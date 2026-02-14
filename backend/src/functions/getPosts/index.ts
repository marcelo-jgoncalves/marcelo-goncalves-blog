/**backend/src/getPosts/index.tls */

import { APIGatewayProxyHandler } from "aws-lambda";
import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../../common/dynamodb";

const TABLE_NAME = process.env.POSTS_TABLE;
const CATEGORIES_TABLE = process.env.CATEGORIES_TABLE; // <-- Adicionado

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

// 🚀 CACHE IN-MEMORY DAS CATEGORIAS
// Lambdas "quentes" reaproveitam esse objeto, economizando chamadas ao DynamoDB!
let categoriesCache: Record<string, any> | null = null;

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

    // 3. GET /busca
    if (resource.includes("/busca") || queryStringParameters?.q) {
      const term = queryStringParameters?.q || "";
      return await searchPosts(term, queryStringParameters);
    }

    // 4. GET /projeto (NOVO - Timeline Cronológica)
    if (resource.includes("/projeto")) {
      return await getProjectPosts(queryStringParameters);
    }

    // 5. GET /artigos (Default)
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

// --- FUNÇÃO DE ENRIQUECIMENTO (O SEGREDO DA PERFORMANCE) ---
async function enrichPostsWithCategories(posts: any[]) {
  if (!posts || posts.length === 0 || !CATEGORIES_TABLE) return posts;

  // Carrega o cache de categorias se estiver vazio
  if (!categoriesCache) {
    try {
      const catResult = await dynamo.send(new ScanCommand({ TableName: CATEGORIES_TABLE }));
      categoriesCache = {};
      catResult.Items?.forEach(cat => {
        categoriesCache![cat.categoria_slug] = cat;
      });
    } catch (err) {
      console.error("Falha ao carregar cache de categorias:", err);
      return posts; // Fallback: retorna posts sem categoria se falhar
    }
  }

  // Enxerta a categoria em cada post
  return posts.map(post => {
    if (post.categoria_slug && categoriesCache && categoriesCache[post.categoria_slug]) {
      return {
        ...post,
        categoria: categoriesCache[post.categoria_slug] // <-- O Frontend vai amar isso
      };
    }
    return post;
  });
}

// --- FUNÇÕES AUXILIARES (AGORA ENRIQUECIDAS) ---

function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function getProjectPosts(queryParams: any) {
  const limit = queryParams?.limit ? parseInt(queryParams.limit) : 20; 
  const nextToken = queryParams?.nextToken;

  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "ProjetoPorData", 
    KeyConditionExpression: "e_projeto = :val",
    ExpressionAttributeValues: { ":val": 1 }, 
    ScanIndexForward: true, 
    Limit: limit,
    ExclusiveStartKey: nextToken ? JSON.parse(atob(nextToken)) : undefined
  });

  const result = await dynamo.send(command);
  const newNextToken = result.LastEvaluatedKey ? btoa(JSON.stringify(result.LastEvaluatedKey)) : null;
  
  // 🚀 Enriquecendo os dados antes de devolver
  const enrichedPosts = await enrichPostsWithCategories(result.Items || []);

  return { statusCode: 200, body: JSON.stringify({ posts: enrichedPosts, nextToken: newNextToken }), headers };
}

async function searchPosts(term: string, queryParams: any) {
  if (!term || term.trim() === "") {
    return { statusCode: 200, body: JSON.stringify({ posts: [], termo_busca: term }), headers };
  }

  const limit = queryParams?.limit ? parseInt(queryParams.limit) : 20;
  const nextToken = queryParams?.nextToken;

  const tLower = term.toLowerCase();
  const tUpper = term.toUpperCase();
  const tTitle = toTitleCase(term);

  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: `
      (contains(titulo, :t1) OR contains(titulo, :t2) OR contains(titulo, :t3)) 
      OR 
      (contains(resumo, :t1) OR contains(resumo, :t2) OR contains(resumo, :t3))
    `,
    ExpressionAttributeValues: { 
      ":t1": tLower, ":t2": tUpper, ":t3": tTitle
    },
    Limit: limit,
    ExclusiveStartKey: nextToken ? JSON.parse(atob(nextToken)) : undefined
  });

  const result = await dynamo.send(command);
  const newNextToken = result.LastEvaluatedKey ? btoa(JSON.stringify(result.LastEvaluatedKey)) : null;
  const enrichedPosts = await enrichPostsWithCategories(result.Items || []);

  return { statusCode: 200, body: JSON.stringify({ termo_busca: term, posts: enrichedPosts, nextToken: newNextToken }), headers };
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
  const enrichedPosts = await enrichPostsWithCategories(result.Items || []);
  
  return { statusCode: 200, body: JSON.stringify({ posts: enrichedPosts }), headers };
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
  const enrichedPosts = await enrichPostsWithCategories(result.Items || []);

  return { statusCode: 200, body: JSON.stringify({ posts: enrichedPosts, nextToken: newNextToken }), headers };
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
  const enrichedPosts = await enrichPostsWithCategories(result.Items || []);

  // Busca a categoria específica para o header da página de listagem
  let categoryMeta = { slug: categorySlug, nome_exibicao: categorySlug, icone_fa: "" };
  if (categoriesCache && categoriesCache[categorySlug]) {
    categoryMeta = categoriesCache[categorySlug];
  }

  return { 
    statusCode: 200, 
    body: JSON.stringify({ 
      posts: enrichedPosts, 
      nextToken: newNextToken, 
      category: categoryMeta 
    }), 
    headers 
  };
}