---
id: POST-PLAN-2026-004
title: "Post 3 da série: Cobertura e Estratégia de Testes — \"O risco de teste não está onde parece\""
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

<!-- Migrado de projects/publishing-content/postagens/04-criterio-cobertura-e-testes.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post 3 da série: Cobertura e Estratégia de Testes — "O risco de teste não está onde parece"

## Títulos alternativos
- "Por que testamos o que lemos e não o que escrevemos"
- "Um arquivo de teste para o CMS inteiro"

## Tese central

A intuição comum é "cobertura baixa = ruim, cobertura alta = bom", aplicada de forma uniforme. O achado real é mais interessante: **o risco de teste não está distribuído igualmente entre leitura e escrita** — e é exatamente nos caminhos de escrita (o CMS, as Lambdas que alteram dados) que a cobertura é mais fraca. O post defende uma tese contraintuitiva: 64 testes E2E protegendo páginas de leitura podem valer menos, em risco real, do que 1 teste protegendo o fluxo de salvar um post.

## Por que importa

Cobertura percentual é uma métrica vaidosa se não for cruzada com "cobertura de quê". O post ensina o leitor a fazer essa pergunta antes de comemorar (ou se desesperar com) um número de coverage.

## Storytelling sugerido

Abra com o contraste mais marcante: o admin (o painel que escreve direto em produção) tem exatamente 1 arquivo de teste — e ele testa só a lógica de retry de token HTTP, nada do formulário de 526 linhas onde o conteúdo de cada post é efetivamente criado e salvo. Pause nesse número (1 arquivo) antes de revelar que o frontend, por outro lado, tem 64 casos de teste E2E cobrindo 9 grupos de rota — uma cobertura de leitura genuinamente boa para o porte do projeto. A virada do post: cobertura alta em um lugar pode coexistir com risco crítico não coberto em outro, no mesmo repositório, no mesmo dia.

Feche conectando ao significado prático: bugs em código de leitura geram página feia. Bugs em código de escrita geram dado corrompido persistido — silenciosamente, até alguém notar meses depois.

## Provas e exemplos reais

| Workspace | Unit/Integration | E2E |
|---|---|---|
| backend | 8 arquivos (Jest), cobrindo 6 de 9 Lambdas vivas | — |
| frontend | 4 arquivos (Jest) | 64 casos (Playwright), 9 grupos de rota |
| admin | 1 arquivo (Vitest) | 0 |

- Zero teste para `EditorView.vue` (526 linhas — fluxo de criação/edição de post), `CategoriesView.vue` (503 linhas), `AuthorEditView.vue`, `DashboardView.vue`, `UploadModal.vue`, store `auth.ts`.
- 3 de 9 Lambdas vivas sem nenhum teste: `getAuthor`, `adminAuthors`, `adminCategorias` — esta última é endpoint de escrita.
- `docs/contract.md` define meta de coverage ≥80% como não-negociável; nenhum `jest.config`/`vitest.config` dos 3 workspaces tem `coverageThreshold` — a meta nunca é, de fato, aplicada.
- Contraponto positivo: o teste existente do admin (`api.test.ts`) cobre um caso de borda real (token expirado + retry duplo), não é superficial; as Lambdas testadas cobrem exatamente os caminhos certos (leitura pública de alto tráfego, escrita de posts, agendamento, pipeline de imagem, sanitização).

## Conceitos a explicar

- **Cobertura de teste (coverage)**: percentual de linhas/branches exercitadas por testes automatizados — métrica de quantidade, não de risco.
- **Caminho de leitura vs. caminho de escrita**: ler dado errado mostra um bug visível; escrever dado errado persiste um bug invisível.
- **`coverageThreshold`**: configuração que falha o build se a cobertura cair abaixo de um valor — sem ela, uma meta de coverage é só aspiração.

## Estrutura sugerida (H2s)

1. Um arquivo de teste para o sistema que escreve em produção
2. O outro lado: 64 testes protegendo o que já é seguro por natureza
3. Por que "80% de cobertura" pode ser uma meta sem dono
4. Como pensar em risco de teste por direção do dado (leitura vs. escrita), não por percentual
5. O que priorizar primeiro quando o tempo é escasso

## Fecho / CTA

Aponta para o post de CI/CD ("ter teste não basta se ele nunca roda automaticamente antes do merge — é o próximo capítulo dessa mesma história").

## Fonte interna

`docs/auditoria-engenharia/03-cobertura-e-estrategia-de-testes.md`
