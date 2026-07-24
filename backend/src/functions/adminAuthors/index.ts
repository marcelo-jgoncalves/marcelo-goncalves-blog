// backend/src/functions/adminAuthors/index.ts
import { APIGatewayProxyHandler } from "aws-lambda";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../../common/dynamodb";
import { logger } from "../../common/logger";
import { sanitizePostHtml } from "../../common/sanitizer";

const TABLE_NAME = process.env.AUTHORS_TABLE || '';
const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN || "*";

const headers = {
  "Access-Control-Allow-Origin": ADMIN_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const requestId = context.awsRequestId;
  const { httpMethod, pathParameters, body } = event;
  const authorId = pathParameters?.id;

  logger.debug("admin_authors_request", { requestId, httpMethod, authorId });

  try {
    // 1. GET - Buscar Autor pelo ID
    if (httpMethod === 'GET') {
      if (!authorId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Author ID is required" }) };
      }

      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { autor_id: authorId }
      });

      const result = await dynamo.send(command);

      if (!result.Item) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: "Author not found" }) };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ autor: result.Item })
      };
    }

    // 2. PUT - Atualizar/Criar Autor (Upsert)
    if (httpMethod === 'PUT' || httpMethod === 'POST') {
      if (!body) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Body is required" }) };
      }

      // O Blueprint define que o ID vem da URL no PUT, ou do corpo.
      // Vamos garantir que usamos o ID da URL se disponível
      const data = JSON.parse(body);
      const finalId = authorId || data.autor_id;

      if (!finalId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Author ID is required" }) };
      }

      // Mapeamento conforme Modelo de Dados [Blueprint 3.3]. `bio` é HTML
      // renderizado via dangerouslySetInnerHTML no blog público
      // (PostFooter.tsx, AuthorBox.tsx) — precisa do mesmo allowlist usado
      // em conteudo_html (adminPosts), senão é stored XSS direto.
      const authorItem = {
        autor_id: finalId,
        nome_exibicao: data.nome_exibicao,
        bio: sanitizePostHtml(data.bio ?? ""),
        foto_avatar_url: data.foto_avatar_url,
        foto_avatar_alt_text: data.foto_avatar_alt_text, // Acessibilidade Mandatória
        linkedin_url: data.linkedin_url,
        github_url: data.github_url,
        instagram_url: data.instagram_url, // Novo campo solicitado
        updated_at: new Date().toISOString()
      };

      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: authorItem
      });

      await dynamo.send(command);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Author saved successfully", autor: authorItem })
      };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("admin_authors_error", { requestId, httpMethod, authorId, error: message });
    return { statusCode: 500, headers, body: JSON.stringify({ message: "Internal Server Error", requestId }) };
  }
};