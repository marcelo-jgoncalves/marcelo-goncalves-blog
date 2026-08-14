---
id: POST-PLAN-2026-012
schema_version: "1.0"
title: "Post standalone: \"O deploy que não aconteceu, e ninguém percebeu por uma hora\""
created_at: 2026-06-27
updated_at: 2026-06-27
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

<!-- Migrado de projects/publishing-content/postagens/12-standalone-pipeline-vermelho-automacao-teatro.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post standalone: "O deploy que não aconteceu, e ninguém percebeu por uma hora"

## Por que este post é diferente dos demais

É o post mais narrativo da pasta — quase um "incident report" pessoal, em tempo real, capturado no meio de outra tarefa (a auditoria). Funciona bem como post de "bastidores" / transparência radical, um gênero que costuma performar bem em blogs técnicos pessoais porque é verificável e humano (mostra operação real, não case de sucesso editado).

## Tese central

Automação de CI/CD pode falhar de formas que não têm nada a ver com o código que você escreveu — e o ponto cego mais perigoso é exatamente esse: quando build e testes passam, a sensação é de "tudo certo", mesmo que o deploy não tenha ido para o ar. "Automação teatro" é quando o pipeline aparenta funcionar (luzes verdes na maior parte) mas o resultado final (deploy efetivo) silenciosamente não aconteceu.

## Storytelling sugerido

Este post se conta quase em ordem cronológica real, porque a cronologia *é* a história: no meio da auditoria de dependências, ao verificar o estado do projeto, apareceu uma execução de pipeline com status de falha, de aproximadamente uma hora antes — sem que ninguém tivesse notado ainda. Investigando, build do backend: passou. Testes: passaram. Build do frontend (OpenNext): passou. E então, silenciosamente, o upload do artefato de build falhou — `Failed to CreateArtifact: Artifact storage quota has been hit` — cota de armazenamento de artefatos do GitHub Actions esgotada. Como os jobs de deploy dependem desses artefatos, o deploy para o ambiente de dev simplesmente nunca rodou.

O ponto alto do post: nada disso aparece como "código quebrado". Ninguém vai abrir um post-mortem pensando em cota de armazenamento de CI. É o tipo de falha que só se vê olhando o pipeline diretamente — não a aplicação, não os logs de erro de negócio.

Fechamento, com honestidade: a causa raiz (retenção de artefatos vs. cota de plano gratuito do GitHub Actions) é banal e fácil de corrigir — mas o ensino real é sobre **onde olhar quando "tudo passou" não significa "tudo aconteceu"**.

## Provas e exemplos reais

- Run `28295174116`, workflow `Deploy Pipeline (CD)`, branch `develop`, evento `push`, commit "docs: update .project-context.md with session 48 summary".
- Sequência observada via `gh run view`:
  - `1a. Build Backend`: todos os steps até `Build backend Lambdas` ✓; falha em `Run actions/upload-artifact@v4`.
  - `1b. Build Frontend`: todos os steps até `Copy frontend static assets` ✓; mesma falha em `Run actions/upload-artifact@v4`.
  - `2a. Deploy → Dev`, `2b. Terraform Plan → Prod`, `3. Aprovação Manual`, `4. Deploy → Prod`: todos com 0s de execução — nunca rodaram, por dependerem dos artefatos que falharam.
- Mensagem de erro literal: `Failed to CreateArtifact: Artifact storage quota has been hit. Unable to upload any new artifacts. Usage is recalculated every 6-12 hours.`
- `cd.yml` configura `retention-days: 1` para os artefatos de build (backend e frontend) — retenção curta, mas, dependendo da frequência de push, artefatos acumulam mais rápido do que são expirados, especialmente perto do limite de armazenamento de planos gratuitos/básicos do GitHub Actions.

## Conceitos a explicar

- **Artefato de CI/CD**: arquivo produzido por um job (aqui, os `.zip` de build) e compartilhado com jobs seguintes do mesmo workflow — se o upload falhar, os jobs seguintes não têm o que precisam para rodar.
- **Cota de armazenamento de Actions**: GitHub limita o espaço total de artefatos retidos simultaneamente por conta/plano; mesmo com retenção curta configurada, picos de uso podem esgotar a cota antes da limpeza automática rodar.
- **Falso verde parcial**: quando partes de um pipeline (build, teste) reportam sucesso mas o objetivo final do pipeline (deploy) não foi atingido — o "verde" não é mentira, é incompleto.

## Estrutura sugerida (H2s)

1. O que eu estava fazendo quando vi a falha (contexto: no meio de outra investigação)
2. A anatomia da falha: tudo passou, até não passar
3. Por que isso não aparece como "bug" em nenhum lugar óbvio
4. A causa raiz banal (cota de artefato) e a correção simples
5. A lição real: onde olhar quando "passou" não é a pergunta certa

## Fecho / CTA

Convite a checar `gh run list` do próprio projeto do leitor agora, sem esperar um incidente — e link para o post-âncora da série de auditoria.

## Fonte interna

Não documentado em arquivo de critério (descoberta fora do escopo formal dos 9 critérios) — registrado na conversa da sessão de auditoria, 2026-06-27.
