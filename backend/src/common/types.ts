// Re-exports the shared entity contracts from packages/contracts — the
// single source of truth between backend and admin. Kept as a thin
// re-export (instead of updating every import site) to avoid touching the
// ~dozen files across backend that import `Post`/`Categoria`/etc. from here.
export type { Post, PostStatus, Categoria, Subcategoria, Autor } from '@mgoncalves/contracts';
