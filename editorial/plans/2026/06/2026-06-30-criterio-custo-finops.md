---
id: POST-PLAN-2026-015
title: "Post 12 da série: Custo (FinOps) — \"O alarme que falta não é técnico, é financeiro\""
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

<!-- Migrado de projects/publishing-content/postagens/15-criterio-custo-finops.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post 12 da série: Custo (FinOps) — "O alarme que falta não é técnico, é financeiro"

## Títulos alternativos
- "A mesma lição da cota de armazenamento, agora em dólar"
- "Decisões de custo certas, sem ninguém vigiando o total"

## Tese central

Este post fecha a série mostrando que o mesmo padrão encontrado em observabilidade (alarme bem desenhado, mas desligado) se repete no domínio financeiro — só que de forma mais grave, porque cobrança real não tem "ambiente de dev" para isolar o risco. O achado central não é "gastando mal" (o projeto, na verdade, toma boas decisões de custo por padrão) — é a ausência total de um alarme que avisaria se isso mudasse.

## Por que importa

Para quem opera infraestrutura na nuvem sozinho, sem um time de FinOps, o guardrail de orçamento é a rede de segurança mais barata que existe — literalmente gratuita até o ponto de gerar o primeiro alerta — e ainda assim é o item mais comumente esquecido, porque "configurar isso depois" nunca dói até doer de uma vez.

## Storytelling sugerido

Conecte explicitamente com o post anterior da série (o incidente de pipeline, achado fora do roteiro original da auditoria): a cota de armazenamento do GitHub Actions foi cruzada sem aviso, e só foi descoberta por acaso, no meio de outra investigação. Pergunte: "e se o mesmo tipo de limite, em vez de armazenamento de CI, fosse a fatura da AWS?" Resposta real, hoje: não existe nenhum `aws_budgets_budget` ou alarme de anomalia de custo configurado. O mesmo buraco, em escala mais cara.

Em seguida, reverta a expectativa do leitor: mostre que o projeto, na real, já toma boas decisões de custo — `PriceClass_200` no CloudFront com justificativa explícita no próprio código (cobre a audiência real sem pagar cobertura global), DynamoDB em modo on-demand, concorrência provisionada só em produção. O ponto não é incompetência, é a ausência específica de uma rede de segurança que custaria, na prática, zero reais para configurar.

Fechamento da série inteira: termine conectando os 12 critérios — o padrão que se repete, criterio após critério, é "desenho correto, ativação ou vigilância pendente". É a frase que resume a auditoria completa.

## Provas e exemplos reais

- Nenhum `aws_budgets_budget` ou recurso de Cost Anomaly Detection em todo `infra/` (confirmado por busca).
- Conexão direta: o incidente de pipeline (run `28295174116`, `Failed to CreateArtifact: Artifact storage quota has been hit`) é o mesmo padrão de risco — limite cruzado, zero alerta prévio — só num domínio diferente (armazenamento de CI, não fatura AWS).
- `infra/modules/frontend/cloudfront.tf:68`: `price_class = "PriceClass_200" # NA/Europa + América do Sul (Brasil) — obrigatório para blog PT-BR` — decisão de custo documentada e correta.
- `aws_dynamodb_table.posts`: `billing_mode = "PAY_PER_REQUEST"` — escolha certa para tráfego baixo/imprevisível.
- `provisioned_concurrency`: `0` em dev, `1` em prod — custo só onde o benefício (eliminar cold start) se justifica.
- Referência cruzada: a tag `Project` incorreta (`marcelo-goncalves-tech` em vez de `marcelo-goncalves-blog`, achado do critério de IaC) significa que, mesmo se um custo anômalo aparecesse, o relatório de custo filtrado por projeto não o encontraria.

## Conceitos a explicar

- **AWS Budgets**: serviço gratuito que monitora gasto acumulado contra um limite definido e notifica (e-mail/SNS) quando cruzado — não impede o gasto, mas avisa a tempo de agir.
- **Cost Anomaly Detection**: usa padrão histórico de gasto para alertar sobre picos atípicos, mesmo sem um limite fixo definido — útil quando o "normal" do projeto ainda está mudando.
- **FinOps**: prática de tratar custo de nuvem como uma dimensão de engenharia contínua (visibilidade, alarme, revisão), não como uma surpresa mensal na fatura.

## Estrutura sugerida (H2s)

1. A mesma pergunta do post anterior, agora sobre dinheiro de verdade
2. O que já está certo (e por que vale dizer isso primeiro)
3. A peça que falta: nenhum alarme de orçamento
4. Por que essa rede de segurança específica é a mais barata de todas
5. Fechamento da série: o padrão que se repetiu 12 vezes

## Fecho / CTA

Fecha a série inteira — link de volta para o post-âncora, convite para o leitor rodar a própria checagem de orçamento AWS hoje, e teaser do capítulo de ebook sobre o `contract.md`.

## Fonte interna

`docs/auditoria-engenharia/12-custo-finops.md`
