# Auditoria AppSec — Categoria 4: Lógica de Negócio e Abuse Cases

> Data: 2026-06-28
> Referência: OWASP ASVS V11 (Lógica de Negócio), OWASP API Security Top 10 2023 (API4 — Unrestricted Resource Consumption)
> Escopo: `infra/modules/api-gateway/main.tf`, `backend/src/functions/mediaUpload/index.ts`.
> Apenas análise — nenhum código foi alterado nesta etapa.

## 🟡 Achados de impacto médio

### 1. ~~Nenhum `usage_plan`/throttling configurado no API Gateway~~ — ✅ corrigido

Confirmado por busca direta em todo `infra/modules/api-gateway/`: não existia nenhum `aws_api_gateway_usage_plan` nem configuração de throttling (`throttle_settings`) em nenhum método ou stage. A API inteira — incluindo as 8 rotas públicas de leitura — estava exposta sem limite de requisições por cliente/IP.

Risco prático: scraping agressivo do conteúdo público, ou simplesmente tráfego anômalo (bot, crawler mal-comportado, ataque de baixo esforço) gerando custo inesperado de Lambda + DynamoDB sem nenhum teto. Não é um risco de confidencialidade/integridade — é de disponibilidade e custo (API4:2023 — Unrestricted Resource Consumption).

**Correção aplicada:** `aws_api_gateway_method_settings.throttle_all` (`infra/modules/api-gateway/main.tf`) aplica `throttling_rate_limit = 20`/`throttling_burst_limit = 40` a `*/*` no stage `v1` — cobre toda a API, inclusive as rotas públicas, sem exigir API key (que quebraria o acesso anônimo das rotas de leitura). Valores iniciais conservadores, ajustáveis conforme tráfego real. WAF com rate-based rule (item de backlog #18) continua sendo uma camada complementar futura, não substituída por este fix.

### 2. Upload de mídia sem limite de tamanho de arquivo (reforça achado da Categoria 2) — não corrigido

`mediaUpload` gera uma URL pré-assinada sem `ContentLengthRange` — um único upload poderia, em teoria, ser arbitrariamente grande, consumindo armazenamento S3 e (se processado) tempo de execução do `imageProcessor` sem teto algum. Mesma raiz do achado #3 da Categoria 2, citado aqui sob a lente de abuso de custo/disponibilidade, não de execução de código.

## 🟢 Pontos positivos (manter)

- A URL pré-assinada do `mediaUpload` expira em 5 minutos (`expiresIn: 300`) — boa prática de limitar a janela de uso de uma URL eventualmente exposta/logada.
- Todas as rotas de escrita (onde o abuso teria maior impacto direto em dados) já exigem autenticação Cognito — o abuso sem rate limiting afeta majoritariamente as rotas públicas de leitura, que são as de menor sensibilidade de dados.

## Resumo

Esta é a categoria mais simples: um único achado real (ausência de rate limiting) que se manifesta de duas formas (API em geral, e upload de mídia em particular). Risco de disponibilidade/custo, não de confidencialidade — mas é o tipo de lacuna que só fica visível quando o tráfego cresce, exatamente o padrão "desenho correto, vigilância pendente" que já apareceu na auditoria de engenharia anterior.
