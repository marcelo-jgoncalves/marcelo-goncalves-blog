# Dev Hub — Development Workflow Center

Complete development environment hub for the **Marcelo Gonçalves Blog** project. One command center for building, testing, linting, serving, committing, and validating all changes.

## 🚀 Quick Start

```bash
# Start frontend dev server
bash dev.sh start
# or on Windows:
.\dev.ps1 start

# Run all tests
bash dev.sh validate
# or
.\dev.ps1 validate

# Show all available commands
bash dev.sh help
# or
.\dev.ps1 help
```

## 📋 What's Included

### Master Scripts

| File | Platform | Purpose |
|------|----------|---------|
| `dev.sh` | Linux/Mac | Main command center (Bash) |
| `dev.ps1` | Windows | Main command center (PowerShell) |
| `SKILL.md` | All | Claude Code skill metadata & full documentation |
| `README.md` | All | This guide |

### Commands by Category

**📦 Setup & Dependencies**
- `install` — Install all workspaces
- `update` — Update dependencies
- `audit` — Security vulnerability check

**🚀 Development Servers**
- `start` — Frontend (Next.js on :3000)
- `start-admin` or `start:admin` — Admin (Vue on :5173)
- `check-ports` — See which ports are in use
- `kill-ports` — Free up dev ports

**🧪 Testing**
- `test` — All unit tests (Jest + Vitest)
- `test-frontend` — Frontend only
- `test-admin` — Admin only
- `test-backend` — Backend only
- `test-e2e` — Playwright E2E (headless)
- `test-e2e-headed` — E2E with browser visible
- `test-coverage` — Coverage reports

**✅ Validation**
- `lint` — ESLint all workspaces
- `typecheck` — TypeScript check
- `validate` — Full validation (tests + lint + types + build)
- `pre-commit` — Quick pre-commit check

**🏗️ Building**
- `build` — Build all workspaces
- `build-frontend` or `build:frontend` — Frontend only
- `build-admin` or `build:admin` — Admin only
- `build-backend` or `build:backend` — Backend only
- `clean` — Remove build artifacts

**📝 Git Workflow**
- `status` — Git status
- `diff` — Show changes
- `log` — Recent commits

**🔍 Utilities**
- `env` — Environment check
- `logs` — View dev server logs
- `help` — Show all commands

## 📁 Project Structure

```
marcelo-goncalves-blog/
├── frontend/        Next.js 16 (dev server: npm run dev on :3000)
├── admin/           Vue 3 + Vite (dev server: npm run dev on :5173)
├── backend/         Node.js 20 + Lambdas (AWS Lambda in dev)
├── infra/           Terraform (AWS infrastructure)
├── docs/            Documentation (design system, guides)
└── .claude/skills/dev-hub/   ← You are here
```

## 🎯 Common Workflows

### 1. Start Development Session

```bash
# Option 1: Just frontend
bash dev.sh start
# Open http://localhost:3000

# Option 2: Frontend + Admin (2 terminals)
# Terminal 1:
bash dev.sh start

# Terminal 2:
bash dev.sh start-admin
# Open http://localhost:5173
```

### 2. Before Committing

```bash
# Quick validation (tests only)
bash dev.sh pre-commit

# Or full validation (tests + lint + build)
bash dev.sh validate
```

### 3. Deploy Preparation

```bash
# Clean everything
bash dev.sh clean

# Install fresh
bash dev.sh install

# Full validation
bash dev.sh validate

# Build for deployment
bash dev.sh build
```

### 4. Debug Issues

```bash
# Check environment
bash dev.sh env

# Kill stuck ports
bash dev.sh kill-ports

# View logs
bash dev.sh logs

# Type check only
bash dev.sh typecheck

# Lint only
bash dev.sh lint
```

### 5. Testing Strategies

```bash
# Run all tests
bash dev.sh test

# Run specific workspace tests
bash dev.sh test-frontend

# E2E tests with browser visible
bash dev.sh test-e2e-headed

# Coverage report
bash dev.sh test-coverage
```

## 🔧 Usage Examples

### Linux / macOS

```bash
cd path/to/marcelo-goncalves-blog
bash .claude/skills/dev-hub/dev.sh [COMMAND]

# Examples:
bash .claude/skills/dev-hub/dev.sh start
bash .claude/skills/dev-hub/dev.sh validate
bash .claude/skills/dev-hub/dev.sh build
```

### Windows (PowerShell)

```powershell
cd path\to\marcelo-goncalves-blog
.\\.claude\skills\dev-hub\dev.ps1 [COMMAND]

# Examples:
.\\.claude\skills\dev-hub\dev.ps1 start
.\\.claude\skills\dev-hub\dev.ps1 validate
.\\.claude\skills\dev-hub\dev.ps1 build
```

### From Any Directory

```bash
# Add to .bashrc / .zshrc / PowerShell profile:
alias dev='bash ~/.claude/projects/c--Users-Usuario-Desktop-projects-marcelo-goncalves-blog/.claude/skills/dev-hub/dev.sh'

# Then use from anywhere:
dev start
dev validate
dev build
```

## 📊 Workspaces & Tests

| Workspace | Type | Test Runner | Count | Command |
|---|---|---|---|---|
| `frontend/` | Next.js 16 | Jest | 45 | `npm test` |
| `frontend/` | Next.js 16 | Playwright | 37 | `npm run test:e2e` |
| `admin/` | Vue 3 | Vitest | 16 | `npm test` |
| `backend/` | Node.js | Jest | 96 | `npm test` |
| **Total** | — | — | **194** | — |

## 🎨 Design System & Tokens

Key files for development:

- **`frontend/app/globals.css`** — CSS design tokens (colors, typography, spacing)
- **`frontend/lib/config.ts`** — SEO constants and site configuration
- **`docs/design-system/design-reference.md`** — Complete token reference
- **`docs/contract.md`** — Engineering standards (logging, security, SEO)
- **`.project-context.md`** — Active session state (read "⚡ PRÓXIMA SESSÃO")

## 🔑 Critical Rules

✅ **Always follow:**
- Conventional commits: `feat:`, `fix:`, `refactor:`, `style:`, `test:`, `docs:`, `chore:`
- `params` is a Promise in Next.js — always `await params` before destructuring
- Use design tokens, never hardcode colors
- Logger not console.log in backend
- Sanitize HTML before saving to DynamoDB
- Run full validation before pushing

❌ **Never:**
- Use `--aws-orange`, `--aws-dark`, `--gray-*` colors
- Use `Space Grotesk` or `DM Sans` fonts
- Break existing tests
- Hardcode AWS credentials
- Skip security headers or SEO metadata

## 🐛 Troubleshooting

| Issue | Solution |
|---|---|
| `npm: command not found` | Install Node.js 20+ from nodejs.org |
| Port 3000/5173 already in use | Run `dev.sh kill-ports` or `dev.ps1 kill-ports` |
| Module not found errors | Run `dev.sh install` to install dependencies |
| TypeScript errors | Run `dev.sh typecheck` to see detailed errors |
| Turbopack crashes | Run `dev.sh clean` to clear cache |
| Tests fail to run | Make sure you're in the workspace directory (e.g., `cd frontend`) |
| E2E tests timeout | Run `dev.sh test-e2e-headed` to see browser and debug |
| Build fails | Check `dev.sh logs` and ensure all dependencies are installed |

## 📚 Documentation

For detailed information, read:

1. **CLAUDE.md** — Project constitution (rules, architecture, patterns)
2. **.project-context.md** — Current session state and next actions
3. **docs/contract.md** — Engineering standards
4. **docs/design-system/design-reference.md** — Design tokens
5. **docs/audit-report.md** — Technical debt & resolutions
6. **docs/seo-audit.md** — SEO checklist (18/20 complete)

## 🚀 Next Steps

When starting work:

1. Read `.project-context.md` (⚡ PRÓXIMA SESSÃO section)
2. Run `dev.sh pre-commit` to verify setup
3. Start dev server: `dev.sh start`
4. Make changes with HMR hot-reload
5. Run tests: `dev.sh test` before committing
6. Commit with conventional message: `git commit -m "feat(component): description"`
7. Push and monitor CI: `git push && gh run list`

## 📞 Support

- **Project Owner:** Marcelo Gonçalves (PM/Architect)
- **Your Role:** Autonomous Staff Engineer
- **Questions:** Read CLAUDE.md first (it's the authority)
- **Issues:** Open GitHub issue with details and steps to reproduce

---

**Created:** Session 36 (2026-05-22)  
**Status:** Active & production-ready  
**Platforms:** Windows (PowerShell), macOS (Bash), Linux (Bash)
