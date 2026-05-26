---
name: dev-hub
description: Complete development workflow hub — build, test, lint, serve, commit, validate
trigger: Development tasks, testing, building, server startup, pre-commit validation
---

# Development Hub — Marcelo Gonçalves Blog

Central command center for efficient development. One-stop skill for all dev workflows: servers, tests, linting, building, committing, and validation.

## Quick Commands

| Task | Command |
|---|---|
| **Start dev servers** | `/dev start` or `npm run dev` in each workspace |
| **Run all tests** | `/dev test` — unit tests + e2e |
| **Lint & typecheck** | `/dev lint` — ESLint + TypeScript |
| **Build all** | `/dev build` — frontend, backend, admin |
| **Validate changes** | `/dev validate` — tests + lint + types + build |
| **Pre-commit check** | `/dev pre-commit` — full validation before commit |
| **View quick help** | `/dev help` |

## Architecture Overview

```
Monorepo (workspaces)
├── frontend/          Node.js 20 + Next.js 16 + React 19
│   ├── npm run dev    Dev server on :3000
│   ├── npm test       45 Jest unit tests
│   ├── npm run test:e2e  37 Playwright E2E tests
│   └── npm run build  → .open-next/ (OpenNext v3)
│
├── admin/             Node.js 20 + Vue 3 + Vite
│   ├── npm run dev    Dev server on :5173
│   ├── npm test       16 Vitest unit tests
│   └── npm run build
│
├── backend/           Node.js 20 + TypeScript
│   ├── npm test       96 Jest unit tests
│   ├── npm run build  → esbuild + Sharp
│   └── (no dev server — Lambda functions)
│
└── infra/             Terraform (AWS IaC)
    ├── terraform plan
    └── terraform apply
```

## Dev Servers

### Start All Servers

```bash
# Terminal 1: Frontend (Next.js + HMR on :3000)
cd frontend && npm run dev

# Terminal 2: Admin (Vue + Vite on :5173)  
cd admin && npm run dev

# Backend runs on AWS Lambda (no local dev server)
# API Gateway: https://5duus31al8.execute-api.us-east-1.amazonaws.com/v1
```

### Frontend (`http://localhost:3000`)
- **Next.js 16** with App Router
- **Turbopack** hot-reload (Ctrl+Shift+R to force refresh)
- **SEO:** robots.txt blocks `/` in dev (`cloudfront.net` detection)
- **Key files:** `app/layout.tsx`, `app/page.tsx`, design tokens in `lib/config.ts`

### Admin (`http://localhost:5173`)
- **Vue 3 + Vite** with HMR
- **Pinia** state management
- **Tiptap** rich text editor (v2.11.0 — do not upgrade to v3)
- **AWS Amplify** for auth
- **Key files:** `src/views/*.vue`, `src/types/index.ts`, `src/assets/main.css`

## Testing

### Run Tests by Workspace

```bash
# Frontend (Jest)
cd frontend && npm test                    # unit tests
cd frontend && npm run test:e2e            # Playwright E2E
cd frontend && npm run test:coverage       # coverage report

# Admin (Vitest)
cd admin && npm test

# Backend (Jest)
cd backend && npm test
```

### Test Coverage

| Workspace | Runner | Count | Command |
|---|---|---|---|
| frontend | Jest | 45 | `npm test` |
| frontend | Playwright | 37 | `npm run test:e2e` |
| admin | Vitest | 16 | `npm test` |
| backend | Jest | 96 | `npm test` |
| **Total** | — | **194** | — |

### E2E Tests (Playwright)

Coverage: smoke, home-layout, post, artigos, busca, categoria

```bash
cd frontend

# Run headless
npm run test:e2e

# Run with browser visible
npm run test:e2e:headed

# Run specific test
npx playwright test tests/smoke.spec.ts
```

## Linting & Type Checking

### TypeScript Check

```bash
cd frontend && npx tsc --noEmit
cd admin && npx tsc --noEmit
cd backend && npx tsc --noEmit
```

### ESLint

```bash
cd frontend && npm run lint
cd admin && npm run lint
cd backend && npm run lint
```

### Prettier (if configured)

```bash
npx prettier --write "frontend/**/*.{ts,tsx,css}"
npx prettier --write "admin/**/*.{vue,ts,css}"
npx prettier --write "backend/**/*.{ts,js}"
```

## Building

### Build Each Workspace

```bash
# Frontend → OpenNext v3
cd frontend && npm run build    # outputs to .open-next/

# Admin
cd admin && npm run build       # outputs to dist/

# Backend
cd backend && npm run build     # outputs esbuild bundles + Sharp layer
```

### Full Build (Pre-deployment)

```bash
# Frontend
cd frontend && npm install && npm run build

# Admin
cd admin && npm install && npm run build

# Backend (includes Sharp binary for Linux)
cd backend && npm install && npm run build
```

## Pre-Commit Validation

Before running `git commit`:

```bash
# 1. Run tests
npm test --all              # all workspaces

# 2. Lint & typecheck
npm run lint --all
npx tsc --noEmit

# 3. Build locally
npm run build --all

# 4. Check browser behavior (critical for CSS/layout changes)
# Start dev server, open http://localhost:3000, verify visually
```

## Git Workflow

### Conventional Commits

Every commit MUST follow: `<type>(<scope>): <message>`

```bash
# Examples:
git commit -m "feat(post): implement PostFooter with share + author section"
git commit -m "fix(newsletter-widget): change overflow to visible"
git commit -m "style(sidebar-widgets): add atmospheric blob effects"
git commit -m "test(consent): add 17 tests for Consent Mode v2"
git commit -m "refactor(responsive-image): simplify image variant logic"
git commit -m "docs(design-system): update token reference"
git commit -m "chore: update Next.js to 16.2.4"
```

### Types

- `feat` — new feature
- `fix` — bug fix
- `refactor` — code refactor (no feature change)
- `style` — styling/visual changes
- `test` — add/update tests
- `docs` — documentation
- `chore` — dependencies, config, cleanup

### After Commit

```bash
# Verify pipeline
git push
gh run list
```

**Red pipeline = work incomplete. Investigate before continuing.**

## Quick Utilities

### Kill Port (if server won't start)

```bash
# Linux/Mac
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows PowerShell
Get-NetTCPConnection -LocalPort 3000 | Stop-Process -Force
```

### Clean Cache

```bash
# Next.js
rm -rf frontend/.next frontend/.turbopack

# Vite
rm -rf admin/dist admin/node_modules/.vite

# Node modules (full reset)
rm -rf frontend/node_modules admin/node_modules backend/node_modules
npm install --workspaces
```

### View Logs

```bash
# Dev server (if running in background)
tail -f /tmp/frontend-dev.log
tail -f /tmp/admin-dev.log

# CI logs
gh run view <run-id> --log
```

## Critical Rules (Non-negotiable)

### Next.js 16 Specifics

- ✅ `params` is a **Promise** — always `await params` in `page.tsx` before destructuring
- ✅ ISR revalidation: posts `revalidate: 60`, lists `revalidate: 300`, static pages `revalidate: 3600`
- ✅ Every new `page.tsx` MUST have `generateMetadata()` with title, description, canonical, og, twitter
- ❌ Never use `<Image>` Next.js with `src` local path — use `<img>` or `<ResponsiveImage>`

### Backend (Lambdas)

- ✅ Use `logger.info/debug/warn/error` — never `console.log`
- ✅ Sanitize HTML via `backend/src/common/sanitizer.ts` before saving to DB
- ✅ New Lambdas: include `tracing_config { mode = local.xray_mode }` from first commit

### Database (DynamoDB)

- ✅ `e_popular` and `e_projeto` are `Number (0/1)` — NOT Boolean (GSI limitation)

### Design System (Non-negotiable)

- ✅ Use tokens: `--accent`, `--text-default`, `--surface-card`, `--space-4`, `--text-2xl` etc.
- ❌ Never use `--aws-orange`, `--aws-dark`, `--gray-*` — removed from both frontend & admin
- ❌ Never use `Space Grotesk` or `DM Sans` — use Inter only
- ✅ Fonts: `--font-display: Inter`, `--font-sans: Inter`, `--font-mono: JetBrains Mono`

### SEO & Security

- ✅ All pages have JSON-LD (Organization, BlogPosting, BreadcrumbList, etc.)
- ✅ robots.ts blocks `/` in dev mode (CloudFront detection)
- ✅ Consent Mode v2 before any ad/analytics scripts
- ✅ Lambda URL: `authorization_type = "AWS_IAM"` + OAC SigV4

## Key Files & References

| File | Purpose |
|---|---|
| `.project-context.md` | Active session state — **read "⚡ PRÓXIMA SESSÃO" at start** |
| `docs/contract.md` | Engineering standards (logging, SEO, design system, security) |
| `docs/audit-report.md` | Technical debt history & resolutions |
| `docs/design-system/design-reference.md` | Complete color & typography tokens |
| `docs/seo-audit.md` | SEO checklist (18/20 done) |
| `CLAUDE.md` | Full project instructions (this repo's constitution) |
| `frontend/lib/config.ts` | SEO constants, site config |
| `frontend/lib/consent.ts` | Consent Mode v2, CMP stubs |
| `admin/src/types/index.ts` | Centralized types (Post, Categoria, etc.) |
| `admin/src/utils/slug.ts` | URL-safe slugification (always use) |
| `backend/src/common/logger.ts` | Structured logging |
| `backend/src/common/sanitizer.ts` | HTML sanitization (always use before DB save) |

## AWS & Terraform

```bash
# View Terraform state
aws s3 cp s3://marcelo-goncalves-blog-dev-tfstate/blog/terraform.tfstate - | jq

# AWS CLI with correct profile
aws --profile claude-dev s3 ls s3://marcelo-goncalves-blog-dev-...

# Lambda invoke (for testing)
aws lambda invoke --function-name blog-dev-getPost \
  --payload '{"slug":"example"}' \
  --profile claude-dev response.json
```

## Environment Variables

### Frontend (Next.js)

```bash
# .env.local (not committed)
NEXT_PUBLIC_SITE_URL=https://dsns2wusdrj9z.cloudfront.net
API_URL=https://5duus31al8.execute-api.us-east-1.amazonaws.com/v1
```

### Admin (Vite)

```bash
# .env.local (not committed)
VITE_API_URL=https://5duus31al8.execute-api.us-east-1.amazonaws.com/v1
VITE_ADMIN_ORIGIN=https://d11ubkpuy1di6r.cloudfront.net
```

### Backend

- Env vars are set via **Terraform** (Lambda environment)
- Never hardcode credentials
- Use AWS Secrets Manager for sensitive data

## Troubleshooting

| Issue | Solution |
|---|---|
| Port 3000/5173 in use | Kill: `lsof -i :3000 \| xargs kill -9` or change `PORT=3001 npm run dev` |
| `npm: command not found` | Node.js not installed. Install 20+ from nodejs.org |
| Module not found errors | Run `npm install` in affected workspace |
| Turbopack crash | Clear: `rm -rf .next .turbopack` then retry |
| TypeScript errors in IDE | Run `tsc --noEmit` to see full errors; may need restart |
| E2E tests timeout | Increase timeout in `playwright.config.ts` or run headed mode |
| AWS credentials missing | Configure: `aws configure --profile claude-dev` |
| Terraform state locked | Check: `aws s3 ls s3://marcelo-goncalves-blog-dev-tfstate/` |
| Admin won't build | Check: `npm audit` for vulnerabilities; 11 moderate in aws-amplify@6 are known |

## Session Checklist

Before starting work:

- [ ] Read `.project-context.md` — "⚡ PRÓXIMA SESSÃO" section
- [ ] Check git branch: `develop` is active branch
- [ ] Run `npm install` if any lockfiles changed
- [ ] Verify servers can start: `npm run dev` in each workspace
- [ ] Run full test suite: `npm test --all`
- [ ] Check CI: `gh run list` to see latest pipeline status

After finishing work:

- [ ] All tests pass locally
- [ ] No lint/type errors: `tsc --noEmit && npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Browser behavior validated (visual tests for UI changes)
- [ ] `.project-context.md` updated if architectural changes
- [ ] Conventional commit with scope and clear message
- [ ] `git push` → monitor `gh run list`

## Next Steps

When starting development:

1. `cd frontend && npm run dev` (or admin/backend as needed)
2. Open `http://localhost:3000` (or :5173 for admin)
3. Make changes with HMR hot-reload
4. Run `npm test` in workspace before committing
5. Follow git workflow: `git commit` → `git push` → monitor pipeline

For detailed session context, read `docs/design-system/`, `.project-context.md`, and `CLAUDE.md`.
