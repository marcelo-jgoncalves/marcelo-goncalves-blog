// Triggered by EventBridge Scheduler every 15 minutes.
// Publishes posts where status = "Programado" and data_publicacao_programada <= NOW.
import { QueryCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../../common/dynamodb";
import { logger } from "../../common/logger";
import { computeCounterDeltas, buildCounterTransactUpdate } from "../../common/postCounters";
import { invalidatePostCache } from "../../common/cacheInvalidation";

const TABLE_NAME = process.env.POSTS_TABLE;

export const handler = async (_event: unknown): Promise<void> => {
  const now = new Date().toISOString();
  logger.info("scheduler_run_start", { now });

  try {
    const scheduledPosts = await fetchScheduledPosts(now);

    if (scheduledPosts.length === 0) {
      logger.info("scheduler_no_posts_to_publish", { now });
      return;
    }

    logger.info("scheduler_posts_found", { count: scheduledPosts.length, now });

    const results = await Promise.allSettled(
      scheduledPosts.map((post) => publishPost(post.slug, post.data_publicacao_programada, post.e_projeto, now)),
    );

    const published = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    logger.info("scheduler_run_complete", { published, failed, now });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("scheduler_run_error", { error: message, now });
    throw error;
  }
};

async function fetchScheduledPosts(now: string): Promise<Array<{ slug: string; data_publicacao_programada: string; e_projeto?: number }>> {
  const items: Array<{ slug: string; data_publicacao_programada: string; e_projeto?: number }> = [];
  let lastKey: Record<string, unknown> | undefined;

  do {
    const result = await dynamo.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "StatusProgramadoPorData",
        KeyConditionExpression: "#status = :programado AND data_publicacao_programada <= :now",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":programado": "Programado", ":now": now },
        // e_projeto incluído para computar o delta do contador agregado
        // (postCounters.ts) sem precisar de uma segunda leitura em publishPost.
        ProjectionExpression: "slug, data_publicacao_programada, e_projeto",
        ExclusiveStartKey: lastKey,
      }),
    );

    for (const item of result.Items ?? []) {
      if (item.slug && item.data_publicacao_programada) {
        items.push({ slug: item.slug, data_publicacao_programada: item.data_publicacao_programada, e_projeto: item.e_projeto });
      }
    }

    lastKey = result.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (lastKey);

  return items;
}

async function publishPost(slug: string, scheduledDate: string, eProjeto: number | undefined, now: string): Promise<void> {
  // "Programado" never counts toward the aggregates (only "Publicado" does),
  // so this transition is always +1 total, and +1 project only if e_projeto=1.
  // Post Update + counter ADD in a single transaction: a failure between two
  // sequential writes would leave the counters drifted with no detection.
  const counterUpdate = buildCounterTransactUpdate(
    computeCounterDeltas({ status: "Programado", e_projeto: eProjeto }, { status: "Publicado", e_projeto: eProjeto }),
  );

  await dynamo.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Update: {
            TableName: TABLE_NAME!,
            Key: { slug },
            UpdateExpression: "SET #status = :published, data_publicacao = :scheduledDate, data_atualizacao = :now",
            ConditionExpression: "#status = :programado",
            ExpressionAttributeNames: { "#status": "status" },
            ExpressionAttributeValues: {
              ":published": "Publicado",
              ":programado": "Programado",
              ":scheduledDate": scheduledDate,
              ":now": now,
            },
          },
        },
        ...(counterUpdate ? [counterUpdate] : []),
      ],
    }),
  );

  // Sempre Programado -> Publicado: a home (posts recentes) sempre fica
  // stale aqui, diferente de savePost onde isso só acontece condicionalmente.
  await invalidatePostCache([`/post/${slug}`, "/", "/artigos", "/todos-artigos", "/categoria/*"]);

  logger.info("post_published", { slug, scheduledDate });
}
