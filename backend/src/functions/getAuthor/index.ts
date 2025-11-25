// backend/src/functions/getAuthor/index.ts
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";
import { dynamo } from "../../common/dynamodb";
import { Autor } from "../../common/types";

const TABLE_NAME = process.env.AUTORES_TABLE;

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("Event:", JSON.stringify(event));

  const id = event.pathParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "ID do autor é obrigatório" }),
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
    };
  }

  try {
    const result = await dynamo.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { autor_id: id },
      })
    );

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Autor não encontrado" }),
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        },
      };
    }

    const autor = result.Item as Autor;

    return {
      statusCode: 200,
      body: JSON.stringify({ autor }), // Formato: { "autor": {...} }
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };

  } catch (error) {
    console.error("Error fetching author:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro interno do servidor" }),
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
    };
  }
};