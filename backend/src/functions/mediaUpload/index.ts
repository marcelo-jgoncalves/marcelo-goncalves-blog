import { APIGatewayProxyHandler } from "aws-lambda";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { logger } from "../../common/logger";

const s3 = new S3Client({});
const UPLOADS_BUCKET = process.env.UPLOADS_BUCKET;
const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN || "*";

// Formatos aceitos pelo pipeline de imagem (CLAUDE.md seção 6) — o client
// escolhe o Content-Type livremente, então sem este allowlist qualquer
// valor seria aceito e usado direto no comando de upload.
const ALLOWED_CONTENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
];

// PutObjectCommand presigned via getSignedUrl não suporta nenhuma condição
// (ex: tamanho máximo) — achado AppSec (Cat. 2): qualquer cliente com a URL
// podia subir um arquivo arbitrariamente grande. createPresignedPost
// (presigned POST) aceita `conditions`, incluindo content-length-range,
// que o S3 valida e rejeita no próprio upload.
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB — mesmo limite já validado no admin (UploadModal.vue)

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

    // Gera o presigned POST (url + fields) válido por 5 minutos, com
    // Content-Type e tamanho máximo aplicados pelo próprio S3 no upload.
    const { url, fields } = await createPresignedPost(s3, {
      Bucket: UPLOADS_BUCKET!,
      Key: key,
      Conditions: [
        ["content-length-range", 0, MAX_UPLOAD_BYTES],
        ["eq", "$Content-Type", tipo_arquivo],
      ],
      Fields: {
        "Content-Type": tipo_arquivo,
      },
      Expires: 300,
    });

    // basePath: caminho sem extensão — o imageProcessor gera as variantes
    // ({basePath}-480.avif, {basePath}-480.webp, {basePath}-768.*, {basePath}-1280.*)
    const basePath = `media/${key.replace(/\.[^.]+$/, "")}`;

    logger.info("presigned_url_generated", { requestId, basePath });
    return { statusCode: 200, body: JSON.stringify({ url, fields, basePath }), headers };

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("media_upload_error", { requestId, error: message });
    return { statusCode: 500, body: JSON.stringify({ message: "Internal Server Error", requestId }), headers };
  }
};
