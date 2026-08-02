// Re-exports the shared Post input schema from packages/contracts — the
// single source of truth between backend and admin. Kept as a thin
// re-export to avoid touching every import site across the admin* Lambdas.
export { postInputSchema } from '@mgoncalves/contracts';
export type { PostInput } from '@mgoncalves/contracts';
