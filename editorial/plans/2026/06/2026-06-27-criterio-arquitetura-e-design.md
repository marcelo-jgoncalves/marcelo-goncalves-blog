---
id: POST-PLAN-2026-002
title: "Post 1 da série: Arquitetura & Design — \"O mesmo dado, três versões diferentes da verdade\""
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

<!-- Migrado de projects/publishing-content/postagens/02-criterio-arquitetura-e-design.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post 1 da série: Arquitetura & Design — "O mesmo dado, três versões diferentes da verdade"

## Título alternativo
- "Por que três definições do mesmo tipo são piores do que uma errada"

## Tese central

Duplicação de schema entre camadas (backend, admin, frontend) não é só "feio" — é um sistema que mente para o compilador. O post usa um caso real (o campo `e_popular`, tipado como `number` no backend e `boolean | 0 | 1` no admin) para explicar por que contratos de dados compartilhados deixam de ser nice-to-have a partir do momento em que três camadas independentes leem/escrevem o mesmo registro.

## Por que importa

Todo sistema com mais de uma camada de aplicação (a maioria dos sistemas reais) enfrenta essa escolha: compartilhar tipos ou duplicar. A maioria duplica "por enquanto" e nunca revisita. O post mostra como isso já tinha divergido de fato — não é risco hipotético, é bug latente documentado.

## Storytelling sugerido

Abra com o achado mais visualmente simples: uma tabela de 3 colunas (backend / admin / o que realmente está no banco) mostrando que `e_popular` é tratado de formas incompatíveis em dois lugares que conversam entre si todos os dias. Deixe o leitor sentir o "espera, isso devia ter quebrado" antes de explicar por que ainda não quebrou (sorte, não desenho). Depois, suba um nível: o segundo achado (Lambda morta `adminCategories` vs. `adminCategorias`) é a mesma doença em outro órgão — duplicação não-sincronizada, só que em código executável, não em tipo.

Fechamento: não é sobre culpa ("alguém esqueceu"), é sobre **o que acontece quando ninguém é o dono único da verdade do dado**. Gancho para o próximo post (Qualidade de Código): tipo `any` no `catch` é o mesmo problema, em miniatura, em todo lugar.

## Provas e exemplos reais

| Campo | `backend/src/common/types.ts:21` | `admin/src/types/index.ts:19` |
|---|---|---|
| `e_popular` | `number` | `boolean \| 0 \| 1` |
| `meta_titulo_seo` | opcional | obrigatório |
| `instagram_url` (Autor) | opcional | obrigatório |

- Frontend não tem tipo nenhum: `frontend/lib/api.ts` retorna `Promise<any>` em toda função; `PostCard.tsx`/`PostFooter.tsx` redefinem subsets ad-hoc do `Post`.
- `backend/src/functions/adminCategorias/` (93 linhas, vivo, referenciado em `build.js:7` e no Terraform) vs. `backend/src/functions/adminCategories/` (154 linhas, morto, schema antigo `CATEGORIES_TABLE`/`nome_exibicao`/`icone_fa`, CORS hardcoded `"*"`).
- Boilerplate de resposta HTTP (`headers`, `{statusCode, body, headers}`) copiado e colado em 10 Lambdas.
- `admin/src/views/EditorView.vue` (526 linhas) e `CategoriesView.vue` (503 linhas) sem extração de lógica em composables.

## Conceitos a explicar

- **Contrato de dados compartilhado**: uma única fonte de verdade para o formato de um tipo, consumida (não redefinida) por cada camada.
- **Type drift**: quando cópias do "mesmo" tipo divergem silenciosamente ao longo do tempo porque são editadas independentemente.
- **Código morto**: arquivo/função que existe no repositório mas não é executado em produção — risco porque parece vivo para quem lê.

## Estrutura sugerida (H2s)

1. O campo que significa duas coisas ao mesmo tempo
2. Por que isso ainda não quebrou (e por que isso não é tranquilizador)
3. A Lambda fantasma: duplicação em código executável
4. O preço real da duplicação: não é estética, é risco de edição
5. O que fazer diferente (pacote de tipos compartilhado, sem virar over-engineering)

## Fecho / CTA

Aponta para o post de Qualidade de Código como "o mesmo problema, escala menor, mais frequente".

## Fonte interna

`docs/auditoria-engenharia/01-arquitetura-e-design.md`
