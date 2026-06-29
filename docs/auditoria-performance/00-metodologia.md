# Auditoria de Performance & Escalabilidade — Sumário Executivo

> Status: **✅ executada e fechada em 2026-06-28** (todas as 9 categorias do plano: PERF1-8 + PERF-LOAD/PERF-CWV como adições). Plano original: `docs/plano-auditoria-performance.md`. Fechamento das 4 categorias de análise (PERF1/3/6/8): `04-fechamento.md`.
> Diferença em relação à auditoria de engenharia anterior (`docs/auditoria-engenharia/07-performance-e-escalabilidade.md`): aquela foi 100% leitura estática de código/Terraform. Esta auditoria adicionou a dimensão que faltava — dado real de execução: teste de carga (k6), métricas reais do CloudWatch, e Core Web Vitals reais (Lighthouse) — todos contra o ambiente de dev real, nunca simulados.

## Achados, ordenados por prioridade real (não pela ordem de execução)

### 🔴 #1 — LCP médio real está fora do threshold "Good" do Core Web Vitals (PERF-CWV)
Médio de 2.74s em 8 execuções reais (threshold "Good" é ≤2.5s) — 5 de 8 execuções excedem o limite. Causa raiz identificada: a Lambda SSR (`nextjs-server`) tem `Duration` real altamente variável (793ms-1.892ms, medido via CloudWatch), e essa variação se propaga quase 1:1 para o TTFB percebido, que é o primeiro componente do LCP. Relevante para SEO (Core Web Vitals é fator de ranking do Google). Detalhe completo: `03-perf-cwv.md` + `02-perf7-perf2-perf5.md`.

### 🟡 #2 — Achados de escalabilidade do critério 7 são confirmados como risco futuro, não problema atual (PERF-LOAD)
Teste de carga real (k6, rampa 1→30 VUs) mostrou p95=832.8ms e 0.10% de erro, sem nenhum throttling — incluindo na rota `/busca` (`Scan` completo do DynamoDB, achado de alto impacto do critério 7). O anti-padrão é real e vai se tornar um problema conforme o volume de posts crescer, mas **hoje, com 14 posts na tabela, não é o gargalo de latência** — o gargalo real observado foi a rota `/artigos` (achado de double-query de contagem, também já documentado no critério 7). Detalhe completo: `01-perf-load.md`.

### 🟢 #3 — Infraestrutura de métrica básica já existe e é gratuita, só não estava sendo consultada (PERF7)
Métricas de `Duration` (Lambda) e `Requests` (CloudFront) estão disponíveis e gratuitas hoje, mesmo com `enable_cloudwatch_alarms=false`. Não é um achado de correção — é a confirmação de que dado real está acessível sem custo extra, e deveria ser parte da rotina (não só de uma auditoria pontual). Detalhe completo: `02-perf7-perf2-perf5.md`.

### 🟢 #4 — `CacheHitRate` do CloudFront não está disponível, e não vale habilitar agora (PERF5)
Exige uma subscription de métricas adicionais (paga). Tráfego real confirmado via métrica básica: 2-20 requisições/dia — volume baixo demais para um cache hit ratio ser estatisticamente útil. Decisão: não habilitar agora, revisitar quando o tráfego justificar (mesmo critério já usado para `enable_cloudfront_logging=false`). Detalhe completo: `02-perf7-perf2-perf5.md`.

## Achado de método (correção durante a execução, não achado de performance)

A primeira rodada de PERF-LOAD incluiu `GET /categorias` como rota pública, assumindo incorretamente a partir de um `path_part` no Terraform. Na real, esse recurso é `/admin/categorias` (Cognito-only) — não existe endpoint público de listagem de categorias. Corrigido no script antes do resultado final ser produzido. Registrado em `01-perf-load.md` porque é exatamente o tipo de erro que a metodologia "confirmar achado contra o ambiente real" (já estabelecida na AppSec) existe para capturar.

## O que esta auditoria não encontrou (e por quê isso também é informação)

Nenhum throttling de Lambda (limite de 10 concorrentes/conta, backlog #6) se manifestou na carga testada (até 30 VUs). Isso não fecha o achado do backlog — é um teto real da AWS — mas indica que o padrão de tráfego atual não é suficiente para disparar esse limite na prática.

## Correções aplicadas nesta sessão (zero custo, zero efeito colateral)

- **Backlog #15 (`CloudFront static/* TTL`) corrigido como item de documentação, não de código** — ao tentar aplicar, descobri que `default_ttl`/`max_ttl` já estão explícitos em `infra/modules/frontend/cloudfront.tf:277-279`. O backlog estava desatualizado (item já resolvido em sessão anterior, nunca marcado). `CLAUDE.md` atualizado para refletir o estado real.

## `getAllPosts`/`getProjectPosts`: query duplicada de `COUNT` — ✅ resolvido com contador atômico (2026-06-28, sessão seguinte)

Decisão do Marcelo: manter "Página X de Y" (não trocar por paginação sem contagem total) e resolver pela via "melhor prática", não pela via "menor esforço" — projeto também serve como lab de estudo. Implementado:

- `backend/src/common/postCounters.ts` — `total_publicado`/`total_projeto_publicado` num item de metadata único na própria tabela `posts` (`slug = "__METADATA__#posts_counters"`), sparse (não tem `status`/`e_projeto_marker`, então não aparece em nenhuma GSI nem na busca por `Scan`).
- Atualizado via `UpdateCommand` com `ADD` atômico (não precisa inicializar — `ADD` em atributo inexistente cria com o valor do delta) em 3 pontos de escrita reais: `adminPosts.savePost` e `adminPosts.deletePost` (lendo o estado anterior via `GetCommand` antes do overwrite para calcular o delta) e `postScheduler.publishPost` (transição Programado→Publicado, que nunca contava antes).
- `getAllPosts`/`getProjectPosts` passam a ler o contador via 1 `GetCommand` (1 RCU) em paralelo à Query de itens, em vez de uma 2ª `Query` completa na GSI.
- Backfill do valor inicial: `scripts/backfill-post-counters.mjs` (mesmo padrão de `backfill-gsi-markers.mjs`) — conta os posts reais via Scan único e aplica o delta necessário. Rodado contra dev: 13 `total_publicado`/13 `total_projeto_publicado`, confirmado idempotente (2ª execução em `--dry-run` reporta delta zero).
- Cobertura de teste: `postCounters.test.ts` (lógica pura de `computeCounterDeltas`, 10 casos) + testes novos em `adminPosts`/`postScheduler`/`getPosts` cobrindo os deltas em cada transição de status. 145 testes backend passando.

## Memória do `nextjs-server` (1024MB → maior) — ainda não aplicado

Candidato razoável para reduzir a variabilidade de `Duration` (achado #1 desta auditoria, CPU adicional tende a acelerar SSR), mas o efeito em custo não é garantido zero (Lambda cobra por GB-segundo; se a duração não cair proporcionalmente, o custo sobe). Não aplicado — registrado como backlog #21, aguardando decisão (Marcelo indicou que a investigação da causa raiz do SSR fica para depois).

## Backlog de otimização (ordem de prioridade real, não de facilidade de implementação)

1. Investigar a causa da variação de `Duration` do `nextjs-server` (cold start? efeito de `provisioned_concurrency=0` em dev?) — prioridade alta, efeito direto e medido no Core Web Vitals. Backlog #21, ainda pendente.
2. Migrar `searchPosts` para fora do `Scan` completo (Algolia, backlog #16, plano já existente em `docs/plano-busca-algolia.md`) — risco confirmado como real, ainda sem gatilho de urgência pelo volume atual.
3. GSI projections `KEYS_ONLY`/`INCLUDE` em vez de `ALL` (backlog #13) — sem novo dado desta auditoria, mantém prioridade já definida (fazer com volume real de posts).

~~Decisão de produto sobre a segunda query de `COUNT`~~ ✅ resolvida — ver seção acima (contador atômico implementado, backlog #22 fechado).

## Entregáveis desta execução

- `docs/auditoria-performance/01-perf-load.md` — PERF4 + PERF-LOAD (teste de carga k6)
- `docs/auditoria-performance/02-perf7-perf2-perf5.md` — PERF7 (monitoramento), PERF2 (compute), PERF5 (network/cache)
- `docs/auditoria-performance/03-perf-cwv.md` — PERF-CWV (Core Web Vitals via Lighthouse)
- `scripts/performance-audit/` — scripts reutilizáveis (k6 + Lighthouse CI config), prontos para rodar de novo em qualquer momento futuro (ex: depois de aplicar uma correção, para medir antes/depois)

- `docs/auditoria-performance/04-fechamento.md` — PERF1 (TTL de ISR vs. padrão real de atualização, com dado real de DynamoDB), PERF3 (storage, sem achado), PERF6 (evolução, sem achado), PERF8 (trade-offs documentados formalmente)

## Fora desta execução (por decisão de escopo do plano original, não pendência)

- FinOps dedicada (auditoria irmã, ainda só planejada) — mediria os mesmos achados de GSI/scan pelo ângulo de custo, não de latência.
