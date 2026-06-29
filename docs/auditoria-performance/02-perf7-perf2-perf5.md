# Auditoria de Performance — PERF7 (Monitoramento), PERF2 (Compute) e PERF5 (Network/Cache)

> Data: 2026-06-28
> Referência: `docs/plano-auditoria-performance.md`.
> Método: `aws cloudwatch get-metric-statistics` real contra a conta de dev (profile `claude-dev`) — métricas básicas, gratuitas, emitidas independente de `enable_cloudwatch_alarms`/`enable_xray_tracing` estarem `false`.

## PERF7 — Monitoramento: pré-requisito confirmado

Métricas básicas de Lambda (`Duration`) e CloudFront (`Requests`) **estão disponíveis e gratuitas hoje**, mesmo com `enable_cloudwatch_alarms = false` em `dev.tfvars` (achado do critério 6) — confirma que não é preciso religar nada para ter dado real, só consultar. Achado novo: `CacheHitRate` do CloudFront **não** está disponível (ver PERF5 abaixo) — é uma métrica "adicional", não básica.

## PERF2 — Compute (Lambda): achado real, não previsto no critério 7

Consulta de `Duration` (24h) nas 3 Lambdas mais relevantes para tráfego público:

| Lambda | Memória | Duration médio (amostras fora da janela do teste k6) | Duration máximo observado |
|---|---|---|---|
| `getPosts` | 512MB | 136–250ms | até 396ms |
| `getPost` | 512MB | (sem amostra fora da janela do teste — tráfego orgânico de leitura de post individual é raro nas últimas 24h) | 360ms |
| `nextjs-server` (SSR) | 1024MB | **793–1810ms** | até 1892ms |

**Achado real, não previsto na auditoria estática do critério 7:** a Lambda de SSR do Next.js (`nextjs-server`) tem `Duration` 5-10x maior que as Lambdas de API (≈1.2s médio vs. ≈150-250ms). Isso é consistente com SSR ser um trabalho mais pesado (render de React + fetch de dados + serialização HTML) do que um handler de API que só lê DynamoDB e serializa JSON — mas o número absoluto (até 1.9s de `Duration`, que não inclui cold start nem rede) é alto para uma página de blog e impacta diretamente o TTFB, que alimenta o LCP (Core Web Vitals, ver PERF-CWV). Não é um anti-padrão confirmado por esta auditoria isoladamente — é um sinal para correlacionar com o resultado real de Core Web Vitals antes de tratar como achado de alto impacto.

**Achado secundário, comparando Lambda-side vs. client-side:** durante a janela do teste de carga k6 (PERF-LOAD), `getPosts` reportou `Duration` médio de **13.6ms** (5238 amostras) — muito abaixo do `http_req_duration` observado pelo k6 no mesmo período (avg 200-300ms, p95 até 833ms). A diferença (~200-300ms) não está na execução da Lambda — está em outro lugar do caminho da requisição (API Gateway, rede entre o cliente do teste e `us-east-1`, possível overhead de TLS/handshake). **Implicação prática:** otimizar a Lambda (memória, código) teria efeito limitado na latência percebida hoje — o gargalo real está fora do código da aplicação.

## PERF5 — Network/Cache (CloudFront)

- Métrica básica `Requests` confirmada funcionando: **2 a 20 requisições/dia** na distribution do frontend (`E1XI31PS4HFJIH`) nos últimos 7 dias — confirma, com dado real, o que o critério 12 já registrava como suposição ("tráfego baixo e imprevisível").
- `CacheHitRate` **não está disponível**: `aws cloudfront get-monitoring-subscription` retorna `NoSuchMonitoringSubscription` — essa métrica faz parte do conjunto de "métricas adicionais" do CloudFront, que exige uma subscription paga separada (não é só ligar `enable_cloudfront_logging`, é um recurso distinto: "CloudFront real-time/additional metrics").
- **Recomendação desta auditoria:** não habilitar a subscription agora. Com 2-20 requisições/dia, qualquer cache hit ratio medido seria estatisticamente fraco (amostra pequena) e não justifica o custo recorrente. Revisitar quando o tráfego justificar (mesmo critério já usado para `enable_cloudfront_logging = false`, critério 12).

## Conclusão destas 3 categorias

O padrão "desenho correto, vigilância pendente" (já nomeado na auditoria geral, ver `00-README-planejamento-serie.md`) se confirma de novo aqui: a infraestrutura de métrica básica já existe e é gratuita, só não estava sendo consultada. O achado de maior valor real desta rodada é o SSR Lambda ser desproporcionalmente mais lento que as APIs — vale cruzar com PERF-CWV antes de decidir se é prioridade.
