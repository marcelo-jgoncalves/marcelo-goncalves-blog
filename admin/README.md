# admin — CMS do Blog Marcelo Gonçalves

Vue 3 + Vite + Pinia + AWS Amplify (Auth via Cognito). SPA deployada em S3 + CloudFront.

## Setup

```bash
npm install
cp .env.example .env.local   # ver instruções dentro do arquivo para obter os valores de Cognito
npm run dev                  # http://localhost:5173
```

## Variáveis de ambiente necessárias

Ver `.env.example` — `VITE_API_BASE_URL`, `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_ASSETS_URL`. Sem as duas variáveis de Cognito, o Amplify Auth não inicializa.

## Stack real deste workspace

- **Editor rich text:** `RichTextEditor` (Tiptap v2.11.0 — fixado, não migrar para v3).
- **Toasts:** sempre `showToast(msg, type)` — nunca `alert()`/`window.confirm()`.
- **Slug:** sempre `slugify()` de `src/utils/slug.ts`.
- **Tipos centralizados:** `src/types/index.ts` — não redefinir `Post`/`Categoria`/`Autor` inline.

## Scripts

```bash
npm run dev          # servidor de desenvolvimento (Vite)
npm run build        # type-check + build de produção
npm run lint         # ESLint
npm test             # Vitest
```

## Mais contexto

Ver `CLAUDE.md` e `docs/contract.md` na raiz do monorepo.
