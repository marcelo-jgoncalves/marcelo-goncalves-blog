---
id: POST-PLAN-2026-007
schema_version: "1.0"
title: "Post 6 da série: Observabilidade — \"O alarme já está construído. Só está desligado.\""
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

<!-- Migrado de projects/publishing-content/postagens/07-criterio-observabilidade.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post 6 da série: Observabilidade — "O alarme já está construído. Só está desligado."

## Títulos alternativos
- "Monitoramento não é desenho, é interruptor"
- "Quando o primeiro a saber do incidente é o usuário"

## Tese central

Existe uma diferença grande entre "não temos observabilidade" e "temos observabilidade desenhada corretamente, mas inativa". O segundo caso é mais comum (e mais perigoso, porque parece resolvido) do que o primeiro. O post mostra um sistema de alarmes e tracing bem projetado — thresholds sensatos, SNS configurado, X-Ray pronto — que está, hoje, com tudo desligado por uma flag de Terraform.

## Por que importa

Para quem está construindo um produto sozinho (o caso de Marcelo), a tentação de "ligar isso depois, quando tiver tráfego real" é racional até certo ponto — mas o ponto de virada chega antes do que parece, e geralmente chega como um incidente, não como um aviso.

## Storytelling sugerido

Abra com a pergunta que ninguém faz até precisar da resposta: "se uma Lambda começar a falhar agora, quem fica sabendo, e quando?". Resposta real, hoje: ninguém, automaticamente — a descoberta depende de alguém notar o blog ou o admin quebrado. Revele que isso não é falta de engenharia: os alarmes (erro/throttle por Lambda, 5xx e latência P99 do API Gateway) já estão implementados, com thresholds bem pensados — é uma variável (`enable_cloudwatch_alarms = false`) no arquivo de configuração do ambiente.

Segundo beat: mesmo quando ativados, há uma lacuna concreta — a Lambda que processa toda imagem enviada (`imageProcessor`) não está na lista de funções monitoradas. Ela pode falhar silenciosamente, e a primeira evidência seria... a imagem não aparecer no post, dias depois.

Fechamento: a virada de "desenhado" para "ativo" geralmente custa uma linha de configuração — o difícil (pensar nos thresholds certos) já foi feito. O ponto do post é mostrar que vale a pena revisitar esse "depois" antes que ele vire "tarde".

## Provas e exemplos reais

- `infra/env/dev.tfvars`: `enable_cloudwatch_alarms = false`, `enable_xray_tracing = false`, `alarm_email = ""` — no único ambiente que existe hoje.
- `infra/modules/lambda/alarms.tf`: alarmes de erro (>5/min) e throttle (>10/min) por Lambda, já implementados, com SNS por e-mail — só não estão ativos.
- `infra/modules/api-gateway/alarms.tf`: alarme de 5xx (>5/min) e de latência P99 (>5s) — mesma situação.
- `imageProcessor` ausente da lista `local.monitored_functions` em `alarms.tf` (8 de 9 Lambdas vivas listadas — falta justo a que processa todo upload de imagem).
- Nenhum `aws_cloudwatch_dashboard` em todo o `infra/` — mesmo com alarmes ativos, não há painel único para triagem de incidente.
- Contraponto positivo real: logging estruturado em JSON (`level`, `message`, `timestamp` + contexto) consistente em todo o backend; nível de log já controlado por ambiente via `LOG_LEVEL`; wrapper do X-Ray no client DynamoDB já é condicional e opt-in, sem custo de manutenção quando desligado.

## Conceitos a explicar

- **CloudWatch Alarm**: regra que observa uma métrica (erros, latência) e dispara uma notificação quando cruza um limiar — sem ele, a métrica existe mas ninguém é avisado.
- **X-Ray / tracing distribuído**: rastreamento de uma requisição através de múltiplos serviços (Lambda → DynamoDB → S3), útil para achar onde, exatamente, uma operação lenta ou que falhou perdeu tempo.
- **MTTR (Mean Time To Recovery)**: tempo médio entre um problema começar e ser resolvido — observabilidade ativa reduz o tempo até *detectar*, que é o primeiro pedaço do MTTR.

## Estrutura sugerida (H2s)

1. A pergunta que só importa quando já é tarde
2. O alarme que já existe, desligado por uma variável
3. A lacuna dentro da lacuna: a Lambda que ninguém está observando
4. Por que "ligar depois" custa mais do que parece
5. O que já está certo (e por que isso facilita a virada)

## Fecho / CTA

Aponta para o post de Performance ("o mesmo princípio — desenho correto, execução pendente — aparece de novo, agora em escala de dado").

## Fonte interna

`docs/auditoria-engenharia/06-observabilidade.md`
