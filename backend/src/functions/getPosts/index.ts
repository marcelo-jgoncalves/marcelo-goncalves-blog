import { APIGatewayProxyHandler, APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../../common/dynamodb";
import { logger } from "../../common/logger";
import { getPostCounters } from "../../common/postCounters";

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
    if (resource.includes("/posts/populares")) {
      return await getPopularPosts(queryStringParameters, requestId);
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

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("get_posts_error", { requestId, resource, error: message });
    return { statusCode: 500, body: JSON.stringify({ message: "Internal Server Error", requestId }), headers };
  }
};

// --- Funções Auxiliares ---

// Converte para Title Case (ajuda na busca)
function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Lógica Específica para "O Projeto"
async function getProjectPosts(queryParams: APIGatewayProxyEventQueryStringParameters | null, requestId?: string) {
  const limit = queryParams?.limit ? parseInt(queryParams.limit, 10) : 8;
  const nextToken = queryParams?.nextToken;

  const postsCommand = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "ProjetoPorData_v2",
    KeyConditionExpression: "e_projeto_marker = :val",
    FilterExpression: "#status = :published",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":val": "PROJ", ":published": "Publicado" },
    ScanIndexForward: true,
    Limit: limit,
    ExclusiveStartKey: nextToken ? JSON.parse(atob(nextToken)) : undefined,
  });

  // totalCount comes from the aggregated counter (postCounters.ts), not a
  // 2nd Query — avoids doubling the read cost on every request just to
  // show "Page X of Y".
  const [result, counters] = await Promise.all([
    dynamo.send(postsCommand),
    getPostCounters(),
  ]);

  const newNextToken = result.LastEvaluatedKey
    ? btoa(JSON.stringify(result.LastEvaluatedKey))
    : null;
  const totalCount = counters.total_projeto_publicado;

  logger.info("project_posts_fetched", { requestId, count: result.Items?.length ?? 0, totalCount });
  return {
    statusCode: 200,
    body: JSON.stringify({ posts: result.Items || [], nextToken: newNextToken, totalCount }),
    headers
  };
}

async function searchPosts(term: string, queryParams: APIGatewayProxyEventQueryStringParameters | null, requestId?: string) {
  if (!term || term.trim() === "") {
    return { statusCode: 200, body: JSON.stringify({ posts: [], termo_busca: term }), headers };
  }

  const nextToken = queryParams?.nextToken;

  const tLower = term.toLowerCase();
  const tUpper = term.toUpperCase();
  const tTitle = toTitleCase(term);

  // Sem Limit: o Limit no ScanCommand aplica-se ANTES do FilterExpression,
  // o que faria o DynamoDB ler apenas N itens e retornar 0 resultados mesmo
  // havendo posts que correspondam ao termo. O Scan lê a tabela inteira.
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
    ExclusiveStartKey: nextToken ? JSON.parse(atob(nextToken)) : undefined
  });

  const result = await dynamo.send(command);
  const newNextToken = result.LastEvaluatedKey ? btoa(JSON.stringify(result.LastEvaluatedKey)) : null;

  logger.info("search_posts_fetched", { requestId, term, count: result.Items?.length ?? 0 });
  return { statusCode: 200, body: JSON.stringify({ termo_busca: term, posts: result.Items || [], nextToken: newNextToken }), headers };
}

async function getPopularPosts(queryParams: APIGatewayProxyEventQueryStringParameters | null, requestId?: string) {
  const limit = queryParams?.limit ? parseInt(queryParams.limit, 10) : 6;

  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "PopularesPorData_v2",
    KeyConditionExpression: "e_popular_marker = :popular",
    FilterExpression: "#status = :published",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":popular": "POP", ":published": "Publicado" },
    ScanIndexForward: false,
    Limit: limit,
  });

  const result = await dynamo.send(command);
  logger.info("popular_posts_fetched", { requestId, count: result.Items?.length ?? 0 });
  return {
    statusCode: 200,
    body: JSON.stringify({ posts: result.Items || [] }),
    headers,
  };
}

async function getRecentPosts(queryParams: APIGatewayProxyEventQueryStringParameters | null, requestId?: string) {
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

async function getAllPosts(queryParams: APIGatewayProxyEventQueryStringParameters | null, requestId?: string) {
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

  // totalCount comes from the aggregated counter (postCounters.ts), not a
  // 2nd Query — this second query used to make /artigos the slowest route
  // under load, just to show "Page X of Y".
  const [result, counters] = await Promise.all([
    dynamo.send(postsCommand),
    getPostCounters()
  ]);

  const newNextToken = result.LastEvaluatedKey ? btoa(JSON.stringify(result.LastEvaluatedKey)) : null;
  const totalCount = counters.total_publicado;

  logger.info("all_posts_fetched", { requestId, count: result.Items?.length ?? 0, totalCount });
  return {
    statusCode: 200,
    body: JSON.stringify({ posts: result.Items || [], nextToken: newNextToken, totalCount }),
    headers
  };
}

async function getPostsByCategory(categorySlug: string, queryParams: APIGatewayProxyEventQueryStringParameters | null, requestId?: string) {
  const limit = queryParams?.limit ? parseInt(queryParams.limit) : 9;
  const nextToken = queryParams?.nextToken;

  // Sem FilterExpression: Limit no QueryCommand conta itens ANTES do filtro,
  // o que causaria retorno de < limit resultados quando há rascunhos na categoria.
  // Filtramos status em memória — volume por categoria é baixo.
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "CategoriaPorData",
    KeyConditionExpression: "categoria_slug = :cat",
    ExpressionAttributeValues: { ":cat": categorySlug },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: nextToken ? JSON.parse(atob(nextToken)) : undefined
  });

  const result = await dynamo.send(command);
  const posts = (result.Items || []).filter((item) => item.status === "Publicado");
  const newNextToken = result.LastEvaluatedKey ? btoa(JSON.stringify(result.LastEvaluatedKey)) : null;

  logger.info("category_posts_fetched", { requestId, categorySlug, count: posts.length });
  return {
    statusCode: 200,
    body: JSON.stringify({ posts, nextToken: newNextToken, category: { slug: categorySlug, nome: categorySlug } }),
    headers
  };
}