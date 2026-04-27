# Auditoria SEO — IA Decifrada Blog
> Gerado em: 2026-04-27 | Auditor: Claude (Staff Engineer)  
> Base: Next.js 16 App Router — frontend/

---

## Resumo Executivo

O projeto tem uma base sólida — semantic HTML correto, JSON-LD em posts individuais, OpenGraph nos posts, imagens otimizadas com Next/Image. O gap crítico está nos **três arquivos técnicos ausentes** (sitemap, robots.txt, OG image dinâmica) que são pré-requisitos para qualquer estratégia de descoberta orgânica séria. Resolvê-los é a maior alavanca disponível agora.

**Score atual estimado (Lighthouse SEO):** 65–75/100  
**Score alvo pós-correções:** 95+/100

---

## Inventário: O Que Está Bom ✅

| Item | Localização | Detalhe |
|------|-------------|---------|
| JSON-LD BlogPosting | `app/post/[slug]/page.tsx` | headline, description, image, datePublished, dateModified, author |
| OpenGraph completo | `app/post/[slug]/page.tsx` | title, description, type: article, publishedTime, authors, images |
| Schema.org/Person microdata | `components/ui/AuthorBox.tsx` | itemScope, itemProp: name, image, description, autor rel nos links |
| Semantic HTML | Todo o projeto | article, nav, main, header, footer, section corretamente usados |
| next/image otimizado | PostCard, post/[slug] | alt text descritivo, sizes responsive, priority no LCP |
| Heading hierarchy | Todas as pages | H1 único por página, H2/H3 estruturados |
| `lang="pt-BR"` | `app/layout.tsx` | Correto para indexação regional |
| Web fonts com display: swap | `app/layout.tsx` | Inter + Space Grotesk — não bloqueia LCP |
| Skip link acessibilidade | `components/ui/SkipLink.tsx` | Aponta para `#main-content` |
| aria-labels e landmarks | Header, nav, paginação, busca | Bem cobertos |
| noindex em /busca | `app/busca/page.tsx` | `robots: 'noindex, follow'` — correto |
| ISR configurado | maioria das pages | revalidate = 60 ou 3600 |
| Security headers | `next.config.ts` | X-Frame-Options, X-Content-Type, Referrer-Policy |
| Cursor-based pagination | `components/ui/Pagination.tsx` | Melhor que offset para SEO |
| TOC com anchor links | `components/ui/TOC.tsx` | H2s com IDs slugificados, mobile + desktop |
| generateMetadata dinâmico | /post/[slug], /categoria/[slug], /artigos, /busca | Presentes e corretos |

---

## Problemas por Prioridade

### 🔴 CRÍTICO — Blockers de indexação

#### C1 — Sitemap dinâmico ausente
- **Arquivo esperado:** `frontend/app/sitemap.ts`
- **Status:** Não existe
- **Impacto:** Googlebot descobre posts apenas por links internos (lento). Com milhares de posts futuros, muitos nunca serão crawleados.
- **Fix:** Implementar `app/sitemap.ts` com posts + categorias + páginas estáticas. Next.js App Router gera `sitemap.xml` automaticamente na build.

#### C2 — robots.txt ausente
- **Arquivo esperado:** `frontend/public/robots.txt` ou `frontend/app/robots.ts`
- **Status:** Não existe
- **Impacto:** Googlebot usa comportamento default (indexa tudo). A rota `/busca` tem `noindex` na metadata mas sem robots.txt explícito o comportamento pode variar por crawler.
- **Fix:** Criar `app/robots.ts` com `Allow: /`, `Disallow: /busca`, `Sitemap:` apontando para a URL do sitemap.

#### C3 — OG Image dinâmica ausente
- **Arquivo esperado:** `frontend/app/post/[slug]/opengraph-image.tsx`
- **Status:** Posts têm `imagem_destaque_url` no OpenGraph mas é uma URL de imagem de conteúdo (pode não existir ou ter proporção errada). Sem `opengraph-image.tsx`, o fallback do Next.js pode não gerar nada válido.
- **Impacto:** Posts compartilhados no LinkedIn/X/WhatsApp aparecem sem preview visual → CTR baixo.
- **Fix:** Implementar `app/post/[slug]/opengraph-image.tsx` usando `ImageResponse` do Next.js com título, nome do autor e branding do blog. Tamanho padrão: 1200×630.

#### C4 — Home sem generateMetadata dinâmico
- **Arquivo:** `frontend/app/page.tsx`
- **Status:** Usa apenas o metadata estático do `layout.tsx` — `title: "IA Decifrada | Marcelo Gonçalves"`, `description: "Blog de autoridade..."`.
- **Impacto:** O `<title>` da home no SERP fica genérico. Não há controle de Open Graph específico para a home.
- **Fix:** Adicionar `export const metadata: Metadata = { ... }` em `app/page.tsx` com título, description, openGraph e twitter cards específicos da home.

---

### 🟡 ALTO — Impacto significativo de ranking e UX

#### A1 — Sem Organization / WebSite schema na home
- **Status:** Não implementado
- **Impacto:** Google não consegue criar um Knowledge Panel para o blog. Busca pelo nome "IA Decifrada" pode não mostrar sitelinks.
- **Fix:** Adicionar JSON-LD `Organization` + `WebSite` (com `SearchAction` para busca interna) no `layout.tsx` ou `app/page.tsx`.

#### A2 — Sem BreadcrumbList schema em posts e categorias
- **Status:** Não implementado
- **Impacto:** Perda de breadcrumb snippets no SERP (resultado visual com hierarquia de navegação).
- **Fix:** Adicionar JSON-LD `BreadcrumbList` em `app/post/[slug]/page.tsx` e `app/categoria/[slug]/page.tsx`.

#### A3 — Paginação sem rel="next" / rel="prev"
- **Componente:** `components/ui/Pagination.tsx`
- **Status:** Links Next/Previous existem no componente mas sem atributo `rel`.
- **Impacto:** Google não entende que `/artigos?nextToken=xxx` é a continuação de `/artigos` — pode não consolidar o link equity corretamente.
- **Fix:** Adicionar `rel="next"` e `rel="prev"` nos links do componente Pagination.

#### A4 — Revalidate ausente em páginas estáticas
- **Páginas:** `app/o-projeto/page.tsx`, `app/servicos/page.tsx`
- **Status:** Sem `export const revalidate` — Next.js aplica comportamento default (pode variar).
- **Fix:** Adicionar `export const revalidate = 3600` (1 hora) para páginas que mudam raramente.

#### A5 — ISR muito agressivo nos endpoints de listagem
- **Arquivos:** `lib/api.ts` — revalidate de 60s em getRecentPosts, getAllPosts, getPostsByCategory
- **Impacto:** Posts novos aparecem rápido (bom), mas gera pressão desnecessária no Lambda se o blog não publica conteúdo com frequência alta.
- **Recomendação:** 300s (5 min) para recentes, 600s (10 min) para categoria, 60s apenas para o post individual recém-publicado.

#### A6 — RSS Feed ausente
- **Status:** Não implementado
- **Impacto:** Sem feed, o blog não pode ser descoberto por agregadores, leitores RSS ou outros blogs que fazem curadoria. É um canal de distribuição orgânica gratuito.
- **Fix:** Implementar `app/feed.xml/route.ts` como Route Handler gerando RSS 2.0 com os 20 posts mais recentes.

#### A7 — Canonical URL não configurada explicitamente
- **Status:** Next.js gera canonical automático baseado na URL, mas não está sendo definido explicitamente via `alternates.canonical` no `generateMetadata`.
- **Risco:** Se o blog for acessado por múltiplas URLs (CloudFront URL direta vs. domínio próprio futuro), pode haver conteúdo duplicado.
- **Fix:** Adicionar `alternates: { canonical: 'https://www.dominio.com/post/slug' }` no `generateMetadata` dos posts.

---

### 🟠 MÉDIO — Melhorias de qualidade

#### M1 — Links sociais no footer são placeholders (#)
- **Componente:** `components/layout/Footer.tsx`
- **Status:** Links para LinkedIn, GitHub, Instagram apontam para `"#"`
- **Impacto:** Links quebrados que Googlebot segue e encontra loop — prejudica crawl budget.
- **Fix:** Configurar as URLs reais ou remover os links até que estejam disponíveis.

#### M2 — Imagem de destaque com alt text potencialmente vazio
- **Arquivo:** `app/post/[slug]/page.tsx`
- **Código:** `alt={imagem_destaque_alt_text || ""}`
- **Impacto:** Se o campo `imagem_destaque_alt_text` não for preenchido no admin, a imagem principal do post fica sem descrição para screen readers e Googlebot.
- **Fix:** Fallback para `alt={imagem_destaque_alt_text || post.titulo}` — usa o título do post como alt text mínimo.

#### M3 — Metadados da página /sobre hardcoded
- **Arquivo:** `app/sobre/page.tsx`
- **Status:** `title` e `description` são strings fixas no arquivo — nome do autor hardcoded.
- **Impacto:** Se o nome ou bio do autor mudar na API, a metadata fica desatualizada.
- **Fix:** Converter para `generateMetadata()` buscando dados do autor via `getAuthor()`.

#### M4 — Sem favicon/apple-touch-icon configurados
- **Pasta:** `public/` — contém apenas SVGs de placeholder Next.js
- **Status:** Nenhum `favicon.ico`, `apple-touch-icon.png` ou `icon.svg` real
- **Impacto:** Browser e Google Search Console usam ícone default. Não aparece em bookmarks ou PWA.
- **Fix:** Adicionar `public/favicon.ico`, `app/icon.png` (512×512) e `app/apple-icon.png` (180×180).

#### M5 — Sem Web App Manifest
- **Status:** Não implementado
- **Impacto:** Blog não pode ser instalado como PWA. Sem controle de `theme_color` e `background_color` para barra de status mobile.
- **Fix:** Criar `app/manifest.ts` com name, short_name, icons, theme_color.

#### M6 — Twitter/X Card type não especificado
- **Arquivo:** `app/post/[slug]/page.tsx`
- **Status:** OpenGraph está correto mas falta o bloco `twitter:` na metadata.
- **Fix:** Adicionar `twitter: { card: 'summary_large_image', creator: '@handle' }` no `generateMetadata` dos posts.

#### M7 — Sem structured data para Serviços (/servicos)
- **Status:** A página de serviços não tem schema `Service` ou `LocalBusiness`
- **Oportunidade:** Schema `ProfessionalService` ou `Offer` poderia gerar rich results para a página de consultoria.

#### M8 — Link para #calendar na página /servicos é placeholder
- **Arquivo:** `app/servicos/page.tsx`
- **Status:** CTA de agendamento aponta para `#calendar` que não existe
- **Impacto:** Link morto — Googlebot e usuários chegam a anchor inexistente

---

### 🟢 MENOR — Polish e otimizações finas

#### P1 — Syntax highlighting pode bloquear renderização
- **Arquivo:** `lib/postUtils.tsx`
- **Status:** Shiki processa code blocks de forma síncrona no servidor
- **Recomendação:** Verificar se o processamento está dentro do fetch boundary (deve estar, pois é Server Component)

#### P2 — Injeção de ads pode quebrar hierarquia semântica
- **Arquivo:** `lib/postUtils.tsx`
- **Status:** Ads são injetados via string manipulation no HTML
- **Risco:** Se um H2 aparecer logo antes ou depois do ponto de injeção, a estrutura semântica pode ficar estranha para leitores de screen reader

#### P3 — `<figure>` captions não tratados para SEO
- **Status:** Se o conteúdo dos posts tiver `<figure><figcaption>`, o cheerio processa mas não adiciona schema específico
- **Oportunidade:** Figcaptions são lidos pelo Googlebot como contexto da imagem — garantir que estejam no HTML final

#### P4 — Revalidate de posts individuais
- **Arquivo:** `app/post/[slug]/page.tsx`
- **Status:** Sem revalidate explícito — herda do layout
- **Fix:** Adicionar `export const revalidate = 3600` — posts raramente mudam após publicação

---

## Backlog Priorizado

| # | Tarefa | Prioridade | Esforço | Impacto SEO |
|---|--------|-----------|---------|-------------|
| 1 | `app/sitemap.ts` dinâmico | 🔴 CRÍTICO | Médio | Descoberta de todos os posts |
| 2 | `app/robots.ts` | 🔴 CRÍTICO | Baixo | Controle de crawl |
| 3 | OG Image dinâmica (`opengraph-image.tsx`) | 🔴 CRÍTICO | Médio | CTR em redes sociais |
| 4 | metadata em `app/page.tsx` (home) | 🔴 CRÍTICO | Baixo | SERP da home |
| 5 | Organization + WebSite JSON-LD | 🟡 ALTO | Baixo | Knowledge Panel |
| 6 | BreadcrumbList JSON-LD em posts/categorias | 🟡 ALTO | Baixo | Rich results no SERP |
| 7 | RSS Feed (`app/feed.xml/route.ts`) | 🟡 ALTO | Médio | Distribuição orgânica |
| 8 | Twitter Card metadata em posts | 🟡 ALTO | Baixo | CTR no X/Twitter |
| 9 | Canonical URL explícito em posts | 🟡 ALTO | Baixo | Previne conteúdo duplicado |
| 10 | rel="next"/"prev" na paginação | 🟡 ALTO | Baixo | Link equity entre páginas |
| 11 | revalidate em o-projeto e servicos | 🟡 ALTO | Baixo | Cache previsível |
| 12 | Favicon + apple-touch-icon reais | 🟠 MÉDIO | Baixo | Branding + PWA |
| 13 | alt text fallback para imagem de destaque | 🟠 MÉDIO | Baixo | Acessibilidade + Googlebot |
| 14 | generateMetadata dinâmico em /sobre | 🟠 MÉDIO | Baixo | Metadata atualizada via API |
| 15 | Web App Manifest | 🟠 MÉDIO | Baixo | PWA / mobile branding |
| 16 | Corrigir links sociais do footer (#) | 🟠 MÉDIO | Baixo | Crawl budget |
| 17 | Schema Service/Offer em /servicos | 🟠 MÉDIO | Médio | Rich results p/ consultoria |
| 18 | Corrigir link #calendar em /servicos | 🟠 MÉDIO | Baixo | UX + crawlability |
| 19 | ISR tuning (60s → 300s em listagens) | 🟢 MENOR | Baixo | Custo Lambda |
| 20 | revalidate explícito em /post/[slug] | 🟢 MENOR | Baixo | Cache previsível |

---

## Dados disponíveis na API (referência para implementação)

**Post:** `slug`, `titulo`, `resumo`, `imagem_destaque_url`, `imagem_destaque_alt_text`, `data_publicacao`, `data_atualizacao`, `tempo_leitura_min`, `autor_id`, `categoria_slug`, `categoria.nome_exibicao`

**Autor:** `nome_exibicao`, `foto_avatar_url`, `bio`, `linkedin_url`, `github_url`, `instagram_url`

**Categorias disponíveis (CATEGORY_META no frontend):**  
`inteligencia-artificial`, `cloud-computing`, `devops-automacao`, `seguranca-na-nuvem`, `engenharia-de-software`, `noticias-e-mercado`, `tutoriais-aws`

---

## Progresso das Correções

| # | Tarefa | Status | Data |
|---|--------|--------|------|
| 1 | sitemap.ts | ⏳ pendente | — |
| 2 | robots.ts | ⏳ pendente | — |
| 3 | OG Image dinâmica | ⏳ pendente | — |
| 4 | metadata home | ⏳ pendente | — |
| 5 | Organization JSON-LD | ⏳ pendente | — |
| 6 | BreadcrumbList JSON-LD | ⏳ pendente | — |
| 7 | RSS Feed | ⏳ pendente | — |
| 8 | Twitter Card | ⏳ pendente | — |
| 9 | Canonical URLs | ⏳ pendente | — |
| 10 | rel next/prev | ⏳ pendente | — |
| 11 | revalidate estáticas | ⏳ pendente | — |
| 12 | Favicon real | ⏳ pendente | — |
| 13 | alt text fallback | ⏳ pendente | — |
| 14 | /sobre generateMetadata | ⏳ pendente | — |
| 15 | Manifest | ⏳ pendente | — |
| 16 | Footer links sociais | ⏳ pendente | — |
| 17 | Schema /servicos | ⏳ pendente | — |
| 18 | Link #calendar | ⏳ pendente | — |
| 19 | ISR tuning | ⏳ pendente | — |
| 20 | revalidate /post/[slug] | ⏳ pendente | — |
