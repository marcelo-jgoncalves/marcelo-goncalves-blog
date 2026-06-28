# Observability — Four Golden Signals & SLOs

> Formaliza os alvos de "bom vs ruim" para os alarmes já existentes em `infra/modules/{api-gateway,lambda,media,observability}`.
> Sem isso, latência/erros eram números sem critério — esta tabela é o critério.

## Mapeamento aos Four Golden Signals (Google SRE)

| Sinal | Métrica | SLO (alvo) | Onde é medido | Alarme |
|---|---|---|---|---|
| **Latência** | API Gateway `IntegrationLatency` p99 | < 5000ms | `modules/api-gateway/alarms.tf` | `api-latency-p99` |
| **Tráfego** | API Gateway `Count` | sem alarme — apenas dashboard (capacidade, não disponibilidade) | `modules/observability/dashboard.tf` | — |
| **Erros** | API Gateway `5XXError` | < 5 em 1min (threshold bruto, ruído operacional) | `modules/api-gateway/alarms.tf` | `api-5xx` |
| **Erros** | Lambda `Errors` (por função) | < 5 em 1min | `modules/lambda/alarms.tf`, `modules/media/alarms.tf` | `{função}-errors` |
| **Saturação** | Lambda `Throttles` (por função) | < 10 em 1min | `modules/lambda/alarms.tf`, `modules/media/alarms.tf` | `{função}-throttles` |
| **Saturação** | Lambda `Duration` p99 | visualização no dashboard — sem alarme fixo (varia muito por função: `imageProcessor` é naturalmente mais lento que `getPost`) | `modules/observability/dashboard.tf` | — |
| **Disponibilidade** (sintético) | Synthetics `SuccessPercent` | 100% em 2 execuções consecutivas (rate 15min) | `modules/observability/canary.tf` | `canary-failure` |
| **Disponibilidade** (SLI/SLO real) | `5XXError / Count` (API Gateway, error ratio) | 99.5% em janela de 30 dias — ver seção abaixo | `modules/observability/slo-burn-rate.tf` | `availability-burn-fast`, `availability-burn-slow` |

Os alarmes de `api-5xx` e `api-latency-p99` (linhas 1-3) são thresholds arbitrários sobre métrica bruta — úteis como sinal operacional imediato ("algo está acontecendo agora"), mas não derivados de um objetivo de negócio. O alarme de disponibilidade (última linha) é o único genuinamente derivado de SLO — ver detalhes abaixo. Os dois coexistem deliberadamente: threshold bruto pega anomalias pontuais rápido; burn rate pega consumo sustentado de error budget que um threshold simples não distingue de ruído.

## SLO de disponibilidade — error budget burn rate (Google SRE Workbook)

**99.5% de disponibilidade mensal** para a API pública (`AWS/ApiGateway`), medido pela proporção de requests que NÃO retornam `5XXError` em relação ao total (`Count`), em janela de 30 dias.

- 99.5%/mês ≈ até 3h36min de indisponibilidade tolerada/mês → **error budget = 0.5%** das requests.
- Escolhido deliberadamente mais permissivo que os "99.9%" de referência de mercado — este é um blog de 1 pessoa sem SLA contratual, não justifica o custo operacional de perseguir 99.9%+ (multi-AZ redundante, runbooks de on-call 24/7).
- Ajustar para 99.9% só se houver dependência de negócio real (ex: leads pagos via tráfego direto) que justifique o investimento adicional. A constante vive em `var.availability_slo` (`modules/observability/variables.tf`) — mudar ali recalcula os thresholds de burn rate automaticamente.

### Por que "burn rate", não "erros > N"

Um threshold fixo ("alarme se 5xx > 5 em 1min") não diferencia 5 erros num minuto de tráfego alto (ruído, <0.01% do total) de 5 erros num minuto de tráfego baixo (pode ser 100% de falha). O burn rate normaliza pelo volume: mede a **taxa de consumo do error budget**, não a contagem absoluta de erros. Implementado como Metric Math (`metric_query` com `expression = "(e5xx / requests) * 100"`) sobre as métricas brutas `5XXError`/`Count` do API Gateway — ver `modules/observability/slo-burn-rate.tf`.

### Multiwindow, multi-burn-rate (padrão do SRE Workbook)

Cada severidade combina uma janela **curta** (detecção rápida) e uma janela **longa** (confirmação, evita falso-positivo de pico isolado) via **CloudWatch Composite Alarm** — só notifica quando AMBAS estão em `ALARM` simultaneamente:

| Severidade | Burn rate | Janela curta | Janela longa | Significado | Notifica |
|---|---|---|---|---|---|
| **Fast burn** (page) | 14.4x | 5min | 1h | Sustentado, esgota o budget mensal em ~2 dias | SNS `slo-page` |
| **Slow burn** (ticket) | 6x | 1h | 6h | Sustentado, esgota o budget mensal em ~5 dias | SNS `slo-ticket` |

O threshold de cada alarme é `burn_rate × error_budget × 100` (em %). Com `availability_slo = 0.995` → `error_budget = 0.005` → fast burn dispara em `14.4 × 0.005 × 100 = 7.2%` de error ratio sustentado; slow burn em `6 × 0.005 × 100 = 3%`.

`treat_missing_data = "notBreaching"` em todos os 4 `aws_cloudwatch_metric_alarm` — sem tráfego (madrugada, dev parado) não deve disparar falso-positivo de "100% de erro" por ausência de dados.

### Por que 2 SNS topics (não 1)

Severidades diferentes merecem resposta diferente: fast burn (page) é "acorda alguém agora", slow burn (ticket) é "investigar no próximo dia útil". Hoje ambos apontam para o mesmo e-mail (`var.alarm_email`) porque o projeto tem 1 operador — a separação existe para permitir integração futura com PagerDuty/Opsgenie (page) vs Jira/Linear (ticket) sem precisar redesenhar o alarme, só trocar o subscriber do topic.

### Honestidade sobre o que isso é (e não é)

Isto é SLI/SLO real (objetivo de negócio declarado → error budget derivado → alarme derivado do error budget), não apenas "CloudWatch Alarm com nome bonito". Mas tem 2 limitações conhecidas, deliberadas:
- O SLI cobre só a API (`AWS/ApiGateway`), não o frontend/CDN — o canary (`canary.tf`) cobre disponibilidade ponta-a-ponta via Synthetics, mas com alarme threshold simples (2 falhas consecutivas), não burn rate.
- MTTR não é medido automaticamente — não há instrumentação de "tempo entre alarme e resolução". Ficaria em um sistema de incident tracking (PagerDuty/Opsgenie), fora do escopo de CloudWatch puro.

## Por que tráfego e duration não têm alarme fixo

Erros e saturação têm um threshold universal claro ("zero é o ideal, N é tolerável"). Tráfego e latência de função não funcionam assim — tráfego baixo pode ser normal (madrugada) ou sintoma de outage upstream (DNS, CDN), e `Duration` varia 10x entre funções leves (`getPost`) e pesadas (`imageProcessor`, que processa imagem). Alarmar com threshold fixo nesses dois geraria ruído sem sinal. Por isso ficam no dashboard (visibilidade humana) em vez de alarme automático (gatilho de SNS) — prática padrão de SRE: nem todo Golden Signal precisa de alarme, só precisa de visibilidade.

## Quando revisar esta tabela

- Antes do primeiro deploy real de produção (validar se os thresholds ainda fazem sentido com tráfego real, não estimado).
- Se o canary disparar falso-positivo recorrente — ajustar `evaluation_periods`/`period` em `modules/observability/canary.tf`, não desabilitar o alarme.
- Se o volume de posts/tráfego crescer o suficiente para o full-table-scan do `searchPosts` (achado de performance separado, ver `docs/auditoria-engenharia/07-performance-e-escalabilidade.md`) começar a aparecer como latência elevada neste dashboard.
