// backend/src/functions/adminAuthors/index.ts
import { APIGatewayProxyHandler } from "aws-lambda";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../../common/dynamodb";

const TABLE_NAME = process.env.AUTHORS_TABLE || '';

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Content-Type": "application/json"
};

export const handler: APIGatewayProxyHandler = async (event) => {
  // Logs para debug (serão filtrados em prod pelo Terraform)
  console.log("Event:", JSON.stringify(event));

  const { httpMethod, pathParameters, body } = event;
  const authorId = pathParameters?.id;

  try {
    // 1. GET - Buscar Autor pelo ID
    if (httpMethod === 'GET') {
      if (!authorId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Author ID is required" }) };
      }

      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { autor_id: authorId }
      });

      const result = await dynamo.send(command);

      if (!result.Item) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: "Author not found" }) };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ autor: result.Item })
      };
    }

    // 2. PUT - Atualizar/Criar Autor (Upsert)
    if (httpMethod === 'PUT' || httpMethod === 'POST') {
      if (!body) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Body is required" }) };
      }

      // O Blueprint define que o ID vem da URL no PUT, ou do corpo.
      // Vamos garantir que usamos o ID da URL se disponível
      const data = JSON.parse(body);
      const finalId = authorId || data.autor_id;

      if (!finalId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Author ID is required" }) };
      }

      // Sanitização básica e mapeamento conforme Modelo de Dados [Blueprint 3.3]
      const authorItem = {
        autor_id: finalId,
        nome_exibicao: data.nome_exibicao,
        bio: data.bio, // HTML String
        foto_avatar_url: data.foto_avatar_url,
        foto_avatar_alt_text: data.foto_avatar_alt_text, // Acessibilidade Mandatória
        linkedin_url: data.linkedin_url,
        github_url: data.github_url,
        instagram_url: data.instagram_url, // Novo campo solicitado
        updated_at: new Date().toISOString()
      };

      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: authorItem
      });

      await dynamo.send(command);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Author saved successfully", autor: authorItem })
      };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};