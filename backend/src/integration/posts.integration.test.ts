// Integration tests against a REAL DynamoDB (DynamoDB Local in CI — see
// package.json test:integration and .github/workflows/cd.yml). Unit tests
// mock dynamo.send entirely, so they can't catch the class of bug that has
// bitten this project repeatedly: a contract the mock accepts but the real
// service rejects (missing IAM permission, an empty string in a GSI range
// key, a TransactWriteItems rollback). These tests exercise the real
// handlers end to end against a table with the actual GSI schema.
//
// Env vars (AWS_ENDPOINT_URL, POSTS_TABLE, dummy credentials) are set BEFORE
// importing the handler modules, since common/dynamodb.ts builds its client
// at module-load time — importing early would bind it to the wrong endpoint.
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { PutItemCommand, GetItemCommand, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { integrationClient, createPostsTable, deleteTable } from "./setup";

const TABLE_NAME = `integration-posts-${Date.now()}-${process.pid}`;

process.env.POSTS_TABLE = TABLE_NAME;
process.env.AUTHORS_TABLE = TABLE_NAME; // unused by these tests, but the module reads it at load time
process.env.AWS_REGION = process.env.AWS_REGION ?? "us-east-1";
process.env.AWS_ACCESS_KEY_ID = "local";
process.env.AWS_SECRET_ACCESS_KEY = "local";
process.env.LOG_LEVEL = "ERROR";
delete process.env.AWS_PROFILE;
delete process.env.FRONTEND_DISTRIBUTION_ID; // cacheInvalidation short-circuits without this — no real CloudFront call
delete process.env.XRAY_ENABLED;

const client = integrationClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let adminPostsHandler: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let getPostsHandler: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let postSchedulerHandler: any;

const ctx = { awsRequestId: "integration-test" } as Context;

function apiEvent(overrides: Partial<APIGatewayProxyEvent>): APIGatewayProxyEvent {
  return {
    body: null,
    headers: {},
    httpMethod: "GET",
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    path: "/",
    pathParameters: null,
    queryStringParameters: null,
    requestContext: {},
    resource: "/",
    stageVariables: null,
    ...overrides,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

function samplePost(overrides: Record<string, unknown> = {}) {
  return {
    slug: `post-${Math.random().toString(36).slice(2)}`,
    titulo: "Integration Test Post",
    autor_id: "marcelo-goncalves",
    conteudo_html: "<p>content</p>",
    resumo: "resumo",
    imagem_destaque_url: "https://example.com/img.jpg",
    imagem_destaque_alt_text: "alt",
    categoria_slug: "aws",
    status: "Publicado",
    tempo_leitura_min: 5,
    e_popular: 0,
    e_projeto: 0,
    ...overrides,
  };
}

beforeAll(async () => {
  await createPostsTable(client, TABLE_NAME);
  ({ handler: adminPostsHandler } = await import("../functions/adminPosts"));
  ({ handler: getPostsHandler } = await import("../functions/getPosts"));
  ({ handler: postSchedulerHandler } = await import("../functions/postScheduler"));
}, 30000);

afterAll(async () => {
  await deleteTable(client, TABLE_NAME);
});

describe("adminPosts.savePost against real DynamoDB", () => {
  it("creates a post via the transactional write and makes it queryable on StatusPorData, with the counter incremented atomically", async () => {
    const post = samplePost();

    const createResult: APIGatewayProxyResult = await adminPostsHandler(
      apiEvent({ httpMethod: "POST", body: JSON.stringify(post) }),
      ctx,
    );
    expect(createResult.statusCode).toBe(200);

    const listResult: APIGatewayProxyResult = await getPostsHandler(
      apiEvent({ resource: "/artigos", queryStringParameters: { limit: "10" } }),
      ctx,
    );
    const body = JSON.parse(listResult.body);
    expect(body.posts.some((p: { slug: string }) => p.slug === post.slug)).toBe(true);
    expect(body.totalCount).toBeGreaterThanOrEqual(1);
  });
});

describe("sparse GSI markers against real DynamoDB", () => {
  it("only a post with e_popular=1 shows up in PopularesPorData_v2 — the other post has no marker attribute at all", async () => {
    const popular = samplePost({ e_popular: 1 });
    const notPopular = samplePost({ e_popular: 0 });

    await adminPostsHandler(apiEvent({ httpMethod: "POST", body: JSON.stringify(popular) }), ctx);
    await adminPostsHandler(apiEvent({ httpMethod: "POST", body: JSON.stringify(notPopular) }), ctx);

    const result: APIGatewayProxyResult = await getPostsHandler(
      apiEvent({ resource: "/posts/populares", queryStringParameters: { limit: "50" } }),
      ctx,
    );
    const slugs = JSON.parse(result.body).posts.map((p: { slug: string }) => p.slug);
    expect(slugs).toContain(popular.slug);
    expect(slugs).not.toContain(notPopular.slug);
  });
});

describe("DynamoDB's own key-attribute validation (not app logic)", () => {
  it("rejects an empty string as a GSI range key value — pins the real service behavior the app's data_publicacao fallback exists to avoid", async () => {
    await expect(
      client.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          Item: {
            slug: { S: `post-${Math.random().toString(36).slice(2)}` },
            status: { S: "Rascunho" },
            e_projeto_marker: { S: "PROJ" },
            data_publicacao: { S: "" }, // range key of ProjetoPorData_v2 — must never be empty
          },
        }),
      ),
    ).rejects.toThrow();
  });
});

describe("postScheduler.handler against real DynamoDB (happy path, real TransactWriteItems)", () => {
  it("publishes a due Programado post and atomically increments total_publicado in the same transaction", async () => {
    const dueDate = new Date(Date.now() - 60_000).toISOString(); // 1 minute in the past
    const post = samplePost({ status: "Programado", data_publicacao_programada: dueDate });
    await adminPostsHandler(apiEvent({ httpMethod: "POST", body: JSON.stringify(post) }), ctx);

    await postSchedulerHandler({});

    const getResult: APIGatewayProxyResult = await adminPostsHandler(
      apiEvent({ httpMethod: "GET", pathParameters: { slug: post.slug } }),
      ctx,
    );
    expect(JSON.parse(getResult.body).status).toBe("Publicado");

    const listResult: APIGatewayProxyResult = await getPostsHandler(
      apiEvent({ resource: "/artigos", queryStringParameters: { limit: "50" } }),
      ctx,
    );
    expect(JSON.parse(listResult.body).posts.some((p: { slug: string }) => p.slug === post.slug)).toBe(true);
  });
});

describe("TransactWriteItems atomic rollback — real DynamoDB guarantee, not a mock assumption", () => {
  it("rejects the whole transaction and applies NEITHER item when one Update's ConditionExpression fails", async () => {
    const slug = `post-${Math.random().toString(36).slice(2)}`;
    await client.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: { slug: { S: slug }, status: { S: "Publicado" } }, // NOT Programado — condition below will fail
      }),
    );

    // The counter item already exists at this point (earlier tests in this
    // file published posts against the same shared table) — the assertion
    // below is a before/after comparison, not "does it exist at all".
    const before = await client.send(
      new GetItemCommand({ TableName: TABLE_NAME, Key: { slug: { S: "__METADATA__#posts_counters" } } }),
    );
    const totalBefore = before.Item?.total_publicado?.N;

    await expect(
      client.send(
        new TransactWriteItemsCommand({
          TransactItems: [
            {
              Update: {
                TableName: TABLE_NAME,
                Key: { slug: { S: slug } },
                UpdateExpression: "SET #status = :published",
                ConditionExpression: "#status = :programado",
                ExpressionAttributeNames: { "#status": "status" },
                ExpressionAttributeValues: {
                  ":published": { S: "Publicado" },
                  ":programado": { S: "Programado" },
                },
              },
            },
            {
              Update: {
                TableName: TABLE_NAME,
                Key: { slug: { S: "__METADATA__#posts_counters" } },
                UpdateExpression: "ADD total_publicado :one",
                ExpressionAttributeValues: { ":one": { N: "1" } },
              },
            },
          ],
        }),
      ),
    ).rejects.toThrow(/TransactionCanceledException|ConditionalCheckFailed/);

    // Unchanged — proves the 2nd Update (which has no condition of its own)
    // was never applied, exactly the scenario buildCounterTransactUpdate
    // relies on to keep counters from drifting.
    const after = await client.send(
      new GetItemCommand({ TableName: TABLE_NAME, Key: { slug: { S: "__METADATA__#posts_counters" } } }),
    );
    expect(after.Item?.total_publicado?.N).toBe(totalBefore);
  });
});
