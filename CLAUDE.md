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

### Protocolos de Feedback (Sessão 35+) — CRÍTICO

**3 regras estabelecidas com Marcelo (2026-05-22):**

1. **Analysis vs Action** — Quando solicitado análise:
   - Ler código/arquivos, extrair dados, apresentar achados
   - NUNCA modificar código na análise
   - Ação requer instrução explícita ("mude", "aplique", "fix", etc.)

2. **Questions Only Answer** — Quando perguntado algo:
   - Responder a pergunta especificamente
   - NÃO assumir ações adicionais
   - NÃO tomar ação baseada na resposta

3. **Incremental Investigation Protocol** — Ao debugar problemas:
   - **ANTES:** Estado atual + modelo mental + hipótese + mudança mínima + teste
   - **DEPOIS:** Resultado + diferença vs esperado
   - **APRENDIZADO:** Modelo mental atualizado + por que falhou + próxima hipótese
   - Documentar em `ACTIVE_INVESTIGATIONS.md`

Ver `memory/` para referência completa (`feedback_*.md`).

### Regra de Bash — UMA operação por chamada (CRÍTICO)

Nunca usar `&&`, `||`, `;`, `$()`, `&` final ou `>` em um único comando Bash — dispara prompt de permissão mesmo com `bypassPermissions` ativo.

| Padrão proibido | Padrão correto |
|---|---|
| `cd "..." && npm run dev` | Chamada 1: `cd "..."` / Chamada 2: `npm run dev` |
| `cd "..." && npm test` | Chamada 1: `cd "..."` / Chamada 2: `npm test` |
| `cd "..." && terraform plan` | Chamada 1: `cd "..."` / Chamada 2: `terraform plan` |
| `sleep 8 && curl ...` | Chamada 1: `sleep 8` / Chamada 2: `curl ...` |
| `npm run dev > file.log &` | Chamada com `run_in_background: true`, sem `&` e sem `>` |
| `cmd1 && cmd2 && cmd3` | 3 chamadas separadas |

Ver `memory/feedback_bash_commands.md` para todos os padrões com exemplos.

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
| `--font-display` | Inter | Headings, UI, botões, nav |
| `--font-sans` | Inter | Body, parágrafos |
| `--font-mono` | JetBrains Mono | Código |

**Nunca** usar `Space Grotesk` ou `DM Sans` — foram removidos do frontend e do admin.

### Paleta base
```css
--accent: #3B5F8A        /* Classic Blue — CTA, links, ativo, eyebrow lines */
--accent-hover: #2D4F76
--accent-light: #EBF1F8
--accent-dark: #1E3A57   /* Navy profundo — ServiceCallout, service-proof-fullwidth */
--accent-10: rgba(59, 95, 138, 0.10)  /* frames subtis, hovers, box H2 */
--accent-18: rgba(59, 95, 138, 0.18)  /* bordas de tag */
--dark-900: #111827      /* Headings global (fora do tema warm) */
--dark-700: #374151      /* Body text global */
--slate-50:  #F8FAFC     /* bg fallback */
--border-color: #E2E8F0
```

### Sistema editorial (sessão 30) — cores semânticas
```css
/* Superfícies */
--surface-page:     #EEF3FA;  /* fundo das páginas */
--surface-elevated: #E6EEF8;  /* hero/nav — levemente mais escuro */
--surface-card:     #F5F8FC;  /* cards e widgets — degrau acima da página */
--surface-inset:    #E0ECF7;  /* th, tint de callout warning */

/* Bordas */
--border-subtle:  #DDE8F3;   /* separadores internos leves */
--border-default: #C8D9EE;   /* = --dark-warm-border — bordas padrão de cards */
--border-strong:  #A3BDD9;   /* inputs enfatizados */

/* Texto semântico */
--text-ghost:   rgba(30, 55, 76, 0.40);  /* placeholder, disabled */
--text-muted:   rgba(30, 55, 76, 0.65);  /* = --dark-warm-muted */
--text-body:    rgba(30, 55, 76, 0.80);  /* = --dark-warm-body */
--text-default: #1E374C;                 /* navy — TODOS os headings e títulos de card */
--text-heading: #3B5F8A;                 /* = --accent */

/* Links de conteúdo editorial */
--link:       #3182CE;   /* links dentro de artigos */
--link-hover: #1E374C;   /* hover → navy */

/* Neumorphism — elevação soft (base: #EEF3FA) */
--neu-raised:  8px 8px 20px rgba(59,95,138,0.10), -8px -8px 20px rgba(255,255,255,0.80);
--neu-soft:    4px 4px 12px rgba(59,95,138,0.08), -4px -4px 12px rgba(255,255,255,0.70);
--neu-subtle:  2px 2px 8px  rgba(59,95,138,0.06), -2px -2px 8px  rgba(255,255,255,0.60);
--neu-inset:   inset 3px 3px 8px rgba(59,95,138,0.10), inset -3px -3px 8px rgba(255,255,255,0.70);

/* Coral scale — NewsletterCTA */
--coral: #E89B8E;  --coral-light: #F2B0A4;  --coral-pale: #F0CCC4;  --coral-muted: #B47D72;

/* Tema warm / post page */
--bg-warm: #EEF3FA;  --bg-warm-strong: #E6EEF8;  /* paleta azul-fria */
--accent-warm: #da7b26;   /* amber — ícones meta */
--dark-warm: #1E374C;     /* navy — texto primário (= --text-default) */
--dark-warm-border:    #C8D9EE;               /* borda padrão do projeto */
--dark-warm-separator: rgba(30, 55, 76, 0.12);
--dark-warm-muted:     rgba(30, 55, 76, 0.65);
--dark-warm-body:      rgba(30, 55, 76, 0.80);

/* Code theme */
--code-inline-bg: #edf2f7   --code-inline-color: #d53f8c
--code-header-bg: #19212c   --code-header-text:  #a0aec0

/* Callout semantic */
--callout-info-text: #2c5282   --callout-warning-text: #744210
```

**Regra de reserva da cor accent:** `var(--accent)` = `#3B5F8A` é usado **apenas** para:
- Box numerador H2 (background sólido via `--accent-10`)
- TOC item ativo (border-left + texto claro)
- Links editoriais de conteúdo
- Eyebrow lines (`::before`)
- CTAs, botões e tags de categoria
**Nunca** usar `--accent` em cor de título/heading — usar `--text-default` (#1E374C navy).

**Nunca** usar `--aws-orange`, `--aws-dark`, `--gray-*` — foram removidos do frontend e do admin.  
Referência completa: `docs/design-system/design-reference.md`.  
Layout de referência da home: `docs/design-system/home-layout-description.md`.

**Footer usa `#1F2937`** (não `--dark-900`/`#111827`) — tom diferenciado do dark CTA.  
**AdSense:** usar flag `ADSENSE_CONFIGURED` em `AdsenseSidebar.tsx`, nunca `NODE_ENV` — em produção `NODE_ENV === 'production'` torna o bloco invisível.

### Escala tipográfica (9 tokens — base 18px frontend / 16px admin)
```css
--text-xs:    0.75rem;   /* tags, badges, meta tiny */
--text-sm:    0.875rem;  /* meta, código, eyebrow, copyright */
--text-base:  1rem;      /* corpo (body padrão) */
--text-lg:    1.125rem;  /* lead, subtítulo, nav, input, descrições */
--text-xl:    1.5rem;    /* h4, card titles, widget headers, TOC */
--text-2xl:   2rem;      /* h3, h2 editorial (post, sobre, serviços) */
--text-2-5xl: 2.25rem;   /* h2 seção de postagem (match protótipo) */
--text-3xl:   2.8rem;    /* h1 heroes — tamanho preferido do projeto */
--text-4xl:   3.5rem;    /* h1 artigo (máximo editorial) */
```
**Nunca** usar valores de font-size ad-hoc — sempre um dos tokens acima.  
Exceção permitida: `14px` para código inline (sub-pixel preciso) e `0.9375rem` para código desktop.

### Escala de espaçamento (10 tokens, 8px grid — ritmo-vertical-contract.md)
```css
--space-1:       8px   /* Micro: badges, gap inline, eyebrow→título widget */
--space-2:       16px  /* Pequeno: meta-row, margin ícone */
--space-3:       24px  /* Médio: padding interno de card, título→descrição widget */
--space-4:       32px  /* Grande: gap widgets sidebar, título→lista/botões widget */
--space-content: 40px  /* Corpo: gap parágrafos, eyebrow→conteúdo, badge→H1 */
--space-5:       48px  /* Macro: gap coluna/sidebar, margin-bottom post-card */
--space-6:       64px  /* Landmark: padding vertical de seções */
--space-breath:  80px  /* Respiro: hero-pb, meta→imagem, separação de blocos */
--space-7:       96px  /* Editorial: entre seções H2, hero-pt */
--space-epic:    112px /* Épico: transição conteúdo→autor no post */
--section-min-height: 384px
```

**Regra global:** `section { margin-block: var(--space-6) }` aplicada em `globals.css`.  
**Exceções obrigatórias** (`margin-block: 0`): `PageHero`, `PageCTA`, `SuperDestaque`, `TechRibbon` e qualquer seção fullwidth com padding próprio.  
**Sidebars:** filhos diretos com `margin-block: 0` — `gap` do flex é o único responsável pelo ritmo entre widgets. Gap entre widgets = `var(--space-4)` (32px).  
**Ritmo interno de widget sidebar:** eyebrow → título = `--space-1` (8px); título → corpo/lista = `--space-4` (32px); corpo → botões = `--space-4` (32px).  
**Colunas editoriais** (home-main, op-articles-feed, op-timeline-feed): sections com `margin-block: var(--space-4)` = 32px (sobrescreve global); banners com `margin: var(--space-4)`; primeiro filho sempre `margin-top: 0`.

### Logo
```
Marcelo    → color: var(--dark-900)  — DM Sans 700
Gonçalves  → color: var(--accent)   — DM Sans 700
```

### CSS Modules vs. CSS global (regra decidida em 2026-06-29)

- **Componente novo a partir de agora → `.module.css`.** Evita colisão de nome de classe (sem garantia de tooling hoje — convenção de prefixo manual `sobre-*`/`op-*`/`pc-*`/`post-*` depende de disciplina, não de compilador) e dá uma rede de segurança mínima contra typo (`styles.foo` inexistente vira `undefined`, em vez de uma string solta que silenciosamente não estiliza nada).
- **CSS existente (177 arquivos `.css` globais) → não migrar retroativamente.** Custo real (reescrever seletores `:nth-child`/descendentes que cruzam elementos, ex. `.sobre-tc-item:nth-child(1) .sobre-tc-logo`, com risco de regressão visual em todas as páginas) maior que o ganho (proteção contra um problema que a convenção de prefixo já mitiga na prática). Só editar um arquivo `.css` existente se já estiver tocando naquele componente por outro motivo — não é proibido, só não é prioridade isolada.
- Variáveis CSS (`--accent`, `--space-*` etc.) continuam globais em `globals.css` independente da escolha — CSS Modules não as afeta, só escopa classes/ids.
- Os 2 arquivos que já eram `.module.css` antes desta regra (`PostFooter.module.css`, `ShareRail.module.css`) foram a motivação original — escolha pontual de quem escreveu, nunca formalizada até agora.

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

### Assets estáticos do site (logos, badges) — pipeline separada (sessão 2026-06-29)

Categoria diferente de imagem: não vem de upload de usuário, é parte do código-fonte, muda raramente. Por isso é otimizada em **build-time** (script local), não em runtime (Lambda) — usar o `imageProcessor` pra isso seria over-engineering.

- **`scripts/optimize-static-images.mjs`** (Sharp, mesmo pacote do `imageProcessor`) gera 2 variantes por imagem — `{nome}-1x.{avif,webp}` e `{nome}-2x.{avif,webp}` — no tamanho de exibição real em CSS (largura para badges quadrados, altura para logos retangulares). **Não** usa breakpoints de viewport (480/768/1280) como o `ResponsiveImage` — esses elementos têm tamanho fixo em CSS em qualquer largura de tela; o único eixo que importa é densidade de pixel (1x/2x retina).
- **`frontend/components/ui/StaticPicture.tsx`** consome essas variantes via `<picture>` com `srcSet` de densidade (`1x, 2x`), AVIF→WebP fallback, `loading="lazy"`. Usar para qualquer logo/badge estático — nunca `<img>` puro com PNG direto.
- **`assets-source/`** (raiz do repo, fora de `frontend/public/`) guarda os PNGs originais de alta resolução — nunca comitar arquivo-fonte não otimizado dentro de `frontend/public/static/`, só o output do script.
- Fotos de pessoas/conteúdo (avatar, hero) continuam pelo fluxo normal de upload (`imageProcessor`) mesmo se vierem de um arquivo local — sobem direto pro bucket `uploads-raw` (mesma convenção de key do admin: `{YYYY}/{MM}/{DD}/{timestamp}-{random}-{nome}`) em vez de virar asset estático.

---

## 7. Testes

| Workspace | Runner | Comando | Total |
|---|---|---|---|
| `backend/` | Jest | `npm test` | 96 testes |
| `frontend/` | Jest | `npm test` | 45 testes |
| `admin/` | Vitest | `npm test` | 16 testes |
| `frontend/` | Playwright | `npm run test:e2e` | 37 testes (smoke, home-layout, post, artigos, busca, categoria) |

- `tsconfig.test.json` separado no backend com `"types": ["jest"]`.
- `npm audit --audit-level=high` roda em cada job de CI. Zero high/critical tolerado.
- Admin: 0 vulnerabilidades (resolvido via `npm audit fix` sem --force, incluindo `shell-quote` critical).
- Backend: 19 moderate residuais (js-yaml via jest/istanbul, dev-only) — aceito como risco conhecido (fix exige downgrade breaking de ts-jest).
- Frontend: 22 moderate residuais (esbuild/open-next, js-yaml/ts-jest, postcss/next) — aceito como risco conhecido (fix exigiria downgrade para next@9 ou open-next@0.0.1, inviável).

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
- **Cache-Control `immutable` em `public/`** — o S3 sync aplica `max-age=31536000, immutable` em todos os assets. Correto para `_next/static/**` (hashed), mas arquivos de `public/` (ex: imagens sem hash no nome) ficam cacheados no browser por 1 ano. Workaround imediato: hard-refresh (Ctrl+Shift+R). Fix pendente (#20 backlog): separar o sync em dois passos.
- **Semgrep** (`security.yml`) roda em todo push para `develop`/`main` — não remover.
- **Dependabot** abre PRs toda segunda — revisar e mergear regularmente para manter deps atualizadas.

### Admin CMS — padrões obrigatórios
- **Design system unificado:** admin usa os mesmos tokens do frontend — `--accent`, `--dark-900`, `--slate-*`, `--border-color`, `--font-display:'DM Sans'`, `--font-sans:'Inter'`, `--text-*`, `--space-*`. Definidos em `admin/src/assets/main.css`. **Nunca** usar `--aws-orange`, `--aws-dark`, `--gray-*` ou Space Grotesk no admin.
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
- **`BlogSidebar`** — props: `showPopularPosts` (default true), `showNewsletter` (default true). Children renderizam no topo (área dinâmica). Ordem fixa: children → PopularPostsWidget → AdsenseSidebar → NewsletterWidget. Gap entre widgets = `var(--space-4)` (32px). Sticky top = `calc(var(--space-7) + var(--space-4))` = 128px.
- **`ShareWidget`** — sidebar widget com `background: var(--accent)` e botões glass. Props: `title`, `slug`. Client component. **Removido da sidebar da post page** (sessão 30) — `ShareButtons` no rodapé da coluna principal permanece.
- **`NewsletterSidebarWidget`** — sidebar widget com `background: var(--accent)` azul, texto cream, formulário (e-mail + checkbox LGPD + botão). Client component. CSS em `NewsletterSidebarWidget.css`.
- **`home-main` (flex column)** — usar `gap: var(--space-4)` + `margin: 0` nos banners. NUNCA combinar gap + margin nos banners — causa duplo espaçamento e margin collapsing em seções vazias.
- **`FullwidthCallout`** — componente único para CTAs fullwidth e inline. Props: `variant` (light/gradient/newsletter/dark/navy), `border`, `size` (md/lg), `rounded` (border-radius 14px — uso dentro de container), `maxWidth`, `icon`, `iconVariant` (light/dark), `title: ReactNode`, `description`, `href`/`ctaText`/`ctaVariant`. `SuperDestaque` e `PageCTA` são thin wrappers sobre ele. **Nunca criar nova seção CTA manualmente** — usar este componente. CTA fullwidth de página = `variant="dark"`; CTA inline dentro de container = `variant="navy" rounded`.
- **Grid de 2 colunas (sidebar)** — padrão obrigatório em todas as páginas: `grid-template-columns: 1fr var(--sidebar-width); gap: var(--space-4)`. `--sidebar-width: 340px` definido em globals.css. **Nunca usar `minmax`** para a coluna da sidebar — causa largura inconsistente em telas largas.
- **`PostCard`** (sessão 30) — `<Link>` wrapper direto, sem `<article>` intermediário. Background `var(--surface-card)`, `border-radius: 20px`, `box-shadow: var(--neu-raised)`. Sem imagem, sem meta row, sem categoria overlay. Título: navy → hover accent. CTA "Ler artigo →" com `margin-top: auto`.
- **Post page `h2` numeração** — feita via CSS counter (`counter-reset` em `.post-content`, `::before` com `decimal-leading-zero`). Box: `48×48px, background: var(--accent-10), border-radius: 16px, color: var(--accent)`. Não requer mudança no Tiptap nem no TSX.
- **`AuthorBox`** — card dark com `background: var(--dark-warm)` = `#1E374C` (navy), avatar quadrado `border-radius: 24px`, eyebrow "Sobre o autor" `font-mono`, `::before` blob azul `blur(60px)`. TSX não muda — só CSS.
- **`TOC` desktop** — container `background: #1E374C` navy, `::before` blob azul como AuthorBox. Eyebrow em `rgba(138,180,232,0.90)`. Items default `#ffffff`; item ativo `rgba(138,180,232,0.90)` + `border-left: 2px solid` mesma cor.
- **`RelatedPostsSection`** (sessão 30) — posicionada DENTRO de `post-footer-safe-zone` após `<AuthorBox>`. 4 posts em grid `repeat(2,1fr)`. Cards: `surface-card` + `neu-raised`, sem imagem.
- **Eyebrows de widgets** — padrão único: traço `::before` (`width: 24px; height: 1px; background: currentColor`) + texto uppercase, `font-size: var(--text-sm)`, `font-weight: 400`. Sem pill/badge.
- **`NewsletterCTA`** — fullwidth com `background: var(--accent)`, overlay `::before` (ember + navy gradients). Grid 2 colunas: texto (eyebrow, H2 cream + `<em>` navy, desc, stats) + form (input cream, botão coral `#E89B8E`). Reescrito baseado em `prot-pre-footer-CTAs.html` opção D.

### Próximas entregas técnicas
9. **Testes E2E Playwright** — expandir cobertura: post individual, artigos, busca, categoria
10. **SEO residual** — links sociais reais (#16) e agendamento (#18) — dependem de Marcelo
11. **LQIP (blur placeholder)** — campo novo no DynamoDB + imageProcessor salva base64 tiny
12. **CMP — validar no browser** — testar incognito, DevTools → Application → Storage → `cmp_consent_v1`

### Performance — pendentes da auditoria (sessão 18)
13. ~~GSI projections KEYS_ONLY/INCLUDE~~ ✅ **resolvido** (2026-06-28) — as 5 GSIs (`StatusPorData`, `CategoriaPorData`, `ProjetoPorData_v2`, `PopularesPorData_v2`, `StatusProgramadoPorData`) trocaram `projection_type = "ALL"` por `"INCLUDE"` em `infra/modules/dynamodb/main.tf`. `non_key_attributes` de cada uma foi extraído dos consumidores reais (queries em `getPosts`/`adminPosts`/`postScheduler` + componentes de listagem do frontend, ver `docs/investigacao-dynamodb.md`) — nenhuma das 5 precisa de `conteudo_html` (o maior campo, motivo original do achado), `meta_titulo_seo/descricao_seo`, `subtitulo`, `topico` ou `variante_card`. Nenhuma mudança de código em backend/frontend foi necessária (queries não declaram `ProjectionExpression` próprio, exceto `adminPosts`/`postScheduler`, que já pediam exatamente os campos agora incluídos). Não foi necessário recriar a tabela — confirmado via `terraform plan`: a tabela é atualizada in-place; só as 5 GSIs são deletadas e recriadas (mesmas keys, projection nova), com backfill automático da AWS a partir dos itens existentes. 145 testes backend passando.
14. **getPostsByCategory: Limit + FilterExpression** — baixo impacto agora, cresce com rascunhos em categorias.
15. ~~CloudFront `static/*` TTL explícito~~ ✅ **já implementado** — confirmado em código (`infra/modules/frontend/cloudfront.tf:277-279`, `default_ttl`/`max_ttl` explícitos). Item estava desatualizado no backlog; corrigido na auditoria de performance dedicada (sessão 2026-06-28).
16. **Full-text search (Algolia)** — searchPosts é full table scan O(n). Estratégia decidida (Algolia, não OpenSearch — custo fixo de cluster injustificável para este volume). Plano completo em `docs/plano-busca-algolia.md`. **Sem gatilho de volume** (decisão 2026-06-28) — entra na fila de prioridades de implementação, não espera 500+ posts.

### Performance — pendentes da auditoria dedicada (`docs/auditoria-performance/`, sessão 2026-06-28)
21. 🟡 **PRIORIDADE MÁXIMA — `nextjs-server` Duration variável (793ms-1.892ms)** — causa raiz não confirmada (cold start? efeito de `provisioned_concurrency=0` em dev?). Correlacionado 1:1 com LCP médio real fora do threshold "Good" do Core Web Vitals (2.74s, medido via Lighthouse real) **e** com FCP (mesmo TTFB alimenta os dois — runs com `server-response-time` pior, ex. 1.820ms, têm o FCP mais alto entre as 8 execuções reais). Elevado a prioridade máxima em 2026-06-28 (Marcelo) — antes de subir produção e antes de publicar posts reais para validação. SEO/Core Web Vitals é critério de negócio explícito. **Causa raiz parcial encontrada e corrigida em 2026-06-29:** `/post/[slug]` nunca tinha `generateStaticParams` — a rota nunca entrava no sistema de ISR do Next.js, então `export const revalidate = 60` era um no-op silencioso; toda visita era SSR puro, sem possibilidade de cache no CloudFront (`Cache-Control: no-store`, `X-Cache: Miss` em 100% das requisições, confirmado via curl + `prerender-manifest.json` com `dynamicRoutes: []`). Corrigido (`generateStaticParams` enumerando os 13 slugs publicados via `getAllPosts`); validado em produção pós-deploy: `Cache-Control: s-maxage=60` + `X-Cache: RefreshHit from cloudfront` + mesmo `x-amzn-RequestId` repetido em requisições consecutivas (Lambda não é mais reinvocado a cada hit). No caminho, achado e corrigido um bug ativo não relacionado: a policy IAM do `getPosts` não tinha `dynamodb:GetItem` (faltou ao introduzir `postCounters.ts` no item #22), causando 500 silencioso em `/artigos`/`/o-projeto` — ver commit `37b6de7`. **Ainda pendente:** `/artigos` e `/categoria/[slug]` continuam sem cache (leem `searchParams` para paginação, o que força SSR dinâmico independente de `revalidate` — ver item #27). Rebaixado de 🔴 pra 🟡 porque a página de post (a mais visitada/auditada) já está resolvida. **Lighthouse real re-rodado em 2026-06-29** (`docs/auditoria-performance/04-perf-cwv-pos-fix-isr.md`): em `/post/[slug]` (única página tocada pelo fix), TTFB pior-caso caiu de 1.820ms pra 1.053ms (-42%) e LCP médio de 2.70s pra 2.37s (-12%, cruzando pra dentro do threshold "Good" ≤2.5s em 2 das 3 execuções vs. 1 das 3 antes); `/` e `/artigos` (grupo de controle, não tocados) ficaram dentro da mesma faixa de ruído de antes — confirma que a melhora é causada pelo fix, não coincidência. TBT alto pontual (341ms num run) fica como possível próximo passo, fora do escopo desta rodada.
22. ~~`getAllPosts`/`getProjectPosts`: query duplicada de `COUNT`~~ ✅ **resolvido** — decisão do Marcelo (2026-06-28): manter "Página X de Y" e aplicar a melhor prática (contador atômico), não trocar por paginação sem contagem total. Implementado: `backend/src/common/postCounters.ts` mantém `total_publicado`/`total_projeto_publicado` num item de metadata (`slug = "__METADATA__#posts_counters"`, sparse — não aparece em nenhuma GSI nem na busca). Atualizado via `ADD` atômico em 3 pontos de escrita: `adminPosts.savePost`/`deletePost` (delta calculado a partir do estado anterior, lido via `GetCommand` antes do overwrite) e `postScheduler.publishPost` (transição Programado→Publicado). `getAllPosts`/`getProjectPosts` agora leem o contador via `GetCommand` (1 RCU) em vez de uma 2ª `Query` na GSI inteira. Backfill inicial rodado via `scripts/backfill-post-counters.mjs` (13/13 confirmado contra os dados reais de dev). 145 testes backend passando (+ novos testes de `postCounters.test.ts` e dos 3 pontos de escrita).
23. **Contador atômico (`postCounters.ts`) sem job de reconciliação** — a correção do item #22 depende de todo caminho de escrita que muda `status`/`e_projeto` chamar `computeCounterDeltas`/`applyCounterDeltas`. Hoje isso é garantido só por levantamento manual (`grep` confirmou nesta sessão que só `adminPosts`/`postScheduler` tocam esses campos na tabela `posts`, `imageProcessor` só escreve LQIP) + testes que fixam o comportamento dos 3 pontos atuais — **não há nenhum mecanismo estrutural que impeça um futuro 4º caminho de escrita (nova Lambda, script de bulk-import) de esquecer de atualizar o contador**, nem um job que detecte divergência depois que ela acontecer. Falta: job de reconciliação periódico (recontar via Scan/Query real e comparar com `total_publicado`/`total_projeto_publicado`, alertando ou autocorrigindo se divergir). **Decisão (2026-06-28, `docs/investigacao-dynamodb.md` ponto 4):** usar cron + Lambda (mesmo padrão de `postScheduler`/EventBridge), não DynamoDB Streams — Streams resolveria o problema na raiz, mas introduziria um padrão arquitetural novo no projeto para um risco hoje teórico (só 2 Lambdas escrevem `status`/`e_projeto`); reavaliar se esse número crescer. O job seria, na prática, agendar `scripts/backfill-post-counters.mjs` (já faz exatamente o recálculo necessário). Tratar futuramente.
26. ~~Habilitar PITR (Point-in-Time Recovery) no DynamoDB — só em produção~~ ✅ **toggle implementado** (2026-06-28) — confirmado via `aws dynamodb describe-continuous-backups` (`docs/investigacao-dynamodb.md` ponto 2): `PointInTimeRecoveryStatus: DISABLED` em dev, correto por decisão explícita do Marcelo, PITR não deve ser ativado em dev. Variável `enable_point_in_time_recovery` criada seguindo exatamente o mesmo padrão de `enable_xray_tracing`/`enable_guardduty`: declarada em `infra/variables.tf` e em `infra/modules/dynamodb/main.tf`, passada via `module "dynamodb"` em `infra/main.tf`, bloco `point_in_time_recovery { enabled = var.enable_point_in_time_recovery }` adicionado nas 3 tabelas (`posts`/`autores`/`categorias`). `dev.tfvars` = `false` (mantém estado atual), `prd.tfvars` = `true`. `terraform fmt`/`validate` confirmados limpos (apply é só via pipeline). Falta apenas: ambiente de produção ser criado e a pipeline aplicar — nenhuma ação local pendente. Custo real quando ativo: ~$0.20/GB-mês em `us-east-1`.
24. ~~**~22-29 KiB de JavaScript não utilizado no bundle do frontend**~~ ✅ **investigado (2026-06-29)** — `ANALYZE=true npx next build --webpack` + inspeção módulo-a-módulo dos 4 chunks principais: o achado literal do Lighthouse (`unused-javascript`) é overhead inerente do runtime React/Next (RSC client runtime, segment cache, server-action-reducer) — não é código removível. **Achado real adjacente, corrigido:** FontAwesome era importado via `@fortawesome/fontawesome-free/css/all.min.css` (CSS de ~2000 ícones, 74KB) para apenas ~22 ícones usados no projeto; além disso `optimizePackageImports` apontava pro pacote CSS (inerte, nunca importado via JS). Migrado para componentes SVG (`@fortawesome/react-fontawesome` + `free-{solid,regular,brands}-svg-icons`), com `config.autoAddCss = false` + import estático de `fontawesome-svg-core/styles.css` (33.2KB, utilitário só — sem glifos). Medido: 22 ícones distintos usados somam 14.7KB de SVG inline (tree-shaken, só os ícones de cada página entram no bundle daquela rota) vs 74KB de CSS bloqueante carregado em 100% das páginas antes — webfonts (`.woff2` solid/regular/brands) também eliminados por completo (zero `@font-face`). Caso especial não-React (`CopyCodeLogic.tsx`, manipulação de DOM puro) usa a API vanilla `icon(faX).html.join('')`. Caso especial de prop dinâmica (`FullwidthCallout.tsx`, `icon="fa-envelope"` string) resolvido via `ICON_MAP` fechado. 16 arquivos de componente/página convertidos; CSS com seletor `i` → `svg` em 5 arquivos (`post.css`, `Breadcrumb.css`, `ShareButtons.css`, `ShareWidget.css`, `SystemStatus.css`). `@next/bundle-analyzer` permanece em `next.config.ts` gated por `ANALYZE=true` para auditorias futuras.
25. **Core Web Vitals/Lighthouse rodado só em mobile, nunca em desktop** — confirmado via `configSettings.formFactor` dos relatórios reais (`.lighthouseci/`): a auditoria PERF-CWV usou o default do Lighthouse/lhci (mobile, viewport 412×823, CPU 4x mais lento, rede simulada ~1.6Mbps) — correto para SEO (Google usa mobile-first indexing), mas significa que nunca medimos a experiência desktop separadamente. Baixo esforço: já existe toda a infraestrutura (`scripts/performance-audit/lighthouse/lighthouserc.json`); falta só rodar de novo com `"formFactor": "desktop"` (config novo ou flag `--preset=desktop`) para ter visibilidade comparativa. Sem urgência de SEO, mas útil para saber se a experiência desktop já está OK ou também precisa de atenção depois do #21.
27. **`/artigos` e `/categoria/[slug]` sem cache no CloudFront (mesma causa-raiz do #21, ainda não corrigida)** — confirmado em 2026-06-29 (mesma investigação do #21): ambas as rotas leem `searchParams` (cursor/`nextToken`/`page` da paginação) diretamente no componente da página, o que força renderização dinâmica no App Router **independente** do `export const revalidate` declarado — `Cache-Control: private, no-cache, no-store` e `X-Cache: Miss from cloudfront` em 100% das requisições, mesmo na página 1 sem query string. Analisadas 3 opções de correção: **(a)** Suspense + Partial Prerendering (PPR) — a forma "correta" no Next.js, mas `experimental.ppr` ainda não tem histórico de produção longo, e exige mover a busca de posts para um componente filho + skeleton de loading, risco médio-alto de regressão visual/funcional; **(b)** paginação path-based (`/artigos/pagina/2`) — exigiria abandonar o cursor opaco do DynamoDB (não é enumerável em `generateStaticParams`) e voltar a paginação por offset, ou pré-computar a cadeia de cursors no build — mudança arquitetural maior, conflita com a decisão já fechada do item #17 (paginação bidirecional cursor-based, escolhida por eficiência de query); **(c)** força de TTL no CloudFront via Terraform (cache behavior override ignorando o `no-store` da origem) — menor risco de código, mas exige incluir `nextToken`/`page`/`prevTokens` na cache key pra não servir a página errada pra usuário errado, e só ajudaria a página 1 (sem query string) — páginas 2+ são únicas por natureza. **Decisão (2026-06-29, Marcelo):** não tocar agora — paginação cursor-based foi decisão recente e deliberada (#17), misturar com ajuste de cache no mesmo dia aumenta risco de um problema mascarar o outro. Tratar como item de backlog próprio, com sessão de validação dedicada.
28. ~~Invalidação de cache sob demanda (CloudFront) — Fase 1~~ ✅ **implementada (2026-06-29)** — `backend/src/common/cacheInvalidation.ts` (novo, mesmo estilo de `postCounters.ts`) chama `cloudfront:CreateInvalidation` via `@aws-sdk/client-cloudfront` nos 3 pontos de escrita (`adminPosts.savePost`/`deletePost`, `postScheduler.publishPost`), sempre `/post/{slug}` + `/` quando a transição afeta o que a home exibe (post passou a ou deixou de contar como Publicado). Best-effort — falha de invalidação só gera `logger.warn`, nunca bloqueia a resposta de save/publish/delete. IAM: `data "aws_caller_identity"` + statement `cloudfront:CreateInvalidation` adicionado a `adminPosts_policy`/`postScheduler_policy`, escopado à ARN da distribution. **Achado de design:** `module.frontend.cloudfront_distribution_id` (output já existia) não pôde ser referenciado diretamente em `module.lambda` — criaria ciclo `lambda → frontend → api-gateway → lambda`. Resolvido com `var.frontend_cloudfront_distribution_id` como valor literal em `dev.tfvars`/`prd.tfvars` (não referência de módulo), com comentário explicando o porquê. 156/156 testes backend passando (11 novos: `cacheInvalidation.test.ts` + asserts nos 3 pontos de chamada em `adminPosts`/`postScheduler`). Plano completo: `docs/plano-cache-invalidation-cloudfront.md`. A Fase 2 — infraestrutura completa de on-demand revalidation do Next.js/OpenNext (bucket S3 de cache + tabela DynamoDB de tags + fila SQS + rota webhook `app/api/revalidate` com segredo) — foi **deliberadamente deferida**, mesmo padrão de decisão de #16/#18/#23 (não construir capacidade cara/complexa antes de um gatilho real). Motivo: o OpenNext 3.1.3 hoje só tem cache `/tmp` efêmero por instância Lambda — sem aquela infra, a Fase 1 (CloudFront) já elimina o problema na prática enquanto o tráfego for baixo (2-20 req/dia, `docs/auditoria-performance/01-perf-load.md`), porque o Lambda raramente fica "quente" entre uma edição e a próxima visita real. **Gatilho explícito pra revisitar:** tráfego real alto o suficiente pra manter o Lambda quente com frequência (o que tornaria o cache interno do OpenNext desatualizado mesmo com o CloudFront invalidado), ou decisão de antecipar antes do lançamento em produção. **Validação possível antes do gatilho:** a correção técnica do mecanismo (não a necessidade) pode ser testada via `k6` em dev simulando carga sustentada pra manter o Lambda quente artificialmente — distinto de validar que o tráfego real justifica a complexidade, que só dá pra saber com dado de produção.

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
