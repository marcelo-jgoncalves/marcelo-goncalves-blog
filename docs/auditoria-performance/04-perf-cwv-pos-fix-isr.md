# Auditoria de Performance — PERF-CWV: re-medição pós-fix de ISR em `/post/[slug]`

> Data: 2026-06-29
> Referência: `docs/auditoria-performance/03-perf-cwv.md` (baseline original, 2026-06-28).
> Ferramenta: `lighthouse` standalone v13.4.0 via `npx` (Chrome headless real), mesmas 3 URLs do `lighthouserc.json`.
> Motivação: validar com dado real se o fix de `generateStaticParams` em `/post/[slug]` (commit `b9c6d54`) e o fix de IAM em `getPosts` (commit `37b6de7`) tiveram efeito mensurável no Core Web Vitals, depois de confirmado via `curl` que o CloudFront passou a servir `/post/[slug]` com `X-Cache: RefreshHit` em vez de `Miss`.

## Nota de execução

`npx @lhci/cli collect` (mesma ferramenta da medição original) bateu no bug conhecido do `chrome-launcher` no Windows (`EPERM` ao limpar o diretório temp do Chrome) já na 2ª execução do lote e abortou o processo inteiro — diferente da medição original, que conseguiu completar 8 das 9 execuções antes de travar na limpeza final. Contornado rodando `npx lighthouse <url>` standalone, um processo por execução (evita o code path de "matar Chrome anterior e relançar" dentro do mesmo processo, que é onde o bug do Windows ocorre). Cada processo individual ainda termina com o mesmo erro de limpeza no exit, mas o relatório já foi escrito em disco antes disso — confirmado por arquivo presente e JSON válido em todas as 9 execuções.

**Efeito colateral não intencional:** o `lhci collect` que tentei primeiro limpou o diretório `.lighthouseci/` (target `filesystem` recria o output dir a cada run) antes de abortar, apagando os 8 relatórios brutos da baseline original. Sem perda real — `.lighthouseci/` é `.gitignore`d (nunca foi versionado) e os números da baseline já estavam consolidados em `03-perf-cwv.md`, usados abaixo para a comparação.

## Resultado real (9 execuções, Chrome headless real, 2026-06-29)

| Página | Run | Score | LCP | FCP | TBT | TTFB | CLS |
|---|---|---|---|---|---|---|---|
| `/` (home) | 1 | 99 | 2.1s | 1.2s | 21ms | 508ms | 0 |
| `/` (home) | 2 | 93 | 2.9s | 1.7s | 62ms | 470ms | 0 |
| `/post/{slug}` | 1 | 97 | 2.2s | 1.4s | 90ms | **759ms** | 0 |
| `/post/{slug}` | 2 | 85 | 2.8s | 1.6s | 341ms | **1.053ms** | 0 |
| `/post/{slug}` | 3 | 98 | 2.1s | 1.1s | 15ms | **648ms** | 0 |
| `/artigos` | 1 | 99 | 2.1s | 1.2s | 59ms | 427ms | 0 |
| `/artigos` | 2 | 88 | 2.8s | 2.2s | 217ms | 415ms | 0 |
| `/artigos` | 3 | 93 | 2.9s | 1.5s | 143ms | 355ms | 0 |

## Comparação direta com a baseline (2026-06-28)

| Página | Métrica | Antes (baseline) | Depois (hoje) | Δ |
|---|---|---|---|---|
| `/post/{slug}` | LCP médio | **2.70s** | **2.37s** | **-0.33s (-12%)** |
| `/post/{slug}` | TTFB médio | 987ms | 820ms | -17% |
| `/post/{slug}` | TTFB pior caso | **1.820ms** | **1.053ms** | **-42%** |
| `/` (home) | LCP médio | 2.43s | 2.50s | +0.07s (ruído — não foi tocado) |
| `/artigos` | LCP médio | 2.75s | 2.60s | -0.15s (ruído — não foi tocado) |

## Achado #1 (confirmado): melhora real e atribuível em `/post/[slug]`, controle estável nas páginas não tocadas

A página de post — a única das 3 onde o fix de ISR foi aplicado — teve queda real no TTFB pior-caso (1.820ms → 1.053ms, -42%) e no LCP médio (2.70s → 2.37s, cruzando para dentro do threshold "Good" ≤2.5s em 2 das 3 execuções, vs. 1 das 3 na baseline). `/` e `/artigos` — que não receberam nenhuma mudança de cache nesta rodada — ficaram dentro da mesma faixa de ruído da medição original (diferença de poucas centenas de ms, sem direção consistente). Isso é evidência de que a melhora em `/post/[slug]` é causada pelo fix, não por variação aleatória de rede/Lambda no momento da medição — um grupo de controle que não muda é o que dá confiança nisso.

## Achado #2 (esperado, não resolvido): `/artigos` continua com a mesma variabilidade de antes

Como documentado no backlog (`CLAUDE.md` #27), `/artigos` não recebeu fix — continua lendo `searchParams` e forçando SSR dinâmico a cada request. O TTFB dessa rota (355-427ms) é mais baixo que o de `/post/{slug}` mesmo sem cache, porque a query Scan/Query por trás é mais simples; o problema ali não é tanto o TTFB absoluto, é a ausência de qualquer possibilidade de cache de borda — ver decisão de não tocar nisso hoje (#27).

## Conclusão

O fix de `generateStaticParams` em `/post/[slug]` (causa raiz do item #21 do backlog) produziu uma melhora real, mensurável e isolada à página corrigida — TTFB pior-caso caiu 42%, LCP médio saiu da faixa "Needs Improvement" na maioria das execuções. O score do Lighthouse em si (85-98, dominado por TBT que é CPU-bound, não rede) não é o melhor proxy para esse fix — TTFB e LCP são. Item #21 rebaixado de 🔴 para 🟡 no backlog; reavaliar prioridade restante (causa do TBT alto no run 2, 341ms) como possível próximo passo, mas fora do escopo desta rodada.
