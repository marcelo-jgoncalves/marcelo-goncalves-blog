import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Event } from "aws-lambda";
import sharp from "sharp";
import { Readable } from "stream";
import { logger } from "../../common/logger";
import { requireEnv } from "../../common/env";

const s3 = new S3Client({});
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const DEST_BUCKET = requireEnv("DESTINATION_BUCKET");
// POSTS_TABLE é lida em runtime (não no carregamento do módulo) para permitir
// que testes configurem/removam a variável por caso individualmente.

const VARIANTS: Array<{
  width: number;
  format: "avif" | "webp";
  quality: number;
  contentType: string;
  keySuffix?: string;
}> = [
  { width: 480,  format: "avif", quality: 65, contentType: "image/avif" },
  { width: 480,  format: "webp", quality: 80, contentType: "image/webp" },
  { width: 768,  format: "avif", quality: 65, contentType: "image/avif" },
  { width: 768,  format: "webp", quality: 80, contentType: "image/webp" },
  { width: 1280, format: "avif", quality: 65, contentType: "image/avif" },
  { width: 1280, format: "webp", quality: 80, contentType: "image/webp" },
  // LQIP: 20px WebP tiny placeholder — browser upscaling natural blur, sem CSS filter
  { width: 20,   format: "webp", quality: 20, contentType: "image/webp", keySuffix: "lqip.webp" },
];

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
};

/**
 * Salva o base64 do LQIP no campo imagem_lqip_base64 dos posts que usam esta imagem.
 * Usa Scan com FilterExpression contains(imagem_destaque_url, basename) — eficiente
 * para a escala atual do blog (~20 posts). Se nenhum post encontrado (imagem ainda não
 * associada), loga aviso e encerra silenciosamente.
 */
async function saveLqipToPost(basename: string, lqipBase64: string): Promise<void> {
  const postsTable = process.env.POSTS_TABLE; // lida em runtime para facilitar testes
  if (!postsTable) {
    logger.debug("lqip_dynamo_skip", { reason: "POSTS_TABLE_not_set" });
    return;
  }

  let matchingSlugs: string[] = [];

  try {
    const result = await dynamo.send(new ScanCommand({
      TableName: postsTable,
      FilterExpression: "contains(imagem_destaque_url, :basename)",
      ExpressionAttributeValues: { ":basename": basename },
      ProjectionExpression: "slug",
    }));

    matchingSlugs = (result.Items || [])
      .map((item) => item.slug as string)
      .filter(Boolean);

  } catch (err) {
    logger.warn("lqip_dynamo_scan_error", { basename, error: (err as Error).message });
    return;
  }

  if (matchingSlugs.length === 0) {
    logger.debug("lqip_dynamo_no_match", { basename });
    return;
  }

  await Promise.all(
    matchingSlugs.map(async (slug) => {
      try {
        await dynamo.send(new UpdateCommand({
          TableName: postsTable,
          Key: { slug },
          UpdateExpression: "SET imagem_lqip_base64 = :lqip",
          ExpressionAttributeValues: { ":lqip": lqipBase64 },
        }));
        logger.info("lqip_dynamo_saved", { slug, basename });
      } catch (err) {
        logger.warn("lqip_dynamo_update_error", { slug, basename, error: (err as Error).message });
      }
    })
  );
}

export const handler = async (event: S3Event) => {
  logger.debug("image_processor_triggered", { recordCount: event.Records.length });

  for (const record of event.Records) {
    const srcBucket = record.s3.bucket.name;
    const srcKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    if (!srcKey.match(/\.(jpg|jpeg|png|webp|heic|heif)$/i)) {
      logger.debug("image_processor_skipped", { srcKey, reason: "not_supported_format" });
      continue;
    }

    try {
      // 1. Baixar imagem original uma única vez
      const { Body } = await s3.send(new GetObjectCommand({ Bucket: srcBucket, Key: srcKey }));
      if (!Body) throw new Error("S3 body vazio");

      const inputBuffer = await streamToBuffer(Body as Readable);
      const basename = srcKey.replace(/\.[^.]+$/, "");

      logger.info("image_processor_start", { srcKey, variants: VARIANTS.length });

      // 2. Gerar todas as variantes em paralelo (Sharp + S3 upload)
      // Captura o buffer do LQIP para salvar o base64 no DynamoDB
      let lqipBuffer: Buffer | null = null;

      await Promise.all(
        VARIANTS.map(async (variant) => {
          const { width, format, quality, contentType, keySuffix } = variant;
          const outputBuffer = await sharp(inputBuffer)
            .resize({ width, withoutEnlargement: true })
            .toFormat(format, {
              quality,
              // AVIF: effort 2 = encode rápido (Lambda CPU), arquivo ~5% maior que effort 4
              ...(format === "avif" && { effort: 2 }),
            })
            .toBuffer();

          const destKey = `media/${basename}-${keySuffix ?? `${width}.${format}`}`;

          await s3.send(new PutObjectCommand({
            Bucket: DEST_BUCKET,
            Key: destKey,
            Body: outputBuffer,
            ContentType: contentType,
            CacheControl: "public, max-age=31536000, immutable",
          }));

          // Captura o buffer do LQIP para reutilizar como base64
          if (keySuffix === "lqip.webp") {
            lqipBuffer = outputBuffer;
          }

          logger.debug("variant_saved", { destKey, width, format, bytes: outputBuffer.length });
        })
      );

      // 3. Salvar base64 do LQIP no DynamoDB (não-bloqueante: erro não falha o handler)
      if (lqipBuffer) {
        const lqipBase64 = `data:image/webp;base64,${(lqipBuffer as Buffer).toString("base64")}`;
        await saveLqipToPost(basename, lqipBase64);
      }

      logger.info("image_processor_done", {
        srcKey,
        destBucket: DEST_BUCKET,
        basename: `media/${basename}`,
        variants: VARIANTS.length,
      });

    } catch (error) {
      logger.error("image_processor_error", { srcKey, error: (error as Error).message });
      throw error;
    }
  }
};
