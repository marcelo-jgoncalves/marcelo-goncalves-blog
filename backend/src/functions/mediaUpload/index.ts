import { APIGatewayProxyHandler } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({});
const UPLOADS_BUCKET = process.env.UPLOADS_BUCKET;

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const handler: APIGatewayProxyHandler = async (event) => {
  // Tratamento de CORS (OPTIONS)
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, body: "", headers };
  }

  try {
    if (!event.body) throw new Error("Body missing");
    const { nome_arquivo, tipo_arquivo } = JSON.parse(event.body);

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

    // Retorna a URL de upload E a URL pública final (onde o arquivo processado vai aparecer)
    // Nota: A URL pública aponta para o CloudFront/S3 de Assets, pasta media/, extensão .webp
    // Precisamos saber o domínio do CloudFront de assets aqui? 
    // Por simplicidade, o frontend monta a URL final ou retornamos o caminho relativo.
    const finalPath = `media/${key.replace(/\.[^.]+$/, "")}.webp`;

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadURL, finalPath }),
      headers,
    };

  } catch (error: any) {
    console.error("Error:", error);
    return { statusCode: 500, body: JSON.stringify({ message: error.message }), headers };
  }
};
