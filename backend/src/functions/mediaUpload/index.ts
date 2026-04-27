import { APIGatewayProxyHandler } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "../../common/logger";

const s3 = new S3Client({});
const UPLOADS_BUCKET = process.env.UPLOADS_BUCKET;
const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN || "*";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": ADMIN_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const requestId = context.awsRequestId;

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, body: "", headers };
  }

  try {
    if (!event.body) throw new Error("Body missing");
    const { nome_arquivo, tipo_arquivo } = JSON.parse(event.body);

    logger.debug("media_upload_request", { requestId, nome_arquivo, tipo_arquivo });

    if (!nome_arquivo || !tipo_arquivo) {
      return { statusCode: 400, body: JSON.stringify({ message: "Missing params" }), headers };
    }

    // Gera um nome único para evitar sobrescrita (timestamp + random)
    const key = `${Date.now()}-${Math.random().toString(36).substring(7)}-${nome_arquivo}`;

    // Cria o comando de PUT
    const command = new PutObjectCommand({
      Bucket: UPLOADS_BUCKET,
      Key: key,
      ContentType: tipo_arquivo,
    });

    // Gera a URL assinada válida por 5 minutos
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 300 });

    // basePath: caminho sem extensão — o imageProcessor gera as variantes
    // ({basePath}-480.avif, {basePath}-480.webp, {basePath}-768.*, {basePath}-1280.*)
    const basePath = `media/${key.replace(/\.[^.]+$/, "")}`;

    logger.info("presigned_url_generated", { requestId, basePath });
    return { statusCode: 200, body: JSON.stringify({ uploadURL, basePath }), headers };

  } catch (error: any) {
    logger.error("media_upload_error", { requestId, error: error.message });
    return { statusCode: 500, body: JSON.stringify({ message: error.message }), headers };
  }
};
