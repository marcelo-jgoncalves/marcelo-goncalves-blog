# Dev Hub — Quick Reference Card

**Bookmark this** for rapid development workflow.

## 🚀 Most Common Commands

```bash
# Start coding
dev.sh start                 # Frontend on :3000
dev.sh start-admin           # Admin on :5173

# Before committing
dev.sh pre-commit            # Tests + lint + typecheck (QUICK)
dev.sh validate              # ^ + build (COMPREHENSIVE)

# Deploy preparation
dev.sh clean && dev.sh build # Clean & build all
```

## 🧪 Testing Shortcuts

```bash
# All tests
dev.sh test                  # unit: Jest + Vitest

# Specific workspace
dev.sh test-frontend         # 45 unit + 37 E2E tests
dev.sh test-admin            # 16 tests
dev.sh test-backend          # 96 tests

# E2E tests
dev.sh test-e2e              # Headless (CI-like)
dev.sh test-e2e-headed       # Browser visible (debug)
```

## ✅ Validation Hierarchy

| Command | What it does | Time |
|---------|-------------|------|
| `pre-commit` | tests + lint + typecheck | ~30s |
| `validate` | ^ + build all | ~2min |
| Fresh deploy | clean + install + validate + build | ~5min |

## 🔧 Troubleshooting

```bash
# Port stuck?
dev.sh kill-ports

# Environment issues?
dev.sh env

# See logs
dev.sh logs

# Clean cache & rebuild
dev.sh clean && dev.sh build
```

## 📝 Before Every Push

1. **Make changes** with HMR hot-reload
2. **Test:** `dev.sh pre-commit`
3. **Fix any issues**
4. **Commit:** `git commit -m "feat(scope): message"`
5. **Push:** `git push && gh run list`

## 🎨 Design System Quick Links

- **Colors:** `frontend/app/globals.css` (lines 1-150)
- **Typography:** `frontend/app/globals.css` (lines 150-250)
- **Spacing:** `frontend/app/globals.css` (lines 250-350)
- **Config:** `frontend/lib/config.ts`

## 🚫 Golden Rules

1. ✅ Always `dev.sh pre-commit` before `git commit`
2. ✅ Always `await params` in Next.js `page.tsx`
3. ✅ Always use design tokens (never hardcode colors)
4. ❌ Never `console.log` in backend (use logger)
5. ❌ Never break existing tests

## 📊 Project Stats

- **Lines of Code:** ~15K (frontend + admin + backend)
- **Tests:** 194 total (unit + E2E)
- **Workspaces:** 4 (frontend, admin, backend, infra)
- **Design Tokens:** 40+ (colors, typography, spacing)
- **TypeScript Strict:** Yes, all workspaces

## 🔗 Key Files

```
README for me          → .project-context.md (read "⚡ PRÓXIMA SESSÃO")
Project rules          → CLAUDE.md (the constitution)
Design tokens          → frontend/app/globals.css
Site config            → frontend/lib/config.ts
Backend logging        → backend/src/common/logger.ts
HTML sanitization      → backend/src/common/sanitizer.ts
Admin types            → admin/src/types/index.ts
```

## 💡 Pro Tips

1. **Alias it:** Add to .bashrc / .zshrc / PowerShell profile
   ```bash
   alias dev='bash ~/.claude/projects/.../dev-hub/dev.sh'
   ```
   Then use: `dev start`, `dev validate`, etc.

2. **Watch mode for development:**
   ```bash
   cd frontend && npm test -- --watch
   ```

3. **E2E debugging:**
   ```bash
   dev.sh test-e2e-headed  # See browser, set breakpoints
   ```

4. **Check what changed:**
   ```bash
   dev.sh diff             # Your changes
   dev.sh status           # Unstaged + untracked
   ```

## 🎯 Typical Session

```bash
# 1. Setup (once per session)
dev.sh env                 # Check environment
dev.sh install             # Update dependencies if needed

# 2. Development loop
dev.sh start               # Terminal 1: Frontend dev server
# Make changes with HMR...

# 3. Before commit
dev.sh pre-commit          # Make sure tests pass
git commit -m "feat(...)"

# 4. Monitor deployment
git push
gh run list                # Watch GitHub Actions
```

---

**For full docs:** Read `SKILL.md` or `README.md` in this directory.  
**For project rules:** Read `CLAUDE.md` in project root.  
**For current context:** Read `.project-context.md` (⚡ section first).
