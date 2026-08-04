---
id: POST-PLAN-2026-005
title: "Post 4 da série: CI/CD e Engenharia de Repositório — \"O gate mais fraco é o que protege o merge\""
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

<!-- Migrado de projects/publishing-content/postagens/05-criterio-cicd-e-engenharia-de-repositorio.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post 4 da série: CI/CD e Engenharia de Repositório — "O gate mais fraco é o que protege o merge"

## Títulos alternativos
- "Build só é testado depois que já era tarde"
- "Monorepo ou polyrepo? A pergunta errada para quem está sozinho"

## Tese central

Pipeline de CI/CD bem desenhado tem uma regra simples: o gate mais rigoroso deve estar **antes** do ponto de não-retorno (merge, deploy), não depois. Este post mostra um pipeline com boas práticas reais (OIDC, plan/apply separado em produção, scans de segurança em camadas) que, mesmo assim, inverte essa ordem — o build de fato só é testado depois que o código já foi mergeado e o deploy já está em andamento.

## Por que importa

É um erro fácil de cometer porque cada peça isolada do pipeline parece certa — "temos teste", "temos scan de segurança", "temos terraform validate". Falta perguntar: cada gate roda **antes** ou **depois** do ponto que ele deveria proteger?

## Storytelling sugerido

Abra com o fato mais contra-intuitivo: o validador de PR (`deploy.yml`) roda testes e `npm audit` — mas nunca `npm run build`. A primeira vez que o build de fato acontece é no `cd.yml`, que só dispara **depois do merge**, já fazendo deploy para infraestrutura real. Conecte com algo concreto e recente: os 64 testes E2E (que existem, funcionam, e seriam o melhor sinal de regressão do projeto) nunca são chamados em nenhum workflow — eles protegem exatamente zero PRs e zero deploys, hoje.

Segunda parte do post: a pergunta que o leitor (Marcelo) fez na auditoria real — "estamos certos em usar monorepo?" — e por que a resposta certa depende do contexto (dono único, forte acoplamento entre camadas), não de dogma de "monorepo é melhor" ou "polyrepo escala mais". Mostre que mesmo a resposta "sim, monorepo" revelou que **não é um monorepo de verdade hoje** — é uma pasta com 3 projetos npm independentes.

Fechamento: pipeline maduro não é "ter etapas", é ter as etapas certas, na ordem certa, no momento certo.

## Provas e exemplos reais

- `deploy.yml` (PR validator): só `npm audit --audit-level=high` + `npm test` por workspace, e `terraform fmt/validate` + Trivy para infra — nunca `npm run build`, `tsc --noEmit` ou `vue-tsc --build`.
- `cd.yml`: builda backend (esbuild) e frontend (OpenNext) — primeira vez que esses comandos rodam — só em push para `develop`/`main`, já em paralelo com o início do processo de deploy.
- 64 casos de teste Playwright (`frontend/e2e/*.spec.ts`) configurados e funcionais, mas `npm run test:e2e` não aparece em nenhum workflow.
- Nenhum smoke test pós-deploy — `cd.yml` termina em sync S3 + invalidação CloudFront, sem nenhuma verificação de que a URL responde 200.
- Nenhum workflow usa `paths:` no gatilho — todo PR roda a matriz inteira (backend + frontend + admin + terraform), mesmo quando só um workspace mudou.
- Contraponto positivo real: autenticação via OIDC (sem credenciais estáticas de AWS); `plan-prod` gera o plano, salva como artefato, espera aprovação manual (`environment: production`), e só então `terraform apply tfplan-prod` aplica exatamente o plano aprovado — separação plan/apply correta, prática de nível sênior.
- Monorepo: `package.json` raiz não tem `workspaces` — cada workspace tem seu próprio `package-lock.json`, instalado separadamente. É descrito como monorepo mas funciona como 3 projetos Node independentes numa mesma pasta.

## Conceitos a explicar

- **Gate de pipeline**: uma etapa que, se falhar, impede a próxima etapa de rodar (ex: PR não pode ser mergeado se o gate falhar).
- **Plan/Apply separado (Terraform)**: gerar o plano de mudança, revisar/aprovar, e aplicar exatamente esse plano (não um novo plano no momento de aplicar) — evita drift entre o que foi aprovado e o que de fato roda.
- **Monorepo de fato vs. "pasta única"**: monorepo de verdade tem grafo de dependências unificado (workspaces, lockfile único); sem isso, é só código no mesmo repositório Git, sem os benefícios reais de tooling.

## Estrutura sugerida (H2s)

1. O build que só é testado depois que já era tarde
2. Os 64 testes que não protegem nada (ainda)
3. O que esse pipeline já faz bem (e por que vale reconhecer)
4. Monorepo ou polyrepo: a pergunta certa para quem está sozinho
5. "Monorepo" no nome, 3 projetos soltos na prática
6. Como ordenar gates pela pergunta "isso protege antes ou depois do ponto de não-retorno?"

## Fecho / CTA

Aponta para o post de Segurança ("scans de segurança em camadas existem aqui — mas alguns dos achados de segurança mais sérios não vêm de scanner nenhum").

## Fonte interna

`docs/auditoria-engenharia/04-cicd-e-pipeline.md`
