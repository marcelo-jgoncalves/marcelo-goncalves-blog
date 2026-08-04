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
// POSTS_TABLE is read at runtime (not at module load) so tests can
// set/unset the variable per case individually.

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
  // LQIP: 20px WebP tiny placeholder, browser upscaling gives natural blur without a CSS filter
  { width: 20,   format: "webp", quality: 20, contentType: "image/webp", keySuffix: "lqip.webp" },
];

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
};

/**
 * Saves the LQIP base64 to the imagem_lqip_base64 field of posts using this image.
 * Uses Scan with FilterExpression contains(imagem_destaque_url, basename): there is
 * no index for this lookup, but it stays cheap at the blog's current scale (~20 posts).
 * If no post is found (image not yet associated), logs a warning and returns silently.
 */
async function saveLqipToPost(basename: string, lqipBase64: string): Promise<void> {
  const postsTable = process.env.POSTS_TABLE; // read at runtime to simplify testing
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
      // Download the original once and reuse the buffer for every variant below,
      // instead of re-fetching from S3 per variant.
      const { Body } = await s3.send(new GetObjectCommand({ Bucket: srcBucket, Key: srcKey }));
      if (!Body) throw new Error("S3 body vazio");

      const inputBuffer = await streamToBuffer(Body as Readable);
      const basename = srcKey.replace(/\.[^.]+$/, "");

      logger.info("image_processor_start", { srcKey, variants: VARIANTS.length });

      let lqipBuffer: Buffer | null = null;

      await Promise.all(
        VARIANTS.map(async (variant) => {
          const { width, format, quality, contentType, keySuffix } = variant;
          const outputBuffer = await sharp(inputBuffer)
            .resize({ width, withoutEnlargement: true })
            .toFormat(format, {
              quality,
              // AVIF: effort 2 trades ~5% larger output (vs effort 4) for faster
              // encode time, which matters on Lambda's limited CPU.
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

          if (keySuffix === "lqip.webp") {
            lqipBuffer = outputBuffer;
          }

          logger.debug("variant_saved", { destKey, width, format, bytes: outputBuffer.length });
        })
      );

      // Non-blocking: a DynamoDB error here is logged but must not fail the handler,
      // since the S3 variants were already saved successfully.
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
