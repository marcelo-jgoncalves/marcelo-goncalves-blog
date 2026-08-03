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
import { PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { integrationClient, createPostsTable, createCategoriasTable, deleteTable } from "./setup";

const TABLE_NAME = `integration-posts-${Date.now()}-${process.pid}`;
const CATEGORIAS_TABLE_NAME = `integration-categorias-${Date.now()}-${process.pid}`;

process.env.POSTS_TABLE = TABLE_NAME;
process.env.CATEGORIAS_TABLE = CATEGORIAS_TABLE_NAME;
process.env.AUTHORS_TABLE = TABLE_NAME; // unused by these tests, but the module reads it at load time
process.env.ADMIN_ORIGIN = "https://test-admin.example.com"; // adminPosts requires it (requireEnv)
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
  await createCategoriasTable(client, CATEGORIAS_TABLE_NAME);
  ({ handler: adminPostsHandler } = await import("../functions/adminPosts"));
  ({ handler: getPostsHandler } = await import("../functions/getPosts"));
  ({ handler: postSchedulerHandler } = await import("../functions/postScheduler"));
}, 30000);

afterAll(async () => {
  await deleteTable(client, TABLE_NAME);
  await deleteTable(client, CATEGORIAS_TABLE_NAME);
});

describe("adminPosts.savePost against real DynamoDB", () => {
  it("creates a post via the transactional write and makes it queryable on StatusPorData, with the counter incremented atomically", async () => {
    const post = samplePost();

    const createResult: APIGatewayProxyResult = await adminPostsHandler(
      apiEvent({ httpMethod: "POST", body: JSON.stringify(post) }),
      ctx,
    );
    expect(createResult.statusCode).toBe(201);

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
    // createPostInputSchema rejects a past data_publicacao_programada, so the
    // post is created with a future date and then pushed into the past via a
    // raw UpdateItemCommand — simulating time passing rather than a save that
    // was already invalid the moment it was made.
    const post = samplePost({
      status: "Programado",
      data_publicacao_programada: new Date(Date.now() + 3_600_000).toISOString(),
    });
    await adminPostsHandler(apiEvent({ httpMethod: "POST", body: JSON.stringify(post) }), ctx);

    const dueDate = new Date(Date.now() - 60_000).toISOString(); // 1 minute in the past
    await client.send(
      new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: { slug: { S: post.slug } },
        UpdateExpression: "SET data_publicacao_programada = :due",
        ExpressionAttributeValues: { ":due": { S: dueDate } },
      }),
    );

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

describe("adminPosts write conflicts against real DynamoDB (ConditionExpression, not app-level checks)", () => {
  it("rejects creating a post whose slug already exists with 409, without overwriting the original", async () => {
    const post = samplePost({ titulo: "Original" });
    await adminPostsHandler(apiEvent({ httpMethod: "POST", body: JSON.stringify(post) }), ctx);

    const conflictResult: APIGatewayProxyResult = await adminPostsHandler(
      apiEvent({ httpMethod: "POST", body: JSON.stringify({ ...post, titulo: "Overwrite attempt" }) }),
      ctx,
    );
    expect(conflictResult.statusCode).toBe(409);

    const getResult: APIGatewayProxyResult = await adminPostsHandler(
      apiEvent({ httpMethod: "GET", pathParameters: { slug: post.slug } }),
      ctx,
    );
    expect(JSON.parse(getResult.body).titulo).toBe("Original");
  });

  it("rejects updating a post that does not exist with 404", async () => {
    const slug = `post-${Math.random().toString(36).slice(2)}`;
    const result: APIGatewayProxyResult = await adminPostsHandler(
      apiEvent({
        httpMethod: "PATCH",
        pathParameters: { slug },
        body: JSON.stringify(samplePost({ slug, version: 1 })),
      }),
      ctx,
    );
    expect(result.statusCode).toBe(404);
  });

  it("rejects an update whose echoed version is stale, even though the slug exists (real ConditionExpression, not just the app's pre-check)", async () => {
    const post = samplePost();
    await adminPostsHandler(apiEvent({ httpMethod: "POST", body: JSON.stringify(post) }), ctx);

    const staleResult: APIGatewayProxyResult = await adminPostsHandler(
      apiEvent({
        httpMethod: "PATCH",
        pathParameters: { slug: post.slug },
        body: JSON.stringify({ ...post, titulo: "Edited with stale version", version: 999 }),
      }),
      ctx,
    );
    expect(staleResult.statusCode).toBe(409);

    const getResult: APIGatewayProxyResult = await adminPostsHandler(
      apiEvent({ httpMethod: "GET", pathParameters: { slug: post.slug } }),
      ctx,
    );
    expect(JSON.parse(getResult.body).titulo).not.toBe("Edited with stale version");
  });
});

describe("adminPosts DELETE vs concurrent update (real ConditionExpression, not a mock)", () => {
  // deletePost() always re-Gets right before its Delete, so a sequential
  // PUT-then-DELETE through the handler is never actually stale by the time
  // the Delete runs — there's no window to land an update between deletePost's
  // own Get and Delete without controlling DynamoDB's network timing directly.
  // This issues the exact ConditionExpression deletePost builds via a raw
  // DeleteItemCommand carrying a deliberately stale expected version (the
  // value a concurrent request's earlier Get would have captured), proving
  // the real DynamoDB service enforces it — not just the mocked unit tests.
  it("rejects a delete carrying a stale expected version once the real item has moved on, and the item survives", async () => {
    const post = samplePost();
    await adminPostsHandler(apiEvent({ httpMethod: "POST", body: JSON.stringify(post) }), ctx);

    const staleVersion = 1; // savePost's version on create

    // A second admin session's update lands, bumping version to 2.
    await adminPostsHandler(
      apiEvent({
        httpMethod: "PATCH",
        pathParameters: { slug: post.slug },
        body: JSON.stringify({ ...post, titulo: "Edited concurrently", version: staleVersion }),
      }),
      ctx,
    );

    // ConditionalCheckFailedException's message is the generic "The
    // conditional request failed" (unlike TransactWriteItems' cancellation
    // error below, whose message does embed the reason code) — the
    // exception name, not the message, is what identifies it here.
    await expect(
      client.send(
        new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { slug: { S: post.slug } },
          ConditionExpression: "attribute_not_exists(#version) OR #version = :expectedVersion",
          ExpressionAttributeNames: { "#version": "version" },
          ExpressionAttributeValues: { ":expectedVersion": { N: String(staleVersion) } },
        }),
      ),
    ).rejects.toMatchObject({ name: "ConditionalCheckFailedException" });

    const getResult: APIGatewayProxyResult = await adminPostsHandler(
      apiEvent({ httpMethod: "GET", pathParameters: { slug: post.slug } }),
      ctx,
    );
    expect(getResult.statusCode).toBe(200);
    expect(JSON.parse(getResult.body).titulo).toBe("Edited concurrently");
  });
});

describe("adminPosts DELETE vs concurrent DELETE (real ConditionExpression, not a mock)", () => {
  // Reproduces the P0.1 finding from the third audit: two concurrent deletes
  // reading the same version before either write lands. The first delete
  // through the handler removes the item; a raw DeleteItemCommand replays
  // the exact ConditionExpression deletePost built from that same stale Get,
  // proving attribute_exists(slug) is what rejects the second delete now —
  // "attribute_not_exists(version) OR ..." alone would have let it through,
  // since the item is already gone by the time it runs.
  it("rejects a second concurrent delete once the item is already gone, decrementing the counter only once", async () => {
    const post = samplePost();
    await adminPostsHandler(apiEvent({ httpMethod: "POST", body: JSON.stringify(post) }), ctx);

    const versionAtGet = 1; // savePost's version on create, what both racing Gets would have read

    const before = await client.send(
      new GetItemCommand({ TableName: TABLE_NAME, Key: { slug: { S: "__METADATA__#posts_counters" } } }),
    );
    const totalBefore = Number(before.Item?.total_publicado?.N ?? "0");

    const firstDelete: APIGatewayProxyResult = await adminPostsHandler(
      apiEvent({
        httpMethod: "DELETE",
        pathParameters: { slug: post.slug },
        queryStringParameters: { version: String(versionAtGet) },
      }),
      ctx,
    );
    expect(firstDelete.statusCode).toBe(200);

    await expect(
      client.send(
        new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { slug: { S: post.slug } },
          ConditionExpression: "attribute_exists(slug) AND (attribute_not_exists(#version) OR #version = :expectedVersion)",
          ExpressionAttributeNames: { "#version": "version" },
          ExpressionAttributeValues: { ":expectedVersion": { N: String(versionAtGet) } },
        }),
      ),
    ).rejects.toMatchObject({ name: "ConditionalCheckFailedException" });

    const getResult: APIGatewayProxyResult = await adminPostsHandler(
      apiEvent({ httpMethod: "GET", pathParameters: { slug: post.slug } }),
      ctx,
    );
    expect(getResult.statusCode).toBe(404);

    const after = await client.send(
      new GetItemCommand({ TableName: TABLE_NAME, Key: { slug: { S: "__METADATA__#posts_counters" } } }),
    );
    expect(Number(after.Item?.total_publicado?.N ?? "0")).toBe(totalBefore - 1);
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
