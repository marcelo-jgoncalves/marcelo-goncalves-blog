# Relatório de Auditoria Técnica — Blog Marcelo Gonçalves
**Data:** 2026-04-26  
**Auditor:** Claude (Staff Engineer Mode)  
**Status:** Sessão 4 concluída — state recuperado, infra pronta para apply  
**Última atualização:** 2026-04-26 (Sessão 4)

---

## 1. Visão Geral do Projeto

Blog de autoridade sobre IA, AWS e DevOps. Arquitetura 100% serverless na AWS, gerenciada por Terraform (IaC). Monorepo com quatro camadas bem definidas.

| Camada | Tecnologia | Estado |
|---|---|---|
| Frontend Público | Next.js 16 + OpenNext v3 | Funcional |
| Backend (API) | Node.js 20 + 9 Lambda Functions | Funcional (versão antiga ao vivo) |
| CMS Admin | Vue 3 + Vite + Pinia + AWS Amplify | Funcional |
| Infraestrutura | Terraform (módulos AWS) | Pronto para apply — state no S3 |

**Ambiente ativo:** apenas `dev`. Produção não existe ainda.

---

## 2. Pontos Fortes

- Arquitetura serverless modular e limpa (zero acoplamento entre camadas)
- Terraform completamente modular com 7 módulos independentes
- DynamoDB com 5 GSIs corretos para todos os padrões de acesso
- Shiki singleton server-side para syntax highlighting
- Tiptap Callout Node com `contentElement` correto
- CI/CD com Trivy (security IaC scan)
- imageProcessor com flags Linux para Sharp
- Acessibilidade base: SkipLink, `aria-label`, role=img, HTML semântico
- Pagination limit parametrizado por endpoint (grid-aware)

---

## 3. Riscos Críticos

> ⛔ **Todos resolvidos no código. Pendentes apenas na infra ao vivo (→ resolver com `terraform apply`).**

### 3.1 ~~Sem Terraform Remote State~~ — ✅ CORRIGIDO + STATE RECUPERADO (2026-04-26)
State da outra máquina recuperado e migrado para S3.  
Bucket: `marcelo-goncalves-blog-dev-tfstate`, key: `blog/terraform.tfstate`.

### 3.2 ~~API Pública Retorna Posts com Status Rascunho/Programado~~ — ✅ CORRIGIDO (`146f438`)

### 3.3 ~~Zero Testes Automatizados~~ — ✅ CORRIGIDO (`ce9ff80`)
47 testes unitários, 4 suites (getPost, getPosts, adminPosts, postScheduler).

### 3.4 ~~Sem Pipeline de Deploy Automatizado~~ — ✅ CORRIGIDO (`72241c8`)
Pipeline cd.yml funcional. GitHub Secrets configurados (2026-04-26).

### 3.5 ~~IAM: Role Monolítica Over-privilegiada~~ — ✅ CORRIGIDO NO CÓDIGO (`8bc7727`)
Código Terraform tem 4 roles separadas. **Na AWS ao vivo ainda existe a role antiga — será substituída pelo `terraform apply`.**

---

## 4. Riscos Médios

### 4.1 ~~adminPosts Usa Full Table Scan~~ — ✅ CORRIGIDO (`37063b8`)

### 4.2 ~~`adminAuthors` Client Não Compartilhado~~ — ✅ CORRIGIDO (`37063b8`)

### 4.3 ~~CORS Wildcard nas Lambdas Admin~~ — ✅ CORRIGIDO (`de2b56c`)

### 4.4 ~~Sem Sanitização HTML no Backend~~ — ✅ CORRIGIDO (`8d73e5b`)

### 4.5 ~~`next.config.ts` Vazio — Sem Security Headers~~ — ✅ CORRIGIDO (`6b39557`)

### 4.6 ~~Featured Image sem Next.js `<Image>`~~ — ✅ CORRIGIDO (`9c16816`)

### 4.7 ~~PostSchedulerLambda Não Implementada~~ — ✅ CORRIGIDO NO CÓDIGO (`f55b3d6`)
Código completo. Lambda não existe na AWS ao vivo — será criada pelo `terraform apply`.

### 4.8 ~~Tiptap: Versão Mismatch~~ — ✅ CORRIGIDO (`23e2a39`)

### 4.9 Cognito: ALLOW_USER_PASSWORD_AUTH Habilitado
Decisão consciente documentada. Para admin pessoal com acesso raro, aceitável.

### 4.10 ~~Lambda Function URL Sem Autenticação CloudFront~~ — ✅ CORRIGIDO NO CÓDIGO (`fd47e1d`)
Código Terraform tem `AWS_IAM` + OAC. **Na AWS ao vivo ainda `AuthType=NONE` — será corrigido pelo `terraform apply`.**

---

## 5. Melhorias Implementadas (Sessões 1–4)

| Item | Commit | Sessão |
|---|---|---|
| Structured JSON Logging (9 Lambdas) | `36a6372` | 1 |
| CloudWatch Log Groups com retenção | `9ca8136` | 2 |
| autor_id dinâmico no Editor Admin | `f0a197d` | 3 |
| Categorias dinâmicas no EditorView | `f0a197d` | 3 |
| Toast notifications no admin | `f0a197d` | 3 |
| CDN FontAwesome → npm package | `9c16816` | 3 |
| Singleton Shiki highlighter | `23e2a39` | 1 |
| Globals copy.css deletado | `37063b8` | 1 |
| Root `package.json` limpo | `23e2a39` | 1 |
| PostCard `role="img"` + `aria-label` | `9c16816` | 3 |
| **Merge main→develop** | `3721093` | 4 |
| **Pagination limit parametrizado** | `dcf2e3d` | 4 |
| **Email footer: contato@iadecifrada.com** | `dcf2e3d` | 4 |
| **Debug mode removido do layout.tsx** | `dcf2e3d` | 4 |
| **GitHub Actions role corrigida** | manual | 4 |
| **Terraform state migrado para S3** | manual | 4 |

### 5.1 Paginação Unidirecional
Limitação real do DynamoDB (sem cursor reverso). Baixa prioridade.

---

## 6. Quick Wins Concluídos

| # | Item | Commit |
|---|---|---|
| QW-1 | Deletar `globals copy.css` | `37063b8` |
| QW-2 | Deletar `admin/src/stores/counter.ts` | `37063b8` + `dcf2e3d` |
| QW-3 | Fix status filter em `getPost` | `146f438` |
| QW-4 | Fix status filter em `getPostsByCategory` e `searchPosts` | `146f438` |
| QW-5 | Fix `listPosts` de Scan → Query com GSI | `37063b8` |
| QW-6 | Unificar `adminAuthors` para usar `dynamo` compartilhado | `37063b8` |
| QW-7 | Configurar `next.config.ts` com security headers | `6b39557` |
| QW-8 | Singleton para Shiki highlighter | `23e2a39` |
| QW-9 | Criar `.tfvars.example` + `dev.tfvars` | `72241c8` |
| QW-10 | Limpar root `package.json` | `23e2a39` |

---

## 7. Dívida Técnica Priorizada

### Prioridade CRÍTICA — todos resolvidos no código ✅
1. ~~Terraform Remote State~~ — state no S3, `terraform apply` pendente
2. ~~IAM Least Privilege~~ — código pronto, apply pendente
3. ~~Filtro de Status na API Pública~~ — `146f438`
4. ~~Testes unitários~~ — `ce9ff80` (47 testes)

### Prioridade ALTA — todos resolvidos ✅
5. ~~Deploy CI/CD Automatizado~~ — `72241c8` + `4191f3b` + secrets configurados
6. ~~PostSchedulerLambda~~ — código `f55b3d6`, apply pendente
7. ~~Endpoints de Categorias Admin~~ — `f0a197d`
8. ~~Security Headers no Next.js~~ — `6b39557`

### Prioridade MÉDIA — todos resolvidos ✅
9. ~~Structured JSON Logging~~ — `36a6372`
10. ~~CloudWatch Log Groups com Retenção~~ — `9ca8136`
11. ~~CORS Admin Restrito~~ — `de2b56c`
12. ~~HTML Sanitization no Backend~~ — `8d73e5b`
13. ~~Paginação de Categorias na API Admin~~ — `f0a197d`
14. ~~Lambda Function URL sem auth CloudFront~~ — código `fd47e1d`, apply pendente

### Prioridade BAIXA (Polish)
15. Paginação bidirecional (`Pagination.tsx`) — limitação DynamoDB
16. WAF no Admin CloudFront — quando houver tráfego real
17. Cognito: migrar `ALLOW_USER_PASSWORD_AUTH` → SRP
18. Hero height padronizado em todas as páginas
19. Layout "e_popular" no admin
20. Preview de imagens no admin

---

## 8. Plano de Correção Incremental

### Sprint 1 — Estabilização ✅ CONCLUÍDA
- [x] QW-1 a QW-10 | Fix status filter | Fix adminPosts GSI | next.config.ts headers

### Sprint 2 — Segurança e Infra ✅ CONCLUÍDA
- [x] Terraform remote state | IAM roles separadas | CloudWatch log groups

### Sprint 3 — Testes e Observabilidade ✅ CONCLUÍDA
- [x] 47 testes Jest | Structured JSON logging | PostSchedulerLambda | CloudWatch

### Sprint 4 — Features e Pipeline ✅ CONCLUÍDA
- [x] Pipeline CD | OpenNext path fix | adminCategorias | EditorView dinâmico | Toast

### Sprint 5 — Segurança e Polish ✅ CONCLUÍDA
- [x] HTML sanitization | CORS restrito | Lambda OAC | autor_id Cognito | FontAwesome npm | a11y

### Sprint 6 — Reconciliação e Infraestrutura (Sessão 4) ✅ CONCLUÍDA
- [x] Merge main→develop (commit `3721093`) — 71+27 commits integrados sem regressão
- [x] Pagination limit parametrizado por endpoint — `dcf2e3d`
- [x] Debug mode removido do layout.tsx — `dcf2e3d`
- [x] Email footer corrigido — `dcf2e3d`
- [x] GitHub Actions role corrigida (repo errado → correto)
- [x] GitHub Secrets `AWS_ROLE_ARN_DEV` + `AWS_ROLE_ARN_PROD` configurados
- [x] Terraform state migrado para S3 (recuperado da outra máquina)
- [x] `terraform plan` limpo: 32 add, 14 change, 13 destroy

### Sprint 7 — Deploy Dev (próxima sessão)
- [ ] Build real das Lambdas (`cd backend && npm ci && npm run build`)
- [ ] `terraform apply -var-file=env/dev.tfvars` — fecha todos os drifts de segurança
- [ ] Seed de categorias no DynamoDB
- [ ] Validar blog e admin ao vivo com código atualizado

---

## 9. Alinhamento com o Blueprint

| Requisito Blueprint | Status |
|---|---|
| Serverless AWS 100% | ✅ Implementado |
| Terraform IaC modular | ✅ Implementado — state no S3 |
| Next.js + OpenNext v3 | ✅ Implementado |
| API Gateway REST + Lambda | ✅ Implementado |
| DynamoDB + GSIs | ✅ Implementado |
| Cognito Auth | ✅ Implementado |
| Image Processor (Sharp WebP) | ✅ Implementado |
| Vue.js Admin CMS | ✅ Implementado |
| Tiptap Editor | ✅ Implementado |
| 10 Templates de Página | ✅ Implementado |
| Mobile-First CSS | ✅ Implementado |
| Acessibilidade WCAG 2.1 | ⚠️ Melhorada — role=img, alt, SkipLink. Paginação bidirecional pendente. |
| Logging Estruturado JSON | ✅ Implementado — `36a6372` |
| CI/CD GitHub Actions Deploy | ✅ Funcional — secrets configurados, apply manual pendente |
| PostSchedulerLambda | ✅ Código implementado — será deployada no próximo apply |
| Terraform Remote State | ✅ State no S3 — apply pendente |
| Testes | ✅ 47 testes unitários |
| WAF no Admin CloudFront | ❌ Não implementado (low priority) |
| Ambiente dev/prod isolado | ⚠️ Apenas dev ativo — prod não criado ainda |
