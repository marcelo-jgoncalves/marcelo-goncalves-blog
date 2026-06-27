# Observability — Four Golden Signals & SLOs

> Formaliza os alvos de "bom vs ruim" para os alarmes já existentes em `infra/modules/{api-gateway,lambda,media,observability}`.
> Sem isso, latência/erros eram números sem critério — esta tabela é o critério.

## Mapeamento aos Four Golden Signals (Google SRE)

| Sinal | Métrica | SLO (alvo) | Onde é medido | Alarme |
|---|---|---|---|---|
| **Latência** | API Gateway `IntegrationLatency` p99 | < 5000ms | `modules/api-gateway/alarms.tf` | `api-latency-p99` |
| **Tráfego** | API Gateway `Count` | sem alarme — apenas dashboard (capacidade, não disponibilidade) | `modules/observability/dashboard.tf` | — |
| **Erros** | API Gateway `5XXError` | < 5 em 1min | `modules/api-gateway/alarms.tf` | `api-5xx` |
| **Erros** | Lambda `Errors` (por função) | < 5 em 1min | `modules/lambda/alarms.tf`, `modules/media/alarms.tf` | `{função}-errors` |
| **Saturação** | Lambda `Throttles` (por função) | < 10 em 1min | `modules/lambda/alarms.tf`, `modules/media/alarms.tf` | `{função}-throttles` |
| **Saturação** | Lambda `Duration` p99 | visualização no dashboard — sem alarme fixo (varia muito por função: `imageProcessor` é naturalmente mais lento que `getPost`) | `modules/observability/dashboard.tf` | — |
| **Disponibilidade** (sintético) | Synthetics `SuccessPercent` | 100% em 2 execuções consecutivas (rate 15min) | `modules/observability/canary.tf` | `canary-failure` |

## SLO de disponibilidade declarado

**99.5% de disponibilidade mensal** para o blog público (`frontend_url`) e admin (`admin_url`), medido pelo heartbeat canary.

- 99.5%/mês ≈ até 3h36min de indisponibilidade tolerada/mês.
- Escolhido deliberadamente mais permissivo que os "99.9%" de referência de mercado — este é um blog de 1 pessoa sem SLA contratual, não justifica o custo operacional de perseguir 99.9%+ (multi-AZ redundante, runbooks de on-call 24/7).
- Ajustar para 99.9% só se houver dependência de negócio real (ex: leads pagos via tráfego direto) que justifique o investimento adicional.

## Por que tráfego e duration não têm alarme fixo

Erros e saturação têm um threshold universal claro ("zero é o ideal, N é tolerável"). Tráfego e latência de função não funcionam assim — tráfego baixo pode ser normal (madrugada) ou sintoma de outage upstream (DNS, CDN), e `Duration` varia 10x entre funções leves (`getPost`) e pesadas (`imageProcessor`, que processa imagem). Alarmar com threshold fixo nesses dois geraria ruído sem sinal. Por isso ficam no dashboard (visibilidade humana) em vez de alarme automático (gatilho de SNS) — prática padrão de SRE: nem todo Golden Signal precisa de alarme, só precisa de visibilidade.

## Quando revisar esta tabela

- Antes do primeiro deploy real de produção (validar se os thresholds ainda fazem sentido com tráfego real, não estimado).
- Se o canary disparar falso-positivo recorrente — ajustar `evaluation_periods`/`period` em `modules/observability/canary.tf`, não desabilitar o alarme.
- Se o volume de posts/tráfego crescer o suficiente para o full-table-scan do `searchPosts` (achado de performance separado, ver `docs/auditoria-engenharia/07-performance-e-escalabilidade.md`) começar a aparecer como latência elevada neste dashboard.
