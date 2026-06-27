# Auditoria de Engenharia — Critério 1: Arquitetura & Design

> Data: 2026-06-27
> Escopo: acoplamento entre camadas, separação de responsabilidades, padrões consistentes entre frontend/backend/admin.
> Apenas análise — nenhum código foi alterado nesta etapa.

## 🔴 Achados de alto impacto

### 1. Contrato de dados duplicado e divergente entre backend/admin/frontend

Não existe um pacote de tipos compartilhado. O `Post` está definido **3 vezes**, sincronizado manualmente, e já divergiu:

| Campo | `backend/src/common/types.ts:21` | `admin/src/types/index.ts:19` |
|---|---|---|
| `e_popular` | `number` (regra: GSI exige 0/1) | `boolean \| 0 \| 1` |
| `meta_titulo_seo` | opcional | obrigatório |
| `instagram_url` (Autor) | opcional | obrigatório |

O frontend não tem tipo nenhum — `frontend/lib/api.ts` retorna `Promise<any>` em todas as funções, e os componentes (`PostCard.tsx`, `PostFooter.tsx`) redefinem subsets ad-hoc do `Post`. Resultado: o compilador não pega quebra de contrato entre as 3 camadas.

**Recomendação:** pacote `packages/shared-types` (ou gerar o tipo do admin/frontend a partir do backend) antes que o volume de campos cresça mais.

### 2. Lambda morta e divergente em produção de código

Existem **dois** diretórios para a mesma responsabilidade:
- `backend/src/functions/adminCategorias/` (93 linhas, PT) — é o que `build.js:7` empacota e o Terraform deploya (confirmado via `infra/modules/lambda/main.tf`).
- `backend/src/functions/adminCategories/` (154 linhas, EN) — **não referenciado em nenhum lugar** (nem build, nem Terraform).

O arquivo morto usa schema antigo (`CATEGORIES_TABLE`, campos `nome_exibicao`/`icone_fa` que não existem mais no modelo atual) e CORS hardcoded em `"*"`.

**Risco:** um próximo dev (ou IA) editar o arquivo errado pensando que é o código vivo.

**Recomendação:** deletar `backend/src/functions/adminCategories/`.

## 🟡 Achados de impacto médio

### 3. Boilerplate de resposta HTTP duplicado em 10 Lambdas

O objeto `headers` de CORS e o padrão `{ statusCode, body: JSON.stringify(...), headers }` é copiado e colado em todas as 10 functions. Não há uma camada `common/http.ts` com helpers como `ok()`, `notFound()`, `error()`. Pequeno hoje, mas cada novo endpoint paga esse custo de cópia — e qualquer mudança de política CORS exige editar 10 arquivos.

### 4. Lambdas misturam roteamento + regra de negócio + acesso a dados num único arquivo

Ex: `backend/src/functions/adminPosts/index.ts` tem handler HTTP, validação, sanitização e chamada DynamoDB no mesmo arquivo/função. Para o tamanho atual do projeto isso é **aceitável** (CRUD simples, 1 dev) — não se recomenda introduzir camadas service/repository agora (seria over-engineering). É o primeiro lugar que vai doer se a lógica de negócio crescer (ex: regras de agendamento, workflow de revisão).

### 5. Componentes Vue grandes sem extração de lógica

`admin/src/views/EditorView.vue` (526 linhas) e `admin/src/views/CategoriesView.vue` (503 linhas) concentram template + estado + chamadas de API + validação. Nenhum uso de composables (`useXxx.ts`) no admin para extrair lógica reutilizável. Funciona, mas dificulta teste unitário (hoje admin tem só 1 arquivo de teste).

## 🟢 Pontos positivos (manter)

- Separação clara por workspace (frontend/backend/admin/infra) com responsabilidades bem definidas.
- Backend usa um único client DynamoDB compartilhado (`backend/src/common/dynamodb.ts`) com X-Ray opt-in — bom padrão de instrumentação centralizada.
- Sanitização HTML centralizada em `backend/src/common/sanitizer.ts` e efetivamente chamada no `savePost` — não há atalho.
- Convenção de nomenclatura de campos (`snake_case` em português) é consistente dentro do domínio, ainda que não tipada entre camadas.

## Resumo

Arquitetura é adequada ao estágio do projeto (sem over-engineering), mas tem um gap real de **type-safety entre camadas** (achado #1) e um item de **higiene de repositório** fácil de resolver (achado #2, é só deletar).
