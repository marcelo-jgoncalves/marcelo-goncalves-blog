# frontend — Blog Marcelo Gonçalves

Next.js 16 (App Router) + React 19, deployado via OpenNext v3 em AWS Lambda + CloudFront + S3 (não Vercel).

## Setup

```bash
npm install
cp .env.example .env.local   # preencher API_URL (já tem valor de dev funcional)
npm run dev                  # http://localhost:3000
```

## Stack real deste workspace

- **Fonte:** Inter (`--font-sans`, `--font-display`) + JetBrains Mono (`--font-mono`) via `next/font/google`. Nunca DM Sans nem Space Grotesk — removidas do projeto.
- **Deploy:** `npx open-next build` empacota um `.zip` de Lambda (`server-functions/default/`), sem relação com a plataforma Vercel.
- **Imagens:** nunca usar `<Image>` do Next.js para conteúdo de post — usar `<ResponsiveImage>` (`components/ui/ResponsiveImage.tsx`). Não há Lambda de image optimizer neste deploy.

## Scripts

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção (OpenNext)
npm run lint         # ESLint
npm test             # Jest (unit)
npm run test:e2e     # Playwright (e2e)
```

## Mais contexto

Ver `CLAUDE.md` e `contexto/contract.md` na raiz do monorepo.
