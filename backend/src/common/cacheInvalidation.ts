//
// On-demand edge cache (CloudFront) invalidation for /post/{slug} (and
// optionally "/", which shows recent posts): called from the 3 write
// paths that change a post's public content (adminPosts.savePost/
// deletePost, postScheduler.publishPost). Without this, Next.js's
// `revalidate=60` only expires naturally; with it, an edit/publish shows up
// on the public site without waiting out the cache window.
//
// Phase 1 only: does not cover OpenNext's internal cache (ephemeral, per
// Lambda instance), deliberately deferred until there's real traffic to
// justify that complexity.
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import { logger } from "./logger";

const cloudfront = new CloudFrontClient({});
const DISTRIBUTION_ID = process.env.FRONTEND_DISTRIBUTION_ID;

// Best-effort: never throws, a failure here must not block the
// save/publish/delete response. Worst case without invalidation: the post
// stays stale until the natural revalidate (60s on /post/[slug], 300s on
// "/").
export async function invalidatePostCache(paths: string[]): Promise<void> {
  if (!DISTRIBUTION_ID || paths.length === 0) return;

  try {
    await cloudfront.send(
      new CreateInvalidationCommand({
        DistributionId: DISTRIBUTION_ID,
        InvalidationBatch: {
          Paths: { Quantity: paths.length, Items: paths },
          CallerReference: `${Date.now()}-${paths[0]}`,
        },
      }),
    );
  } catch (err) {
    logger.warn("cache_invalidation_failed", { paths, error: String(err) });
  }
}
