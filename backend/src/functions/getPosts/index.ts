import { APIGatewayProxyHandler } from "aws-lambda";
import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../../common/dynamodb";

const TABLE_NAME = process.env.POSTS_TABLE;

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const { queryStringParameters, pathParameters, resource } = event;
  
  try {
    // 1. GET /posts/recentes
    if (resource.includes("/posts/recentes")) {
      return await getRecentPosts();
    }

    // 2. GET /categoria/{slug}
    if (resource.includes("/categoria/") && pathParameters?.slug) {
      return await getPostsByCategory(pathParameters.slug, queryStringParameters);
    }

    // 3. GET /busca (Com lógica Case-Insensitive)
    if (resource.includes("/busca") || queryStringParameters?.q) {
      const term = queryStringParameters?.q || "";
      return await searchPosts(term, queryStringParameters);
    }

    // 4. GET /artigos (Todos)
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

// Função simples para converter primeira letra em maiúscula (ex: "aws" -> "Aws")
function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function searchPosts(term: string, queryParams: any) {
  if (!term || term.trim() === "") {
    return { statusCode: 200, body: JSON.stringify({ posts: [], termo_busca: term }), headers };
  }

  const limit = queryParams?.limit ? parseInt(queryParams.limit) : 20;
  const nextToken = queryParams?.nextToken;

  // Estratégia Case-Insensitive para DynamoDB Scan:
  // Como Scan não suporta lower(), buscamos pelas 3 variações mais comuns.
  const tLower = term.toLowerCase();
  const tUpper = term.toUpperCase();
  const tTitle = toTitleCase(term);

  const command = new ScanCommand({
    TableName: TABLE_NAME,
    // Busca: (Titulo contém variação 1 OU 2 OU 3) OU (Resumo contém variação 1 OU 2 OU 3)
    FilterExpression: `
      (contains(titulo, :t1) OR contains(titulo, :t2) OR contains(titulo, :t3)) 
      OR 
      (contains(resumo, :t1) OR contains(resumo, :t2) OR contains(resumo, :t3))
    `,
    ExpressionAttributeValues: { 
      ":t1": tLower,
      ":t2": tUpper,
      ":t3": tTitle
    },
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
      termo_busca: term,
      posts: result.Items || [],
      nextToken: newNextToken
    }),
    headers
  };
}

async function getRecentPosts() {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "StatusPorData",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":status": "Publicado" },
    ScanIndexForward: false,
    Limit: 3
  });

  const result = await dynamo.send(command);
  return { statusCode: 200, body: JSON.stringify({ posts: result.Items || [] }), headers };
}

async function getAllPosts(queryParams: any) {
  const limit = queryParams?.limit ? parseInt(queryParams.limit) : 9;
  const nextToken = queryParams?.nextToken;

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
  const newNextToken = result.LastEvaluatedKey ? btoa(JSON.stringify(result.LastEvaluatedKey)) : null;

  return { statusCode: 200, body: JSON.stringify({ posts: result.Items || [], nextToken: newNextToken }), headers };
}

async function getPostsByCategory(categorySlug: string, queryParams: any) {
  const limit = queryParams?.limit ? parseInt(queryParams.limit) : 9;
  const nextToken = queryParams?.nextToken;

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
  const newNextToken = result.LastEvaluatedKey ? btoa(JSON.stringify(result.LastEvaluatedKey)) : null;

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      posts: result.Items || [],
      nextToken: newNextToken,
      category: { slug: categorySlug, nome: categorySlug }
    }),
    headers
  };
}