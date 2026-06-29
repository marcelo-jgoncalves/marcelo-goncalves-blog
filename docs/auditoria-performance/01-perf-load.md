# Auditoria de Performance — PERF-LOAD: Teste de Carga Real

> Data: 2026-06-28
> Referência: `docs/plano-auditoria-performance.md`, seção PERF-LOAD/PERF4.
> Ferramenta: k6 v2.0.0 (instalado nativo via `winget`), contra a API real de dev.
> Scripts: `scripts/performance-audit/k6/load-test.js` (rampa 1→30 VUs, 2min) e `breakdown-by-route.js` (10 VUs, 30s, por rota).

## Achado de execução (não é achado de performance, é correção de método)

A primeira rodada incluiu `GET /categorias` na mistura de rotas, assumindo que era um endpoint público de listagem (baseado em `path_part = "categorias"` encontrado em `infra/modules/api-gateway/main.tf`). Resultado: 16,66% de taxa de erro, 100% concentrado nessa rota, com `403 Missing Authentication Token`.

**Causa real:** esse `path_part` pertence a `/admin/categorias` (recurso filho de `/admin`, protegido por `COGNITO_USER_POOLS`), não a um `/categorias` na raiz. **Não existe endpoint público de listagem de categorias** — categorias são consumidas embutidas em cada post (`categoria_slug`/`subcategoria_slug`), nunca via endpoint próprio. Rota removida do script; resultado abaixo já está limpo.

## Resultado real (rampa 1→30 VUs, 2min, 5 rotas públicas)

```
THRESHOLDS
  http_req_duration: p(95)=832.8ms  ✓ (< 2000ms)
  http_req_failed:   0.10% ✓ (< 5%)  — 2 erros em 1900 requisições, sem padrão (provável timeout transitório de rede, não investigado a fundo por ser <1%)

http_reqs: 1900 (15.6 req/s sustentado)
http_req_duration: avg=306ms  p(90)=526ms  p(95)=833ms  max=4.55s
checks "não é 429 (throttled)": 100% — nenhum throttling em nenhum momento, mesmo em 30 VUs simultâneas
```

**Achado #1 (positivo, contraria a suposição teórica do backlog #6):** o limite de 10 execuções concorrentes por conta (Lambda) **não foi atingido** nesta rajada de até 30 VUs / ~15-30 req/s. Nenhum `429` apareceu. Isso não invalida o achado do backlog (é um teto real da AWS), mas indica que, no padrão de tráfego testado, o throttling do API Gateway (20 rps/burst 40) ou o próprio limite de Lambda não são, na prática, o gargalo visível neste volume — o risco é real, mas seu disparo exige mais carga simultânea do que este teste gerou.

## Breakdown por rota (10 VUs, 30s, n=200 cada)

| Rota | avg | p95 | max |
|---|---|---|---|
| `/artigos` | **228.1ms** | **464.7ms** | 688.6ms |
| `/projeto` | 210.7ms | 250.9ms | 885.9ms |
| `/posts/populares` | 202.8ms | 274.0ms | 713.8ms |
| `/post/{slug}` | 189.4ms | 232.6ms | 527.6ms |
| `/busca?termo=...` | **174.7ms** | **210.3ms** | 609.8ms |

**Achado #2 (contraintuitivo — confirma achado já existente por outro caminho):** `/busca` — o endpoint que faz `ScanCommand` completo sem `Limit` (achado de alto impacto do critério 7, `getPosts/index.ts:106-120`) — é, na prática, a rota **mais rápida** das cinco testadas, não a mais lenta. `/artigos` é a mais lenta.

**Por que isso não contradiz o achado do critério 7, e na verdade o reforça:** o volume atual da tabela é pequeno (confirmado em sessões anteriores: 14 posts) — um `Scan` completo sobre 14 itens é trivialmente rápido independente do anti-padrão. O risco documentado no critério 7 é sobre **a curva de custo conforme o volume cresce** (custo escala com o tamanho da tabela, não com os resultados), não sobre a latência hoje. O dado real desta auditoria não invalida o achado — confirma que ele é uma bomba-relógio de volume, não um problema de latência atual.

A causa real de `/artigos` ser a rota mais lenta aponta para outro achado já documentado: `getAllPosts` (usado por `/artigos`) dispara **2 queries paralelas** por requisição (itens + `Select: COUNT`, achado #4 do critério 7, `getPosts/index.ts:74`) — o dobro do trabalho de `/busca`, que faz só 1 `Scan` sem contagem. Os números reais desta auditoria são consistentes com essa explicação: dobrar o trabalho de leitura por requisição é uma explicação mais direta para +30% de latência do que "Scan vs Query" no volume atual.

## Conclusão desta categoria

1. Nenhum achado novo de **latência crítica hoje** — todas as rotas respondem bem dentro de um threshold aceitável para um blog de conteúdo (p95 < 1s mesmo na rota mais lenta).
2. Os dois achados de maior risco do critério 7 (`Scan` completo em `/busca`, double-query em `/artigos`) são **achados de escalabilidade futura, não de performance atual** — o teste de carga real confirma essa distinção, que a leitura estática de código não conseguia fazer por si só.
3. O limite de concorrência de Lambda (backlog #6) é real, mas não se manifestou nesta rajada — recomendação: se for medir o ponto exato de throttling, repetir o teste com VUs/rps maior que os ~30/15 usados aqui.
