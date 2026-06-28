import { APIGatewayProxyHandler } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "../../common/logger";

const s3 = new S3Client({});
const UPLOADS_BUCKET = process.env.UPLOADS_BUCKET;
const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN || "*";

// Formatos aceitos pelo pipeline de imagem (CLAUDE.md seção 6) — o client
// escolhe o Content-Type livremente, então sem este allowlist qualquer
// valor seria aceito e usado direto no PutObjectCommand.
const ALLOWED_CONTENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
];

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

    if (!ALLOWED_CONTENT_TYPES.includes(tipo_arquivo)) {
      return { statusCode: 400, body: JSON.stringify({ message: "Unsupported content type" }), headers };
    }

    // Normaliza extensão para minúsculas — S3 filter_suffix é case-sensitive,
    // então "foto.JPG" e "foto.jpg" precisam ter o mesmo comportamento.
    const nome_normalizado = nome_arquivo.replace(/\.[^.]+$/, (ext: string) => ext.toLowerCase());

    // Prefixo de data UTC (YYYY/MM/DD) gerado no momento do upload —
    // organiza o bucket por data automaticamente sem nenhuma ação manual.
    const now    = new Date();
    const year   = now.getUTCFullYear();
    const month  = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day    = String(now.getUTCDate()).padStart(2, "0");
    const key    = `${year}/${month}/${day}/${Date.now()}-${Math.random().toString(36).substring(7)}-${nome_normalizado}`;

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

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("media_upload_error", { requestId, error: message });
    return { statusCode: 500, body: JSON.stringify({ message: "Internal Server Error" }), headers };
  }
};
