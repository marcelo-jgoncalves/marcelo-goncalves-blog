/**backend/src/funcions/adminCategories/index.ts */

import { APIGatewayProxyHandler } from "aws-lambda";
import { ScanCommand, GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../../common/dynamodb";

const TABLE_NAME = process.env.CATEGORIES_TABLE;

// Cabeçalhos CORS Obrigatórios
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Tipagem baseada na infraestrutura do DynamoDB
interface Categoria {
  categoria_slug: string;
  nome_exibicao: string;
  descricao_seo?: string;
  icone_fa?: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, body: "", headers };
  }

  const { httpMethod, pathParameters, body } = event;
  const slug = pathParameters?.slug;

  try {
    // 1. Listar Todas
    if (httpMethod === "GET" && !slug) {
      return await listCategories();
    }

    // 2. Ler Uma
    if (httpMethod === "GET" && slug) {
      return await getCategory(slug);
    }

    // 3. Criar
    if (httpMethod === "POST") {
      if (!body) throw new Error("Body is required");
      const data = JSON.parse(body);
      return await saveCategory(data);
    }

    // 4. Atualizar
    if (httpMethod === "PUT" && slug) {
      if (!body) throw new Error("Body is required");
      const data = JSON.parse(body);
      if (data.categoria_slug !== slug) throw new Error("Slug mismatch");
      return await saveCategory(data);
    }

    // 5. Deletar
    if (httpMethod === "DELETE" && slug) {
      return await deleteCategory(slug);
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
      headers,
    };

  } catch (error: any) {
    console.error("Error adminCategories:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message || "Internal Server Error" }),
      headers,
    };
  }
};

// --- Funções Auxiliares ---

async function listCategories() {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });
  const result = await dynamo.send(command);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ items: result.Items || [], count: result.Count }),
    headers,
  };
}

async function getCategory(slug: string) {
  const result = await dynamo.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { categoria_slug: slug }
  }));
  
  if (!result.Item) {
    return { 
        statusCode: 404, 
        body: JSON.stringify({ message: "Category not found" }), 
        headers
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
    headers,
  };
}

async function saveCategory(data: Partial<Categoria>) {
  if (!data.categoria_slug || !data.nome_exibicao) {
    return { 
        statusCode: 400, 
        body: JSON.stringify({ message: "Missing required fields: categoria_slug and nome_exibicao" }), 
        headers
    };
  }

  const item: Categoria = {
    categoria_slug: data.categoria_slug,
    nome_exibicao: data.nome_exibicao,
    descricao_seo: data.descricao_seo || "",
    icone_fa: data.icone_fa || "fas fa-tag",
  };

  await dynamo.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Category saved", slug: item.categoria_slug }),
    headers,
  };
}

async function deleteCategory(slug: string) {
  await dynamo.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { categoria_slug: slug }
  }));
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Category deleted" }),
    headers,
  };
}