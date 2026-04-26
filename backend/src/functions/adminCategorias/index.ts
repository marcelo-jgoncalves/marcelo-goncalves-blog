// backend/src/functions/adminCategorias/index.ts
import { APIGatewayProxyHandler } from "aws-lambda";
import { ScanCommand, GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../../common/dynamodb";
import { logger } from "../../common/logger";

const TABLE_NAME = process.env.CATEGORIAS_TABLE;
const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN || "*";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": ADMIN_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const requestId = context.awsRequestId;

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, body: "", headers };
  }

  const { httpMethod, pathParameters, body } = event;
  const slug = pathParameters?.slug;

  logger.debug("admin_categorias_request", { requestId, httpMethod, slug });

  try {
    if (httpMethod === "GET" && !slug) {
      return await listCategorias(requestId);
    }

    if (httpMethod === "GET" && slug) {
      return await getCategoria(slug, requestId);
    }

    if (httpMethod === "POST") {
      if (!body) throw new Error("Body is required");
      return await saveCategoria(JSON.parse(body), requestId);
    }

    if (httpMethod === "PUT" && slug) {
      if (!body) throw new Error("Body is required");
      const data = JSON.parse(body);
      if (data.categoria_slug !== slug) throw new Error("Slug mismatch");
      return await saveCategoria(data, requestId);
    }

    if (httpMethod === "DELETE" && slug) {
      return await deleteCategoria(slug, requestId);
    }

    return { statusCode: 405, body: JSON.stringify({ message: "Method Not Allowed" }), headers };

  } catch (error: any) {
    logger.error("admin_categorias_error", { requestId, httpMethod, error: error.message });
    return { statusCode: 500, body: JSON.stringify({ message: error.message || "Internal Server Error" }), headers };
  }
};

async function listCategorias(requestId: string) {
  const result = await dynamo.send(new ScanCommand({ TableName: TABLE_NAME }));
  const items = (result.Items || []).sort((a, b) => (a.nome ?? "").localeCompare(b.nome ?? ""));
  logger.info("categorias_listed", { requestId, count: items.length });
  return { statusCode: 200, body: JSON.stringify({ items, count: items.length }), headers };
}

async function getCategoria(slug: string, requestId: string) {
  const result = await dynamo.send(new GetCommand({ TableName: TABLE_NAME, Key: { categoria_slug: slug } }));
  if (!result.Item) {
    return { statusCode: 404, body: JSON.stringify({ message: "Categoria not found" }), headers };
  }
  logger.info("categoria_fetched", { requestId, slug });
  return { statusCode: 200, body: JSON.stringify(result.Item), headers };
}

async function saveCategoria(data: { categoria_slug: string; nome: string; descricao?: string }, requestId: string) {
  if (!data.categoria_slug || !data.nome) {
    return { statusCode: 400, body: JSON.stringify({ message: "categoria_slug and nome are required" }), headers };
  }

  await dynamo.send(new PutCommand({ TableName: TABLE_NAME, Item: data }));
  logger.info("categoria_saved", { requestId, slug: data.categoria_slug });
  return { statusCode: 200, body: JSON.stringify({ message: "Categoria saved", categoria_slug: data.categoria_slug }), headers };
}

async function deleteCategoria(slug: string, requestId: string) {
  await dynamo.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { categoria_slug: slug } }));
  logger.info("categoria_deleted", { requestId, slug });
  return { statusCode: 200, body: JSON.stringify({ message: "Categoria deleted" }), headers };
}
