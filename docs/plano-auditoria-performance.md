# Plano — Auditoria Completa de Performance & Escalabilidade (World-Class Standard)

> Status: **✅ executado em 2026-06-28** (PERF4/PERF-LOAD, PERF7, PERF2, PERF5, PERF-CWV). Resultado completo em `docs/auditoria-performance/` (sumário executivo em `00-metodologia.md`). Achado de maior prioridade: LCP médio real (2.74s) fora do threshold "Good" do Core Web Vitals, com causa raiz correlacionada à variabilidade do SSR Lambda. PERF1/PERF3/PERF6/PERF8 (fechamento por leitura/análise) ficaram fora desta rodada — não bloqueiam os achados já produzidos.
> Diferença em relação à auditoria de engenharia anterior (`docs/auditoria-engenharia/07-performance-e-escalabilidade.md`): aquela tratou performance como **1 de 12 critérios** — boa profundidade de leitura estática (código + Terraform), mas **zero dado real de execução**. Esta auditoria é dedicada, usa o AWS Well-Architected Performance Efficiency Pillar como vara de medir, e adiciona exatamente a dimensão que faltava: comportamento real sob carga (teste dinâmico, métricas CloudWatch, Core Web Vitals reais) — não apenas inferência a partir do código. Mesmo padrão que tornou a auditoria de AppSec (`docs/plano-auditoria-appsec.md`) mais profunda que a passada geral.

## 1. Objetivo

Avaliar o sistema inteiro (backend serverless, DynamoDB, CDN/cache, performance percebida pelo usuário no frontend) contra um framework de performance reconhecido, com evidência real de comportamento sob carga — não só leitura de código —, produzindo achados classificados por severidade e um backlog de otimização, nos mesmos moldes da AppSec (`docs/auditoria-appsec/`).

## 2. Frameworks de referência (a régua do "world-class")

| Framework | Por que usar |
|---|---|
| **AWS Well-Architected Framework — Performance Efficiency Pillar** | Checklist mestre: 8 perguntas estruturadas (PERF 1-8) cobrindo seleção de arquitetura, compute, storage, database, network, evolução, monitoramento e trade-offs. Framework-padrão para avaliar performance de cargas AWS-nativas — toda a infra deste projeto é serverless AWS. |
| **AWS DynamoDB Best Practices** (whitepaper oficial) | Régua específica para os achados que o critério 7 já abriu (GSI de baixa cardinalidade, `Scan` completo, `projection_type = "ALL"`) — fonte oficial para julgar se cada um é, de fato, anti-padrão neste volume de dados ou só "teoricamente errado". |
| **Core Web Vitals** (Google: LCP, INP, CLS) | Régua de performance **percebida pelo usuário real**, com thresholds objetivos (`LCP ≤ 2.5s`, `INP ≤ 200ms`, `CLS ≤ 0.1` = "Good") e ligação direta a SEO/ranking de busca — dimensão que nenhuma auditoria anterior deste projeto mediu. |

**Princípio de rigor adotado:** medir antes de otimizar. Um padrão identificado como "anti-padrão teórico" na leitura de código (ex: GSI de baixa cardinalidade) pode não ser o gargalo real no volume de tráfego atual — esta auditoria prioriza **dado real** (métrica, teste de carga) sobre suposição, mesmo quando o achado estático já existe.

## 3. Escopo (componentes cobertos)

| Componente | O que entra na auditoria |
|---|---|
| `backend/` | 9 Lambdas — memória, timeout, concorrência, cold start, padrões de acesso a dados |
| `infra/modules/dynamodb/` | Tabela `posts` + 5 GSIs, tabelas `autores`/`categorias` — capacity mode, projections, partition key design |
| `infra/modules/api-gateway/` | Throttling/usage plan já configurado (20 rps / burst 40, sessão 53) — avaliar interação com performance, não só segurança |
| `infra/modules/frontend/`, `infra/modules/admin/` | CloudFront — cache behaviors, TTL, price class, compressão |
| `frontend/` | Next.js 16 ISR (revalidate por tipo de página), bundle size, pipeline de imagem (AVIF/WebP), Core Web Vitals reais |

**Fora de escopo** (justificativa): custo em si — overlap parcial de achados (GSI/projections) com uma eventual auditoria de FinOps dedicada, mas esta mede **latência/throughput**, aquela mede **$**; tratar como auditorias irmãs, não duplicar. Segurança (AppSec já feita). Acessibilidade (auditoria separada, ainda não planejada).

## 4. Estrutura proposta (categorias mapeadas ao Well-Architected + achados preliminares já visíveis)

Cada categoria abaixo vira um arquivo em `docs/auditoria-performance/0X-categoria.md` na execução real (mesmo padrão de `docs/auditoria-appsec/`). Achados preliminares marcados **precisam ser confirmados com dado real na execução** — não são veredito final.

### PERF1 — Seleção geral de arquitetura
Estratégia de cache ISR em camadas (60s posts, 300s listagens, 3600s páginas estáticas, documentada no `CLAUDE.md`) já é desenho deliberado — **nunca validado contra cache hit ratio real**. Verificar se os TTLs escolhidos batem com o padrão de atualização real de conteúdo (posts mudam com que frequência depois de publicados?).

### PERF2 — Seleção de Compute (Lambda)
- Memória já diferenciada por carga: 512MB nas 7 Lambdas de API, 1024MB em `imageProcessor`/SSR do frontend (`infra/modules/frontend/lambda.tf:45`) — achado positivo do critério 7, **nunca confirmado contra `Duration`/`Memory Used` reais do CloudWatch** (métrica básica, gratuita, emitida independente de alarmes estarem ativos ou não).
- `provisioned_concurrency = 0` em dev, `1` em prod (`var.provisioned_concurrency`, `infra/modules/frontend/lambda.tf:70`) — trade-off documentado, mas o cold-start real em dev **nunca foi medido** (só assumido).
- Runtime `nodejs20.x` consistente nas 9 Lambdas + frontend SSR — confirmado, sem achado aqui.

### PERF3 — Seleção de Storage
S3 para assets/uploads — sem gargalo conhecido ou suspeitado. Baixa prioridade nesta rodada; entra só se algum achado de PERF-LOAD apontar para lá.

### PERF4 — Seleção de Database (DynamoDB)
Achados já confirmados por leitura de código no critério 7 — esta auditoria mede o **custo real** (RCU consumido, latência p99) de cada um sob teste de carga controlado, em vez de só apontar o anti-padrão:
- `PopularesPorData`/`ProjetoPorData`: GSI com `hash_key` de baixa cardinalidade (`e_popular`/`e_projeto`, só 2 valores possíveis) — teto de escalabilidade embutido no schema.
- 5 GSIs da tabela `posts` com `projection_type = "ALL"` (`infra/modules/dynamodb/main.tf:62,70,78,86,94`) — duplica `conteudo_html` por GSI.
- `searchPosts` (`backend/src/functions/getPosts/index.ts:106-120`) — `ScanCommand` completo sem `Limit`, custo escala com o tamanho da tabela, não com resultados.
- `getAllPosts`/`getProjectPosts` (`:74`, `:192`) — 2 queries paralelas por requisição (itens + `COUNT`) nos endpoints de listagem mais visitados.

### PERF5 — Configuração de Network (CloudFront/API Gateway)
- `price_class = "PriceClass_200"` (NA/Europa + América do Sul) — decisão correta e já documentada, sem achado aqui.
- **Achado preliminar (backlog #15):** `static/*` sem `default_ttl`/`max_ttl` explícito no `aws_cloudfront_cache_policy` — herdando comportamento implícito em vez de declarado.
- Cache hit ratio real **nunca foi medido** — `enable_cloudfront_logging = false` em dev e prod (achado do critério 12, decisão consciente de custo). Decisão a tomar nesta auditoria: ligar logging temporariamente só para a janela do teste de carga, ou usar a métrica agregada nativa do CloudFront (`CacheHitRate`, disponível via CloudWatch sem precisar de access logs detalhados).
- Throttling do API Gateway (20 rps / burst 40, já configurado por motivo de segurança na AppSec) — avaliar se esse limite já é, na prática, o teto de performance real antes mesmo do limite de concorrência de Lambda (PERF-LOAD vai revelar qual dos dois limites é atingido primeiro).

### PERF6 — Evolução (manter-se atualizado)
Next.js 16 + OpenNext v3 e runtime `nodejs20.x` já são versões atuais em todas as Lambdas — sem achado conhecido aqui. Confirmar na execução se há alguma dependência de performance (ex: AWS SDK v2 residual em algum arquivo) que ainda não migrou para v3.

### PERF7 — Monitoramento (pré-requisito de toda a auditoria)
Cross-reference direto com o critério 6 (Observabilidade): `enable_cloudwatch_alarms = false`, `enable_xray_tracing = false` em dev. Esta auditoria **não corrige isso** (já é achado documentado de Observabilidade) — mas depende de confirmar que métricas **básicas** de Lambda/DynamoDB/API Gateway continuam sendo emitidas gratuitamente mesmo com alarmes desligados (são, por padrão, na AWS) para ter dado real sem custo extra.

### PERF8 — Trade-offs documentados
Well-Architected pede declarar trade-offs explicitamente, não só tomar a decisão:
- `PAY_PER_REQUEST` (DynamoDB) vs. provisionado — já decidido e correto para o volume atual; revalidar com dado real de RCU/WCU consumido no teste de carga, não só com a justificativa teórica já escrita.
- TTL de cache (freshness vs. hit ratio) — 60s em posts pode estar curto ou longo demais; só um dado real de cache hit ratio (PERF5) responde isso.
- Pipeline de imagem eager (6 variantes geradas em todo upload, `imageProcessor`) vs. lazy/on-demand — avaliar se o custo de gerar todas as variantes antecipadamente se justifica pelo padrão real de uso (todas as 6 são realmente servidas?).

### PERF-LOAD — Teste de carga real (dimensão nova, não estática)
Usando **k6** (free/OSS) contra o ambiente de dev real:
- Simular tráfego realista nos endpoints públicos mais visitados: `GET /posts`, `/artigos`, `/post/{slug}`, busca (`searchPosts`).
- Medir latência real (p50/p95/p99) e taxa de erro sob rajada crescente.
- Confirmar **qual limite é atingido primeiro de fato**: o de concorrência de Lambda (10 execuções/conta, backlog #6, nunca testado na prática) ou o throttling do API Gateway (20 rps/burst 40, configurado na AppSec) — hoje isso é só suposição teórica, nenhuma das duas auditorias anteriores rodou uma rajada real.
- Sempre contra `dev` — sem risco, já que produção não existe ainda.

### PERF-CWV — Core Web Vitals reais (dimensão nova, não estática)
Usando **Lighthouse CI** ou **PageSpeed Insights API** (ambos free):
- Medir LCP/INP/CLS reais nas páginas de maior tráfego esperado: home, `/post/[slug]`, `/artigos`.
- Primeira vez que isso é medido no projeto — nem a auditoria geral nem a AppSec tocaram em performance percebida pelo usuário real (browser), só em backend/infra.
- Resultado tem valor duplo: performance e SEO (Core Web Vitals é fator de ranking confirmado do Google) — conecta com o backlog de SEO já 18/20 itens completo.

## 5. Metodologia de verificação (por categoria)

| Método | Quando usar |
|---|---|
| Revisão estática de código/Terraform (já feita no critério 7, revalidada aqui com a régua Well-Architected) | PERF1-PERF8 |
| Métricas reais via `aws cloudwatch get-metric-statistics` (gratuito, métricas básicas já emitidas mesmo com alarmes desligados) | PERF2, PERF4, PERF5 |
| Teste de carga controlado contra `dev` (**k6**, free/OSS) | PERF-LOAD |
| Lighthouse CI / PageSpeed Insights API (free) | PERF-CWV |
| CloudFront `CacheHitRate` (métrica agregada nativa, sem precisar ligar access logs) | PERF5 |

## 6. Ordem de execução proposta

1. **PERF7** (pré-requisito) — confirmar que métricas básicas estão disponíveis via CLI antes de tudo; sem isso, parte da auditoria fica sem dado real.
2. **PERF4 + PERF-LOAD** — DynamoDB e teste de carga juntos, porque é onde a auditoria estática (critério 7) já tem os achados mais ricos e conectados; o teste de carga gera o dado que falta para medir o impacto real de cada um.
3. **PERF2** — Compute/cold start, reaproveitando os mesmos dados do teste de carga (PERF-LOAD).
4. **PERF5** — Network/CDN/cache hit ratio e qual limite de throttling é atingido primeiro.
5. **PERF-CWV** — Core Web Vitals, independente do resto, pode rodar em paralelo a qualquer momento.
6. **PERF1/PERF3/PERF6/PERF8** — fecham o ciclo (arquitetura geral, storage, evolução, trade-offs documentados).

## 7. Entregáveis

- `docs/auditoria-performance/00-metodologia.md` — versão final deste plano + sumário executivo pós-execução
- `docs/auditoria-performance/0X-categoria.md` — 1 arquivo por categoria, mesmo padrão de `docs/auditoria-appsec/`
- Achados classificados por severidade (Critical/High/Medium/Low/Info)
- Números reais de antes/depois caso alguma otimização seja aplicada na mesma sessão (mesmo padrão da migração de GSI, sessão 52)
- Backlog de otimização integrado ao `CLAUDE.md` seção 10 (cross-reference aos itens #13-16 já existentes: GSI projections, `getPostsByCategory` Limit, CloudFront TTL, Algolia)

## 8. Estimativa de esforço

| Etapa | Tempo estimado |
|---|---|
| PERF7 (confirmar métricas disponíveis) | 15min |
| PERF4 + PERF-LOAD (DynamoDB + teste de carga) | 2h (inclui configurar k6 e rodar cenários) |
| PERF2 (Compute/cold start) | 30min (reaproveita dado do teste de carga) |
| PERF5 (Network/cache) | 45min |
| PERF-CWV (Core Web Vitals) | 45min |
| PERF1/PERF3/PERF6/PERF8 (fechamento) | 45min |
| Consolidação dos achados + backlog | 45min |
| **Total** | **~5h45min**, divisível em múltiplas sessões |

## 9. Fora de escopo (explicitamente)

- Otimização de custo em si — auditoria de FinOps dedicada (proposta separadamente), mesmo que ache achados sobrepostos (GSI/projections); esta mede performance, aquela mede gasto.
- Teste de carga contra produção — não existe ambiente prod ainda.
- Otimização de acessibilidade — auditoria de a11y dedicada, fora do escopo de performance.

## 10. Fonte interna

- Auditoria de engenharia anterior (critério 7): `docs/auditoria-engenharia/07-performance-e-escalabilidade.md`
- Achados cruzados de custo (critério 12): `docs/auditoria-engenharia/12-custo-finops.md`
- Achados cruzados de observabilidade (critério 6): `docs/auditoria-engenharia/06-observabilidade.md`
- Backlog existente já relacionado: `CLAUDE.md` seção 10, itens #13 (GSI projections), #14 (`getPostsByCategory` Limit), #15 (CloudFront TTL), #16 (Algolia/`docs/plano-busca-algolia.md`)
