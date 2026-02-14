// backend/src/functions/getPost/index.ts

import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";
import { dynamo } from "../../common/dynamodb";

const TABLE_NAME = process.env.POSTS_TABLE;
// 1. ADICIONADO: Referência à tabela de categorias
const CATEGORIES_TABLE = process.env.CATEGORIES_TABLE; 

// Headers CORS (Essenciais!)
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const slug = event.pathParameters?.slug;

  if (!slug) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Slug missing" }),
      headers,
    };
  }

  try {
    // Busca o post principal
    const result = await dynamo.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { slug: slug },
      })
    );

    const post = result.Item;

    if (!post) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Post not found" }),
        headers,
      };
    }

    // 2. ADICIONADO: Busca da Categoria (Graceful Degradation)
    let category = null;
    
    // Só tenta buscar se o post tiver uma categoria atrelada e a env var existir
    if (post.categoria_slug && CATEGORIES_TABLE) {
      try {
        const catResult = await dynamo.send(
          new GetCommand({
            TableName: CATEGORIES_TABLE,
            Key: { categoria_slug: post.categoria_slug },
          })
        );
        category = catResult.Item || null;
      } catch (catError) {
        // Se falhar a busca da categoria, apenas logamos, mas NÃO quebramos o post
        console.error(`Aviso: Erro ao buscar categoria '${post.categoria_slug}' para o post '${slug}':`, catError);
      }
    }

    // 3. ALTERADO: Payload enriquecido
    return {
      statusCode: 200,
      body: JSON.stringify({ post, category }), 
      headers,
    };

  } catch (error: any) {
    console.error("Error fetching post:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
      headers,
    };
  }
};