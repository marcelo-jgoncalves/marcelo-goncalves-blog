// Re-exports the shared entity contracts from packages/contracts: the
// single source of truth between backend and admin. Type-only: no runtime
// zod dependency is pulled into the admin bundle.
export type { Post, PostStatus, Categoria, Subcategoria, Autor } from '@mgoncalves/contracts'
