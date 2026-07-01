# Blog Marcelo Gonçalves

Plataforma editorial completa sobre IA, AWS e DevOps. Não só um blog, mas o motor de conteúdo de ponta a ponta: CMS próprio, pipeline de imagens, SEO/observabilidade de produção, e (em construção) uma camada de geração e distribuição de conteúdo assistida por IA: resumos automáticos, repasse para LinkedIn, geração de imagens, versão em inglês e newsletter.

Monorepo serverless 100% AWS, infraestrutura como código.

---

## Visão geral

| | |
|---|---|
| **Blog público** | Next.js 16, SSR/ISR, SEO completo, Core Web Vitals "Good" |
| **CMS (admin)** | Vue 3 + Tiptap, editor rich-text próprio, não é um SaaS de terceiros |
| **Backend** | 9 Lambdas Node.js/TypeScript, DynamoDB, S3, CloudFront |
| **Infraestrutura** | Terraform, 100% IaC, sem cliques manuais no console AWS |
| **Ambiente ativo** | `dev` apenas, produção ainda não existe |

---

## Stack

| Camada | Tecnologia | Função |
|---|---|---|
| Frontend público | Next.js 16 + React 19 + OpenNext v3 | Blog renderizado via Lambda + CloudFront, ISR |
| CMS / Admin | Vue 3 + Vite + Pinia + Tiptap 2 | Editor de posts rich-text, gestão de autores/categorias |
| Backend | Node.js 20 + TypeScript + esbuild | 9 Lambdas, uma por responsabilidade |
| Banco de dados | DynamoDB | Single-table-ish por entidade, 5 GSIs otimizadas (projection `INCLUDE`) |
| Imagens | Sharp.js (Lambda) | Pipeline automática: 6 variantes (AVIF/WebP x 3 breakpoints) + LQIP blur |
| Auth | AWS Cognito | Admin único (`ALLOW_USER_PASSWORD_AUTH`, migração para SRP planejada) |
| CDN / Edge | CloudFront + S3 + OAC | Cache de borda, invalidação sob demanda em save/publish/delete |
| IaC | Terraform (~1.14) | 7+ módulos AWS, state em S3 |
| CI/CD | GitHub Actions | Build, test, `terraform apply` e deploy, 100% automático em `develop` |
| Observabilidade | CloudWatch, X-Ray, Synthetics Canary, GuardDuty, CloudTrail | Dashboards, SLO burn-rate, tracing distribuído |
| Testes | Jest (backend/frontend), Vitest (admin), Playwright (E2E) | ~157 testes unitários + 37 E2E |

---

## Arquitetura do monorepo

```
marcelo-goncalves-blog/
├── frontend/    Next.js 16 + OpenNext v3 (blog público)
├── backend/     Node.js 20 + TypeScript (9 Lambdas)
├── admin/       Vue 3 + Vite + Pinia (CMS)
├── infra/       Terraform, módulos AWS (lambda, dynamodb, frontend, admin,
│                api-gateway, cognito, media, observability, security, finops)
└── .github/     Pipelines de CI/CD
```

**Lambdas (backend):** `getPost`, `getPosts`, `getAuthor`, `adminPosts`, `adminAuthors`, `adminCategorias`, `mediaUpload`, `imageProcessor`, `postScheduler`.

`CLAUDE.md`, na raiz, descreve as regras de engenharia não-negociáveis do projeto (arquitetura, design system, padrões críticos).

---

## O que já está construído

### Conteúdo e CMS
- Editor rich-text próprio (Tiptap): headings, listas, tabelas, citações em destaque, blocos de código com syntax highlight, callouts semânticos (info/aviso/erro/dica), embeds de YouTube, blocos de encerramento.
- Pipeline de imagens completa: upload, Lambda `imageProcessor` (Sharp.js), 6 variantes responsivas (AVIF/WebP, 3 breakpoints) + blur placeholder (LQIP) inline, zero requisição extra.
- Agendamento de publicação (`postScheduler`, EventBridge + Lambda).
- Sanitização de HTML server-side em toda escrita: nenhum HTML bruto do editor é persistido sem allowlist.

### Performance & SEO
- ISR real em `/post/[slug]` (`generateStaticParams` + `revalidate: 60`), confirmado via Lighthouse: LCP médio caiu de 2,70s para 2,37s pós-fix, dentro do threshold "Good" do Core Web Vitals.
- Invalidação de cache CloudFront sob demanda (`/post/{slug}` + `/`) disparada automaticamente em save/publish/delete, sem depender só de TTL.
- 18/20 itens da auditoria de SEO concluídos: JSON-LD (`BlogPosting`, `BreadcrumbList`, `Organization`, `Person`, `ProfessionalService`), Open Graph, canonical, sitemap, favicon/manifest.
- GSIs do DynamoDB otimizadas (`ALL` para `INCLUDE`), contador atômico de posts publicados (evita scan duplicado em paginação).
- Bundle de produção auditado (`@next/bundle-analyzer`); migração de ícones de CSS/webfont (74KB) para SVG tree-shaken (~15KB).

### Segurança
- CSP e security headers reais via `aws_cloudfront_response_headers_policy` (não meta tag, que não funciona para `X-Frame-Options`).
- Lambda URLs com `AWS_IAM` + OAC SigV4: só CloudFront pode invocar.
- GuardDuty + CloudTrail ativos, Semgrep no CI a cada push, `npm audit --audit-level=high` obrigatório (zero high/critical tolerado).
- Auditoria de AppSec dedicada (6 critérios) e auditoria de engenharia completa (12 critérios) realizadas e documentadas.
- Toggle de PITR (Point-in-Time Recovery) implementado via Terraform, pronto para produção.

### Observabilidade
- Dashboards CloudWatch, X-Ray tracing em todas as Lambdas, Synthetics Canary, SLO burn-rate alarms.
- Logging estruturado (JSON, `level`/`message`/`timestamp`/`requestId`): `console.log` proibido no backend.

### Qualidade & automação de testes
- 96 testes backend (Jest) + 45 frontend (Jest) + 16 admin (Vitest) + 37 E2E (Playwright), cobrindo smoke, layout, post, artigos, busca, categoria.
- Ferramenta própria de QA: script Playwright que simula um usuário real publicando um post completo (login, digitação via input rules, upload de imagem, todos os node types do editor) e valida o resultado em duas camadas: round-trip no admin e DOM renderizado real da página pública (visibilidade, imagem decodificada, JSON-LD parseado, comparação de contagem de nós admin-vs-público, mobile + desktop).
- Compliance/legal: Consent Mode v2 (Google), CMP próprio (LGPD), páginas de política de privacidade/cookies/termos.

---

## Roadmap: camada de IA e expansão editorial

A ordem abaixo segue a lógica de implementação técnica, não de prioridade de produto: agrupa primeiro tudo que reaproveita a mesma peça de infraestrutura (geração de texto via LLM), depois a próxima peça de infraestrutura nova (geração de imagem), e por último a camada de distribuição, que consome o que as etapas anteriores produzem.

### 1. Resumos automáticos via IA
Gerar um resumo do post (usado hoje manualmente como `resumo`/meta description) automaticamente a partir do `conteudo_html`, via chamada a LLM no momento do save/publish. Primeiro ponto de integração com um provedor de IA generativa no backend: estabelece o padrão (gestão de chave/custo, prompt, tratamento de erro) que as duas etapas seguintes reaproveitam.
**Status:** planejado, não iniciado.

### 2. Geração de versão para LinkedIn
A partir do post publicado, gerar uma versão adaptada ao formato/tom do LinkedIn (hook, quebras de linha, CTA), com edição humana antes da publicação. Não é postagem automática, é rascunho assistido. Reaproveita a mesma infraestrutura de geração de texto do item 1, só muda o prompt e a superfície de UI no admin.
**Status:** planejado, não iniciado.

### 3. Versão do blog em inglês
Tradução do post para inglês via IA a partir da versão original em português, sempre com aprovação/curadoria humana antes de publicar: nunca publicação automática de conteúdo traduzido. A geração em si ainda é uma chamada de LLM (mesma infra dos itens 1 e 2), mas a tradução exige trabalho estrutural pesado: rotas i18n no Next.js, campo de idioma/tradução vinculado no modelo de dados do post, fluxo de revisão no admin (rascunho de tradução, aprovação, publicação) e SEO multi-idioma (hreflang, sitemap por idioma). Faz sentido endereçar enquanto o padrão de integração com IA ainda está ativo, antes de migrar para um domínio de infraestrutura totalmente diferente (geração de imagem).
**Status:** planejado, não iniciado. Maior item estrutural do roadmap.

### 4. Geração de imagens via template + IA
Imagem de destaque gerada automaticamente a partir de um template de design (mantendo a identidade visual do blog) combinado com geração de imagem por IA, reduzindo a dependência de banco de imagens manual. Domínio de infraestrutura novo (geração de imagem, não de texto), mas reaproveita o pipeline de imagens já existente (Lambda `imageProcessor`, variantes responsivas, S3) como destino do output gerado.
**Status:** planejado, não iniciado.

### 5. Newsletter
Envio recorrente (digest) reaproveitando os resumos gerados no item 1, com gestão de assinantes e disparo via serviço de e-mail transacional (ex. SES). Camada de distribuição, naturalmente a última: depende do conteúdo já existir pronto e curado (resumos, e idealmente já com a versão em inglês disponível) para ter o menor custo de produção possível.
**Status:** planejado, não iniciado.

> Nenhum desses 5 itens tem implementação iniciada nesta data: listados aqui para dar visibilidade da direção do produto, não do progresso técnico.

---

## Setup local

```bash
npm run install:all     # instala os 3 workspaces

cd frontend && cp .env.example .env.local && npm run dev   # http://localhost:3000
cd admin && cp .env.example .env.local && npm run dev      # http://localhost:5173
# backend não tem servidor local, roda só na AWS (ver backend/README.md)
```

## Testes

```bash
cd backend && npm test    # Jest, 96 testes
cd frontend && npm test   # Jest, 45 testes
cd admin && npm test      # Vitest, 16 testes
cd frontend && npm run test:e2e   # Playwright, 37 testes E2E
```

## Ambiente e deploy

Só `dev` existe hoje: produção ainda não foi provisionada. Branch de trabalho: `develop` (`main` é o snapshot estável). Push em `develop` dispara o pipeline completo via GitHub Actions: build, testes, `terraform apply`, deploy do frontend, admin e Lambdas.
