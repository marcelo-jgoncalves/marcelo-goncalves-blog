// backend/src/functions/adminPosts/index.ts
import { APIGatewayProxyHandler } from "aws-lambda";
import { ScanCommand, GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../../common/dynamodb";
import { Post } from "../../common/types";

const TABLE_NAME = process.env.POSTS_TABLE;

// Cabeçalhos CORS Obrigatórios em TODAS as respostas
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const handler: APIGatewayProxyHandler = async (event) => {
  // Se por acaso o API Gateway deixar passar um OPTIONS para a Lambda, respondemos rápido
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, body: "", headers };
  }

  const { httpMethod, pathParameters, body } = event;
  const slug = pathParameters?.slug;

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
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message || "Internal Server Error" }),
      headers, // <--- Importante: Headers até no erro 500
    };
  }
};

// --- Funções Auxiliares (AGORA COM HEADERS) ---

async function listPosts() {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    ProjectionExpression: "slug, titulo, #status, data_atualizacao, autor_id",
    ExpressionAttributeNames: { "#status": "status" }
  });
  const result = await dynamo.send(command);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ items: result.Items || [], count: result.Count }),
    headers, // <--- ADICIONADO
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