# Checklist de execução — Auditoria de Performance

> Referência: registro histórico arquivado fora do repo (`marcelo-goncalves-blog-arquivo/docs-historico/plano-auditoria-performance.md`). Preparado em 2026-06-28, antes de uma pausa de sessão — ler `.project-context.md` "PRÓXIMA SESSÃO" antes de continuar, pode ter mudado.

## Verificado nesta sessão

- [x] URLs reais confirmadas (registro histórico arquivado: `marcelo-goncalves-blog-arquivo/docs-historico/urls-ambiente.md`): blog, admin, API Gateway.
- [x] Rotas públicas reais confirmadas em `infra/modules/api-gateway/main.tf`: `/artigos`, `/post/{slug}`, `/busca`, `/posts/populares`, `/posts/recentes`, `/projeto`, `/categoria/{slug}`, `/categorias`, `/autor/{id}`, `/autores` — todas `authorization = "NONE"`.
- [x] Slug real confirmado via `curl` contra a API de dev: `terraform-em-producao-as-licoes-que-so-um-incidente-real-ensina`.
- [x] `k6` e `lighthouse` **não estão instalados** localmente (`which k6` / `npx lighthouse --version` vazios). Runtime Node confirmado: v24.15.0.
- [x] Script k6 criado: `scripts/performance-audit/k6/load-test.js` (cenário de rampa 1→30 VUs, mistura realista de rotas públicas incluindo `/busca`).
- [x] Config Lighthouse CI criada: `scripts/performance-audit/lighthouse/lighthouserc.json` (home, post real, `/artigos`).

## Concluído nesta sessão

- [x] k6 instalado nativo via `winget` (v2.0.0, binário em `C:\Program Files\k6\k6.exe` — não estava no `PATH` da sessão de shell aberta, precisou caminho completo).
- [x] **PERF4 + PERF-LOAD executados.** Resultado completo: `contexto/auditoria-performance/01-perf-load.md`. Resumo: p95=832.8ms / 0.10% erro / zero throttling até 30 VUs; achado de método (rota `/categorias` não existe pública, era `/admin/categorias`); achado contraintuitivo (`/busca` é a rota MAIS rápida, não a mais lenta — anti-padrão do critério 7 é de escalabilidade futura, não latência atual; `/artigos` é a mais lenta, consistente com o achado de double-query do critério 7).

## ✅ Execução completa (2026-06-28)

Todas as categorias com dado real planejadas (PERF7, PERF4+PERF-LOAD, PERF2, PERF5, PERF-CWV) foram executadas nesta sessão. Resultado consolidado: `contexto/auditoria-performance/00-metodologia.md`.

- [x] **PERF7** — métricas básicas do CloudWatch confirmadas disponíveis e gratuitas (`getPosts`, `getPost`, `nextjs-server`).
- [x] **PERF4 + PERF-LOAD** — k6 rodado 2x (rampa 1→30 VUs + breakdown por rota 10 VUs/30s). Achado: `/busca` (Scan) é a rota mais rápida hoje (tabela pequena), `/artigos` (double-query) é a mais lenta.
- [x] **PERF2** — `nextjs-server` tem `Duration` real 5-10x maior que as Lambdas de API (793ms-1.892ms vs. 136-396ms) — achado novo, correlacionado com PERF-CWV.
- [x] **PERF5** — `CacheHitRate` indisponível sem subscription paga; tráfego real confirmado em 2-20 req/dia (volume baixo demais para justificar habilitar agora).
- [x] **PERF-CWV** — Lighthouse CI real (8 execuções): **LCP médio = 2.74s**, acima do threshold "Good" (≤2.5s). CLS perfeito (0). Causa raiz: variabilidade do TTFB, correlacionada 1:1 com a variabilidade de `Duration` do SSR achada em PERF2.

## Pendente (fora desta rodada, por decisão de escopo)

PERF1/PERF3/PERF6/PERF8 — categorias de fechamento por leitura/análise (arquitetura geral, storage, evolução, trade-offs documentados), sem ferramenta nova. Não bloqueiam os achados já produzidos.

## Nota de escopo

Tudo roda contra `dev` (único ambiente que existe). Nenhum comando acima é destrutivo — são `GET`/leitura de métrica. Pedir confirmação antes de instalar `k6` globalmente na máquina, caso a próxima sessão prefira rodar via Docker (`docker run grafana/k6 run ...`) em vez de instalar nativo.
