// Shared table-lifecycle helpers for integration tests running against a
// real DynamoDB (DynamoDB Local in CI, see package.json test:integration and
// .github/workflows/cd.yml). Schema mirrors the posts table Terraform
// actually creates (infra/modules/dynamodb/main.tf), kept in sync by hand,
// since Terraform doesn't export a machine-readable schema to import here.
import { DynamoDBClient, CreateTableCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";

export function integrationClient(): DynamoDBClient {
  return new DynamoDBClient({
    endpoint: process.env.AWS_ENDPOINT_URL,
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: { accessKeyId: "local", secretAccessKey: "local" },
  });
}

export async function createPostsTable(client: DynamoDBClient, tableName: string): Promise<void> {
  await client.send(new CreateTableCommand({
    TableName: tableName,
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [
      { AttributeName: "slug", AttributeType: "S" },
      { AttributeName: "status", AttributeType: "S" },
      { AttributeName: "data_atualizacao", AttributeType: "S" },
      { AttributeName: "categoria_slug", AttributeType: "S" },
      { AttributeName: "data_publicacao", AttributeType: "S" },
      { AttributeName: "data_publicacao_programada", AttributeType: "S" },
      { AttributeName: "e_projeto_marker", AttributeType: "S" },
      { AttributeName: "e_popular_marker", AttributeType: "S" },
    ],
    KeySchema: [{ AttributeName: "slug", KeyType: "HASH" }],
    GlobalSecondaryIndexes: [
      {
        IndexName: "StatusPorData",
        KeySchema: [
          { AttributeName: "status", KeyType: "HASH" },
          { AttributeName: "data_atualizacao", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
      },
      {
        IndexName: "CategoriaPorData",
        KeySchema: [
          { AttributeName: "categoria_slug", KeyType: "HASH" },
          { AttributeName: "data_atualizacao", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
      },
      {
        IndexName: "ProjetoPorData_v2",
        KeySchema: [
          { AttributeName: "e_projeto_marker", KeyType: "HASH" },
          { AttributeName: "data_publicacao", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
      },
      {
        IndexName: "PopularesPorData_v2",
        KeySchema: [
          { AttributeName: "e_popular_marker", KeyType: "HASH" },
          { AttributeName: "data_atualizacao", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
      },
      {
        IndexName: "StatusProgramadoPorData",
        KeySchema: [
          { AttributeName: "status", KeyType: "HASH" },
          { AttributeName: "data_publicacao_programada", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
      },
    ],
  }));
}

export async function createCategoriasTable(client: DynamoDBClient, tableName: string): Promise<void> {
  await client.send(new CreateTableCommand({
    TableName: tableName,
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [{ AttributeName: "categoria_slug", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "categoria_slug", KeyType: "HASH" }],
  }));
}

export async function deleteTable(client: DynamoDBClient, tableName: string): Promise<void> {
  await client.send(new DeleteTableCommand({ TableName: tableName })).catch(() => {});
}
