# Relatório de Auditoria Técnica — Blog Marcelo Gonçalves
**Data:** 2026-04-26  
**Auditor:** Claude (Staff Engineer Mode)  
**Status:** Sessão 3 concluída — todos os riscos médios resolvidos, polish aplicado  
**Última atualização:** 2026-04-26 (Sessão 3)

---

## 1. Visão Geral do Projeto

Blog de autoridade sobre IA, AWS e DevOps. Arquitetura 100% serverless na AWS, gerenciada por Terraform (IaC). Monorepo com quatro camadas bem definidas.

| Camada | Tecnologia | Estado |
|---|---|---|
| Frontend Público | Next.js 16 + OpenNext v3 | Funcional, incompleto |
| Backend (API) | Node.js 20 + 8 Lambda Functions | Funcional |
| CMS Admin | Vue 3 + Vite + Pinia + AWS Amplify | Funcional, incompleto |
| Infraestrutura | Terraform (módulos AWS) | Funcional, local |

**Páginas Implementadas:** Homepage, `/post/[slug]`, `/artigos`, `/categoria/[slug]`, `/busca`, `/o-projeto`, `/sobre`, `/servicos`, `/newsletter`, `/not-found`  
**Páginas Faltando:** Nenhuma — todas as 10 do blueprint estão implementadas.

---

## 2. Pontos Fortes

- **Arquitetura Serverless bem planejada** — separação clara entre Frontend/Backend/Admin/Infra é exemplar. Zero acoplamento entre camadas.
- **Terraform modular** — cada recurso AWS tem seu módulo isolado (`api-gateway`, `cognito`, `dynamodb`, `frontend`, `admin`, `media`, `lambda`), permitindo reuso e manutenção independente.
- **DynamoDB GSI design correto** — 5 GSIs projetados adequadamente para os padrões de acesso (recentes, populares, categoria, projeto, agendados).
- **Pipeline de Processamento de Conteúdo** — `postUtils.tsx` implementa Shiki para syntax highlighting server-side, evitando client-side JS. Approach sênior.
- **Tiptap Callout Node** — implementação correta com `contentElement: '.callout-content-area'` para evitar duplicação de texto na serialização/deserialização. Segue blueprint v1.7.
- **CI/CD com Trivy** — scan de segurança IaC com `aquasecurity/trivy-action` é uma escolha moderna e adequada (substituiu o tfsec obsoleto).
- **imageProcessor Lambda** — build especial com `npm install --os=linux --cpu=x64` para sharp binaries é a abordagem correta para Lambda + Sharp.js.
- **ISR Configurado** — `revalidate = 60` no Next.js implementa corretamente o Incremental Static Regeneration.
- **Acessibilidade Base** — SkipLink, `aria-label`, `aria-expanded`, HTML semântico presentes.
- **CORS nas respostas de erro** — todas as Lambdas admin retornam headers CORS mesmo em 500, prevenindo silent failures no admin.

---

## 3. Riscos Críticos

> ⛔ **Devem ser resolvidos antes de qualquer deploy em produção.**

### 3.1 ~~Sem Terraform Remote State~~ — ✅ CORRIGIDO (2026-04-26)
**Arquivo:** `infra/providers.tf`  
Backend S3 configurado. `scripts/bootstrap-state.sh` cria os recursos necessários.  
**Pendente:** Executar o bootstrap script e configurar `infra/backend.hcl` local.

### 3.2 ~~API Pública Retorna Posts com Status Rascunho/Programado~~ — ✅ CORRIGIDO (2026-04-26)
**Commits:** `146f438`  
- `getPost`: retorna 404 se status != "Publicado"
- `getPostsByCategory`: `FilterExpression` adicionado  
- `searchPosts`: `FilterExpression` adicionado
- `getProjectPosts`: `FilterExpression` adicionado

### 3.3 ~~Zero Testes Automatizados~~ — ✅ CORRIGIDO (2026-04-26)
**Commits:** `ce9ff80`  
47 testes unitários implementados com Jest + ts-jest para getPost, getPosts, adminPosts e postScheduler.  
CI atualizado com job dedicado de testes no deploy.yml e step no cd.yml (antes do build).

### 3.4 ~~Sem Pipeline de Deploy Automatizado~~ — ✅ CORRIGIDO (2026-04-26)
**Arquivo:** `.github/workflows/cd.yml` criado.  
Pipeline completa: build backend + frontend + admin, terraform apply, S3 sync, CloudFront invalidation.  
**Pendente:** Configurar GitHub Secrets (AWS_ROLE_ARN_DEV, AWS_ROLE_ARN_PROD) e OIDC roles na AWS.

### 3.5 ~~IAM: Todas as Lambdas Compartilham a Mesma Role Over-privilegiada~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `8bc7727`  
3 roles separadas implementadas:
- `public-lambda-role`: read-only DynamoDB (getPost, getPosts, getAuthor)
- `admin-lambda-role`: full CRUD (adminPosts, adminAuthors)
- `media-upload-role`: s3:PutObject apenas (mediaUpload)

---

## 4. Riscos Médios

> ⚠️ **Devem ser endereçados antes do crescimento de tráfego ou conteúdo sensível.**

### 4.1 ~~adminPosts listPosts Usa Full Table Scan~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `37063b8`  
`listPosts()` agora usa `QueryCommand` no GSI `StatusPorData` para cada status (Publicado, Rascunho, Programado). Elimina custo de Scan completo.

### 4.2 ~~`adminAuthors` Não Usa o Client Compartilhado~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `37063b8`  
Unificado para importar `dynamo` de `common/dynamodb.ts`. Tipagem corrigida para `APIGatewayProxyHandler`.

### 4.3 ~~CORS Wildcard nas Lambdas Admin~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `de2b56c`  
`ADMIN_ORIGIN` env var injetada via Terraform (`module.admin.cloudfront_url`). Cobre adminPosts, adminAuthors, mediaUpload e adminCategorias. Fallback `*` preservado para dev local.

### 4.4 ~~Sem Sanitização HTML no Backend~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `8d73e5b`  
`sanitize-html` aplicado em `savePost()` antes de persistir no DynamoDB. Allowlist de tags Tiptap configurada em `backend/src/common/sanitizer.ts`. Links externos recebem `rel=noopener noreferrer` automaticamente.

### 4.5 ~~`next.config.ts` Vazio — Sem Security Headers~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `6b39557`  
Security headers adicionados: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. `images.remotePatterns` configurado para CloudFront e S3. `optimizePackageImports` para fontawesome.

### 4.6 ~~Featured Image sem Next.js `<Image>` e sem Alt Obrigatório~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `9c16816`  
Substituído `<img>` nativo por `<Image fill priority sizes="..." />` com `objectFit: cover`. Alt text com fallback para título do post.

### 4.7 ~~PostSchedulerLambda Não Implementada~~ — ✅ CORRIGIDO (2026-04-26)
**Commits:** `f55b3d6`  
Lambda implementada: consulta GSI `StatusProgramadoPorData`, publica posts vencidos com ConditionExpression anti-race-condition.  
EventBridge Scheduler criado via Terraform com `rate(15 minutes)`. IAM least privilege.

### 4.8 ~~Tiptap: Versão Mismatch Entre Root e Admin~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `23e2a39`  
Root `package.json` limpo desde Sessão 1. Apenas scripts de conveniência do monorepo. Tiptap v2 exclusivo do `admin/package.json`.

### 4.9 Cognito: ALLOW_USER_PASSWORD_AUTH Habilitado
**Arquivo:** `infra/modules/cognito/main.tf:32-37`  
`ALLOW_USER_PASSWORD_AUTH` é menos seguro que SRP. Para um admin pessoal com acesso raro, aceitável. **Decisão consciente documentada** — não requer ação imediata.

### 4.10 ~~Lambda Function URL Sem Autenticação CloudFront~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `fd47e1d`  
`authorization_type = "AWS_IAM"` + OAC `lambda_oac` (SigV4). Lambda só aceita requests assinados pelo CloudFront. `allow_public_url` substituído por `allow_cloudfront` com `source_arn = cloudfront_distribution.arn`.

---

## 5. Melhorias Recomendadas

### ~~5.1 Structured JSON Logging~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `36a6372`  
Todas as 8 Lambdas emitem JSON estruturado via `backend/src/common/logger.ts`.

### ~~5.2 CloudWatch Log Groups com Retenção Explícita~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `9ca8136`  
8 log groups criados via Terraform com `depends_on`. dev: 7 dias, prod: 30 dias (`log_retention_days`).

### 5.3 ~~Hardcoded `autor_id` no Editor Admin~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `f0a197d`  
`form.value.autor_id = auth.user.username` — usa o Cognito username do usuário autenticado.

### 5.4 ~~Categorias Hardcoded no Editor Admin~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `f0a197d`  
Lambda `adminCategorias` implementada com CRUD completo. `categoriasApi.list()` chamada no `onMounted` com fallback silencioso para as 6 categorias hardcoded caso a API falhe.

### 5.5 ~~`alert()` no Admin — UX Primitivo~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `f0a197d`  
Toast com Transition CSS (sucesso verde / erro vermelho), auto-dismiss em 4s. Substitui todos os `alert()` do EditorView.

### 5.6 ~~CDN FontAwesome vs NPM Package~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `9c16816`  
`import "@fortawesome/fontawesome-free/css/all.min.css"` em `layout.tsx`. CDN externo removido. Elimina DNS lookup externo e melhora TTFB.

### 5.7 ~~Shiki Instância por Request (Performance)~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `23e2a39`  
Singleton implementado em module level em `frontend/lib/postUtils.tsx`. `getHighlighter()` cria a instância uma única vez e reutiliza em todos os requests.

### 5.8 ~~`globals copy.css` — Arquivo Lixo~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `37063b8` — Arquivo deletado.

### 5.9 ~~`admin/src/stores/counter.ts` — Arquivo Lixo~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `37063b8` — Store deletada.

### 5.10 ~~Root `package.json` com Dependências Incorretas~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `23e2a39` — Root package.json limpo. Agora tem apenas scripts de conveniência para o monorepo (`build:backend`, `build:frontend`, `build:admin`).

### 5.11 ~~No `imagem_destaque_alt_text` no PostCard~~ — ✅ CORRIGIDO (2026-04-26)
**Commit:** `9c16816`  
`role="img"` e `aria-label={post.imagem_destaque_alt_text || post.titulo}` adicionados à div de background-image.

### 5.12 Paginação Unidirecional
**Arquivo:** `frontend/components/ui/Pagination.tsx`  
O componente só tem "Próxima" página. Limitação real do DynamoDB (sem cursor reverso). UX pode ser melhorada com histórico de tokens no client-side — baixa prioridade.

---

## 6. Quick Wins (Alto Impacto, Baixo Esforço)

| # | Item | Status | Commit |
|---|---|---|---|
| QW-1 | Deletar `globals copy.css` | ✅ Feito | `37063b8` |
| QW-2 | Deletar `admin/src/stores/counter.ts` | ✅ Feito | `37063b8` |
| QW-3 | Fix status filter em `getPost` | ✅ Feito | `146f438` |
| QW-4 | Fix status filter em `getPostsByCategory` e `searchPosts` | ✅ Feito | `146f438` |
| QW-5 | Fix `listPosts` de Scan para Query com GSI | ✅ Feito | `37063b8` |
| QW-6 | Unificar `adminAuthors` para usar `dynamo` compartilhado | ✅ Feito | `37063b8` |
| QW-7 | Configurar `next.config.ts` com security headers | ✅ Feito | `6b39557` |
| QW-8 | Singleton para Shiki highlighter | ✅ Feito | `23e2a39` |
| QW-9 | Criar `.tfvars.example` + `dev.tfvars` + `prd.tfvars` | ✅ Feito | `72241c8` |
| QW-10 | Limpar root `package.json` | ✅ Feito | `23e2a39` |

---

## 7. Dívida Técnica Priorizada

### ~~Prioridade CRÍTICA — todos resolvidos~~ ✅
1. ~~Terraform Remote State~~ — `dc93284`
2. ~~IAM Least Privilege~~ — `8bc7727`
3. ~~Filtro de Status na API Pública~~ — `146f438`
4. ~~Testes unitários~~ — `ce9ff80` (47 testes)

### ~~Prioridade ALTA — todos resolvidos~~ ✅
5. ~~Deploy CI/CD Automatizado~~ — `72241c8` + `4191f3b`
6. ~~PostSchedulerLambda~~ — `f55b3d6`
7. **Endpoints de Categorias Admin** — pendente
8. ~~Security Headers no Next.js~~ — `6b39557`

### Prioridade MÉDIA
9. ~~Structured JSON Logging~~ — `36a6372`
10. ~~CloudWatch Log Groups com Retenção~~ — `9ca8136`
11. **CORS Admin Restrito** — wildcard → domínio do admin
12. **HTML Sanitization no Backend** — sanitize-html antes de salvar no DynamoDB
13. **Paginação de Categorias na API Admin** — `GET /admin/categorias` não implementado
14. **Lambda Function URL sem auth CloudFront** — DoS vector

### Prioridade BAIXA (Polish)
15. **Substituir `alert()` por toast no admin**
16. **Categorias dinâmicas no editor** (consumir API)
17. **`autor_id` dinâmico no editor** (usar Cognito user ID)
18. **Next.js `<Image>` para imagem de destaque**
19. ~~Singleton Shiki~~ — `23e2a39`
20. **CDN FontAwesome → npm package**

---

## 8. Plano de Correção Incremental

### Sprint 1 — Estabilização ✅ CONCLUÍDA
- [x] QW-1 a QW-10 (Quick Wins de limpeza e bug fixes)
- [x] Fix status filter nas APIs públicas (QW-3, QW-4) — commit `146f438`
- [x] Fix adminPosts listPosts (QW-5) — commit `37063b8`
- [x] Configurar `next.config.ts` com headers e image domains — commit `6b39557`

### Sprint 2 — Segurança e Infra ✅ CONCLUÍDA
- [x] Terraform remote state (S3 + DynamoDB lock) — commit `dc93284`
- [x] IAM roles separadas por grupo funcional — commit `8bc7727`
- [x] `.tfvars.example` + `dev.tfvars` + `prd.tfvars` documentados/commitados
- [x] CloudWatch log groups com retenção no Terraform — commit `9ca8136`

### Sprint 3 — Testes e Observabilidade ✅ CONCLUÍDA
- [x] Testes unitários para backend (Jest) — commit `ce9ff80` (47 testes, 4 suites)
- [x] Structured JSON logging nas 7 Lambdas — commit `36a6372`
- [x] PostSchedulerLambda + EventBridge Scheduler — commit `f55b3d6`
- [x] CloudWatch log groups com retenção (dev: 7d, prod: 30d) — commit `9ca8136`

### Sprint 4 — Features e Pipeline ✅ CONCLUÍDA
- [x] Pipeline de deploy automatizado (GitHub Actions cd.yml) — commit `72241c8`
- [x] Bug OpenNext path corrigido (server-functions plural) — commit `4191f3b`
- [x] Backend test step adicionado ao CI e CD — commit `ce9ff80`
- [ ] Configurar pré-requisitos do CD (GitHub secrets, OIDC roles) — **pendente manual** (fora do escopo de código)
- [x] Endpoints admin para Categorias (Lambda + API GW + Terraform) — commit `f0a197d`
- [x] Categorias dinâmicas no EditorView (API + fallback) — commit `f0a197d`
- [x] Toast notifications no admin — commit `f0a197d`

### Sprint 5 — Segurança e Polish ✅ CONCLUÍDA (Sessão 3)
- [x] HTML sanitization no backend (sanitize-html) — commit `8d73e5b`
- [x] CORS restrito nas Lambdas admin (ADMIN_ORIGIN via Terraform) — commit `de2b56c`
- [x] Lambda Function URL protegida via OAC + AWS_IAM — commit `fd47e1d`
- [x] autor_id dinâmico no editor (Cognito username) — commit `f0a197d`
- [x] FontAwesome CDN → npm package — commit `9c16816`
- [x] Featured image: `<img>` → Next.js `<Image fill>` — commit `9c16816`
- [x] PostCard: `role="img"` + `aria-label` — commit `9c16816`

---

## 9. Alinhamento com o Blueprint

| Requisito Blueprint | Status |
|---|---|
| Serverless AWS 100% | ✅ Implementado |
| Terraform IaC modular | ✅ Implementado |
| Next.js + OpenNext v3 | ✅ Implementado |
| API Gateway REST + Lambda | ✅ Implementado |
| DynamoDB + GSIs | ✅ Implementado |
| Cognito Auth | ✅ Implementado |
| Image Processor (Sharp WebP) | ✅ Implementado |
| Vue.js Admin CMS | ✅ Implementado |
| Tiptap Editor | ✅ Implementado |
| 10 Templates de Página | ✅ Implementado |
| Mobile-First CSS | ✅ Implementado |
| Acessibilidade WCAG 2.1 | ⚠️ Melhorada — PostCard role=img, alt obrigatório, SkipLink. Paginação unidirecional persiste. |
| Logging Estruturado JSON | ✅ Implementado — `36a6372` |
| Ambientes dev/prod isolados | ⚠️ Terraform pronto, contas AWS não separadas confirmadas |
| CI/CD GitHub Actions Deploy | ✅ cd.yml funcional — pendente GitHub Secrets (OIDC) |
| PostSchedulerLambda | ✅ Implementado — `f55b3d6` |
| WAF no Admin CloudFront | ❌ Não implementado |
| Terraform Remote State | ✅ Configurado — pendente bootstrap manual |
| Testes | ✅ 47 testes unitários — `ce9ff80` |
