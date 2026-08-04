# SEO

## Proteção do ambiente dev

`app/robots.ts` e `app/layout.tsx` detectam `SITE_URL.includes('cloudfront.net')` e emitem `Disallow: /` + `noindex, nofollow`. Nunca remover essa lógica sem confirmar que `SITE_URL` é o domínio definitivo (produção real).

Toda constante de SEO vive em `frontend/lib/config.ts` — nunca repetir URL ou nome do blog em string literal.

## JSON-LD por tipo de página

| Página | Schema |
|---|---|
| Layout (todas) | `Organization` + `WebSite` com `SearchAction` |
| `/post/[slug]` | `BlogPosting` + `BreadcrumbList` |
| `/categoria/[slug]` | `BreadcrumbList` |
| `/sobre` | `Person` |
| As 4 landings de pilar | `ProfessionalService` (escopado a cada pilar) |
| Novas listagens | `BreadcrumbList` |

Toda nova página pública precisa respeitar esta matriz antes de ir ao ar.

## `generateMetadata()`

Toda nova `page.tsx` deve ter `generateMetadata()` com `title`, `description`, `alternates.canonical`, `openGraph`, `twitter`.

## Copy voltado ao usuário

Sem travessão (`—`/`–`) em título, meta description, OG ou JSON-LD — trocar por vírgula, dois-pontos ou `|` (mesma regra de `docs/engineering/standards/code-conventions.md`).

## Status

Não há auditoria de SEO corrente mantida como documento vivo. A última existente (`seo-audit.md`, 2026-04-27) ficou desatualizada em relação a decisões posteriores do projeto (ex.: citava `next/image` para conteúdo e a fonte Space Grotesk, ambos descontinuados) e foi arquivada como registro histórico em `marcelo-goncalves-blog-arquivo/docs-historico/seo-audit.md` — não usar como referência de estado atual. Este documento (matriz de JSON-LD, proteção dev, `generateMetadata()`) é a fonte corrente.
