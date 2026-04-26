// backend/src/functions/postScheduler/index.ts
// Triggered by EventBridge Scheduler every 15 minutes.
// Publishes posts where status = "Programado" and data_publicacao_programada <= NOW.
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../../common/dynamodb";
import { logger } from "../../common/logger";

const TABLE_NAME = process.env.POSTS_TABLE;

export const handler = async (event: unknown): Promise<void> => {
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
      scheduledPosts.map((post) => publishPost(post.slug, post.data_publicacao_programada, now)),
    );

    const published = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    logger.info("scheduler_run_complete", { published, failed, now });
  } catch (error: any) {
    logger.error("scheduler_run_error", { error: error.message, now });
    throw error;
  }
};

async function fetchScheduledPosts(now: string): Promise<Array<{ slug: string; data_publicacao_programada: string }>> {
  const items: Array<{ slug: string; data_publicacao_programada: string }> = [];
  let lastKey: Record<string, unknown> | undefined;

  do {
    const result = await dynamo.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "StatusProgramadoPorData",
        KeyConditionExpression: "#status = :programado AND data_publicacao_programada <= :now",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":programado": "Programado", ":now": now },
        ProjectionExpression: "slug, data_publicacao_programada",
        ExclusiveStartKey: lastKey,
      }),
    );

    for (const item of result.Items ?? []) {
      if (item.slug && item.data_publicacao_programada) {
        items.push({ slug: item.slug, data_publicacao_programada: item.data_publicacao_programada });
      }
    }

    lastKey = result.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (lastKey);

  return items;
}

async function publishPost(slug: string, scheduledDate: string, now: string): Promise<void> {
  await dynamo.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
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
    }),
  );
  logger.info("post_published", { slug, scheduledDate });
}
