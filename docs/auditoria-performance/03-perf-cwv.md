# Auditoria de Performance — PERF-CWV: Core Web Vitals Reais

> Data: 2026-06-28
> Referência: `docs/plano-auditoria-performance.md`, categoria PERF-CWV.
> Ferramenta: Lighthouse CI (`@lhci/cli` v0.15.1, via `npx`, free) — Chrome headless real, contra as URLs reais de dev.
> Config: `scripts/performance-audit/lighthouse/lighthouserc.json` (home, post real, `/artigos`, 3 execuções por URL).
> **Primeira vez que Core Web Vitals foi medido neste projeto** — nem a auditoria geral (critério 7) nem a AppSec tocaram em performance percebida pelo usuário real.

## Achado de execução

`lhci autorun` coletou as 8 das 9 execuções esperadas (3 URLs × 3 runs) com sucesso — os relatórios (`.lighthouseci/lhr-*.json`) foram salvos corretamente antes do processo encontrar um erro de limpeza (`EPERM` ao deletar o diretório temp do Chrome, bug conhecido do `chrome-launcher` no Windows, não afeta a qualidade dos dados coletados, só a 9ª execução e a etapa de upload). Dado suficiente e real para conclusão desta categoria.

## Resultado real (8 execuções, Chrome headless real)

| Página | Run | Score | LCP | CLS | TBT | FCP | TTFB |
|---|---|---|---|---|---|---|---|
| `/` (home) | 1 | 98 | 2.1s | 0 | 30ms | 1.3s | 740ms |
| `/` (home) | 2 | 95 | 2.8s | 0 | 20ms | 1.3s | 650ms |
| `/` (home) | 3 | 97 | 2.4s | 0 | 20ms | 1.5s | 520ms |
| `/post/{slug}` | 1 | 92 | 2.9s | 0 | 50ms | 1.4s | **1.820ms** |
| `/post/{slug}` | 2 | 98 | 2.4s | 0 | 30ms | 1.2s | 550ms |
| `/post/{slug}` | 3 | 94 | 2.8s | 0 | 80ms | 1.4s | 590ms |
| `/artigos` | 1 | 96 | 2.7s | 0 | 40ms | 1.2s | 390ms |
| `/artigos` | 2 | 95 | 2.8s | 0 | 80ms | 1.3s | 360ms |

**Médias:** Performance score = 95.6 · **LCP = 2.74s** · CLS = 0 · TBT = 44ms · FCP = 1.33s

## Achado #1 (alto impacto): LCP médio está acima do threshold "Good" do Core Web Vitals

Threshold oficial do Google: LCP ≤ 2.5s = "Good", 2.5-4.0s = "Needs Improvement". A **média real medida (2.74s) já está na faixa "Needs Improvement"**, e 5 das 8 execuções individuais excedem 2.5s (2.8s, 2.9s, 2.7s, 2.8s, 2.8s). Isso é relevante diretamente para SEO — Core Web Vitals é fator de ranking confirmado do Google — e o backlog do `CLAUDE.md` já lista SEO como prioridade (18/20 itens). Nenhuma das duas auditorias anteriores (geral ou AppSec) tinha esse dado; é um achado novo desta auditoria.

## Achado #2 (correlação real entre PERF2 e PERF-CWV): TTFB é a causa mais provável

A execução com o LCP mais alto (`/post/{slug}`, run 1: LCP=2.9s) tem TTFB de **1.820ms** — mais de 3x os outros runs da mesma página (550-590ms). Esse número bate, em ordem de grandeza, com a variação de `Duration` real medida na Lambda `nextjs-server` em `02-perf7-perf2-perf5.md` (793ms a 1.892ms via CloudWatch, fora da janela do teste de carga). **Conclusão direta:** a variabilidade de latência do SSR (`nextjs-server`) se propaga quase 1:1 para o TTFB percebido pelo browser, que por sua vez é o primeiro componente do LCP (LCP = TTFB + tempo de carregar o elemento maior da viewport). Resolver a causa raiz (achado PERF2: por que o SSR varia de ~800ms a ~1.9s) tem efeito direto e mensurável no Core Web Vitals — não são dois achados isolados, são a mesma causa vista de dois ângulos.

## Achado #3 (positivo, sem ação necessária): CLS perfeito

`Cumulative Layout Shift = 0` em **todas as 8 execuções**, sem exceção. Indica que a estratégia de `ResponsiveImage`/dimensões explícitas de imagem e a ausência de conteúdo injetado tardiamente (ads, banners) que desloque layout estão funcionando corretamente. Nenhuma ação recomendada — manter como está.

## Conclusão desta categoria

Diferente das categorias anteriores (PERF-LOAD, PERF7/2/5), que majoritariamente confirmaram que os anti-padrões já documentados são riscos futuros e não problemas atuais, esta categoria produz o **achado de maior prioridade real de toda a auditoria de performance até agora**: o LCP médio já está fora do threshold "Good" hoje, com causa raiz identificável (variabilidade de SSR) e measurável. Recomendação de prioridade: investigar a causa da variação de `Duration` do `nextjs-server` (cold start? `provisioned_concurrency=0` em dev, ver PERF2/PERF8) antes de qualquer outra otimização desta auditoria.
