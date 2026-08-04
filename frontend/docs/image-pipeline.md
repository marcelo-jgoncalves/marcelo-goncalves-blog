# Pipeline de imagens

## Upload de conteúdo (posts)

- Formatos aceitos: PNG, JPEG, WebP, HEIC, HEIF. Extensões maiúsculas normalizadas automaticamente.
- `imageProcessor` (Lambda) gera 6 variantes por upload, gravadas no bucket `assets` sob `media/`: `{base}-480.avif`, `{base}-480.webp`, `{base}-768.avif`, `{base}-768.webp`, `{base}-1280.avif`, `{base}-1280.webp`.
- CloudFront roteia `media/*` → `S3-Assets` (bucket de assets estáticos, não o de uploads-raw).
- O pipeline de CD faz `aws s3 sync ... --exclude "media/*"` para preservar variantes entre deploys.
- Nunca renderizar imagem de conteúdo com `<Image>` do Next.js diretamente — sempre `<ResponsiveImage>` (`frontend/components/ui/ResponsiveImage.tsx`).
- `ResponsiveImage` sempre remove a extensão do `src` antes de usar como basePath (cobre URLs antigas do admin com `.webp` appended e novos basePaths sem extensão).
- `imagem_destaque_url` no DynamoDB: basePath sem extensão (posts novos) ou URL `.webp` legada — ambos funcionam via strip.
- Alt text nunca é string vazia — fallback mínimo é o título do post.

### Restrição estrutural

`/_next/image` retorna 404 para imagens locais (`src="/..."`) — não há Lambda de image optimizer neste deploy. Nunca usar `<Image>` do Next.js com `src` local; usar `<img>` com `unoptimized` ou CSS.

## Assets estáticos do site (logos, badges)

Categoria diferente de imagem: não vem de upload de usuário, é parte do código-fonte, muda raramente. Otimizada em build-time (script local), não em runtime — usar o `imageProcessor` para isso seria over-engineering.

- `scripts/optimize-static-images.mjs` (Sharp) gera 2 variantes por imagem — `{nome}-1x.{avif,webp}` e `{nome}-2x.{avif,webp}` — no tamanho de exibição real em CSS. Não usa breakpoints de viewport como o `ResponsiveImage`; o único eixo que importa é densidade de pixel (1x/2x retina).
- `assets-source/` (raiz do repo, fora de `frontend/public/`) guarda os PNGs originais de alta resolução — nunca comitar arquivo-fonte não otimizado dentro de `frontend/public/static/`, só o output do script.
- Fotos de pessoas/conteúdo continuam pelo fluxo normal de upload (`imageProcessor`), mesmo vindas de um arquivo local.

Um componente de consumo dedicado (`StaticPicture.tsx`) existiu e foi removido por estar órfão (nenhuma página real o usava). Se a seção de logos/badges do `/sobre` for implementada no futuro, recriar um componente equivalente antes de consumir essas variantes.
