// backend/src/functions/getAuthor/index.ts
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";
import { dynamo } from "../../common/dynamodb";
import { Autor } from "../../common/types";
import { logger } from "../../common/logger";

const TABLE_NAME = process.env.AUTORES_TABLE;

const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const requestId = context.awsRequestId;
  const id = event.pathParameters?.id;

  if (!id) {
    logger.warn("missing_author_id", { requestId });
    return { statusCode: 400, body: JSON.stringify({ message: "ID do autor é obrigatório" }), headers };
  }

  logger.debug("get_author_request", { requestId, authorId: id });

  try {
    const result = await dynamo.send(new GetCommand({ TableName: TABLE_NAME, Key: { autor_id: id } }));

    if (!result.Item) {
      logger.info("author_not_found", { requestId, authorId: id });
      return { statusCode: 404, body: JSON.stringify({ message: "Autor não encontrado" }), headers };
    }

    logger.info("author_fetched", { requestId, authorId: id });
    return { statusCode: 200, body: JSON.stringify({ autor: result.Item as Autor }), headers };

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("get_author_error", { requestId, authorId: id, error: message });
    return { statusCode: 500, body: JSON.stringify({ message: "Erro interno do servidor" }), headers };
  }
};
