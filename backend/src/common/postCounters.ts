// backend/src/common/postCounters.ts
//
// Contador atômico de posts publicados — substitui a Query com
// `Select: "COUNT"` que getAllPosts/getProjectPosts disparavam em paralelo
// a cada requisição (achado real da auditoria de performance dedicada,
// docs/auditoria-performance/01-perf-load.md: essa segunda query dobrava o
// custo de leitura e tornava /artigos a rota mais lenta no teste de carga).
//
// Vive como um item próprio na tabela `posts` (slug = COUNTERS_SLUG), nunca
// aparece em nenhuma GSI porque não tem os atributos `status`/
// `e_projeto_marker` que as GSIs indexam (sparse index, mesmo princípio já
// usado em e_popular_marker/e_projeto_marker).
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "./dynamodb";

const TABLE_NAME = process.env.POSTS_TABLE;

export const COUNTERS_SLUG = "__METADATA__#posts_counters";

export interface PostCounters {
  total_publicado: number;
  total_projeto_publicado: number;
}

export async function getPostCounters(): Promise<PostCounters> {
  const result = await dynamo.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { slug: COUNTERS_SLUG } }),
  );
  return {
    total_publicado: result.Item?.total_publicado ?? 0,
    total_projeto_publicado: result.Item?.total_projeto_publicado ?? 0,
  };
}

// Estado mínimo de um post necessário para decidir se ele conta nos
// agregados — aceita undefined para representar "não existe" (post novo
// na criação, ou já deletado).
export interface CounterRelevantState {
  status?: string;
  e_projeto?: number;
}

function contaComoPublicado(item?: CounterRelevantState): boolean {
  return item?.status === "Publicado";
}

function contaComoProjeto(item?: CounterRelevantState): boolean {
  return item?.status === "Publicado" && Number(item?.e_projeto) === 1;
}

export interface CounterDeltas {
  deltaTotal: number;
  deltaProjeto: number;
}

// Compara o estado antes/depois de uma escrita e retorna o delta a aplicar
// nos contadores. Cobre os 3 caminhos de escrita reais: criação (oldItem
// undefined), atualização (ambos definidos) e exclusão (newItem undefined).
export function computeCounterDeltas(
  oldItem: CounterRelevantState | undefined,
  newItem: CounterRelevantState | undefined,
): CounterDeltas {
  return {
    deltaTotal: Number(contaComoPublicado(newItem)) - Number(contaComoPublicado(oldItem)),
    deltaProjeto: Number(contaComoProjeto(newItem)) - Number(contaComoProjeto(oldItem)),
  };
}

// ADD em DynamoDB cria o atributo (inicializado no valor do delta) se o
// item/atributo ainda não existir — não é preciso inicializar os
// contadores manualmente antes do primeiro uso.
export async function applyCounterDeltas(deltas: CounterDeltas): Promise<void> {
  if (deltas.deltaTotal === 0 && deltas.deltaProjeto === 0) return;

  await dynamo.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { slug: COUNTERS_SLUG },
      UpdateExpression: "ADD total_publicado :dt, total_projeto_publicado :dp",
      ExpressionAttributeValues: { ":dt": deltas.deltaTotal, ":dp": deltas.deltaProjeto },
    }),
  );
}
