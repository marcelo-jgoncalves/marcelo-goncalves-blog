// backend/src/functions/adminPosts/index.ts
import { APIGatewayProxyHandler } from "aws-lambda";
import { QueryCommand, GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../../common/dynamodb";
import { Post } from "../../common/types";
import { logger } from "../../common/logger";

const TABLE_NAME = process.env.POSTS_TABLE;

// Cabeçalhos CORS Obrigatórios em TODAS as respostas
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", 
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

  logger.debug("admin_posts_request", { requestId, httpMethod, slug });

  try {
    // 1. Listar Todos
    if (httpMethod === "GET" && !slug) {
      return await listPosts();
    }

    // 2. Ler Um
    if (httpMethod === "GET" && slug) {
      return await getPost(slug);
    }

    // 3. Criar
    if (httpMethod === "POST") {
      if (!body) throw new Error("Body is required");
      const postData = JSON.parse(body);
      return await savePost(postData, true);
    }

    // 4. Atualizar
    if (httpMethod === "PUT" && slug) {
      if (!body) throw new Error("Body is required");
      const postData = JSON.parse(body);
      if (postData.slug !== slug) throw new Error("Slug mismatch");
      return await savePost(postData, false);
    }

    // 5. Deletar
    if (httpMethod === "DELETE" && slug) {
      return await deletePost(slug);
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
      headers, // <--- Importante
    };

  } catch (error: any) {
    logger.error("admin_posts_error", { requestId, httpMethod, slug, error: error.message });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message || "Internal Server Error" }),
      headers,
    };
  }
};

// --- Funções Auxiliares (AGORA COM HEADERS) ---

async function listPosts() {
  const statuses = ["Publicado", "Rascunho", "Programado"];
  const allItems: any[] = [];

  for (const status of statuses) {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "StatusPorData",
      KeyConditionExpression: "#status = :status",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":status": status },
      ProjectionExpression: "slug, titulo, #status, data_atualizacao, autor_id",
      ScanIndexForward: false,
    });
    const result = await dynamo.send(command);
    allItems.push(...(result.Items || []));
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ items: allItems, count: allItems.length }),
    headers,
  };
}

async function getPost(slug: string) {
  const result = await dynamo.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { slug }
  }));
  
  if (!result.Item) {
    return { 
        statusCode: 404, 
        body: JSON.stringify({ message: "Post not found" }), 
        headers // <--- ADICIONADO
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
    headers, // <--- ADICIONADO
  };
}

async function savePost(data: Partial<Post>, isNew: boolean) {
  if (!data.slug || !data.titulo || !data.autor_id) {
    return { 
        statusCode: 400, 
        body: JSON.stringify({ message: "Missing required fields" }), 
        headers // <--- ADICIONADO
    };
  }

  const now = new Date().toISOString();
  
  const item: Post = {
    ...data as Post,
    data_atualizacao: now,
    data_publicacao: isNew ? (data.data_publicacao || now) : data.data_publicacao!,
    e_popular: Number(data.e_popular || 0),
    e_projeto: Number(data.e_projeto || 0),
    tempo_leitura_min: Number(data.tempo_leitura_min || 5)
  };

  await dynamo.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Post saved", slug: item.slug }),
    headers, // <--- ADICIONADO
  };
}

async function deletePost(slug: string) {
  await dynamo.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { slug }
  }));
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Post deleted" }),
    headers, // <--- ADICIONADO
  };
}