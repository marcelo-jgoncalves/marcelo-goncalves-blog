# Auditoria de Engenharia — Critério 12: Custo (FinOps)

> Data: 2026-06-27
> Escopo: Lambda concurrency/memória, CloudFront, DynamoDB on-demand vs. provisionado, guardrails de gasto.
> Apenas análise — nenhum recurso foi alterado nesta etapa.

## 🔴 Achados de alto impacto

### 1. Nenhum guardrail de orçamento (AWS Budgets / Cost Anomaly Detection) configurado

Não existe nenhum recurso `aws_budgets_budget` ou alarme de anomalia de custo em todo o `infra/`. Para um projeto rodado por uma pessoa, sem time de finanças observando a fatura, isso é a rede de segurança mais barata e mais ausente: um alerta por e-mail quando o gasto mensal cruzar um limiar, ou quando o padrão de gasto mudar bruscamente.

**Conexão direta com o achado de pipeline já relatado nesta auditoria** (cota de armazenamento de artefatos do GitHub Actions esgotada, descoberta durante o critério 9): é o mesmo tipo de risco — um limite sendo cruzado sem ninguém ser avisado antecipadamente — só que a versão AWS desse risco (cobrança real, não só falha de CI) ainda não tem alarme nenhum.

**Recomendação:** criar um `aws_budgets_budget` simples (limite mensal + notificação SNS/e-mail) é a ação de menor esforço e maior retorno deste critério inteiro.

## 🟡 Achados de impacto médio (referência cruzada — já detalhados em critérios anteriores)

Os itens abaixo já foram reportados em outros critérios desta auditoria, mas têm impacto de custo direto e merecem estar listados aqui também:

- **GSIs com `projection_type = "ALL"`** (5 índices, critério 7) — cada GSI duplica o item inteiro; em DynamoDB on-demand isso se traduz em mais WCU consumido por escrita e mais armazenamento cobrado por item.
- **`getAllPosts`/`getProjectPosts` com query de contagem duplicada** (critério 7) — dobra o RCU consumido nos dois endpoints de listagem mais visitados, só para exibir um número.
- **`searchPosts` como Scan completo** (critério 7, backlog #16) — é, hoje, a operação de maior custo potencial por requisição no backend, e escala com o tamanho da tabela.
- **Tag `Project` incorreta** (`marcelo-goncalves-tech` em vez de `marcelo-goncalves-blog`, critério 8) — impede qualquer relatório de custo no AWS Cost Explorer filtrado corretamente por projeto, o que é exatamente a ferramenta que detectaria os 3 itens acima crescendo de custo ao longo do tempo.

## 🟢 Pontos positivos (manter)

- **`price_class = "PriceClass_200"` no CloudFront, com justificativa explícita em comentário** ("NA/Europa + América do Sul — obrigatório para blog PT-BR") — escolha deliberada e correta: cobre a audiência real do blog sem pagar pela cobertura global (`PriceClass_All`).
- **DynamoDB em `PAY_PER_REQUEST`** — evita pagar por capacidade provisionada ociosa num projeto com tráfego baixo e imprevisível (já citado no critério 7, vale reafirmar aqui como decisão de FinOps correta).
- **`provisioned_concurrency = 0` em dev, `1` em prod`** — eliminação de cold start só onde o custo se justifica (tráfego real), não em todos os ambientes.
- **`enable_cloudfront_logging = false` em dev e prod** (com comentário "setar true quando prod tiver tráfego real") — decisão consciente de não pagar por armazenamento de log de CDN antes de haver tráfego que justifique a análise.
- **Retenção de artefato de CI já em 1 dia** (`cd.yml`, `retention-days: 1`) — já é o valor mais baixo praticável; o incidente de cota (critério 9) não foi causado por configuração de retenção generosa, e sim por volume de execuções acumulado antes da limpeza automática rodar.
- **Memória de Lambda já diferenciada por carga** (512MB Lambdas de API, 1024MB `imageProcessor`/frontend SSR) — não há sinal de over-provisioning óbvio sem dados de uso real (`Duration`/`Memory Used` do CloudWatch, que não estavam disponíveis para esta análise estática).

## Resumo

O projeto já toma boa parte das decisões de custo certas por padrão (on-demand, price class regional, sem log desnecessário). O gap real não é "gastando mal" — é "sem alarme se algo sair do padrão". Como a tag de projeto está incorreta (critério 8), mesmo se um custo anômalo aparecesse na fatura, ele não seria fácil de atribuir a este projeto especificamente sem antes corrigir a tag.
