// backend/src/functions/getPost/index.ts
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";
import { dynamo } from "../../common/dynamodb";
import { logger } from "../../common/logger";

const TABLE_NAME = process.env.POSTS_TABLE;

// Headers CORS (Essenciais!)
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const requestId = context.awsRequestId;
  const slug = event.pathParameters?.slug;

  if (!slug) {
    logger.warn("missing_slug", { requestId });
    return { statusCode: 400, body: JSON.stringify({ message: "Slug missing" }), headers };
  }

  logger.debug("get_post_request", { requestId, slug });

  try {
    const result = await dynamo.send(new GetCommand({ TableName: TABLE_NAME, Key: { slug } }));

    if (!result.Item || result.Item.status !== "Publicado") {
      logger.info("post_not_found", { requestId, slug });
      return { statusCode: 404, body: JSON.stringify({ message: "Post not found" }), headers };
    }

    logger.info("post_fetched", { requestId, slug });
    return { statusCode: 200, body: JSON.stringify({ post: result.Item }), headers };

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("get_post_error", { requestId, slug, error: message });
    return { statusCode: 500, body: JSON.stringify({ message: "Internal Server Error", requestId }), headers };
  }
};