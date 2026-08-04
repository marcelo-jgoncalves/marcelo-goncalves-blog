import { postEntitySchema, Post } from "@mgoncalves/contracts";
import { logger } from "./logger";

// A cast (`as Post`) only tells the compiler to trust the shape, it proves
// nothing about the item actually read from DynamoDB (manual table edit,
// a field removed in a later schema version, partial write from a bug).
// This validates at the boundary instead, so corrupted data fails loudly
// here rather than reaching business logic silently malformed.
export function parsePostItem(item: unknown, context: { requestId?: string | undefined; slug?: string | undefined }): Post {
  const result = postEntitySchema.safeParse(item);
  if (!result.success) {
    // Never log the raw item: it may contain content fields, only the
    // identifier needed to locate the corrupted row.
    logger.error("post_item_invalid", { ...context, issues: result.error.issues.map((i) => i.path.join(".")) });
    throw new Error("Persisted post item failed validation");
  }
  return result.data;
}
