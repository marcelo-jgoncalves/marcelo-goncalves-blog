# Auditoria de Engenharia — Critério 6: Observabilidade

> Data: 2026-06-27
> Escopo: CloudWatch alarms, X-Ray, dashboards, logging estruturado.
> Apenas análise — nenhum código foi alterado nesta etapa.

## 🔴 Achados de alto impacto

### 1. Observabilidade está implementada no código mas inativa no único ambiente vivo

`infra/env/dev.tfvars` define:

```
enable_cloudwatch_alarms = false
enable_xray_tracing       = false
alarm_email               = ""
```

Os alarmes de erro/throttle por Lambda, os alarmes de 5xx/latência P99 do API Gateway e o tracing X-Ray (todos implementados em `infra/modules/lambda/alarms.tf` e `infra/modules/api-gateway/alarms.tf`) existem em código, mas estão **desligados** no dev — o único ambiente que existe hoje (confirma `CLAUDE.md`: "Ambiente ativo: apenas dev").

Na prática: se uma Lambda começar a falhar, o API Gateway acumular 5xx, ou a latência degradar, **ninguém é notificado**. A descoberta depende inteiramente de alguém notar o blog/admin quebrado.

**Recomendação:** ligar `enable_cloudwatch_alarms = true` + `alarm_email` no dev agora — o custo é mínimo (SNS + CloudWatch Alarms têm tier gratuito generoso) e o blog já está em uso real para conteúdo/SEO, não é mais um ambiente puramente experimental.

## 🟡 Achados de impacto médio

### 2. `imageProcessor` não está na lista de funções monitoradas

`local.monitored_functions` em `alarms.tf` lista 8 Lambdas (`getPost`, `getAuthor`, `getPosts`, `adminPosts`, `adminAuthors`, `adminCategorias`, `mediaUpload`, `postScheduler`) — falta `imageProcessor`. Mesmo quando os alarmes forem ativados, essa Lambda (que decide se as variantes AVIF/WebP de cada imagem são geradas) não terá alarme de erro nem de throttle. É a única das 9 Lambdas vivas fora da lista.

### 3. Nenhum CloudWatch Dashboard existe

Confirmado: nenhum recurso `aws_cloudwatch_dashboard` em todo `infra/`. Mesmo com alarmes ativos, não há um painel único (taxa de erro, latência, throttles de DynamoDB) para triagem de incidente — qualquer investigação parte de zero em CloudWatch Logs Insights.

### 4. Lambdas orientadas a evento sem ID de correlação próprio

`postScheduler` (EventBridge) e `imageProcessor` (trigger S3) não têm `requestId` de API Gateway — esperado, já que não estão atrás do API Gateway — mas também não geram um ID de correlação próprio (ex: chave do objeto S3, ID do evento EventBridge) no contexto de log. Rastrear uma única execução de upload/agendamento através de múltiplas linhas de log é mais difícil do que nas Lambdas com `requestId`.

## 🟢 Pontos positivos (manter)

- Logging estruturado em JSON (`level`, `message`, `timestamp` + contexto) é usado de forma consistente em todo o backend — é a matéria-prima de que qualquer observabilidade depende, e já está correta.
- A infraestrutura de alarmes/tracing já está bem desenhada (thresholds sensatos: 5 erros/min, 10 throttles/min, P99 de 5s; SNS por e-mail; gating via variável) — é uma mudança de `.tfvars`, não um redesenho, para ativar em produção.
- Nível de log controlado por ambiente (`DEBUG` em dev via `LOG_LEVEL`) — comportamento correto já implementado.
- Wrapper do X-Ray no client DynamoDB (`backend/src/common/dynamodb.ts`) é condicional e não quebra nada quando desativado — bom design de opt-in.

## Resumo

A base de observabilidade (logging, desenho de alarmes, instrumentação X-Ray) está bem construída — o problema não é desenho, é **ativação**. Hoje, em produção (dev), o sistema roda sem nenhuma rede de alerta proativa. Isso é aceitável apenas enquanto o tráfego for irrelevante; como o blog já está em uso real, vale a pena ligar o que já existe antes de seguir adicionando funcionalidades novas.
