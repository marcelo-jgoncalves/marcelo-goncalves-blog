# Auditoria de Engenharia — Critério 2: Qualidade de Código

> Data: 2026-06-27
> Escopo: duplicação, complexidade, nomenclatura, aderência a `docs/contract.md`.
> Apenas análise — nenhum código foi alterado nesta etapa.

`docs/contract.md` define como não-negociável: "lint automático", "tipagem consistente", "zero código morto", "zero TODO permanente", coverage ≥ 80%. Os achados abaixo comparam o estado real do código contra esse padrão que o próprio projeto definiu.

## 🔴 Achados de alto impacto

### 1. Backend não tem lint configurado

`backend/package.json` não tem script `lint`, não há `.eslintrc`/`eslint.config.*`, e `eslint` não está nas dependências. Frontend (`next lint`) e admin (`eslint . --fix --cache`) têm lint funcional; o backend (10 Lambdas, lógica de negócio + acesso a dados) não tem nenhuma análise estática além do `tsc` do build. Isso contradiz diretamente o item "lint automático" do `contract.md`.

**Recomendação:** adicionar ESLint ao backend (flat config compartilhável com o padrão do frontend/admin).

### 2. Uso de `any` disperso, especialmente no tratamento de erro do backend

Contagem de `: any`/`as any`:

| Workspace | Ocorrências | Arquivos |
|---|---|---|
| backend/src | 22 | 14 |
| admin/src | 11 | 7 |
| frontend | 7 | 6 |

Destaque: `catch (error: any)` está copiado e colado em **9 das 10** Lambdas (`adminAuthors`, `adminCategorias`, `adminCategories`, `adminPosts`, `getAuthor`, `getPost`, `getPosts`, `mediaUpload`, `postScheduler`). Isso é o mesmo padrão de duplicação já identificado no critério 1 (boilerplate de resposta HTTP), agora visto pelo ângulo de tipagem — contradiz "tipagem consistente" do `contract.md`. TypeScript moderno tipa `catch` como `unknown` por padrão; o `any` explícito desliga essa proteção em todos os handlers.

## 🟡 Achados de impacto médio

### 3. Lint existe mas não é executado em CI

Nenhum workflow em `.github/workflows/*.yml` menciona `lint` (confirmado via busca). Mesmo onde o script existe e funciona (frontend, admin), nada impede um PR de mergear com lint quebrado — o gate só funciona se o dev lembrar de rodar localmente.

**Recomendação:** adicionar etapa de lint no `deploy.yml` (PR validator) para os 3 workspaces, frontend e admin primeiro (já têm script pronto), backend depois do achado #1 ser resolvido.

### 4. Prettier configurado em apenas 1 dos 3 workspaces

Só `admin/.prettierrc.json` existe. Frontend e backend não têm formatação automática configurada — hoje não é um problema visível (1 dev, sem diffs de estilo conflitantes), mas é uma lacuna se o time crescer.

## 🟢 Pontos positivos (manter)

- TypeScript `strict: true` confirmado nos 3 workspaces (backend, frontend, admin via `@vue/tsconfig`).
- Logging do backend é 100% aderente à regra "nunca `console.log`" — única exceção é o arquivo morto `adminCategories/` (já reportado no critério 1), o que reforça que é código não-vivo.
- Nenhum TODO/FIXME real de débito técnico encontrado. Os únicos hits de busca foram placeholders intencionais (`ca-pub-XXXXXXXXXXXXXXXX`, `G-XXXXXXXXXX`) dentro de stubs comentados do CMP, já documentados e rastreados no backlog do `CLAUDE.md` (itens #5 e #8) — não é dívida técnica oculta.
- Nomenclatura de domínio (campos em português, `snake_case`) é consistente em todo o código vivo.

## Resumo

O backend é o ponto mais frágil deste critério: zero lint configurado e o padrão de `catch (error: any)` repetido 9x sem tipagem. Frontend e admin estão em melhor situação (lint funcional), mas nenhum dos três tem o gate de lint rodando em CI — ou seja, mesmo a proteção que existe hoje depende de disciplina manual, não de automação.
