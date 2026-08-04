---
id: POST-PLAN-2026-019
title: "Pedi para a IA Medir a Performance Real do Próprio Blog — e o Gargalo Não Estava Onde a Leitura de Código Apontava"
created_at: 2026-06-30
updated_at: 2026-06-30
status: idea
channels: []
source_skill: post-planejamento
planned_publication:
published_at:
canonical_content:
related_case:
related_work_items: []
tags: []
contains_sensitive_content: false
---

<!-- Migrado de projects/publishing-content/postagens/19-standalone-auditoria-performance-ia-staff-engineer.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post Standalone: "Pedi para a IA Medir a Performance Real do Próprio Blog — e o Gargalo Não Estava Onde a Leitura de Código Apontava"

## Títulos alternativos
- "`/busca` Devia Ser a Rota Mais Lenta. No Teste de Carga Real, Foi a Mais Rápida — e Isso Não é um Erro"
- "O TTFB de 1.820ms que Apareceu Duas Vezes, em Duas Ferramentas Diferentes, Sem Eu Procurar"

## Tese central

Uma auditoria de performance feita só por leitura de código encontra anti-padrões — mas não diz quais deles importam *hoje*. Este post usa uma auditoria real e dedicada de performance (ancorada no AWS Well-Architected Performance Efficiency Pillar, complementando uma auditoria de engenharia geral anterior que já tinha identificado os mesmos anti-padrões por leitura estática) para mostrar a diferença entre **um achado de escalabilidade futura** e **um achado de performance atual** — distinção que só aparece quando você efetivamente mede: teste de carga real (k6) contra a API de produção de dev, métricas reais do CloudWatch, e Core Web Vitals reais (Lighthouse) medidos por este projeto pela primeira vez. O resultado mais valioso não foi confirmar os anti-padrões já conhecidos — foi descobrir, pelo cruzamento de duas ferramentas independentes, qual é o gargalo real de hoje (variabilidade do Lambda de SSR, propagada quase 1:1 para o LCP), e ter a disciplina de **não aplicar** o "fix" mais óbvio do backlog quando a investigação revelou que ele, na verdade, apaga uma feature visível ao usuário.

## Por que importa

A maior parte do conteúdo sobre "auditoria de performance com IA" para na leitura de código: "este `Scan` é O(n), é um anti-padrão, conserte." Isso é incompleto de um jeito perigoso — porque a urgência de um anti-padrão depende do volume real de dados e tráfego, não só da sua existência. O valor real desta auditoria está em três coisas que leitura estática nunca entrega: (1) medir antes de decidir prioridade — o `Scan` completo da busca, apontado como o maior risco da auditoria geral, foi a rota *mais rápida* de todas no teste de carga real, porque a tabela tem 14 posts; (2) cruzar instrumentos independentes para confirmar causa raiz — a variação de `Duration` do Lambda de SSR (medida via CloudWatch) e o outlier de TTFB do Lighthouse apareceram nos mesmos números, sem eu ter ligado um ao outro de propósito; e (3) reconhecer quando um "fix" de performance é, disfarçado, uma decisão de produto — e recusar aplicá-lo sem confirmação humana, mesmo tendo a permissão técnica e o pedido explícito de "aplique correções que não gerem custo".

## Storytelling sugerido

Abrir pela hipótese que todo mundo (inclusive a auditoria de engenharia geral anterior) faria: o achado de maior impacto documentado para o backend era `searchPosts` fazer um `ScanCommand` completo sem `Limit` — o anti-padrão clássico de DynamoDB, custo escalando com o tamanho da tabela. A expectativa natural é que essa rota seja a mais lenta. No teste de carga real (k6, rampa de 1 a 30 usuários virtuais contra a API de dev), ela foi **a mais rápida das cinco rotas testadas** (174.7ms médio, contra 228.1ms de `/artigos`). Não é que o achado estava errado — é que ele mede uma curva de custo futura (o que acontece quando a tabela tiver 5.000 posts), não a latência de hoje (14 posts, um `Scan` completo é trivial). Esse é o primeiro ensinamento: um anti-padrão de código e um problema de performance atual são coisas diferentes, e só medir revela qual dos dois você tem.

Segundo movimento, um erro de método que vale mostrar sem esconder: a primeira rodada do teste de carga incluiu `GET /categorias`, assumindo que era um endpoint público de listagem (a partir de um `path_part = "categorias"` encontrado no Terraform). Resultado: 16.66% de taxa de erro, 100% concentrado nessa rota, `403 Missing Authentication Token`. Investigação revelou a causa real: esse recurso era `/admin/categorias` (protegido por Cognito), não um endpoint público — não existe listagem pública de categorias no projeto, elas vêm embutidas em cada post. Mostrar o diagnóstico passo a passo (rodar de novo com log de status code por rota, isolar a rota culpada, ler o Terraform de novo com mais atenção) é o ensinamento: "Missing Authentication Token" do API Gateway é, na maioria das vezes, sintoma de rota inexistente, não de bug de autorização — e um teste de carga mal calibrado pode produzir um falso achado de instabilidade que não existe.

Terceiro movimento, o achado de maior valor real da auditoria: consultando `Duration` real do CloudWatch (métrica gratuita, disponível mesmo com alarmes desligados), a Lambda de SSR do Next.js (`nextjs-server`) mostrou variação de 793ms a 1.892ms — 5 a 10x mais que as Lambdas de API (136-396ms). Isoladamente, é um número. O que o transforma em achado é o Lighthouse, rodado de forma completamente independente para medir Core Web Vitals: o LCP médio real ficou em 2.74s (acima do threshold "Good" de 2.5s do Google), e a execução com o LCP mais alto teve TTFB de **1.820ms** — quase exatamente o topo da faixa de `Duration` medida no CloudWatch. Duas ferramentas, dois ângulos, mesma causa. Esse cruzamento — não cada medição isolada — é o que dá confiança na causa raiz.

Fechamento, sobre a diferença entre corrigir e decidir: ao revisar o backlog de otimização para aplicar correções "sem custo", duas descobertas pararam a aplicação automática. A primeira foi boa notícia disfarçada de achado: o item de backlog "CloudFront `static/*` sem TTL explícito" já estava implementado no código — o backlog estava desatualizado, não havia nada para corrigir. A segunda foi a mais interessante: o "fix" óbvio para a rota mais lenta (`/artigos`) seria remover a segunda query de `COUNT` que a Lambda dispara em paralelo só para alimentar a paginação. Tecnicamente, é uma economia real de RCU. Só que essa contagem alimenta "Página X de Y" na interface — removê-la em nome de performance apaga uma informação visível ao usuário sem ninguém ter decidido isso. A IA registrou como decisão pendente de produto, não como correção aplicada — o mesmo tipo de disciplina que, na auditoria de AppSec anterior, fez a IA parar diante de uma mudança de configuração de repositório sem aprovação humana.

**Desfecho real, numa sessão seguinte (vale fechar o post com isso, não deixar em aberto):** diante da decisão registrada, o Marcelo escolheu manter "Página X de Y" e resolver pela via da melhor prática, não pela mais barata — o projeto também é laboratório de estudo, então o esforço extra tem valor por si só. A IA implementou um contador atômico: um item de metadata na própria tabela (`slug = "__METADATA__#posts_counters"`, nunca aparece em nenhuma GSI por ser sparse), atualizado via `ADD` em todo ponto de escrita que muda `status`/`e_projeto` — inclusive o `postScheduler`, que ninguém tinha lembrado de tratar na primeira passada porque a transição Programado→Publicado não é um "save" nem um "delete", é um terceiro caminho de escrita que também precisa manter o agregado correto. Esse é o ensinamento final, talvez o mais sutil de todos: quando você decide manter uma feature em vez de cortá-la por performance, o "fix" raramente é local — é rastrear *todos* os lugares que tocam o mesmo invariante, não só o arquivo que a auditoria apontou.

## Provas e exemplos reais

| Achado | Suposição (leitura estática / auditoria geral) | Dado real (teste de carga / métrica / Core Web Vitals) |
|---|---|---|
| `searchPosts` (`Scan` completo) | Anti-padrão de alto impacto, custo escala com volume da tabela (critério 7 da auditoria geral) | Rota **mais rápida** das 5 testadas hoje (174.7ms médio) — tabela tem só 14 posts; risco é real, mas é de escalabilidade futura, não de latência atual |
| `getAllPosts`/`getProjectPosts` (double-query de `COUNT`) | Achado de impacto médio, "dobra o custo de leitura" (critério 7) | `/artigos` foi a rota **mais lenta** do teste real (228.1ms médio, p95=464.7ms) — consistente com o dobro de trabalho por requisição. Resolvido depois com contador atômico (ver "Desfecho real" no storytelling) — mantém a feature, elimina a 2ª query |
| `GET /categorias` no script de teste | Assumido público a partir de `path_part = "categorias"` no Terraform | `403 Missing Authentication Token` em 100% das chamadas — o recurso real é `/admin/categorias` (Cognito-only); corrigido no script após diagnóstico |
| `Duration` do `nextjs-server` (CloudWatch) | Sem dado — nenhuma auditoria anterior consultou métrica real de Lambda | 793ms-1.892ms, 5-10x as Lambdas de API (136-396ms) |
| LCP (Lighthouse, Core Web Vitals) | Nunca medido em nenhuma auditoria anterior deste projeto | Média real de 2.74s — acima do threshold "Good" (≤2.5s); outlier de TTFB (1.820ms) bate com o topo da faixa de `Duration` do SSR |
| Backlog "CloudFront `static/*` sem TTL explícito" | Item pendente documentado em `CLAUDE.md` | Já implementado no código (`cloudfront.tf:277-279`) — backlog estava desatualizado, nada a corrigir |

## Conceitos a explicar

- **Achado de escalabilidade vs. achado de performance atual**: por que um anti-padrão de código (`Scan` completo) pode ser 100% real e, ainda assim, não ser o gargalo de hoje — a diferença está na curva de custo vs. volume atual, e só medição revela em que ponto da curva você está.
- **`Duration` de Lambda (server-side) vs. latência percebida pelo cliente**: durante o teste de carga, `getPosts` reportou `Duration` médio de 13.6ms no CloudWatch, enquanto o k6 mediu 200-300ms do lado do cliente no mesmo período — a diferença não está no código da aplicação, está em outro lugar do caminho da requisição (rede, API Gateway). Otimizar a Lambda teria efeito limitado nesse cenário.
- **TTFB como primeiro componente do LCP**: por que a latência de Time to First Byte de uma página SSR se propaga quase diretamente para o Largest Contentful Paint — e por que isso conecta uma métrica de backend (Lambda `Duration`) a uma métrica de frontend (Core Web Vitals) que, à primeira vista, parecem pertencer a domínios diferentes.
- **"Missing Authentication Token" do API Gateway**: por que essa mensagem de erro especificamente significa "nenhum recurso/método combina com este path" — não autenticação ausente — e como isso pode mascarar um erro de método de teste como um falso achado de instabilidade.
- **Quando uma "otimização de performance" é, na verdade, uma decisão de produto**: o caso de `totalCount`/`COUNT` query — toda métrica derivada que vira *feature visível* (paginação com número total) deixa de ser só uma escolha técnica; removê-la para economizar custo é uma troca que exige decisão explícita, não só permissão técnica.

## Ferramentas gratuitas usadas nesta auditoria (e o que cada uma mediu)

| Ferramenta | Categoria | O que mediu nesta auditoria |
|---|---|---|
| **k6** (free/OSS, Grafana Labs) | Teste de carga real | Rampa de 1→30 VUs contra a API de dev real; latência p50/p95/p99 e taxa de erro por rota |
| **Lighthouse CI** (`@lhci/cli`, free, via `npx`) | Core Web Vitals reais | LCP/CLS/TBT/TTFB em 8 execuções reais (Chrome headless) contra home, post real e `/artigos` |
| **`aws cloudwatch get-metric-statistics`** (CLI, gratuito) | Métricas reais de Lambda/CloudFront | `Duration` real das Lambdas de API e SSR; `Requests` real do CloudFront — confirmando que métrica básica está disponível mesmo com alarmes desligados |
| **`aws dynamodb scan`** (CLI, read-only, gratuito) | Padrão real de atualização de conteúdo | `data_publicacao` vs. `data_atualizacao` de todos os posts — confirmou que conteúdo é quase imutável após publicado, validando o TTL de cache ISR já escolhido |

## Implementação real — scripts e configuração usados

- `scripts/performance-audit/k6/load-test.js` — cenário de rampa (1→30 VUs, 4 estágios de 30s), mistura de rotas reais (`/artigos`, `/post/{slug}`, `/busca`, `/posts/populares`, `/projeto`), thresholds (`p(95)<2000`, `http_req_failed rate<0.05`).
- `scripts/performance-audit/k6/breakdown-by-route.js` — versão com `tags: { route: nome }` por requisição, exportando para JSON (`--out json=...`) e agregada via um script Node de ~15 linhas para extrair p95/avg por rota — necessário porque o resumo padrão do k6 não quebra métricas por tag automaticamente.
- `scripts/performance-audit/lighthouse/lighthouserc.json` — config do Lighthouse CI: 3 URLs reais, `numberOfRuns: 3`, thresholds de `largest-contentful-paint` (2500ms), `cumulative-layout-shift` (0.1), `interactive` (3800ms) como `warn` (não bloqueante, é auditoria, não gate de CI).
- Comando real usado para PERF7: `aws cloudwatch get-metric-statistics --namespace AWS/Lambda --metric-name Duration --dimensions Name=FunctionName,Value=<nome-real> --period 3600 --statistics Average Maximum SampleCount --profile claude-dev` — funciona sem nenhuma configuração adicional porque métricas básicas de Lambda são gratuitas e sempre emitidas pela AWS.

## Prompt de exemplo para uma IA fazer este tipo de auditoria

```
Quero uma auditoria de performance e escalabilidade dedicada e profunda
deste repositório — não uma menção de performance dentro de uma revisão
geral de qualidade de código, um exercício à parte.

Use como referência:
- AWS Well-Architected Framework — Performance Efficiency Pillar (ou o
  pillar de performance equivalente do seu provedor de cloud)
- [framework de banco de dados específico, se aplicável — ex: AWS
  DynamoDB Best Practices]
- Core Web Vitals (Google), se houver frontend servido a usuários reais

Regra inegociável: NÃO classifique nenhum achado como prioridade alta ou
baixa só pela leitura de código. Para cada achado de leitura estática
(anti-padrão, query ineficiente, etc.), meça o impacto real antes de
declarar severidade:
- Rode um teste de carga real (k6, Artillery ou equivalente, sempre
  contra um ambiente de não-produção) e meça latência real por rota.
- Consulte métricas reais já existentes (CloudWatch, Datadog, etc. —
  métricas básicas geralmente são gratuitas e já estão sendo coletadas,
  mesmo sem alarmes configurados).
- Se houver frontend, meça Core Web Vitals reais (Lighthouse CI,
  PageSpeed Insights), não suponha a partir do código.

Para cada achado, declare explicitamente: isso é um problema de
performance ATUAL (latência real medida hoje) ou um risco de
ESCALABILIDADE FUTURA (custo que vai crescer com o volume, mas não é
o gargalo agora)? Essas duas categorias exigem prioridades diferentes.

Antes de aplicar qualquer correção: se a correção remove ou altera um
comportamento visível ao usuário (não só um detalhe de implementação),
pare e registre como decisão pendente — não aplique sozinho, mesmo que
tecnicamente seja "só uma otimização".

Entregável: um arquivo por categoria medida, com os números reais
(não estimados) de cada teste, e um backlog ordenado pela prioridade
real (impacto medido), não pela gravidade teórica do anti-padrão.
```

## Estratégia de prevenção — para não precisar desta auditoria em primeiro lugar

- **Medir Core Web Vitals desde o primeiro deploy real, não só quando uma auditoria dedicada acontecer.** O LCP fora do threshold "Good" existia, silenciosamente, desde que o site foi ao ar — só não tinha sido medido. Um job leve de Lighthouse CI rodando semanalmente (ou pós-deploy) contra as páginas mais importantes custaria minutos e detectaria essa regressão antes de uma auditoria dedicada precisar existir.
- **Toda métrica derivada que se torna feature de produto precisa de um dono explícito.** `totalCount` nasceu como "só um número a mais na resposta" e se tornou "Página X de Y" na UI sem que essa transição fosse documentada como uma decisão de trade-off (custo de RCU vs. informação ao usuário). Da próxima vez que um campo "extra" virar parte visível da interface, registrar o trade-off no momento em que isso acontece, não anos depois numa auditoria.
- **Backlog de performance precisa de data de revalidação, não só de criação.** O item "CloudFront TTL explícito" ficou marcado como pendente por sessões depois de já ter sido corrigido — porque nada revalidava o backlog contra o código real. Itens de performance/infra deveriam ser fechados (ou reabertos) automaticamente quando o código que os motivou muda, não só manualmente.

## Estratégia de correção — quando o achado já existe em produção

1. **Sempre medir antes de priorizar a correção** — esta auditoria mediu primeiro (k6, CloudWatch, Lighthouse) e só depois decidiu o que corrigir. A ordem inversa (corrigir o que "parece" mais grave na leitura de código) teria gasto esforço em `searchPosts` (que não é o gargalo hoje) em vez de investigar o SSR (que é).
2. **Tratar um erro de método como achado, não como ruído a descartar** — o falso positivo de `/categorias` (rota inexistente testada por engano) foi documentado explicitamente no relatório, não só corrigido silenciosamente. Isso preserva a lição para quem reler a auditoria depois.
3. **Cruzar pelo menos duas fontes de dado independentes antes de declarar causa raiz** — a variabilidade do SSR só se tornou um achado de alta confiança quando o número do CloudWatch (`Duration`) e o número do Lighthouse (TTFB) bateram de forma independente. Uma medição isolada teria sido só um dado, não uma conclusão.
4. **Parar antes de aplicar uma correção que altera comportamento visível, mesmo com autorização ampla para "aplicar correções sem custo"** — a permissão para agir não é permissão para decidir trade-offs de produto. Registrar como pendência explícita (`CLAUDE.md`, backlog #22) em vez de assumir a resposta. Quando a decisão veio (manter a feature, resolver com a abordagem mais correta), a implementação cobriu todos os pontos de escrita que tocam o mesmo invariante — não só o arquivo que a auditoria original apontou (o `postScheduler` quase ficou de fora, por não ser um "save" nem um "delete" óbvio).
5. **Revalidar o backlog contra o código antes de aplicar uma correção dele** — o item do CloudFront TTL só foi descoberto como "já resolvido" porque o código foi lido de novo antes de editar, não confiando no texto do backlog como verdade absoluta.

## Estrutura sugerida (H2s)

1. A rota que devia ser a mais lenta foi a mais rápida
2. `Missing Authentication Token`: quando o próprio teste mente
3. O TTFB que apareceu duas vezes, em duas ferramentas diferentes
4. O "fix" que, na verdade, era uma decisão de produto
5. O que isso ensina sobre medir antes de otimizar

## Fecho / CTA

Linka para `07-criterio-performance-e-escalabilidade.md` ("Performance: anti-padrões que ninguém mediu") como o capítulo de origem — aquele post tratou performance como 1 de 12 critérios de uma auditoria de engenharia geral, 100% por leitura de código; este é o mergulho dedicado que mede o impacto real. Linka também para o par `16-standalone-dynamodb-gsi-partition-key-design.md`/`17-standalone-ledger-de-tradeoffs-escolha-de-servico.md` (mesmo domínio de dados, DynamoDB, mas essa auditoria mede o que aqueles posts só documentaram por leitura). Por fim, linka para `18-standalone-auditoria-appsec-ia-staff-engineer.md` como o par mais próximo em estrutura — "fizemos isso para segurança, agora fizemos para performance" é literalmente a origem deste post.

## Fonte interna

- `docs/plano-auditoria-performance.md` (plano original, frameworks de referência)
- `docs/auditoria-performance/00-metodologia.md` (sumário executivo, inclui o desfecho da decisão sobre `COUNT`)
- `docs/auditoria-performance/01-perf-load.md` (teste de carga real, achado do `/categorias`, breakdown por rota)
- `docs/auditoria-performance/02-perf7-perf2-perf5.md` (métricas reais CloudWatch — `Duration`, `Requests`, ausência de `CacheHitRate`)
- `docs/auditoria-performance/03-perf-cwv.md` (Core Web Vitals reais via Lighthouse)
- `docs/auditoria-performance/04-fechamento.md` (PERF1/3/6/8 — TTL de ISR validado com dado real de DynamoDB, trade-offs documentados)
- `scripts/performance-audit/` (scripts k6 + config Lighthouse CI, reutilizáveis)
- `backend/src/common/postCounters.ts` + `postCounters.test.ts` (contador atômico, implementação real do desfecho)
- `scripts/backfill-post-counters.mjs` (seed inicial do contador contra dados reais de dev)
- `CLAUDE.md` backlog #21 (`nextjs-server` Duration, ainda pendente), #22 (decisão de produto sobre `COUNT` query — ✅ resolvida)

## Relação com o post #7 (criterio-performance-e-escalabilidade)

Este post e `07-criterio-performance-e-escalabilidade.md` cobrem o mesmo domínio (performance) em profundidades e momentos diferentes — não são duplicados:

- **#7** nasceu de uma auditoria de engenharia **geral**, onde performance era 1 de 12 critérios avaliados — achados encontrados 100% por leitura de código/Terraform (GSI de baixa cardinalidade, `Scan` completo, projections `ALL`, queries duplicadas), sem nenhum dado de execução real.
- **#19 (este)** nasceu de uma auditoria **dedicada só a performance**, ancorada no AWS Well-Architected Performance Efficiency Pillar, que **mede** os mesmos achados contra dado real (teste de carga, métricas, Core Web Vitals) — e descobre que a prioridade real é diferente da prioridade aparente na leitura de código.

**Ordem de publicação sugerida:** #7 antes (mostra os anti-padrões encontrados por leitura de código, a primeira camada), #19 depois (mostra o que muda quando você efetivamente mede) — mesmo padrão de ordem já usado entre #6 e #18 para segurança.
