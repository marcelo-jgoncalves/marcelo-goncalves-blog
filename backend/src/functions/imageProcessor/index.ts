// backend/src/functions/imageProcessor/index.ts
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Event } from "aws-lambda";
import sharp from "sharp";
import { Readable } from "stream";
import { logger } from "../../common/logger";

const s3 = new S3Client({});
const DEST_BUCKET = process.env.DESTINATION_BUCKET;

// Helper para converter stream do S3 em Buffer
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

  // Itera sobre os registros (geralmente é 1 por evento)
  for (const record of event.Records) {
    const srcBucket = record.s3.bucket.name;
    // Decodifica o nome do arquivo (ex: espaços viram %20)
    const srcKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    // Validação básica: evitar loops infinitos ou arquivos errados
    if (!srcKey.match(/\.(jpg|jpeg|png)$/i)) {
      console.log(`Skipping non-image: ${srcKey}`);
      continue;
    }

    try {
      // 1. Baixar imagem original
      const getCommand = new GetObjectCommand({
        Bucket: srcBucket,
        Key: srcKey,
      });
      const response = await s3.send(getCommand);
      
      if (!response.Body) throw new Error("Body is empty");
      
      const inputBuffer = await streamToBuffer(response.Body as Readable);

      // 2. Processar com Sharp (Redimensionar + WebP)
      const outputBuffer = await sharp(inputBuffer)
        .resize({ width: 1280, withoutEnlargement: true }) // Max width 1280px
        .toFormat("webp", { quality: 80 })
        .toBuffer();

      // 3. Salvar no Bucket de Destino (Público)
      // Mudamos a extensão para .webp e organizamos na pasta 'media/'
      const destKey = `media/${srcKey.replace(/\.[^.]+$/, "")}.webp`;

      await s3.send(new PutObjectCommand({
        Bucket: DEST_BUCKET,
        Key: destKey,
        Body: outputBuffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable" // Cache agressivo para performance
      }));

      logger.info("image_processed", { srcBucket, srcKey, destBucket: DEST_BUCKET, destKey });

    } catch (error) {
      logger.error("image_processor_error", { srcKey, error: (error as Error).message });
      throw error; // Faz a Lambda tentar de novo (Retry) se for erro temporário
    }
  }
};
