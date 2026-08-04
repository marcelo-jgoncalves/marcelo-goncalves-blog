# Visão geral da arquitetura

> last_verified: 2026-08-04

## Componentes

```
mgoncalves-editorial-platform/
├── frontend/    # Next.js 16 + OpenNext (blog público + site institucional)
├── backend/     # Node.js + TypeScript — Lambdas serverless
├── admin/       # Vue 3 + Vite + Pinia + AWS Amplify (CMS)
├── infra/       # Terraform — módulos AWS
└── docs/        # Documentação viva do projeto
```

## Responsabilidades

- **`frontend/`**: renderiza o site público (Home institucional, blog, páginas de pilar, contato) via SSR/ISR na Lambda, servido por CloudFront.
- **`backend/`**: Lambdas que implementam a API pública e o BFF do admin — leitura/escrita de posts, categorias, autores, processamento de imagem, agendamento de publicação, reconciliação de contadores.
- **`admin/`**: SPA de CMS para o autor único do blog, autenticado via Cognito, servida por sua própria distribuição CloudFront.
- **`infra/`**: todo o provisionamento AWS via Terraform, state em S3, aplicado exclusivamente pelo pipeline de CD.

## Fronteiras e fluxos principais

Diagramas detalhados (visão geral, leitura pública, BFF do admin, pipeline assíncrono de mídia, observabilidade) estão em `docs/architecture/*.svg`/`*.png`.

Fluxos de integração específicos (autenticação, pipeline de imagens, cache/invalidação CloudFront) estão documentados próximos ao componente que os implementa — ver `frontend/docs/image-pipeline.md` e os READMEs de `backend/`, `admin/` e `infra/`.

## Invariantes críticos transversais

Gotchas que atravessam mais de um componente, não são facilmente descobertos no código, e cuja violação tem alto risco. Detalhes de cada dependência específica ficam próximos do componente que a usa (README do componente); aqui só o invariante em si.

- **Next.js 16 — `params` é Promise**: sempre `await params` antes de desestruturar em qualquer `page.tsx`. ISR: posts individuais `revalidate: 60`, listagens `revalidate: 300`, páginas estáticas `revalidate = 3600`.
- **OpenNext**: ZIP do Next.js em `frontend/.open-next/server-functions/default/` (plural), `index.mjs` na raiz do ZIP.
- **DynamoDB**: `e_popular`/`e_projeto` são `Number (0/1)`, não Boolean — limitação de GSI.
- **Backend (Lambdas)**: nunca `console.log` — sempre `logger.info/debug/warn/error` de `backend/src/common/logger.ts` (JSON estruturado com `level`/`message`/`timestamp`/`requestId`). Sanitização HTML via `backend/src/common/sanitizer.ts` em `savePost()` — nunca persistir HTML bruto. Novas Lambdas incluem `tracing_config { mode = local.xray_mode }` desde o primeiro commit.
- **Sharp.js/Build**: `backend/build.js` usa `npm install --os=linux --cpu=x64` — não alterar. No Windows, usa `PowerShell Compress-Archive` em vez de `zip`.
- **Variáveis de ambiente**: `API_URL` (sem prefixo `NEXT_PUBLIC_`) é lida em runtime do `process.env` real da Lambda — `NEXT_PUBLIC_*` seria baked pelo Next.js/SWC no bundle em build time, não funciona para runtime injection. Admin (`VITE_*`) é baked no build; o CD builda o admin depois do `terraform apply` gerar os outputs.
- **Segurança/CORS**: Lambda URL usa `authorization_type = "AWS_IAM"` + OAC SigV4 — só CloudFront pode invocar. `ADMIN_ORIGIN` é definido via Terraform, nunca hardcoded.
- **CloudFront/assets estáticos**: arquivos em `public/` (`.ico`, `.webmanifest`, `.png` root-level) precisam de `ordered_cache_behavior` explícito apontando para `S3-Assets` — o behavior padrão roteia tudo para a Lambda, que não serve `public/`. `app/favicon.ico` tem prioridade sobre `public/favicon.ico`.
- **SEO — proteção dev**: `app/robots.ts`/`app/layout.tsx` emitem `Disallow: /` + `noindex, nofollow` quando `SITE_URL` contém `cloudfront.net`. Nunca remover sem confirmar que `SITE_URL` é o domínio definitivo (ver `frontend/docs/seo.md`).

## Fatos deriváveis (não duplicar aqui)

Número de Lambdas, módulos Terraform, versões de dependências e contagens de teste mudam com frequência maior do que este documento é revisado — consulte o código, `package.json`/lockfiles, Terraform e os workflows de CI diretamente. Ver `docs/README.md` para o mapa completo de onde cada fato vive.
