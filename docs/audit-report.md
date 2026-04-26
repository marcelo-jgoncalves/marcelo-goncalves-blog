# Relatório de Auditoria Técnica — Blog Marcelo Gonçalves
**Data:** 2026-04-26  
**Auditor:** Claude (Staff Engineer Mode)  
**Status:** Auditoria Completa — Aguardando Fase 3 (Correções)

---

## 1. Visão Geral do Projeto

Blog de autoridade sobre IA, AWS e DevOps. Arquitetura 100% serverless na AWS, gerenciada por Terraform (IaC). Monorepo com quatro camadas bem definidas.

| Camada | Tecnologia | Estado |
|---|---|---|
| Frontend Público | Next.js 16 + OpenNext v3 | Funcional, incompleto |
| Backend (API) | Node.js 20 + 7 Lambda Functions | Funcional, com bugs |
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

### 3.1 Sem Terraform Remote State — BLOQUEANTE PARA PROD
**Arquivo:** `infra/providers.tf`  
O backend do Terraform é local. O comentário no arquivo diz "será configurado posteriormente". Para produção, sem estado remoto (S3 + DynamoDB lock), qualquer segundo operador destrói a infraestrutura.  
**Risco:** Perda total de infra em prod se outro operador fizer `terraform apply`.  
**Correção:** Adicionar backend S3 com lock DynamoDB em `providers.tf`.

### 3.2 API Pública Retorna Posts com Status Rascunho/Programado
**Arquivos:** `backend/src/functions/getPost/index.ts`, `backend/src/functions/getPosts/index.ts`

- `getPost`: faz `GetCommand` sem filtrar `status`. Se alguém souber o slug de um rascunho, obtém o conteúdo.
- `getPostsByCategory`: faz `QueryCommand` no GSI `CategoriaPorData` sem `FilterExpression: status = Publicado`. Retorna rascunhos.
- `searchPosts`: `ScanCommand` sem filtrar por status. Retorna rascunhos nos resultados de busca.  

**Risco:** Vazamento de conteúdo não publicado.  
**Correção:** Adicionar `FilterExpression: "#status = :published"` nas queries públicas.

### 3.3 Zero Testes Automatizados
Nenhum teste unitário, de integração ou end-to-end em nenhuma das quatro camadas.  
**Risco:** Qualquer refactoring ou nova feature pode quebrar silenciosamente funcionalidades existentes. Impossível ter CI/CD confiável.  
**Correção:** Implementar testes unitários para o backend (Jest + AWS SDK mocks) como primeira prioridade.

### 3.4 Sem Pipeline de Deploy Automatizado
**Arquivo:** `.github/workflows/deploy.yml`  
O workflow existente faz apenas **validação** (lint, audit, terraform validate). Não há nenhum job de deploy. Todo deploy é manual, seguindo procedimentos do `tec.md` seção 3.  
**Risco:** Deploy manual é propenso a erros. O procedimento para Next.js é particularmente complexo (zip da pasta específica).  
**Correção:** Implementar jobs de deploy automatizado no pipeline de CI/CD.

### 3.5 IAM: Todas as Lambdas Compartilham a Mesma Role Over-privilegiada
**Arquivo:** `infra/modules/lambda/main.tf`  
A `lambda-role` única tem permissão de `dynamodb:Scan` e `dynamodb:PutItem`/`DeleteItem` em todas as tabelas. Lambdas públicas como `getPost` e `getPosts` têm permissão de escrita no DynamoDB — violação direta do princípio Least Privilege mandatório no blueprint.  
**Risco:** Se uma Lambda pública for comprometida (RCE), o atacante pode alterar/deletar dados do blog.  
**Correção:** Criar roles separadas por função (read-only para Lambdas públicas, read-write apenas para Lambdas admin).

---

## 4. Riscos Médios

> ⚠️ **Devem ser endereçados antes do crescimento de tráfego ou conteúdo sensível.**

### 4.1 adminPosts listPosts Usa Full Table Scan
**Arquivo:** `backend/src/functions/adminPosts/index.ts:76-87`  
A função `listPosts()` usa `ScanCommand` na tabela Posts. Com poucos posts não é problema, mas o DynamoDB Scan lê TODA a tabela e cobra por cada item escaneado. Com centenas/milhares de posts, isso é caro e lento.  
**Correção:** Usar `QueryCommand` com o GSI `StatusPorData` para listar posts, igual ao que `getPosts` já faz.

### 4.2 `adminAuthors` Não Usa o Client Compartilhado
**Arquivo:** `backend/src/functions/adminAuthors/index.ts:2-5`  
Cria seu próprio `DynamoDBDocument.from(new DynamoDBClient())` em vez de importar o `dynamo` de `common/dynamodb.ts`. Inconsistência de padrão — duplicação desnecessária e não aplica `removeUndefinedValues`.

### 4.3 CORS Wildcard nas Lambdas Admin
**Arquivos:** `adminPosts/index.ts:13`, `adminAuthors/index.ts:11`, `mediaUpload/index.ts:10`  
`Access-Control-Allow-Origin: *` em todas as Lambdas admin. Em produção, deve ser restrito ao domínio do painel admin.  
**Nota:** Apenas as configurações MOCK do API Gateway CORS foram corretamente configuradas. As lambdas retornam wildcard independente.

### 4.4 Sem Sanitização HTML no Backend
**Arquivo:** `backend/src/functions/adminPosts/index.ts:122`  
O campo `conteudo_html` é armazenado diretamente no DynamoDB sem nenhuma sanitização. Se o painel admin for comprometido, um atacante pode injetar scripts maliciosos que serão renderizados via `dangerouslySetInnerHTML` no frontend.  
**Correção:** Usar uma biblioteca de sanitização (ex: DOMPurify server-side ou sanitize-html) antes de armazenar.

### 4.5 `next.config.ts` Vazio — Sem Security Headers
**Arquivo:** `frontend/next.config.ts`  
O arquivo está completamente vazio. Ausentes: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Content-Security-Policy`, configuração de domínios de imagem.  
**Correção:** Adicionar security headers e configuração de `images.remotePatterns`.

### 4.6 Featured Image sem Next.js `<Image>` e sem Alt Obrigatório
**Arquivo:** `frontend/app/post/[slug]/page.tsx:128-136`  
A imagem de destaque usa `<img>` nativo em vez do componente `<Image>` do Next.js, que provê otimização automática (WebP, lazy loading, dimensões). Além disso, `imagem_destaque_alt_text` pode ser undefined se não cadastrado.

### 4.7 PostSchedulerLambda Não Implementada
**Bluepint seção 8.** A Lambda de agendamento de posts (EventBridge Scheduler → `PostSchedulerLambda`) está documentada no blueprint e os GSIs estão criados (`StatusProgramadoPorData`), mas nenhum código ou Terraform para a Lambda existe.  
**Impacto:** Funcionalidade "Publicar Programado" no editor não funciona na prática.

### 4.8 Tiptap: Versão Mismatch Entre Root e Admin
**Arquivos:** `package.json` (raiz), `admin/package.json`  
Root tem `@tiptap/*: ^3.14.0`, admin tem `@tiptap/*: ^2.11.0`. A versão 3 tem breaking changes. O root package.json parece ser um resquício de experimento — as dependências Tiptap da raiz não fazem sentido num monorepo onde o único consumidor de Tiptap é o admin.

### 4.9 Cognito: ALLOW_USER_PASSWORD_AUTH Habilitado
**Arquivo:** `infra/modules/cognito/main.tf:32-37`  
`ALLOW_USER_PASSWORD_AUTH` permite enviar username/senha diretamente na requisição (menos seguro que SRP). O fluxo SRP (`ALLOW_USER_SRP_AUTH`) nunca expõe a senha pela rede. Para um admin que raramente troca de acesso, está aceitável — mas deve ser documentado como decisão consciente.

### 4.10 Lambda Function URL Sem Autenticação CloudFront
**Arquivo:** `infra/modules/frontend/lambda.tf:48-60`  
A Lambda do Next.js SSR tem URL pública com `authorization_type = "NONE"`. Qualquer pessoa que descubra a URL pode invocar a Lambda diretamente, bypassando o CloudFront. O custo de Lambda seria cobrado, e é um potencial DoS vector.  
**Correção Ideal:** Usar `authorization_type = "AWS_IAM"` e configurar CloudFront com OAC para Lambda, ou adicionar WAF rate limiting.

---

## 5. Melhorias Recomendadas

### 5.1 Structured JSON Logging
Todas as 7 Lambdas usam `console.log("Event:", JSON.stringify(event))`. Para ser "production-grade operável às 3h da manhã" (blueprint 2.5), cada Lambda deveria emitir JSON estruturado:
```json
{ "level": "INFO", "requestId": "...", "event": "post_fetched", "slug": "...", "duration_ms": 45 }
```

### 5.2 CloudWatch Log Groups com Retenção Explícita
Nenhum `aws_cloudwatch_log_group` está definido no Terraform. As Lambda criam grupos automaticamente sem política de retenção — acumulam logs para sempre em prod.

### 5.3 Hardcoded `autor_id` no Editor Admin
**Arquivo:** `admin/src/views/EditorView.vue:40`  
`form.value.autor_id = 'marcelo-goncalves'` — hardcoded. Deveria usar o ID do usuário Cognito autenticado.

### 5.4 Categorias Hardcoded no Editor Admin
**Arquivo:** `admin/src/views/EditorView.vue:172-179`  
O dropdown de categorias lista 6 categorias hardcoded. Deveria consumir `GET /admin/categorias` para ser dinâmico. A tabela `Categorias` existe no DynamoDB mas nenhum endpoint de admin gerencia categorias no backend.

### 5.5 `alert()` no Admin — UX Primitivo
**Arquivo:** `admin/src/views/EditorView.vue:77,80`  
Usar `alert()` nativo bloqueia a thread e é visual e funcionalmente primitivo. Implementar um sistema de toast/notificação.

### 5.6 CDN FontAwesome vs NPM Package
**Arquivo:** `frontend/app/layout.tsx:36-39`  
Carrega FontAwesome via CDN externo (`cdnjs.cloudflare.com`) sendo que `@fortawesome/fontawesome-free: ^7.1.0` está instalado via npm. Dependência externa desnecessária — impacta performance (DNS lookup + request externo).

### 5.7 Shiki Instância por Request (Performance)
**Arquivo:** `frontend/lib/postUtils.tsx:21`  
`createHighlighter(...)` é chamado dentro da função que processa cada post. Em desenvolvimento (dev server), cada navegação cria um novo highlighter. Deveria ser um singleton/module-level cache.

### 5.8 `globals copy.css` — Arquivo Lixo
**Arquivo:** `frontend/app/globals copy.css`  
Arquivo duplicado do CSS global (provavelmente um backup manual). Deve ser deletado — não é importado em nenhum lugar mas polui o diretório.

### 5.9 `admin/src/stores/counter.ts` — Arquivo Lixo
Store padrão do template Vue/Pinia, não usado em nenhum componente. Deve ser deletado.

### 5.10 Root `package.json` com Dependências Incorretas
O `package.json` na raiz do monorepo contém apenas dependências Tiptap (`@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/vue-3`). Essas dependências pertencem ao `admin/package.json` (e já estão lá). O root `package.json` parece ser resquício de experimento.

### 5.11 No `imagem_destaque_alt_text` no PostCard
**Arquivo:** `frontend/components/ui/PostCard.tsx`  
A imagem é renderizada como `div` com `backgroundImage` — correto para CSS, mas não tem texto alternativo. Para acessibilidade, o card deveria ter `role="img"` e `aria-label` na div de imagem.

### 5.12 Paginação Unidirecional
**Arquivo:** `frontend/components/ui/Pagination.tsx`  
O componente só tem "Próxima" página — sem volta. Embora seja uma limitação real do DynamoDB (sem cursor reverso), a UX pode ser melhorada com histórico de tokens no client-side.

---

## 6. Quick Wins (Alto Impacto, Baixo Esforço)

| # | Item | Arquivo | Esforço |
|---|---|---|---|
| QW-1 | Deletar `globals copy.css` | `frontend/app/globals copy.css` | 5 min |
| QW-2 | Deletar `admin/src/stores/counter.ts` | `admin/src/stores/counter.ts` | 5 min |
| QW-3 | Fix status filter em `getPost` (retorna rascunho) | `backend/src/functions/getPost/index.ts` | 20 min |
| QW-4 | Fix status filter em `getPostsByCategory` e `searchPosts` | `backend/src/functions/getPosts/index.ts` | 30 min |
| QW-5 | Fix `listPosts` de Scan para Query com GSI | `backend/src/functions/adminPosts/index.ts` | 30 min |
| QW-6 | Unificar `adminAuthors` para usar `dynamo` compartilhado | `backend/src/functions/adminAuthors/index.ts` | 15 min |
| QW-7 | Configurar `next.config.ts` com security headers | `frontend/next.config.ts` | 30 min |
| QW-8 | Singleton para Shiki highlighter | `frontend/lib/postUtils.tsx` | 15 min |
| QW-9 | Criar `.tfvars.example` para os dois ambientes | `infra/env/` | 20 min |
| QW-10 | Remover root `package.json` Tiptap deps | `package.json` | 10 min |

---

## 7. Dívida Técnica Priorizada

### Prioridade CRÍTICA (Bloqueante para Prod)
1. **Terraform Remote State** — sem isso, prod é inoperável em equipe
2. **IAM Least Privilege** — roles separadas por função
3. **Filtro de Status na API Pública** — vazamento de rascunhos
4. **Testes unitários** — mínimo para backend (getPost, getPosts, adminPosts)

### Prioridade ALTA
5. **Deploy CI/CD Automatizado** — jobs de build+deploy no GitHub Actions
6. **PostSchedulerLambda** — feature de agendamento está broken sem ela
7. **Endpoints de Categorias Admin** — tabela existe, CRUD no backend não
8. **Security Headers no Next.js** — CSP, X-Frame-Options, etc.

### Prioridade MÉDIA
9. **Structured JSON Logging** — observabilidade production-grade
10. **CloudWatch Log Groups com Retenção** — custo e compliance
11. **CORS Admin Restrito** — wildcard é aceitável para MVP, deve ser corrigido antes de escalar
12. **HTML Sanitization no Backend** — DOMPurify / sanitize-html
13. **Paginação de Categorias na API Admin** — `GET /admin/categorias` não implementado

### Prioridade BAIXA (Polish)
14. Substituir `alert()` por toast no admin
15. Categorias dinâmicas no editor (consumir API)
16. `autor_id` dinâmico no editor (usar Cognito user ID)
17. Next.js `<Image>` para imagem de destaque
18. Singleton Shiki
19. CDN FontAwesome → npm package

---

## 8. Plano de Correção Incremental

### Sprint 1 — Estabilização (Esta semana)
- [ ] QW-1 a QW-10 (Quick Wins de limpeza e bug fixes)
- [ ] Fix status filter nas APIs públicas (QW-3, QW-4)
- [ ] Fix adminPosts listPosts (QW-5)
- [ ] Configurar `next.config.ts` com headers e image domains

### Sprint 2 — Segurança e Infra
- [ ] Terraform remote state (S3 + DynamoDB lock)
- [ ] IAM roles separadas por grupo funcional
- [ ] CloudWatch log groups com retenção no Terraform
- [ ] `.tfvars.example` files documentando variáveis necessárias

### Sprint 3 — Testes e Observabilidade
- [ ] Testes unitários para backend (Jest)
- [ ] Structured JSON logging nas 7 Lambdas
- [ ] PostSchedulerLambda + EventBridge Scheduler

### Sprint 4 — Features e Pipeline
- [ ] Pipeline de deploy automatizado (GitHub Actions)
- [ ] Endpoints admin para Categorias
- [ ] Categorias dinâmicas no EditorView
- [ ] Toast notifications no admin

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
| Acessibilidade WCAG 2.1 | ⚠️ Parcial (base ok, melhorias pendentes) |
| Logging Estruturado JSON | ❌ Não implementado |
| Ambientes dev/prod isolados | ⚠️ Terraform pronto, contas AWS não separadas confirmadas |
| CI/CD GitHub Actions Deploy | ❌ Apenas validação, sem deploy |
| PostSchedulerLambda | ❌ Não implementado |
| WAF no Admin CloudFront | ❌ Não implementado |
| Terraform Remote State | ❌ Estado local |
| Testes | ❌ Zero testes |
