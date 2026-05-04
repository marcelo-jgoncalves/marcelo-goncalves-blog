import { APIGatewayProxyHandler } from "aws-lambda";
import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../../common/dynamodb";
import { logger } from "../../common/logger";

const TABLE_NAME = process.env.POSTS_TABLE;

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const requestId = context.awsRequestId;
  const { queryStringParameters, pathParameters, resource } = event;

  logger.debug("get_posts_request", { requestId, resource, queryStringParameters });

  try {
    if (resource.includes("/posts/recentes")) {
      return await getRecentPosts(queryStringParameters, requestId);
    }
    if (resource.includes("/categoria/") && pathParameters?.slug) {
      return await getPostsByCategory(pathParameters.slug, queryStringParameters, requestId);
    }
    if (resource.includes("/busca") || queryStringParameters?.q) {
      return await searchPosts(queryStringParameters?.q || "", queryStringParameters, requestId);
    }
    if (resource.includes("/projeto")) {
      return await getProjectPosts(queryStringParameters, requestId);
    }
    return await getAllPosts(queryStringParameters, requestId);

  } catch (error: any) {
    logger.error("get_posts_error", { requestId, resource, error: error.message });
    return { statusCode: 500, body: JSON.stringify({ message: "Internal Server Error" }), headers };
  }
};

// --- Funções Auxiliares ---

// Converte para Title Case (ajuda na busca)
function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Lógica Específica para "O Projeto"
async function getProjectPosts(queryParams: any, requestId?: string) {
  const limit = queryParams?.limit ? parseInt(queryParams.limit, 10) : 8;
  const nextToken = queryParams?.nextToken;

  const baseQuery = {
    TableName: TABLE_NAME,
    IndexName: "ProjetoPorData",
    KeyConditionExpression: "e_projeto = :val",
    FilterExpression: "#status = :published",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":val": 1, ":published": "Publicado" },
  };

  const postsCommand = new QueryCommand({
    ...baseQuery,
    ScanIndexForward: true,
    Limit: limit,
    ExclusiveStartKey: nextToken ? JSON.parse(atob(nextToken)) : undefined,
  });

  const countCommand = new QueryCommand({ ...baseQuery, Select: "COUNT" });

  const [result, countResult] = await Promise.all([
    dynamo.send(postsCommand),
    dynamo.send(countCommand),
  ]);

  const newNextToken = result.LastEvaluatedKey
    ? btoa(JSON.stringify(result.LastEvaluatedKey))
    : null;
  const totalCount = countResult.Count ?? 0;

  logger.info("project_posts_fetched", { requestId, count: result.Items?.length ?? 0, totalCount });
  return {
    statusCode: 200,
    body: JSON.stringify({ posts: result.Items || [], nextToken: newNextToken, totalCount }),
    headers
  };
}

async function searchPosts(term: string, queryParams: any, requestId?: string) {
  if (!term || term.trim() === "") {
    return { statusCode: 200, body: JSON.stringify({ posts: [], termo_busca: term }), headers };
  }

  const limit = queryParams?.limit ? parseInt(queryParams.limit, 10) : 9;
  const nextToken = queryParams?.nextToken;

  const tLower = term.toLowerCase();
  const tUpper = term.toUpperCase();
  const tTitle = toTitleCase(term);

  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: `
      (#status = :published) AND (
        (contains(titulo, :t1) OR contains(titulo, :t2) OR contains(titulo, :t3))
        OR
        (contains(resumo, :t1) OR contains(resumo, :t2) OR contains(resumo, :t3))
      )
    `,
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: {
      ":t1": tLower, ":t2": tUpper, ":t3": tTitle, ":published": "Publicado"
    },
    Limit: limit,
    ExclusiveStartKey: nextToken ? JSON.parse(atob(nextToken)) : undefined
  });

  const result = await dynamo.send(command);
  const newNextToken = result.LastEvaluatedKey ? btoa(JSON.stringify(result.LastEvaluatedKey)) : null;

  logger.info("search_posts_fetched", { requestId, term, count: result.Items?.length ?? 0 });
  return { statusCode: 200, body: JSON.stringify({ termo_busca: term, posts: result.Items || [], nextToken: newNextToken }), headers };
}

async function getRecentPosts(queryParams: any, requestId?: string) {
  const limit = queryParams?.limit ? parseInt(queryParams.limit, 10) : 6;
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "StatusPorData",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":status": "Publicado" },
    ScanIndexForward: false,
    Limit: limit
  });
  const result = await dynamo.send(command);
  logger.info("recent_posts_fetched", { requestId, count: result.Items?.length ?? 0 });
  return { statusCode: 200, body: JSON.stringify({ posts: result.Items || [] }), headers };
}

async function getAllPosts(queryParams: any, requestId?: string) {
  const limit = queryParams?.limit ? parseInt(queryParams.limit) : 9;
  const nextToken = queryParams?.nextToken;

  const postsCommand = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "StatusPorData",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":status": "Publicado" },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: nextToken ? JSON.parse(atob(nextToken)) : undefined
  });

  const countCommand = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "StatusPorData",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":status": "Publicado" },
    Select: "COUNT"
  });

  const [result, countResult] = await Promise.all([
    dynamo.send(postsCommand),
    dynamo.send(countCommand)
  ]);

  const newNextToken = result.LastEvaluatedKey ? btoa(JSON.stringify(result.LastEvaluatedKey)) : null;
  const totalCount = countResult.Count ?? 0;

  logger.info("all_posts_fetched", { requestId, count: result.Items?.length ?? 0, totalCount });
  return {
    statusCode: 200,
    body: JSON.stringify({ posts: result.Items || [], nextToken: newNextToken, totalCount }),
    headers
  };
}

async function getPostsByCategory(categorySlug: string, queryParams: any, requestId?: string) {
  const limit = queryParams?.limit ? parseInt(queryParams.limit) : 9;
  const nextToken = queryParams?.nextToken;

  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "CategoriaPorData",
    KeyConditionExpression: "categoria_slug = :cat",
    FilterExpression: "#status = :published",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":cat": categorySlug, ":published": "Publicado" },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: nextToken ? JSON.parse(atob(nextToken)) : undefined
  });

  const result = await dynamo.send(command);
  const newNextToken = result.LastEvaluatedKey ? btoa(JSON.stringify(result.LastEvaluatedKey)) : null;

  logger.info("category_posts_fetched", { requestId, categorySlug, count: result.Items?.length ?? 0 });
  return {
    statusCode: 200,
    body: JSON.stringify({ posts: result.Items || [], nextToken: newNextToken, category: { slug: categorySlug, nome: categorySlug } }),
    headers
  };
}