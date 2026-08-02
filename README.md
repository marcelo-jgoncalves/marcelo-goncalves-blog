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
| Auth | AWS Cognito (SRP) + sessão BFF | Admin único; sessão opaca em cookie httpOnly (`SameSite=Strict`), armazenada em DynamoDB (`admin_sessions`), atrás de proxy same-origin no CloudFront |
| CDN / Edge | CloudFront + S3 + OAC | Cache/origin-request policies gerenciadas, invalidação sob demanda em save/publish/delete |
| IaC | Terraform (~> 1.8) | 10 módulos AWS, state em S3, lint via `tflint` + README por módulo via `terraform-docs` |
| CI/CD | GitHub Actions | Build, lint, testes (unitários + integração + E2E smoke) e `terraform apply` gateando o deploy, 100% automático em `develop` |
| Observabilidade | CloudWatch, X-Ray, Synthetics Canary, GuardDuty, CloudTrail | Dashboards, SLO burn-rate, tracing distribuído, DLQ + alarme para as 2 Lambdas assíncronas |
| Testes | Jest (backend/frontend), Vitest (admin), Playwright (E2E + smoke pós-deploy) | ~175 testes unitários backend + 5 de integração (DynamoDB Local), 81 frontend, 25 admin, 80 E2E |

---

## Arquitetura do monorepo

```
marcelo-goncalves-blog/
├── frontend/    Next.js 16 + OpenNext v3 (blog público)
├── backend/     Node.js 20 + TypeScript (9 Lambdas)
├── admin/       Vue 3 + Vite + Pinia (CMS)
├── infra/       Terraform, módulos AWS (lambda, dynamodb, frontend, admin,
│                api-gateway, cognito, media, observability, security-monitoring, finops)
└── .github/     Pipelines de CI/CD
```

**Lambdas (backend):** `getPost`, `getPosts`, `getAuthor`, `adminPosts`, `adminAuthors`, `adminCategories`, `mediaUpload`, `imageProcessor`, `postScheduler`.

`CLAUDE.md`, na raiz, descreve as regras de engenharia não-negociáveis do projeto (arquitetura, design system, padrões críticos).

---

## O que já está construído

### Conteúdo e CMS
- Editor rich-text próprio (Tiptap): headings, listas, tabelas, citações em destaque, blocos de código com syntax highlight, callouts semânticos (info/aviso/erro/dica), embeds de YouTube, blocos de encerramento.
- Pipeline de imagens completa: upload, Lambda `imageProcessor` (Sharp.js), 6 variantes responsivas (AVIF/WebP, 3 breakpoints) + blur placeholder (LQIP) inline, zero requisição extra.
- Agendamento de publicação (`postScheduler`, EventBridge + Lambda).
- Sanitização de HTML server-side em toda escrita: nenhum HTML bruto do editor é persistido sem allowlist.

### Performance & SEO
- ISR real em `/post/[slug]` (`generateStaticParams` + `revalidate: 60`); LCP médio dentro do threshold "Good" do Core Web Vitals.
- Cache/origin-request policies do CloudFront modernas nas rotas SSR, com TTL forçado na borda para listagens paginadas; invalidação sob demanda (`/post/{slug}` + `/`) disparada em save/publish/delete.
- 18/20 itens da auditoria de SEO concluídos: JSON-LD (`BlogPosting`, `BreadcrumbList`, `Organization`, `Person`, `ProfessionalService`), Open Graph, canonical, sitemap, favicon/manifest.
- GSIs do DynamoDB com projection `INCLUDE`, contador atômico de posts publicados (evita scan duplicado em paginação).
- Ícones renderizados como SVG tree-shaken por rota (sem webfont/CSS de ícone completo carregado globalmente).

### Segurança
- CSP e security headers reais via `aws_cloudfront_response_headers_policy` (não meta tag, que não funciona para `X-Frame-Options`).
- Lambda URLs com `AWS_IAM` + OAC SigV4: só CloudFront pode invocar.
- Sessão do admin via BFF: cookie httpOnly, sem token Cognito em Web Storage.
- Cognito com fluxo SRP (`ALLOW_USER_SRP_AUTH`), sem senha em texto plano na rede.
- DLQ (SQS) + alarme de profundidade nas Lambdas assíncronas (`imageProcessor`, `postScheduler`), com notificação SNS.
- Pipeline de CI trava o deploy se lint/testes (unitários, integração ou E2E smoke) falharem.
- GuardDuty + CloudTrail ativos, Semgrep no CI a cada push, `npm audit --audit-level=high` obrigatório (zero high/critical tolerado).
- `tflint` + Trivy (config scan) no CI de infraestrutura.
- Toggle de PITR (Point-in-Time Recovery) implementado via Terraform, pronto para produção.

### Observabilidade
- Dashboards CloudWatch, X-Ray tracing em todas as Lambdas, Synthetics Canary, SLO burn-rate alarms.
- Logging estruturado (JSON, `level`/`message`/`timestamp`/`requestId`): `console.log` proibido no backend.

### Qualidade & automação de testes
- ~175 testes backend (Jest) + 5 de integração contra DynamoDB Local + 81 frontend (Jest) + 25 admin (Vitest) + 80 E2E (Playwright, 19 specs), cobrindo smoke, layout, post, artigos, todos-artigos, busca, categoria, projeto e auditoria visual.
- Ferramenta própria de QA: script Playwright que simula um usuário real publicando um post completo (login, digitação via input rules, upload de imagem, todos os node types do editor) e valida o resultado em duas camadas: round-trip no admin e DOM renderizado real da página pública (visibilidade, imagem decodificada, JSON-LD parseado, comparação de contagem de nós admin-vs-público, mobile + desktop).
- Compliance/legal: Consent Mode v2 (Google), CMP próprio (LGPD), páginas de política de privacidade/cookies/termos.

---

## Roadmap

- **Resumos automáticos via IA** — síntese gerada para cada artigo, facilitando leitura rápida e navegação.
- **Versão em inglês** — publicação multilíngue com rotas, metadata, canonical e hreflang próprios.
- **Tradução assistida por IA** — rascunho de tradução gerado após decisão editorial, sempre com revisão humana.
- **Publicação social com aprovação** — rascunhos e mídias para redes sociais, com etapa explícita de aprovação.
- **Newsletter** — canal editorial opcional, condicionado a consentimento e infraestrutura própria.
- **Atendimento via WhatsApp com IA** — triagem inicial automatizada, com escalonamento para atendimento humano quando necessário.
- **Nutrição automatizada de leads** — sequência guiada por comportamento de leitura, conduzindo o contato até o diagnóstico de consultoria.
- **Ebook proprietário** — material estruturado com os aprendizados e frameworks do projeto.

Nenhum desses itens tem implementação iniciada nesta data.

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
cd backend && npm test               # Jest, ~175 testes
cd backend && npm run test:integration   # Jest + DynamoDB Local, 5 testes
cd frontend && npm test              # Jest, 81 testes
cd admin && npm test                 # Vitest, 25 testes
cd frontend && npm run test:e2e      # Playwright, 80 testes E2E (19 specs)
```

## Ambiente e deploy

Só `dev` existe hoje: produção ainda não foi provisionada. Branch de trabalho: `develop` (`main` é o snapshot estável). Push em `develop` dispara o pipeline completo via GitHub Actions: build, testes, `terraform apply`, deploy do frontend, admin e Lambdas.
