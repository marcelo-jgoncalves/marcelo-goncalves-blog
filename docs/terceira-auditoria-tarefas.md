# Terceira Auditoria — Tarefas de Correção

Fonte: `terceira-auditoria-repositorio-evolucao-notas.md` (raiz, 2026-08-02). Este arquivo é o rastreador de progresso — atualizar o status a cada tarefa concluída. Continuar a partir daqui em sessões futuras.

## Status geral
Execução iniciada em 2026-08-02. Retomar lendo este arquivo antes de qualquer coisa.

## P0 — Correções imediatas

- [x] **P0.1** Corrigir condição de double delete em `backend/src/functions/adminPosts/index.ts` — adicionar `attribute_exists(slug)` à ConditionExpression do delete; criar teste de integração para duas exclusões concorrentes (uma sucesso, outra 409, contadores decrementados uma vez só).
- [x] **P0.2** Tornar `version` obrigatória no update — separar schemas `createPostSchema`/`updatePostSchema`/`persistedPostSchema` em `packages/contracts/src/post.ts`; POST não aceita `version`; PUT exige `version` (400/428 se ausente); testar ausência e conflito.

## P1 — Regras de domínio no backend

- [x] **P1.1** Normalizar datas programadas — backend valida formato, rejeita data passada, converte para UTC, persiste ISO 8601 completo; scheduler usa mesmo formato; testes de timezone.
- [x] **P1.2** Garantir `status` na criação — default server-side (`"Rascunho"`) via `z.enum(POST_STATUSES).default(...)` no schema de criação; testar criação sem status.

## P2 — Preparação de produção

- [ ] ~~**P2.1** Adicionar smoke Playwright em produção no `cd.yml`~~ — POSTERGADO por decisão de Marcelo (2026-08-02): produção ainda não existe; criar esse smoke só quando produção for ativada de fato.
- [ ] **P2.2** Confirmar pipeline verde do commit final (depende do push feito ao fim deste ciclo — verificar via `gh run list` depois).
- [x] **P2.3** Atualizar comentário no código sobre proteção de concorrência (`adminPosts/index.ts`) para refletir a condição real, não a intenção antiga.

## Itens que dependem de autorização do Marcelo (postergados)
- **P2.1** — smoke Playwright de produção: Marcelo pediu explicitamente para não criar agora, só quando produção existir de fato (2026-08-02). Gatilho para revisitar: ativação real do ambiente de produção.

## Registro de conclusão
- 2026-08-03 — **P0.2**: schemas separados em `packages/contracts/src/post.ts` (`createPostInputSchema`/`updatePostInputSchema`), `Post.version` passou a obrigatório; `backend/src/common/postSchema.ts` e `backend/src/functions/adminPosts/index.ts` atualizados para usar o schema certo por verbo; PUT sem `version` agora falha com 400 via validação do schema (sem necessidade de checagem manual). Testes novos/ajustados em `packages/contracts/src/post.test.ts` e `backend/src/functions/adminPosts/index.test.ts`.
- 2026-08-03 — **P1.1**: `data_publicacao_programada` validado e normalizado dentro de `createPostInputSchema`/`updatePostInputSchema` (só quando `status === "Programado"`, para não quebrar o re-save de posts já publicados que mantêm a data antiga) — rejeita data passada/não parseável, normaliza para ISO 8601 UTC completo via `.transform()`. `postScheduler` já comparava com `new Date().toISOString()`, sem mudança necessária lá. Testes em `post.test.ts` e `adminPosts/index.test.ts`; teste de integração do scheduler ajustado para criar com data futura e empurrar para o passado via `UpdateItemCommand` direto (criar já-vencido deixou de ser possível pela validação nova).
- 2026-08-03 — **P1.2**: `status` tem `.default("Rascunho")` em `createPostInputSchema` (schema de update permanece sem default, mantendo comportamento existente). Teste em `post.test.ts` e `adminPosts/index.test.ts`.
- 2026-08-03 — **P2.3**: comentário de `savePost()` sobre a ConditionExpression de version atualizado — não fala mais em clausula "extra"/best-effort, já que `updatePostInputSchema` agora torna `version` obrigatório e a cláusula é incondicional em todo update.
