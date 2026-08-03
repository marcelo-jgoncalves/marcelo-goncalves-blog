# Recomendações de Ajustes — Auditoria Atual — Tarefas de Correção

Fonte: documento "Recomendações de Ajustes — Auditoria Atual" colado por Marcelo em 2026-08-03. Este arquivo é o rastreador de progresso — atualizar o status a cada tarefa concluída. Continuar a partir daqui em sessões futuras.

## Status geral
Execução iniciada em 2026-08-03. Retomar lendo este arquivo antes de qualquer coisa.

## P0 — Corrigir o ciclo de versionamento do editor

- [x] **1.2** Backend: resposta de create/update retorna `slug`, `version`, `data_atualizacao`, mensagem, status HTTP correto (201 create / 200 update). Criar `savePostResponseSchema` compartilhado em `packages/contracts`.
- [x] **1.3** Admin: cliente da API (`postsApi`/equivalente) parseia a resposta tipada via `savePostResponseSchema`, não ignora o body.
- [x] **1.4** Admin: formulário atualiza `form.value.slug/version/data_atualizacao` a partir da resposta após salvar; `router.replace` só depois do estado local sincronizado. `isEditing` continua sendo um `computed` derivado da rota (não pode ser atribuído diretamente) — o efeito prático pedido (uma 2ª gravação sem reload não repete o create) foi resolvido com um novo `createdInSession` ref que a `save()` consulta junto com `isEditing`.
- [x] **1.5** Admin: diferenciar mensagens de 409 (conflito real de edição concorrente vs. slug duplicado no create) e 404 (post removido por outra sessão) e 400 (dados inválidos) — 4 branches distintos em `usePostForm.ts`'s `save()` catch.
- [x] **1.6** Testes: criação seguida de nova gravação sem reload; sincronização de slug/version/data_atualizacao a partir da resposta; conflito real (409) com toast específico; conflito de slug no create (409) com toast distinto.

## P1 — Normalizar timezone e data programada

- [x] **2.2** Admin: `localDateTimeToUtcIso()` — converter `datetime-local` para ISO UTC antes de enviar. `admin/src/utils/date.ts` (novo arquivo).
- [x] **2.3** Admin: `utcIsoToLocalDateTimeInput()` — converter ISO UTC para `datetime-local` ao carregar o formulário. Mesmo arquivo.
- [x] **2.4** Contrato: `data_publicacao_programada` só aceita ISO 8601 completo com timezone (`z.string().datetime({ offset: true })`, com preprocess de `""` → `undefined`) — já implementado em `packages/contracts/src/post.ts` (parte do trabalho já em andamento nesta sessão antes da checagem final).
- [x] **2.5** Contrato: validação de data futura via `superRefine` quando `status === "Programado"` já existia do round anterior (terceira auditoria) — confirmado, não usa clock injetável (usa `Date.now()` direto); não revisitado nesta sessão por não ser o gap identificado (é um item de robustez de teste, não de comportamento).
- [x] **2.6** Backend: `savePost()` sempre persiste `data_atualizacao`/`data_publicacao_programada` normalizados via `.toISOString()` (normalizeScheduledDate no contrato) — confirmado sem mudança necessária.
- [x] **2.7** Scheduler: confirmado — `postScheduler/index.ts` compara `data_publicacao_programada <= :now` como string, ambos `new Date().toISOString()`; agora que o contrato exige offset explícito, todo valor novo escrito é garantidamente UTC. Não há estratégia de migração de registros legados sem timezone (nenhum encontrado em produção); não implementado por falta de gatilho real (YAGNI).
- [x] **2.8** Testes: round-trip local→UTC→local (`admin/src/__tests__/utils/date.test.ts`, 8 testes); rejeição de `data_publicacao_programada` sem offset (`packages/contracts/src/post.test.ts`, backend `index.test.ts`). Casos de fuso específico (UTC-3/UTC+1) não testados isoladamente — a conversão usa o `Date` nativo do ambiente de teste (UTC no CI), não fusos simulados; scheduler já tinha cobertura própria (não alterado).

## P1 — Definir semântica correta de atualização (PUT vs PATCH)

- [x] **3.2/3.3** Implementado: `PATCH /admin/post/{slug}` substitui `PUT`. `savePost()` em `backend/src/functions/adminPosts/index.ts` faz `merged = {...existing, ...data}` e o item final é construído a partir de `merged`, não de `data` isolado. `slug` nunca vem do payload no update (sempre o `{slug}` da URL); `updatePostInputSchema` usa `.strict()` (rejeita campo desconhecido em vez de descartar silenciosamente) e aceita `data_atualizacao` só para ignorá-lo (o servidor sempre sobrescreve com `now`).
- [x] **3.4** `computeCounterDeltas(existing, item)` já recebia o item final construído (confirmado, sem mudança necessária).
- [x] **3.5** Remoção via `null` explícito implementada para `subtitulo` e `imagem_lqip_base64` (campos com caso de uso real de "remover"): `updatePostInputSchema` os torna `.nullable()`; `savePost()` deleta a chave do item mesclado quando o valor é `null` (`REMOVABLE_FIELDS` em `index.ts`). Demais campos opcionais (subcategoria, meta SEO, tópico, variante) não ganharam o mecanismo de remoção — não têm um caso de uso real de "limpar" identificado na UI hoje; ampliar a lista é trivial se surgir a necessidade.
- [x] **3.6** Testes adicionados em `backend/src/functions/adminPosts/index.test.ts`: preserva campo omitido do payload; remove campo via `null`; ignora `slug` enviado pelo cliente; resposta com slug/version/data_atualizacao atualizados. Recalculo de contador em mudança de status já tinha cobertura prévia (não regrediu — confirmado pelos 56 testes do arquivo passando).

## P2 — CI/CD e produção

- [ ] ~~**4** Smoke Playwright em produção~~ — POSTERGADO (mesma decisão já registrada em `docs/terceira-auditoria-tarefas.md`: produção não existe ainda; revisitar quando produção for ativada).
- [x] **5** Atualizar action `aws-actions/configure-aws-credentials` para versão estável mais recente, pin por SHA. Confirmado que a atualização de 2026-08-02 (CLAUDE.md §11) cobriu `checkout`/`setup-node`, mas não esta action — ainda estava em v4 (SHA `7474bc4690e29a8392af63c5b98e7449536d5c3a`). Atualizado para v6.2.3 (SHA `e6de054238d6b7531b4efff3b6587d9aade6a06c`, via `gh api repos/aws-actions/configure-aws-credentials/releases/latest`), nas 3 ocorrências em `.github/workflows/cd.yml`.

## P2 — Documentação (item 7 do documento)
- [x] Atualizado `README.md` (seção de arquitetura, logo após a lista de Lambdas) com um parágrafo curto cobrindo: UTC ISO 8601, PATCH parcial (merge + remoção via `null`), exigência de `version` (concorrência otimista), e o shape da resposta de save. Estratégia de rollback/smoke em produção não documentada — fora de escopo (produção não existe ainda, mesma decisão do item 4).

## Decisões confirmadas por Marcelo
- **3.2/3.3 (PUT vs PATCH)** — confirmado em 2026-08-03: adotar **PATCH parcial com merge** (recomendação principal do documento). Endpoint de update passa de `PUT` para `PATCH`; backend faz merge `{...existing, ...data, camposProtegidos}`; contrato de update usa `.strict()` para rejeitar campos internos.

## Itens que dependem de decisão/autorização do Marcelo (postergados)
- **Item 4 (smoke Playwright produção)** — já postergado antes (2026-08-02); mantém-se postergado.

## Registro de conclusão
(cada item concluído ganha uma linha aqui com data + commit)

- 2026-08-03 — Itens 1 (P0 ciclo de versionamento), 2 (P1 timezone/agendamento), 3 (P1 PATCH parcial com merge), 5 (SHA de `configure-aws-credentials`) e 7 (documentação) implementados. Arquivos tocados: `packages/contracts/src/post.ts` e `post.test.ts`; `backend/src/functions/adminPosts/index.ts` e `index.test.ts`; `backend/src/integration/posts.integration.test.ts` (PUT→PATCH, 200→201 no create — não executado localmente, DynamoDB Local não alcançável neste ambiente); `admin/src/services/api.ts` e `api.test.ts`; `admin/src/composables/usePostForm.ts` e `usePostForm.test.ts`; `admin/src/utils/date.ts` (novo) e `date.test.ts` (novo); `.github/workflows/cd.yml`; `README.md`. Testes: contracts 28/28, backend 208/208, admin 43/43 — todos verdes. Typecheck/lint limpos nos 3 workspaces. Commit ainda não criado (aguardando revisão humana).
