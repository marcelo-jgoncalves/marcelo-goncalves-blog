// backend/src/functions/getPosts/index.ts
import { APIGatewayProxyHandler } from "aws-lambda";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../../common/dynamodb";

const TABLE_NAME = process.env.POSTS_TABLE;

// Headers CORS para acesso público
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const { queryStringParameters, pathParameters, resource } = event;
  
  try {
    // Roteamento interno baseado no Resource do API Gateway
    // 1. GET /posts/recentes
    if (resource.includes("/posts/recentes")) {
      return await getRecentPosts();
    }

    // 2. GET /categoria/{slug}
    if (resource.includes("/categoria/") && pathParameters?.slug) {
      return await getPostsByCategory(pathParameters.slug, queryStringParameters);
    }

    // 3. GET /artigos (Todos)
    return await getAllPosts(queryStringParameters);

  } catch (error: any) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
      headers,
    };
  }
};

// --- Funções Auxiliares ---

async function getRecentPosts() {
  // Usa o GSI StatusPorData para pegar os últimos publicados
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "StatusPorData",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":status": "Publicado" },
    ScanIndexForward: false, // Decrescente (mais novos primeiro)
    Limit: 3
  });

  const result = await dynamo.send(command);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ posts: result.Items || [] }),
    headers
  };
}

async function getAllPosts(queryParams: any) {
  const limit = queryParams?.limit ? parseInt(queryParams.limit) : 9;
  const nextToken = queryParams?.nextToken;

  // Paginação com GSI StatusPorData
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "StatusPorData",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":status": "Publicado" },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: nextToken ? JSON.parse(atob(nextToken)) : undefined
  });

  const result = await dynamo.send(command);
  
  // Codifica o nextToken para enviar ao front
  const newNextToken = result.LastEvaluatedKey 
    ? btoa(JSON.stringify(result.LastEvaluatedKey)) 
    : null;

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      posts: result.Items || [],
      nextToken: newNextToken
    }),
    headers
  };
}

async function getPostsByCategory(categorySlug: string, queryParams: any) {
  const limit = queryParams?.limit ? parseInt(queryParams.limit) : 9;
  const nextToken = queryParams?.nextToken;

  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "CategoriaPorData", // Blueprint Seção 3.2
    KeyConditionExpression: "categoria_slug = :cat",
    ExpressionAttributeValues: { ":cat": categorySlug },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: nextToken ? JSON.parse(atob(nextToken)) : undefined
  });

  const result = await dynamo.send(command);
  
  const newNextToken = result.LastEvaluatedKey 
    ? btoa(JSON.stringify(result.LastEvaluatedKey)) 
    : null;

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      posts: result.Items || [],
      nextToken: newNextToken,
      category: { slug: categorySlug, nome: categorySlug } // Idealmente buscaria o nome bonito na tabela Categorias
    }),
    headers
  };
}