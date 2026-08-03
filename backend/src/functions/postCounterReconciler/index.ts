// Triggered by EventBridge Scheduler once a day.
// Recounts the real posts table (Scan) and compares against the aggregated
// counters (postCounters.ts) that every write path is supposed to keep in
// sync via a transaction. Closes the gap documented in docs/backlog.md item
// #23: nothing structurally prevents a future write path from forgetting to
// update the counters, and until now nothing detected it if one did.
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../../common/dynamodb";
import { logger } from "../../common/logger";
import { COUNTERS_SLUG, getPostCounters, applyCounterDeltas } from "../../common/postCounters";
import { requireEnv } from "../../common/env";

const TABLE_NAME = requireEnv("POSTS_TABLE");

interface ScannedPost {
  slug: string;
  status?: string;
  e_projeto?: number;
}

export const handler = async (_event: unknown): Promise<void> => {
  logger.info("counter_reconciler_run_start", {});

  try {
    const posts = await scanAllPosts();
    const realTotal = posts.filter((p) => p.status === "Publicado").length;
    const realProjeto = posts.filter((p) => p.status === "Publicado" && Number(p.e_projeto) === 1).length;

    const stored = await getPostCounters();
    const deltaTotal = realTotal - stored.total_publicado;
    const deltaProjeto = realProjeto - stored.total_projeto_publicado;

    if (deltaTotal === 0 && deltaProjeto === 0) {
      logger.info("counter_reconciler_run_complete", { drift: false, realTotal, realProjeto });
      return;
    }

    // Self-heals via the same ADD-delta primitive the runtime write paths use
    // (postCounters.ts), then logs at "warn" so the drift is visible in
    // CloudWatch Logs/Insights even though it was corrected automatically —
    // repeated drift here is a symptom of a write path that isn't going
    // through computeCounterDeltas/applyCounterDeltas, worth investigating.
    await applyCounterDeltas({ deltaTotal, deltaProjeto });
    logger.warn("counter_reconciler_drift_detected", {
      storedTotal: stored.total_publicado,
      storedProjeto: stored.total_projeto_publicado,
      realTotal,
      realProjeto,
      deltaTotal,
      deltaProjeto,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("counter_reconciler_run_error", { error: message });
    throw error;
  }
};

async function scanAllPosts(): Promise<ScannedPost[]> {
  const items: ScannedPost[] = [];
  let lastKey: Record<string, unknown> | undefined;

  do {
    const result = await dynamo.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        ProjectionExpression: "slug, #status, e_projeto",
        ExpressionAttributeNames: { "#status": "status" },
        ExclusiveStartKey: lastKey,
      }),
    );

    for (const item of result.Items ?? []) {
      if (item.slug !== COUNTERS_SLUG) items.push(item as ScannedPost);
    }

    lastKey = result.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (lastKey);

  return items;
}
