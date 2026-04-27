// backend/src/functions/imageProcessor/index.ts
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Event } from "aws-lambda";
import sharp from "sharp";
import { Readable } from "stream";
import { logger } from "../../common/logger";

const s3 = new S3Client({});
const DEST_BUCKET = process.env.DESTINATION_BUCKET;

const VARIANTS: Array<{
  width: number;
  format: "avif" | "webp";
  quality: number;
  contentType: string;
}> = [
  { width: 480,  format: "avif", quality: 65, contentType: "image/avif" },
  { width: 480,  format: "webp", quality: 80, contentType: "image/webp" },
  { width: 768,  format: "avif", quality: 65, contentType: "image/avif" },
  { width: 768,  format: "webp", quality: 80, contentType: "image/webp" },
  { width: 1280, format: "avif", quality: 65, contentType: "image/avif" },
  { width: 1280, format: "webp", quality: 80, contentType: "image/webp" },
];

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
};

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
      await Promise.all(
        VARIANTS.map(async ({ width, format, quality, contentType }) => {
          const outputBuffer = await sharp(inputBuffer)
            .resize({ width, withoutEnlargement: true })
            .toFormat(format, {
              quality,
              // AVIF: effort 2 = encode rápido (Lambda CPU), arquivo ~5% maior que effort 4
              ...(format === "avif" && { effort: 2 }),
            })
            .toBuffer();

          const destKey = `media/${basename}-${width}.${format}`;

          await s3.send(new PutObjectCommand({
            Bucket: DEST_BUCKET,
            Key: destKey,
            Body: outputBuffer,
            ContentType: contentType,
            CacheControl: "public, max-age=31536000, immutable",
          }));

          logger.debug("variant_saved", { destKey, width, format, bytes: outputBuffer.length });
        })
      );

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
