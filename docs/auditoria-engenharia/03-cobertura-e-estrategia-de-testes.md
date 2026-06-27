# Auditoria de Engenharia — Critério 3: Cobertura e Estratégia de Testes

> Data: 2026-06-27
> Escopo: unit/integration/e2e por workspace, gaps de cobertura.
> Apenas análise — nenhum código foi alterado nesta etapa.

## Mapa de cobertura atual

| Workspace | Unit/Integration | E2E | Observação |
|---|---|---|---|
| backend | 8 arquivos de teste (Jest) cobrindo 6 de 9 Lambdas vivas + `logger` + `sanitizer` | — | 3 Lambdas vivas sem teste |
| frontend | 4 arquivos (Jest): `api.test.ts`, `ResponsiveImage.test.tsx`, `consent.test.ts`, `postUtils.test.ts` | 64 casos de teste (Playwright) em 9 grupos de rota: smoke, home-layout, post, artigos, busca, categoria, sobre, servicos, projeto | Unit fino, E2E forte |
| admin | 1 arquivo (Vitest): `api.test.ts` | 0 | Cobertura quase nula |

## 🔴 Achados de alto impacto

### 1. Admin (CMS) está praticamente sem testes

O único teste existente cobre a lógica de auth/retry do client HTTP (`services/api.ts`) — e é bem escrito (cobre refresh de token e 401 duplo, não só o caminho feliz). Mas **zero teste** cobre:
- `EditorView.vue` (526 linhas) — formulário de criação/edição de post, o fluxo mais crítico do CMS.
- `CategoriesView.vue` (503 linhas) — CRUD de categorias.
- `AuthorEditView.vue`, `DashboardView.vue`, `UploadModal.vue`.
- Store `auth.ts` (Pinia).
- Nenhum E2E no admin.

O admin é a superfície que **escreve diretamente em produção** (via `savePost`/sanitização). É o ponto de maior risco real (dado errado publicado, sanitização falhando, upload corrompido) e o de menor cobertura de todo o projeto.

### 2. 3 de 9 Lambdas vivas sem nenhum teste unitário

`getAuthor`, `adminAuthors` e `adminCategorias` não têm arquivo `.test.ts`. `adminCategorias` em particular é um endpoint de escrita (criar/editar/deletar categoria) sem nenhuma rede de segurança — mesma classe de risco do achado #1, no backend.

## 🟡 Achados de impacto médio

### 3. Meta de coverage (≥80%, definida no `contract.md`) não é aplicada em nenhum lugar

Não há `coverageThreshold` configurado em nenhum `jest.config`/`vitest.config` dos 3 workspaces. O número "≥80%" existe como aspiração documentada, mas nenhuma CI falha se a cobertura cair — não há enforcement.

### 4. Frontend: unit tests finos, mas compensados por E2E forte

Apenas 4 arquivos de teste unitário para ~70 arquivos de componente. Isoladamente pareceria um gap, mas a suíte E2E (64 casos, 9 grupos de rota) funciona como rede de regressão de facto para o frontend — para uma aplicação majoritariamente de apresentação (SSR/ISR, pouca lógica de estado client-side), isso é uma troca razoável e não precisa ser tratado com a mesma urgência dos achados #1 e #2.

## 🟢 Pontos positivos (manter)

- As Lambdas com teste cobrem exatamente os caminhos certos: `getPost`/`getPosts` (tráfego público de leitura), `adminPosts` (escrita mais crítica), `postScheduler` (lógica de agendamento), `imageProcessor`/`mediaUpload` (pipeline de imagem), `sanitizer` (segurança de conteúdo).
- E2E do frontend tem boa amplitude de rotas (9 grupos) — incomum para um projeto deste porte, geralmente é o primeiro tipo de teste a ser negligenciado.
- O teste existente do admin (`api.test.ts`) não é superficial — testa o caso de borda real (token expirado + retry), não só o happy path.

## Resumo

O risco de teste não está distribuído de forma uniforme: ele se concentra exatamente onde dados são **escritos** (admin e Lambdas de admin/escrita), não onde são lidos. Frontend de leitura pública está razoavelmente protegido por E2E; o caminho de escrita — admin completo + 3 Lambdas — está, na prática, sem rede de segurança automatizada.
