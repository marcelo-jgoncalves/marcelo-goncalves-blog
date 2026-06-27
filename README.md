# Blog Marcelo Gonçalves

Blog de autoridade sobre IA, AWS e DevOps. Monorepo serverless: Next.js 16 (blog público), Vue 3 (CMS admin), 9 Lambdas Node.js/TypeScript, Terraform (AWS).

## Estrutura

```
frontend/   Next.js 16 + OpenNext v3 — blog público (Lambda + CloudFront + S3)
backend/    Node.js 20 + TypeScript — 9 Lambdas
admin/      Vue 3 + Vite + Pinia + AWS Amplify — CMS
infra/      Terraform — 7 módulos AWS
docs/       Documentação viva do projeto
```

## Setup rápido

```bash
npm run install:all     # instala os 3 workspaces

cd frontend && cp .env.example .env.local && npm run dev   # http://localhost:3000
cd admin && cp .env.example .env.local && npm run dev      # http://localhost:5173
# backend não tem servidor local — roda só na AWS (ver backend/README.md)
```

## Documentação

- **`CLAUDE.md`** — instruções operacionais completas (arquitetura, regras críticas, design system).
- **`docs/contract.md`** — padrões de engenharia (logging, segurança, observabilidade).
- **`.project-context.md`** — estado vivo do projeto, sessão por sessão.
- **`docs/auditoria-engenharia/`** — auditoria de engenharia completa (12 critérios), 2026-06.

## Ambiente

Só `dev` existe hoje. Branch de trabalho: `develop`. Pipeline: GitHub Actions (`.github/workflows/`).
