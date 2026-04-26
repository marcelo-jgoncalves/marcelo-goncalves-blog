// backend/src/functions/getPost/index.ts
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";
import { dynamo } from "../../common/dynamodb";

const TABLE_NAME = process.env.POSTS_TABLE;

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
    const result = await dynamo.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { slug: slug },
      })
    );

    if (!result.Item || result.Item.status !== "Publicado") {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Post not found" }),
        headers,
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ post: result.Item }),
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