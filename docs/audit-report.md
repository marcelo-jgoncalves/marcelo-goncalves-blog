# Relatório de Auditoria Técnica — Blog Marcelo Gonçalves
**Data:** 2026-04-27 | **Última atualização:** 2026-05-04 (sessão 16)  
**Auditor:** Claude (Staff Engineer Mode)  
**Status:** Sessão 4 encerrada — sistema ao vivo, pipeline verde, pronto para conteúdo  
**Última atualização:** 2026-04-27

---

## 1. Visão Geral

Blog de autoridade sobre IA, AWS e DevOps. Arquitetura 100% serverless na AWS, gerenciada por Terraform (IaC). Monorepo com quatro camadas.

| Camada | Tecnologia | Estado |
|---|---|---|
| Frontend Público | Next.js 16 + OpenNext v3 | ✅ Ao vivo |
| Backend (API) | Node.js 20 + 9 Lambda Functions | ✅ Ao vivo, código da sessão 4 |
| CMS Admin | Vue 3 + Vite + Pinia + AWS Amplify | ✅ Ao vivo |
| Infraestrutura | Terraform (7 módulos AWS) | ✅ Sincronizado — state no S3 |

**Ambiente ativo:** apenas `dev`. Produção não existe ainda.  
**Pipeline:** CD verde — push para `develop` faz deploy automático completo.

---

## 2. Pontos Fortes

- Arquitetura serverless modular — zero acoplamento entre camadas
- Terraform 7 módulos independentes com remote state no S3
- DynamoDB com 5 GSIs para todos os padrões de acesso
- Shiki singleton server-side para syntax highlighting
- OIDC sem credenciais estáticas — GitHub Actions assume role via JWT
- CI com trivy (IaC security scan), jest (47 testes unitários), npm audit
- CD completo: build → terraform apply → S3 sync → CloudFront invalidate
- Lambda URL protegida via OAC + AWS_IAM (só CloudFront pode invocar)
- 4 IAM roles de least-privilege (public/admin/media-upload/scheduler)
- HTML sanitization (sanitize-html) antes de persistir no DynamoDB
- PostScheduler + EventBridge rate(15min) — evita double-publish com ConditionExpression
- Pagination limit parametrizado por endpoint (grid-aware)

---

## 3. Riscos — Todos Resolvidos ✅

| Risco | Commit | Data |
|---|---|---|
| Sem Terraform Remote State | `dc93284` + migração S3 | 2026-04-26 |
| API pública retorna drafts/scheduled | `146f438` | Jan 2026 |
| Zero testes automatizados | `ce9ff80` (47 testes) | Jan 2026 |
| Sem pipeline de deploy | `72241c8` | Jan 2026 |
| IAM role monolítica over-privilegiada | `8bc7727` + apply | Abr 2026 |
| Lambda URL sem auth CloudFront | `fd47e1d` + apply | Abr 2026 |
| OIDC apontando para repo errado | update trust policy | Abr 2026 |
| `admin/src/assets/main.ts` com CSS | `2f85620` | Abr 2026 |
| CategoriesView com campos inexistentes | `abb2357` | Abr 2026 |

---

## 4. Riscos Médios — Todos Resolvidos ✅

| Risco | Commit |
|---|---|
| adminPosts listPosts com Full Table Scan | `37063b8` |
| adminAuthors client não compartilhado | `37063b8` |
| CORS wildcard nas Lambdas admin | `de2b56c` |
| Sem sanitização HTML no backend | `8d73e5b` |
| next.config.ts sem security headers | `6b39557` |
| Featured image sem Next.js `<Image>` | `9c16816` |
| PostSchedulerLambda inexistente | `f55b3d6` + apply |
| Tiptap versão mismatch | `23e2a39` |
| Lambda Function URL sem auth | `fd47e1d` + apply |
| Categorias dinâmicas inexistentes no editor | `f0a197d` |
| UX com `alert()` no admin | `f0a197d` |

### Risco restante (decisão consciente)
**Cognito: `ALLOW_USER_PASSWORD_AUTH`** — menos seguro que SRP, aceitável para admin pessoal.

---

## 5. Melhorias Implementadas (Sessões 1–4)

| Sessão | Item | Commit |
|---|---|---|
| 1 | Structured JSON Logging (9 Lambdas) | `36a6372` |
| 1 | Singleton Shiki highlighter | `23e2a39` |
| 1 | Root `package.json` limpo | `23e2a39` |
| 2 | CloudWatch Log Groups com retenção | `9ca8136` |
| 2 | 47 testes Jest (4 suites) | `ce9ff80` |
| 2 | PostSchedulerLambda + EventBridge | `f55b3d6` |
| 3 | adminCategorias Lambda + API GW | `f0a197d` |
| 3 | EditorView: categorias dinâmicas + toast | `f0a197d` |
| 3 | HTML sanitization (sanitize-html) | `8d73e5b` |
| 3 | CORS restrito (ADMIN_ORIGIN Terraform) | `de2b56c` |
| 3 | Lambda OAC + AWS_IAM | `fd47e1d` |
| 3 | FontAwesome npm, Next.js Image, a11y | `9c16816` |
| 4 | Merge main→develop (98 commits) | `3721093` |
| 4 | Pagination limit parametrizado | `dcf2e3d` |
| 4 | build.js Windows cross-platform | `edfdac3` |
| 4 | OIDC trust policy corrigida | manual |
| 4 | Terraform apply dev (32 add, 19 change, 5 destroy) | manual |
| 4 | Pipeline CD verde | `abb2357` |
| 4 | Node.js 20 deprecation fix | `FORCE_...=true` |

---

## 6. Dívida Técnica Priorizada

### Aguarda ação manual de Marcelo
1. **URLs sociais reais** — LinkedIn, GitHub, Instagram para footer e author box
2. **Ferramenta de agendamento** — Calendly ou similar para /servicos
3. **AWS Support ticket** — elevar Lambda concurrent executions 10→1000
4. **NEXT_PUBLIC_SITE_URL** — configurar via Terraform quando domínio definitivo estiver pronto

### Resolvidos nesta sessão (sessão 16)
- ✅ Favicon + apple-touch-icon + favicon-192/512 + site.webmanifest deployados
- ✅ CloudFront behaviors para arquivos estáticos root-level
- ✅ Admin: QuillEditor (crítico) → RichTextEditor (Tiptap)
- ✅ Admin: Dashboard reescrito com tabs/busca/delete
- ✅ Admin: dirty state, preview link, date validation, SERP preview, auto reading time
- ✅ SEO: 18/20 itens (restam #16 links sociais e #18 agendamento)

### Baixa prioridade
5. Paginação bidirecional — ✅ Implementada (artigos + o-projeto)
6. WAF no Admin CloudFront — quando houver tráfego real
7. Cognito: migrar `ALLOW_USER_PASSWORD_AUTH` → SRP
8. Preview de imagens no admin (upload pipeline já existe)

---

## 7. Sprints

| Sprint | Status | Entregas |
|---|---|---|
| 1 — Estabilização | ✅ | Quick wins, status filter, next.config.ts |
| 2 — Segurança e Infra | ✅ | TF remote state, IAM roles, CloudWatch |
| 3 — Testes e Observabilidade | ✅ | 47 testes, logging, PostScheduler |
| 4 — Features e Pipeline | ✅ | CD pipeline, adminCategorias, EditorView |
| 5 — Segurança e Polish | ✅ | Sanitization, OAC, CORS, a11y, FontAwesome |
| 6 — Reconciliação | ✅ | Merge main→develop, TF state S3, secrets GitHub |
| 7 — Deploy Dev | ✅ | Build real, terraform apply, pipeline verde |

**Sprint 8 — Conteúdo (aguarda Marcelo)**
- [ ] Seed de categorias no DynamoDB
- [ ] Primeiro post real no blog
- [ ] Validação end-to-end (criar post no admin → aparecer no blog)

**Sprint 9 — CSS + Pipeline (Sessão 13) ✅**
- [x] Ritmo vertical world-class: spacing scale `--space-1..6` + `--section-min-height` em globals.css
- [x] Alinhamento primeiro banner com topo da sidebar (home, artigos, o-projeto)
- [x] Paginação de artigos fora do grid de duas colunas — alinha último card com último widget
- [x] Espaçamento uniforme 40px em artigos (padding-top, gap desktop, pagination)
- [x] ServiceCallout: esquema accent-dark (fundo azul escuro, botão branco)
- [x] ZIPs determinísticos: timestamps normalizados antes de zipar — Terraform só atualiza Lambda quando código muda
- [x] Build paralelo no cd.yml: `build-backend` ‖ `build-frontend`
- [ ] AWS Support ticket: elevar Lambda concurrent executions de 10 → 1000 (aguarda Marcelo)

**Sprint 12 — Post page, Mobile SEO, Brand Assets, Admin (Sessão 16) ✅**
- [x] Post page 13 fixes: `revalidate=60`, `--font-mono`, blockquote `position:relative`, BreadcrumbList com `category.nome`, dead code removed (service injection, console.error), OG image tokens (#3B5F8A), `<time dateTime>`, AdsenseInArticle usa `ADSENSE_CONFIGURED` (não `NODE_ENV`), mobile class corrigida
- [x] Mobile SEO 8 fixes: hero `min-height:280px` flex centrado, hero-title scaling mobile→desktop, /servicos OG+canonical completos, sitemap `lastModified` em todas as páginas, "IA Decifrada" eliminado de todas as strings, Pagination fora do grid em `/categoria/[slug]`, `<time datetime>` correto
- [x] Brand assets: `app/favicon.ico`, `public/apple-touch-icon.png`, `public/favicon-192.png`, `public/favicon-512.png`, `public/site.webmanifest`, `public/logo-desktop.png` deployados
- [x] CloudFront 5 `ordered_cache_behavior` para arquivos estáticos root-level: `*.ico`, `*.webmanifest`, `apple-touch-icon.png`, `favicon-*.png`, `logo-desktop.*` → target `S3-Assets`
- [x] UI: category cards h3 `0.95→1.5rem` + p `0.8→1rem`; hero min-height `280px` + flex centrado em todas as páginas; home-see-all ghost pill (accent-light bg); /servicos icon acima texto centralizado desktop; TechRibbon Gemini→Claude Code
- [x] Color consistency: PostCard título `--dark-700→--dark-900`; PopularPostsWidget `--text-primary→--dark-900`
- [x] Admin crítico: `AuthorEditView.vue` — `QuillEditor` (pacote não instalado) → `RichTextEditor` (Tiptap já no projeto)
- [x] Admin alto: todos `alert()` → `showToast()` com tipos `success/error/warning` (CategoriesView, DashboardView, AuthorEditView)
- [x] Admin alto: `DashboardView.vue` reescrito — tabs de status com contagens, busca de texto client-side, delete posts com confirm
- [x] Admin alto: `EditorView.vue` dirty state — `isDirty` computed + `onBeforeRouteLeave` guard + badge "● Não salvo"
- [x] Admin alto: `EditorView.vue` preview link — botão "Ver no Blog" quando post status=Publicado
- [x] Admin alto: `EditorView.vue` date validation — Programado exige data futura
- [x] Admin médio: `admin/src/utils/slug.ts` + `admin/src/types/index.ts` criados (centralizados)
- [x] Admin médio: `EditorView.vue` SERP preview — computed title/desc/URL com contadores de chars
- [x] Admin médio: `EditorView.vue` auto reading time — watcher em `conteudo_html`, strip HTML, palavras÷200
- [x] Admin médio: `ImageNode.vue` — definitive error state após maxRetries, não tenta mais; retries 10→5 (~10s)
- [ ] AWS Support ticket: elevar Lambda concurrent executions 10→1000 (aguarda Marcelo)

**Sprint 11 — O Projeto + Home Final (Sessão 15) ✅**
- [x] Home: margin collapsing corrigido — `gap: var(--space-4)` + `margin: 0` nos banners
- [x] Home: `section-header margin-bottom` 40px → 24px (título conectado ao conteúdo)
- [x] Home: `home-layout padding-bottom` 64px → 40px
- [x] Sidebar: `BlogSidebar` prop `showNewsletter` + `sidebar-dynamic-area gap` 32px→24px
- [x] Sidebar: `ProjetoWidget`, `PopularPostsWidget`, `AdsenseSidebar` — tokens aplicados
- [x] O Projeto: CSS simplificado 124→43 linhas, dead CSS removido
- [x] O Projeto: `padding-top/gap` 64px→40px, banners `margin:0` com gap
- [x] O Projeto: `Pagination` movida para fora do grid (padrão artigos)
- [x] O Projeto: sidebar reordenada — `ServiceCallout` topo, `NewsletterWidget` rodapé
- [x] O Projeto: backend `getProjectPosts` retorna `totalCount`; frontend exibe "Página X de Y"
- [x] `Pagination.tsx`: bidirecional sem dependência de `totalPages` — botão Anterior funciona em qualquer página com cursor stack

**Sprint 10 — Segurança + Home (Sessão 14) ✅**
- [x] Home spacing: todos os valores migrados para tokens (gap 48→40px, padding 60→40/64px)
- [x] Home banners: `margin: 0` no contexto flex — elimina duplo espaçamento (gap+margin=80px)
- [x] Fix 403 pós-deploy: removido `--delete` do sync de static assets — race condition resolvida
- [x] PostCard: `meta-info gap` 10px → `var(--space-1)` = 8px
- [x] artigos.css: bloco `.op-in-grid-ad` morto removido (com `!important` residual)
- [x] Dependabot: PRs automáticos semanais para npm (3 workspaces) + GitHub Actions
- [x] Semgrep SAST: `security.yml` com `p/typescript` + `p/nodejs`, falha em ERROR severity
- [x] contract.md: seção de ritmo vertical documentada como padrão obrigatório

---

## 8. Alinhamento com o Blueprint

| Requisito | Status |
|---|---|
| Serverless AWS 100% | ✅ |
| Terraform IaC modular | ✅ State no S3 |
| Next.js + OpenNext v3 | ✅ |
| API Gateway REST + Lambda | ✅ |
| DynamoDB + GSIs | ✅ |
| Cognito Auth | ✅ |
| Image Processor (Sharp WebP) | ✅ |
| Vue.js Admin CMS | ✅ |
| Tiptap Editor | ✅ |
| 10 Templates de Página | ✅ |
| Mobile-First CSS | ✅ |
| Acessibilidade WCAG 2.1 | ⚠️ Melhorada — paginação bidirecional pendente |
| Logging Estruturado JSON | ✅ |
| CI/CD GitHub Actions | ✅ Verde em develop |
| PostSchedulerLambda | ✅ ENABLED no EventBridge |
| Terraform Remote State | ✅ |
| Testes Unitários | ✅ 157 testes (96 backend + 45 frontend + 16 admin) |
| Favicon + Manifest | ✅ Deployados sessão 16 — CloudFront behaviors ativos |
| SEO world-class | ✅ 18/20 itens (restam social links + agendamento) |
| Admin CMS completo | ✅ Dirty state, SERP preview, auto reading time, Dashboard filtros |
| WAF Admin CloudFront | ❌ Low priority |
| Ambiente dev/prod isolado | ⚠️ Apenas dev ativo |
