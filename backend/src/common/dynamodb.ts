// backend/src/common/dynamodb.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

function buildClient(): DynamoDBClient {
  const raw = new DynamoDBClient({});
  if (process.env.XRAY_ENABLED !== "true") return raw;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const AWSXRay = require("aws-xray-sdk-core");
  return AWSXRay.captureAWSv3Client(raw) as DynamoDBClient;
}

export const dynamo = DynamoDBDocumentClient.from(buildClient(), {
  marshallOptions: { removeUndefinedValues: true },
});