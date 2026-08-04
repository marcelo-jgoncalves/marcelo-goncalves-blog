import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

function buildClient(): DynamoDBClient {
  const raw = new DynamoDBClient({});
  if (process.env.XRAY_ENABLED !== "true") return raw;
  // aws-xray-sdk-core ships no type declarations: the require() and its
  // return value are both `any` by nature, not a typing gap to close here.
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
  const AWSXRay: { captureAWSv3Client: (client: DynamoDBClient) => DynamoDBClient } = require("aws-xray-sdk-core");
  return AWSXRay.captureAWSv3Client(raw);
}

export const dynamo = DynamoDBDocumentClient.from(buildClient(), {
  marshallOptions: { removeUndefinedValues: true },
});