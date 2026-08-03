// Re-exports the shared Post input schemas from packages/contracts — the
// single source of truth between backend and admin. Kept as a thin
// re-export to avoid touching every import site across the admin* Lambdas.
export { createPostInputSchema, updatePostInputSchema } from '@mgoncalves/contracts';
export type { CreatePostInput, UpdatePostInput } from '@mgoncalves/contracts';
