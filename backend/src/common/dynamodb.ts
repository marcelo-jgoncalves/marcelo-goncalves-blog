// backend/src/common/dynamodb.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

// O DocumentClient facilita a vida convertendo objetos JS <-> DynamoDB JSON automaticamente
export const dynamo = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true, // Remove campos undefined para não dar erro no Dynamo
  },
});