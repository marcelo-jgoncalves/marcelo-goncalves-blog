# CLAUDE.md — Blog Marcelo Gonçalves

> Carregado automaticamente em toda sessão. Leia antes de qualquer ação.

---

## 1. Contexto do Projeto

Blog de autoridade sobre IA, AWS e DevOps. Propósito: AdSense + leads para consultoria.  
**Owner:** Marcelo Gonçalves (PM/Arquiteto) — você é o Staff Engineer.

**Ambiente ativo:** apenas `dev`. Produção não existe ainda.  
**Branch de trabalho:** `develop` — todo trabalho vai aqui. `main` = snapshot estável.

### Sistema ao vivo (dev)
| Serviço | URL |
|---|---|
| Blog público | `https://dsns2wusdrj9z.cloudfront.net` |
| Admin Vue | `https://d11ubkpuy1di6r.cloudfront.net` |
| API Gateway | `https://5duus31al8.execute-api.us-east-1.amazonaws.com/v1` |
| Pipeline CD | GitHub Actions → develop ✅ verde |

### Arquivos de contexto obrigatórios
- **`.project-context.md`** — memória viva do projeto. Leia a seção "⚡ PRÓXIMA SESSÃO" ao iniciar.
- **`docs/contract.md`** — padrões de engenharia não-negociáveis (logging, SEO, design system, segurança).
- **`docs/audit-report.md`** — histórico de dívida técnica e o que foi resolvido.
- **`docs/seo-audit.md`** — status de 20 itens SEO (18/20 feitos).

---

## 2. Modo de Operação

Você atua como **Autonomous Staff Engineer**, não como assistente passivo.

- Marcelo fornece direção estratégica e decisões de produto.
- Você detecta problemas, planeja, implementa, valida e commita.
- Nunca acumule trabalho não validado. Um ciclo só termina quando: testes passam + pipeline verde + `.project-context.md` atualizado.
- Prefira muitos ciclos pequenos a mudanças grandes.

### Protocolo de início de sessão
1. Ler seção "⚡ PRÓXIMA SESSÃO" do `.project-context.md`
2. Se houver dúvida sobre estado real da infra, validar via AWS CLI (profile `claude-dev`)
3. Nunca assumir — sempre verificar

### Antes de qualquer commit
- Build passa
- Testes passam (`npm test` em cada workspace afetado)
- Lint/typecheck limpos
- Comportamento no browser validado (quando aplicável)
- `.project-context.md` atualizado se houver mudança arquitetural

---

## 3. Arquitetura

```
marcelo-goncalves-blog/
├── frontend/    # Next.js 16 + OpenNext v3 (blog público)
├── backend/     # Node.js 20 + TypeScript — 9 Lambdas
├── admin/       # Vue 3 + Vite + Pinia + AWS Amplify (CMS)
├── infra/       # Terraform — 7 módulos AWS
└── docs/        # Documentação viva do projeto
```

**AWS profile local:** `claude-dev` — SEMPRE usar este.  
**Terraform state:** `s3://marcelo-goncalves-blog-dev-tfstate/blog/terraform.tfstate`  
**CD automático:** push em `develop` dispara build → terraform apply → deploy completo.

---

## 4. Regras Críticas (quebrar = bug em produção)

### Next.js 16
- `params` é Promise — **sempre** `await params` antes de desestruturar em qualquer `page.tsx`.
- ISR: posts individuais `revalidate: 60`, listagens `revalidate: 300`, páginas estáticas `revalidate = 3600`.
- Toda nova `page.tsx` DEVE ter `generateMetadata()` com `title`, `description`, `alternates.canonical`, `openGraph`, `twitter`.

### OpenNext v3
- ZIP do Next.js: `frontend/.open-next/server-functions/default/` (PLURAL). `index.mjs` na raiz do ZIP.

### DynamoDB
- `e_popular` e `e_projeto` são `Number (0/1)` — não Boolean. Limitação de GSI.

### Backend (Lambdas)
- **Nunca** usar `console.log` — sempre `logger.info/debug/warn/error` de `backend/src/common/logger.ts`.
- Logs = JSON estruturado com `level`, `message`, `timestamp`, `requestId`.
- Sanitização HTML via `backend/src/common/sanitizer.ts` em `savePost()` — nunca persistir HTML bruto.
- Novas Lambdas: incluir `tracing_config { mode = local.xray_mode }` desde o primeiro commit.

### Sharp.js / Build
- `backend/build.js` usa `npm install --os=linux --cpu=x64`. **Não alterar.**
- No Windows: `build.js` usa `PowerShell Compress-Archive` (não `zip`).

### Variáveis de ambiente
- `API_URL` (sem prefixo `NEXT_PUBLIC_`): lida em runtime do `process.env` real da Lambda. `NEXT_PUBLIC_*` seria baked pelo Next.js/SWC no bundle em build time — não funciona para runtime injection.
- Admin (`VITE_*` vars): baked no build — o CD builda o admin **após** terraform apply outputs.

### Segurança / CORS
- Lambda URL: `authorization_type = "AWS_IAM"` + OAC SigV4. Só CloudFront pode invocar.
- `ADMIN_ORIGIN = "https://${module.admin.cloudfront_url}"` — definido via Terraform, não hardcoded.

### CloudFront / Assets estáticos
- Arquivos em `public/` (`.ico`, `.webmanifest`, `.png` root-level) **precisam de `ordered_cache_behavior` explícito** apontando para `S3-Assets` — o behavior padrão roteia tudo para Lambda (que não serve `public/`).
- `/_next/image` retorna 404 para imagens locais (`src="/..."`): não há Lambda de image optimizer neste deploy. Nunca usar `<Image>` Next.js com `src` local — usar `<img>` com `unoptimized` ou CSS.
- `app/favicon.ico` tem prioridade sobre `public/favicon.ico` no Next.js App Router.

### SEO — proteção dev
- `app/robots.ts` e `app/layout.tsx` detectam `SITE_URL.includes('cloudfront.net')` e emitem `Disallow: /` + `noindex, nofollow`.
- **Nunca remover** essa lógica sem confirmar que `SITE_URL` é o domínio definitivo.
- Toda constante de SEO vive em `frontend/lib/config.ts` — nunca repetir URL ou nome do blog em string literal.

---

## 5. Design System (não-negociável)

### Fontes
| Variável CSS | Fonte | Uso |
|---|---|---|
| `--font-display` | DM Sans | Headings, UI, botões, nav |
| `--font-sans` | Inter | Body, parágrafos |
| `--font-mono` | JetBrains Mono | Código |

**Nunca** usar `Space Grotesk` — foi removido.

### Paleta
```css
--accent: #3B5F8A        /* Classic Blue — CTA, links, ativo */
--accent-hover: #2D4F76
--accent-light: #EBF1F8
--accent-dark: #1E3A57   /* Navy profundo — ServiceCallout, service-proof-fullwidth */
--dark-900: #111827      /* Headings */
--dark-700: #374151      /* Body text */
--slate-50:  #F8FAFC     /* Page bg */
--border-color: #E2E8F0
```

**Nunca** usar `--aws-orange`, `--aws-dark`, `--gray-*` — foram removidos.  
Referência completa: `docs/design-system/design-reference.md`.  
Layout de referência da home: `docs/design-system/home-layout-description.md`.

**Footer usa `#1F2937`** (não `--dark-900`/`#111827`) — tom diferenciado do dark CTA.  
**AdSense:** usar flag `ADSENSE_CONFIGURED` em `AdsenseSidebar.tsx`, nunca `NODE_ENV` — em produção `NODE_ENV === 'production'` torna o bloco invisível.

### Escala de espaçamento (8px grid)
```css
--space-1:  8px   /* Micro: badges, gap inline */
--space-2:  16px  /* Pequeno: meta-row, margin ícone */
--space-3:  24px  /* Médio: gap cards, padding widgets sidebar */
--space-4:  40px  /* Grande: gap seção→grid, margin banners AdSense */
--space-5:  64px  /* Seção: padding vertical de layouts de conteúdo */
--space-6:  80px  /* Landmark: padding de PageHero, CTAs fullwidth */
--section-min-height: 384px  /* min-height de landmarks */
```

**Regra não-negociável:** componentes usam `--space-1` a `--space-4`. Seções de layout usam `--space-5` e `--space-6`. Nenhum CSS de componente deve ter padding vertical maior que `--space-4`.

### Logo
```
Marcelo    → color: var(--dark-900)  — DM Sans 700
Gonçalves  → color: var(--accent)   — DM Sans 700
```

---

## 6. Imagens (pipeline obrigatória)

- **Upload**: formatos aceitos = PNG, JPEG, WebP, HEIC, HEIF. Extensões maiúsculas normalizadas automaticamente.
- **imageProcessor** gera 6 variantes por upload e as grava no bucket `assets` sob `media/`: `{base}-480.avif`, `{base}-480.webp`, `{base}-768.avif`, `{base}-768.webp`, `{base}-1280.avif`, `{base}-1280.webp`.
- **CloudFront** `media/*` → `S3-Assets` (bucket de assets estáticos, não o uploads-raw).
- **CD pipeline**: `aws s3 sync ... --exclude "media/*"` para preservar variantes entre deploys.
- **Nunca** renderizar imagens de conteúdo com `<Image>` Next.js diretamente — sempre `<ResponsiveImage>` (`frontend/components/ui/ResponsiveImage.tsx`).
- **`ResponsiveImage`** sempre strip extensão do `src` antes de usar como basePath (cobre URLs antigas do admin com `.webp` appended e novos basePaths sem extensão).
- `imagem_destaque_url` no DynamoDB: basePath sem extensão (novos posts) ou URL `.webp` legada — ambos funcionam via strip.
- Alt text: nunca string vazia — fallback mínimo = título do post.

---

## 7. Testes

| Workspace | Runner | Comando | Total |
|---|---|---|---|
| `backend/` | Jest | `npm test` | 96 testes |
| `frontend/` | Jest | `npm test` | 45 testes |
| `admin/` | Vitest | `npm test` | 16 testes |
| `frontend/` | Playwright | `npm run test:e2e` | 7 testes (smoke + home-layout) |

- `tsconfig.test.json` separado no backend com `"types": ["jest"]`.
- `npm audit --audit-level=high` roda em cada job de CI. Zero high/critical tolerado.
- Admin: 11 moderate residuais em aws-amplify@6 — aceito como risco conhecido (fix exige downgrade breaking para v5).

---

## 8. Commits e Pipeline

**Conventional Commits** obrigatório:
```
feat: add X
fix: resolve Y
refactor: simplify Z
test: add tests for W
chore: update dependency
docs: update context
```

Após commit:
```bash
git push
gh run list   # verificar pipeline
```

Pipeline vermelha = trabalho incompleto. Investigar antes de continuar.

---

## 9. JSON-LD por tipo de página (obrigatório)

| Página | Schema |
|---|---|
| Layout (todas) | `Organization` + `WebSite` com `SearchAction` |
| `/post/[slug]` | `BlogPosting` + `BreadcrumbList` |
| `/categoria/[slug]` | `BreadcrumbList` |
| `/sobre` | `Person` |
| `/servicos` | `ProfessionalService` |
| Novas listagens | `BreadcrumbList` |

---

## 10. Backlog Atual

### Aguarda ação de Marcelo
1. **URLs sociais reais** — LinkedIn, GitHub, Instagram para footer e author box
2. ~~**Favicon + Web App Manifest**~~ ✅ Deployados sessão 16 — SEO agora 18/20
3. **Ferramenta de agendamento** — Calendly ou similar para CTA em /servicos
4. **`NEXT_PUBLIC_SITE_URL`** — configurar via Terraform quando o domínio definitivo estiver pronto
5. **Publisher ID AdSense** — quando ativo: `ADSENSE_CONFIGURED = true` em `AdsenseSidebar.tsx` + descomentar stub AdSense em `frontend/lib/consent.ts → loadScriptsByConsent()`
6. **AWS Support ticket** — elevar Lambda concurrent executions de 10 → 1000
7. **Conteúdo definitivo LGPD** — preencher placeholders em `/politica-de-privacidade`, `/politica-de-cookies` e `/termos-de-uso`
8. **Google Analytics** — quando GA4 configurado, descomentar stub analytics em `frontend/lib/consent.ts → loadScriptsByConsent()` com `G-XXXXXXXXXX` real

### Notas de pipeline (não-negociável)
- **Static assets S3 sync sem `--delete`** — arquivos Next.js têm hash de conteúdo; `--delete` causa race condition com 403 pós-deploy. Manter apenas no admin SPA.
- **Semgrep** (`security.yml`) roda em todo push para `develop`/`main` — não remover.
- **Dependabot** abre PRs toda segunda — revisar e mergear regularmente para manter deps atualizadas.

### Admin CMS — padrões obrigatórios
- **Editor rich text:** usar `RichTextEditor` (Tiptap, já instalado em `admin/src/components/tiptap/`). `QuillEditor` (`@vueup/vue-quill`) **não está instalado** — não usar.
- **Toasts:** todos os feedbacks de ação via `showToast(msg, type)` — nunca `alert()` ou `window.confirm()` (exceto para guards de navegação).
- **Dirty state:** formulários de edição devem rastrear mudanças com `JSON.stringify` snapshot + `onBeforeRouteLeave` guard.
- **Tipos centralizados:** `admin/src/types/index.ts` — Post, Categoria, Autor, PostStatus. Não redefinir inline.
- **Slug:** usar `slugify()` de `admin/src/utils/slug.ts` — não duplicar a lógica.

### CMP — Consent Management (padrões obrigatórios)
- **Consent Mode v2:** `<Script strategy="beforeInteractive">` em `layout.tsx` seta `ad_storage/analytics_storage: denied` ANTES de qualquer script de ads. **Nunca remover.**
- **Storage:** `localStorage['cmp_consent_v1']` com campos `{ essential, analytics, ads, timestamp, version }`. `CONSENT_VERSION` em `frontend/lib/consent.ts` — incrementar invalida consents antigos.
- **Script loader:** stubs comentados em `loadScriptsByConsent()` — descomentar para AdSense e Analytics quando configurados. `Set<string>` previne double-inject.
- **Event bus Footer→Modal:** Footer dispara `window.dispatchEvent(new CustomEvent('openConsentModal'))`. `ConsentManager` ouve. Não usar prop drilling.
- **Páginas legais:** `/politica-de-privacidade`, `/politica-de-cookies`, `/termos-de-uso` — CSS compartilhado em `frontend/app/legal.css`. Conteúdo definitivo aguarda Marcelo.
- **Testes:** `frontend/__tests__/consent.test.ts` com `@jest-environment jsdom` — 17 testes cobrindo storage, versioning e gtag Consent Mode.

### Componentes de layout reutilizáveis (padrões obrigatórios)
- **`Pagination`** — componente único em artigos e o-projeto. Deve ficar **fora** do grid de duas colunas (entre `</grid>` e `<NewsletterCTA />`). Botão "← Anterior" funciona sem `totalPages` via cursor stack. "Página X de Y" só aparece quando `totalPages` é passado.
- **`BlogSidebar`** — props: `showPopularPosts` (default true), `showNewsletter` (default true). Children renderizam no topo (área dinâmica). Ordem fixa: children → PopularPostsWidget → AdsenseSidebar → NewsletterWidget.
- **`home-main` (flex column)** — usar `gap: var(--space-4)` + `margin: 0` nos banners. NUNCA combinar gap + margin nos banners — causa duplo espaçamento e margin collapsing em seções vazias.

### Próximas entregas técnicas
9. **Testes E2E Playwright** — expandir cobertura: post individual, artigos, busca, categoria
10. **SEO residual** — links sociais reais (#16) e agendamento (#18) — dependem de Marcelo
11. **LQIP (blur placeholder)** — campo novo no DynamoDB + imageProcessor salva base64 tiny
12. **CMP — validar no browser** — testar incognito, DevTools → Application → Storage → `cmp_consent_v1`

### Performance — pendentes da auditoria (sessão 18)
13. **GSI projections KEYS_ONLY/INCLUDE** — 5 GSIs com `projection_type = "ALL"` duplicam `conteudo_html`. Fix requer recriar tabela. Fazer com volume real de posts.
14. **getPostsByCategory: Limit + FilterExpression** — baixo impacto agora, cresce com rascunhos em categorias.
15. **CloudFront `static/*` TTL explícito** — adicionar `default_ttl`/`max_ttl` por consistência.
16. **Full-text search (OpenSearch/Algolia)** — searchPosts é full table scan O(n). Avaliar com 500+ posts.

### Baixa prioridade
17. ~~Paginação bidirecional~~ ✅ Implementada em artigos e o-projeto
18. WAF no Admin CloudFront — quando houver tráfego real
19. Cognito: migrar `ALLOW_USER_PASSWORD_AUTH` → SRP
20. Preview de imagens no admin (upload pipeline já existe)

---

## 11. Dependências Críticas

| Componente | Versão | Notas |
|---|---|---|
| Next.js | ^16.2.4 | `params` é Promise — `await params` |
| OpenNext | ^3.1.3 | Output: `server-functions/default/` (PLURAL) |
| Tiptap | 2.11.0 | Fixado em v2 — **não migrar para v3** |
| AWS Amplify | ^6.15.8 | Auth via `aws-amplify/auth` |
| Sharp | ^0.33.2 | Build com `--os=linux --cpu=x64` |
| esbuild | ^0.27.0 | `format: 'cjs'` obrigatório |
| Terraform | ~1.14 | State no S3 |
| Node.js Actions | — | `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` (deadline Jun 2026) |
