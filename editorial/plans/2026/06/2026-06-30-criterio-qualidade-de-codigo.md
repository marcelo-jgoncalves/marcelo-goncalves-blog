---
id: POST-PLAN-2026-003
schema_version: "1.0"
title: "Post 2 da série: Qualidade de Código — \"O lint que existe, funciona, e nunca roda\""
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

<!-- Migrado de projects/publishing-content/postagens/03-criterio-qualidade-de-codigo.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post 2 da série: Qualidade de Código — "O lint que existe, funciona, e nunca roda"

## Títulos alternativos
- "Ter a ferramenta não é o mesmo que ter a prática"
- "`catch (error: any)`, nove vezes, no mesmo arquivo de regras"

## Tese central

Existem dois tipos de dívida de qualidade: a que falta (sem ferramenta) e a que existe mas não é exercitada (ferramenta presente, processo ausente). O segundo tipo é mais traiçoeiro porque dá falsa sensação de segurança. O post usa o backend (zero lint configurado) e o frontend/admin (lint configurado, nunca rodado em CI) como dois lados da mesma moeda.

## Por que importa

"Configuramos ESLint" é um item de checklist que muita gente marca e nunca revisita. O achado real aqui é mais sutil e mais comum do que "não temos lint": **ter lint que não é gate de nada**.

## Storytelling sugerido

Comece com o número mais concreto: `catch (error: any)` aparece, literalmente copiado, em 9 das 10 Lambdas do backend. Não é um erro de uma pessoa cansada numa sexta-feira — é um padrão sistemático, porque não existe nenhuma ferramenta automatizada checando isso no backend (zero arquivo de configuração ESLint). Vire a chave: frontend e admin *têm* ESLint configurado e funcional — mas nenhum workflow de CI jamais invoca `npm run lint`. A piada amarga: a ferramenta que poderia ter pego os 9 `any` não está nem instalada onde aconteceu, e a que está instalada em outro lugar nunca é chamada.

Fechamento: qualidade de código não é sobre ter a ferramenta certa, é sobre a ferramenta estar **no caminho obrigatório** entre escrever código e ele ir para produção.

## Provas e exemplos reais

- Backend: nenhum `.eslintrc`/`eslint.config.*`, nenhum script `lint` em `package.json`, `eslint` não está em `devDependencies`.
- `docs/contract.md` (o próprio documento de padrões do projeto) declara "lint automático" como não-negociável — contradição direta com o estado real do backend.
- Contagem de `any`: backend 22 ocorrências/14 arquivos, admin 11/7, frontend 7/6.
- `catch (error: any)` repetido em `adminAuthors`, `adminCategorias`, `adminCategories`, `adminPosts`, `getAuthor`, `getPost`, `getPosts`, `mediaUpload`, `postScheduler` — 9 de 10 handlers.
- Nenhum workflow do GitHub Actions menciona a palavra `lint` (confirmado via busca em todo `.github/workflows/`).
- Prettier configurado só em `admin/.prettierrc.json` — frontend e backend sem formatação automática.
- Contraponto positivo real: TypeScript `strict: true` confirmado nos 3 workspaces; zero TODO/FIXME de dívida real encontrado (os únicos hits foram placeholders intencionais de AdSense/GA4, já documentados no backlog).

## Conceitos a explicar

- **Lint como gate vs. lint como sugestão**: a diferença entre "a ferramenta existe" e "a ferramenta bloqueia merge".
- **`any` em TypeScript**: desliga a verificação de tipo justamente no ponto (tratamento de erro) onde o comportamento inesperado é mais provável.
- **Análise estática**: detectar problemas por inspeção do código, sem executá-lo — é o que lint faz, diferente de teste.

## Estrutura sugerida (H2s)

1. O padrão repetido nove vezes
2. Por que o backend nunca pegou isso
3. O outro lado: lint que existe e nunca é chamado
4. A ilusão de segurança de "temos ESLint configurado"
5. Lint como gate: o que muda na prática

## Fecho / CTA

Aponta para o post de Testes ("a mesma pergunta — a rede de segurança existe ou só parece existir — vale também para cobertura").

## Fonte interna

`docs/auditoria-engenharia/02-qualidade-de-codigo.md`
