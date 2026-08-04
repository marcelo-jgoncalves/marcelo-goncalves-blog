//
// Atomic counter of published posts: replaces the `Select: "COUNT"` query
// that getAllPosts/getProjectPosts fired in parallel on every request,
// doubling the read cost.
//
// Lives as its own item in the `posts` table (slug = COUNTERS_SLUG), never
// shows up in any GSI because it lacks the `status`/`e_projeto_marker`
// attributes the GSIs index on (sparse index, same principle already used
// in e_popular_marker/e_projeto_marker).
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
  const item: Record<string, unknown> | undefined = result.Item;
  const total = item?.total_publicado;
  const totalProjeto = item?.total_projeto_publicado;
  return {
    total_publicado: typeof total === "number" ? total : 0,
    total_projeto_publicado: typeof totalProjeto === "number" ? totalProjeto : 0,
  };
}

// Minimal post state needed to decide if it counts toward the aggregates:
// accepts undefined to represent "doesn't exist" (new post on create, or
// already deleted).
export interface CounterRelevantState {
  status?: string | undefined;
  e_projeto?: number | undefined;
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

// Compares before/after state of a write and returns the delta to apply to
// the counters. Covers the 3 real write paths: create (oldItem undefined),
// update (both defined), delete (newItem undefined).
export function computeCounterDeltas(
  oldItem: CounterRelevantState | undefined,
  newItem: CounterRelevantState | undefined,
): CounterDeltas {
  return {
    deltaTotal: Number(contaComoPublicado(newItem)) - Number(contaComoPublicado(oldItem)),
    deltaProjeto: Number(contaComoProjeto(newItem)) - Number(contaComoProjeto(oldItem)),
  };
}

// DynamoDB's ADD creates the attribute (initialized to the delta value) if
// the item/attribute doesn't exist yet: no need to manually initialize the
// counters before first use.
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

// Shape usable inside a TransactWriteCommand: lets a write path commit the
// post mutation and the counter ADD in a single atomic transaction, instead
// of two sequential calls where a crash in between leaves the counters
// drifted with no detection. Returns null when the write doesn't change the
// aggregates (caller falls back to a plain, cheaper single-item write).
export function buildCounterTransactUpdate(deltas: CounterDeltas) {
  if (deltas.deltaTotal === 0 && deltas.deltaProjeto === 0) return null;

  return {
    Update: {
      TableName: TABLE_NAME!,
      Key: { slug: COUNTERS_SLUG },
      UpdateExpression: "ADD total_publicado :dt, total_projeto_publicado :dp",
      ExpressionAttributeValues: { ":dt": deltas.deltaTotal, ":dp": deltas.deltaProjeto },
    },
  };
}
