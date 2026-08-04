import { APIGatewayProxyHandler } from "aws-lambda";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { logger } from "../../common/logger";
import { parseJsonBody } from "../../common/httpBody";
import { requireEnv } from "../../common/env";

const s3 = new S3Client({});
const UPLOADS_BUCKET = requireEnv("UPLOADS_BUCKET");
const ADMIN_ORIGIN = requireEnv("ADMIN_ORIGIN");

// Formats accepted by the image pipeline: the client chooses the
// Content-Type freely, so without this allowlist any value would be
// accepted and used directly in the upload command.
const ALLOWED_CONTENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
];

// A PutObjectCommand presigned via getSignedUrl supports no conditions
// (e.g. max size): any client with the URL could upload an arbitrarily
// large file. createPresignedPost (presigned POST) accepts `conditions`,
// including content-length-range, which S3 validates and rejects at
// upload time.
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB: same limit already validated in admin (UploadModal.vue)

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
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ message: "Body missing" }), headers };
    }
    const parsed = parseJsonBody(event.body);
    if (parsed === undefined || typeof parsed !== "object" || parsed === null) {
      return { statusCode: 400, body: JSON.stringify({ message: "Invalid JSON body" }), headers };
    }
    const { nome_arquivo, tipo_arquivo } = parsed as Record<string, unknown>;

    logger.debug("media_upload_request", { requestId, nome_arquivo, tipo_arquivo });

    if (!nome_arquivo || !tipo_arquivo || typeof nome_arquivo !== "string" || typeof tipo_arquivo !== "string") {
      return { statusCode: 400, body: JSON.stringify({ message: "Missing params" }), headers };
    }

    if (!ALLOWED_CONTENT_TYPES.includes(tipo_arquivo)) {
      return { statusCode: 400, body: JSON.stringify({ message: "Unsupported content type" }), headers };
    }

    // Lowercase the extension: S3 filter_suffix is case-sensitive, so
    // "foto.JPG" and "foto.jpg" must behave the same.
    // Characters outside [A-Za-z0-9._-] become "-": the name comes from the
    // client and is interpolated straight into the S3 key, "/" would create
    // pseudo-folders outside the date prefix, and characters that require
    // URL-encoding break the match with the variants imageProcessor writes.
    const nome_normalizado = nome_arquivo
      .replace(/\.[^.]+$/, (ext: string) => ext.toLowerCase())
      .replace(/[^A-Za-z0-9._-]/g, "-");

    // UTC date prefix (YYYY/MM/DD) generated at upload time: keeps the
    // bucket organized by date automatically, with no manual action.
    const now    = new Date();
    const year   = now.getUTCFullYear();
    const month  = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day    = String(now.getUTCDate()).padStart(2, "0");
    const key    = `${year}/${month}/${day}/${Date.now()}-${Math.random().toString(36).substring(7)}-${nome_normalizado}`;

    // Presigned POST (url + fields) valid for 5 minutes; Content-Type and
    // max size are enforced by S3 itself at upload time.
    const { url, fields } = await createPresignedPost(s3, {
      Bucket: UPLOADS_BUCKET,
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

    // basePath: extensionless path, imageProcessor generates the variants
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
