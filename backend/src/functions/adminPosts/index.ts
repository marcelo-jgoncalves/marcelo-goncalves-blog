import { APIGatewayProxyHandler } from "aws-lambda";
import { QueryCommand, GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../../common/dynamodb";
import { Post } from "../../common/types";
import { logger } from "../../common/logger";
import { sanitizePostHtml } from "../../common/sanitizer";
import { postInputSchema } from "../../common/postSchema";
import { computeCounterDeltas, applyCounterDeltas } from "../../common/postCounters";
import { invalidatePostCache } from "../../common/cacheInvalidation";

const TABLE_NAME = process.env.POSTS_TABLE;
const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN || "*";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": ADMIN_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const requestId = context.awsRequestId;

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, body: "", headers };
  }

  const { httpMethod, pathParameters, body } = event;
  const slug = pathParameters?.slug;

  logger.debug("admin_posts_request", { requestId, httpMethod, slug });

  try {
    // 1. Listar Todos
    if (httpMethod === "GET" && !slug) {
      return await listPosts();
    }

    // 2. Ler Um
    if (httpMethod === "GET" && slug) {
      return await getPost(slug);
    }

    // 3. Criar
    if (httpMethod === "POST") {
      if (!body) throw new Error("Body is required");
      const postData = JSON.parse(body);
      return await savePost(postData, true, requestId);
    }

    // 4. Atualizar
    if (httpMethod === "PUT" && slug) {
      if (!body) throw new Error("Body is required");
      const postData = JSON.parse(body);
      if (postData.slug !== slug) throw new Error("Slug mismatch");
      return await savePost(postData, false, requestId);
    }

    // 5. Deletar
    if (httpMethod === "DELETE" && slug) {
      return await deletePost(slug);
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
      headers, // <--- Importante
    };

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("admin_posts_error", { requestId, httpMethod, slug, error: message });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", requestId }),
      headers,
    };
  }
};

// --- Funções Auxiliares (AGORA COM HEADERS) ---

async function listPosts() {
  const statuses = ["Publicado", "Rascunho", "Programado"];

  const results = await Promise.all(
    statuses.map((status) =>
      dynamo.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "StatusPorData",
        KeyConditionExpression: "#status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":status": status },
        ProjectionExpression:
          "slug, titulo, #status, data_atualizacao, autor_id, categoria_slug, imagem_destaque_url, tempo_leitura_min, e_popular, e_projeto",
        ScanIndexForward: false,
      }))
    )
  );

  const allItems = results.flatMap((r) => r.Items || []);

  return {
    statusCode: 200,
    body: JSON.stringify({ items: allItems, count: allItems.length }),
    headers,
  };
}

async function getPost(slug: string) {
  const result = await dynamo.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { slug }
  }));
  
  if (!result.Item) {
    return { 
        statusCode: 404, 
        body: JSON.stringify({ message: "Post not found" }), 
        headers // <--- ADICIONADO
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
    headers, // <--- ADICIONADO
  };
}

async function savePost(rawData: unknown, isNew: boolean, requestId?: string) {
  const parsed = postInputSchema.safeParse(rawData);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }));
    logger.warn("admin_posts_validation_error", { requestId, issues });
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid post data", issues }),
      headers,
    };
  }
  const data = parsed.data;

  // Lido antes do overwrite só para saber o estado anterior (status/e_projeto)
  // e computar o delta dos contadores agregados (postCounters.ts) — não
  // existia leitura prévia aqui antes, savePost confiava 100% no body do
  // client para os campos não recalculados.
  const existing = isNew
    ? undefined
    : (await dynamo.send(new GetCommand({ TableName: TABLE_NAME, Key: { slug: data.slug } }))).Item as Post | undefined;

  const now = new Date().toISOString();
  const ePopular = Number(data.e_popular || 0);
  const eProjeto = Number(data.e_projeto || 0);

  const item: Post = {
    ...data as Post,
    conteudo_html: sanitizePostHtml(data.conteudo_html ?? ""),
    data_atualizacao: now,
    // Nunca gravar string vazia: quando e_popular/e_projeto=1, os GSIs
    // esparsos (PopularesPorData_v2/ProjetoPorData_v2) usam este campo como
    // range key, e uma AttributeValue vazia num atributo de chave de índice
    // é rejeitada pelo DynamoDB (crash observado ao salvar um Rascunho
    // marcado como "projeto" sem nunca ter tido data de publicação). Cai
    // para o valor já existente no update, ou "agora" na criação/1ª vez.
    data_publicacao: data.data_publicacao || existing?.data_publicacao || now,
    e_popular: ePopular,
    e_projeto: eProjeto,
    // undefined é omitido pelo marshaller (removeUndefinedValues: true em
    // common/dynamodb.ts) — isso é o que torna o índice esparso: o atributo
    // simplesmente não existe no item quando o flag é 0.
    e_popular_marker: ePopular === 1 ? "POP" : undefined,
    e_projeto_marker: eProjeto === 1 ? "PROJ" : undefined,
    tempo_leitura_min: Number(data.tempo_leitura_min || 5)
  };

  await dynamo.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item
  }));

  await applyCounterDeltas(computeCounterDeltas(existing, item));

  // Post passou a contar como publicado agora (criação já publicada, ou
  // transição de Rascunho/Programado -> Publicado) -- a home (posts
  // recentes) também fica stale, não só a página do post.
  const ficouPublicado = item.status === "Publicado" && existing?.status !== "Publicado";
  await invalidatePostCache(ficouPublicado ? [`/post/${item.slug}`, "/", "/artigos", "/categoria/*"] : [`/post/${item.slug}`]);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Post saved", slug: item.slug }),
    headers, // <--- ADICIONADO
  };
}

async function deletePost(slug: string) {
  const existing = (await dynamo.send(new GetCommand({ TableName: TABLE_NAME, Key: { slug } }))).Item as Post | undefined;

  await dynamo.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { slug }
  }));

  await applyCounterDeltas(computeCounterDeltas(existing, undefined));

  await invalidatePostCache(existing?.status === "Publicado" ? [`/post/${slug}`, "/", "/artigos", "/categoria/*"] : [`/post/${slug}`]);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Post deleted" }),
    headers, // <--- ADICIONADO
  };
}