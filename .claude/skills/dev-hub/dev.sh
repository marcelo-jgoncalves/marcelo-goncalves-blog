#!/bin/bash
set -e

# Dev Hub Master Script — Marcelo Gonçalves Blog
# Central command center for development workflows

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COLORS_ON=true
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${GREEN}ℹ${NC} $*"; }
log_warn() { echo -e "${YELLOW}⚠${NC} $*"; }
log_error() { echo -e "${RED}✗${NC} $*"; exit 1; }
log_success() { echo -e "${GREEN}✓${NC} $*"; }
log_section() { echo -e "\n${BLUE}━━━ $* ━━━${NC}\n"; }

# ============================================================================
# HELP
# ============================================================================
show_help() {
  cat << 'EOF'
Dev Hub — Development Workflow Center

USAGE:
  dev.sh [COMMAND] [OPTIONS]

COMMANDS:

  📦 SETUP & DEPENDENCIES
    install           Install all workspaces (frontend, admin, backend)
    update            npm update all workspaces
    audit             npm audit all workspaces (security check)

  🚀 DEVELOPMENT SERVERS
    start             Start frontend dev server (Next.js on :3000)
    start:admin       Start admin dev server (Vue on :5173)
    start:all         Start all dev servers (requires multiple terminals)
    check-ports       Check which ports are in use (3000, 5173, etc.)
    kill-ports        Kill processes on dev ports

  🧪 TESTING
    test              Run all unit tests (jest + vitest)
    test:frontend     Jest tests in frontend/
    test:admin        Vitest tests in admin/
    test:backend      Jest tests in backend/
    test:e2e          Playwright E2E tests (frontend)
    test:e2e:headed   E2E tests with browser visible
    test:coverage     Coverage report for all workspaces
    test:watch        Watch mode for unit tests

  ✅ VALIDATION & LINTING
    lint              ESLint all workspaces
    typecheck         TypeScript check all workspaces
    validate          Full validation (tests + lint + types + build)
    pre-commit        Pre-commit check (quick validation before commit)

  🏗️ BUILDING
    build             Build all workspaces
    build:frontend    Build frontend (Next.js → OpenNext)
    build:admin       Build admin (Vue → dist/)
    build:backend     Build backend (esbuild + Sharp)
    clean             Clean build artifacts

  📝 GIT & COMMITS
    status            Show git status & changed files
    diff              Show git diff of changes
    commit            Helper to create conventional commit
    log               Show recent commits

  🔍 DEBUGGING & UTILITIES
    logs              View dev server logs
    env               Show environment variables
    tree              Tree view of project structure
    help              Show this help message

OPTIONS:
  -q, --quiet       Minimal output
  -v, --verbose     Detailed output
  --no-color        Disable colored output

EXAMPLES:

  # Start frontend development
  dev.sh start

  # Run all tests before committing
  dev.sh validate

  # Check everything is ready
  dev.sh pre-commit

  # Build for deployment
  dev.sh build

  # Create a conventional commit
  dev.sh commit

DOCUMENTATION:
  CLAUDE.md                    Project instructions & architecture
  .project-context.md          Active session state
  docs/contract.md             Engineering standards
  docs/design-system/          Design tokens & patterns
  docs/seo-audit.md            SEO checklist

For more details: https://github.com/marcelo-goncalves/blog
EOF
}

# ============================================================================
# SETUP & DEPENDENCIES
# ============================================================================
cmd_install() {
  log_section "Installing All Workspaces"
  cd "$PROJECT_ROOT"
  npm install --workspaces
  log_success "Dependencies installed"
}

cmd_update() {
  log_section "Updating All Workspaces"
  cd "$PROJECT_ROOT"
  npm update --workspaces
  log_success "Dependencies updated"
}

cmd_audit() {
  log_section "Security Audit (npm audit)"
  cd "$PROJECT_ROOT"
  npm audit --audit-level=high --workspaces || {
    log_warn "Vulnerabilities found (audit level: high)"
    log_info "Known acceptable: 11 moderate in aws-amplify@6"
  }
}

# ============================================================================
# DEV SERVERS
# ============================================================================
cmd_start() {
  log_section "Starting Frontend Dev Server"
  log_info "Next.js dev server will start on http://localhost:3000"
  log_info "Using Turbopack with HMR (Ctrl+Shift+R to force refresh)"
  cd "$PROJECT_ROOT/frontend"
  npm run dev
}

cmd_start_admin() {
  log_section "Starting Admin Dev Server"
  log_info "Vue + Vite dev server will start on http://localhost:5173"
  cd "$PROJECT_ROOT/admin"
  npm run dev
}

cmd_check_ports() {
  log_section "Checking Dev Ports"
  for port in 3000 5173 8080; do
    if lsof -i :$port 2>/dev/null | grep -q LISTEN; then
      echo "✓ Port $port: IN USE"
    else
      echo "✗ Port $port: free"
    fi
  done
}

cmd_kill_ports() {
  log_section "Killing Processes on Dev Ports"
  for port in 3000 5173; do
    if lsof -i :$port 2>/dev/null | grep -q LISTEN; then
      PID=$(lsof -t -i :$port)
      log_info "Killing process $PID on port $port"
      kill -9 $PID || true
    fi
  done
  log_success "Ports cleared"
}

# ============================================================================
# TESTING
# ============================================================================
cmd_test() {
  log_section "Running All Tests"
  log_info "Unit tests: Jest (frontend, backend) + Vitest (admin)"
  cd "$PROJECT_ROOT"

  log_info "Frontend tests..."
  cd "$PROJECT_ROOT/frontend" && npm test -- --passWithNoTests

  log_info "Admin tests..."
  cd "$PROJECT_ROOT/admin" && npm test -- --passWithNoTests

  log_info "Backend tests..."
  cd "$PROJECT_ROOT/backend" && npm test -- --passWithNoTests

  log_success "All unit tests passed"
}

cmd_test_e2e() {
  log_section "Running E2E Tests (Playwright)"
  log_info "Coverage: smoke, home-layout, post, artigos, busca, categoria"
  cd "$PROJECT_ROOT/frontend"
  npm run test:e2e
  log_success "E2E tests passed"
}

cmd_test_e2e_headed() {
  log_section "Running E2E Tests (Browser Visible)"
  cd "$PROJECT_ROOT/frontend"
  npm run test:e2e:headed
}

cmd_test_coverage() {
  log_section "Running Tests with Coverage"
  cd "$PROJECT_ROOT"

  cd "$PROJECT_ROOT/frontend" && npm run test:coverage || true
  cd "$PROJECT_ROOT/admin" && npm test -- --coverage || true
  cd "$PROJECT_ROOT/backend" && npm test -- --coverage || true

  log_info "Coverage reports generated (check each workspace)"
}

cmd_test_workspace() {
  local ws=$1
  log_section "Testing $ws"
  cd "$PROJECT_ROOT/$ws"
  npm test
}

# ============================================================================
# VALIDATION & LINTING
# ============================================================================
cmd_lint() {
  log_section "ESLint Check"
  cd "$PROJECT_ROOT"

  for ws in frontend admin backend; do
    log_info "Linting $ws..."
    cd "$PROJECT_ROOT/$ws"
    npm run lint 2>/dev/null || log_warn "$ws: lint errors found"
  done
}

cmd_typecheck() {
  log_section "TypeScript Check"
  cd "$PROJECT_ROOT"

  for ws in frontend admin backend; do
    log_info "Typechecking $ws..."
    cd "$PROJECT_ROOT/$ws"
    npx tsc --noEmit || log_error "$ws: type errors"
  done

  log_success "All workspaces pass type check"
}

cmd_pre_commit() {
  log_section "Pre-Commit Validation"

  log_info "1. Running tests..."
  cmd_test || log_error "Tests failed"

  log_info "2. Type checking..."
  cmd_typecheck || log_error "Type check failed"

  log_info "3. Linting..."
  cmd_lint || log_warn "Lint issues (non-fatal)"

  log_success "Pre-commit validation passed! Ready to commit."
  log_info "Next: git add . && git commit -m '...'"
}

cmd_validate() {
  log_section "Full Validation (Pre-deployment)"

  log_info "1. Tests..."
  cmd_test || log_error "Tests failed"

  log_info "2. Type checking..."
  cmd_typecheck || log_error "Type check failed"

  log_info "3. Linting..."
  cmd_lint || log_warn "Lint issues (non-fatal)"

  log_info "4. Building..."
  cmd_build || log_error "Build failed"

  log_success "Full validation passed!"
}

# ============================================================================
# BUILDING
# ============================================================================
cmd_build() {
  log_section "Building All Workspaces"
  cd "$PROJECT_ROOT"

  log_info "Building frontend (Next.js → OpenNext)..."
  cd "$PROJECT_ROOT/frontend" && npm run build

  log_info "Building admin (Vue → dist)..."
  cd "$PROJECT_ROOT/admin" && npm run build

  log_info "Building backend (esbuild + Sharp)..."
  cd "$PROJECT_ROOT/backend" && npm run build

  log_success "All builds completed successfully"
}

cmd_build_workspace() {
  local ws=$1
  log_section "Building $ws"
  cd "$PROJECT_ROOT/$ws"
  npm run build
}

cmd_clean() {
  log_section "Cleaning Build Artifacts"

  log_info "Cleaning frontend..."
  rm -rf "$PROJECT_ROOT/frontend/.next" "$PROJECT_ROOT/frontend/.open-next" "$PROJECT_ROOT/frontend/out"

  log_info "Cleaning admin..."
  rm -rf "$PROJECT_ROOT/admin/dist"

  log_info "Cleaning backend..."
  rm -rf "$PROJECT_ROOT/backend/dist" "$PROJECT_ROOT/backend/build"

  log_success "Build artifacts cleaned"
}

# ============================================================================
# GIT & COMMITS
# ============================================================================
cmd_status() {
  log_section "Git Status"
  cd "$PROJECT_ROOT"
  git status --short
  echo ""
  log_info "Detailed status:"
  git status
}

cmd_diff() {
  log_section "Git Diff"
  cd "$PROJECT_ROOT"
  git diff --stat
  echo ""
  git diff
}

cmd_log() {
  log_section "Recent Commits"
  cd "$PROJECT_ROOT"
  git log --oneline -10 --graph
}

# ============================================================================
# UTILITIES
# ============================================================================
cmd_logs() {
  log_section "Dev Server Logs"
  log_info "Frontend: /tmp/frontend-dev.log"
  log_info "Admin: /tmp/admin-dev.log"

  if [ -f /tmp/frontend-dev.log ]; then
    tail -20 /tmp/frontend-dev.log
  fi
}

cmd_env() {
  log_section "Environment Check"

  echo "Node.js: $(node -v)"
  echo "npm: $(npm -v)"
  echo "git: $(git --version | cut -d' ' -f3)"

  if command -v aws &> /dev/null; then
    echo "AWS CLI: $(aws --version 2>&1 | cut -d' ' -f1)"
  else
    log_warn "AWS CLI not found"
  fi

  if command -v terraform &> /dev/null; then
    echo "Terraform: $(terraform version | head -1)"
  else
    log_warn "Terraform not found"
  fi
}

# ============================================================================
# MAIN
# ============================================================================
main() {
  local cmd=$1

  if [ -z "$cmd" ]; then
    show_help
    exit 0
  fi

  case "$cmd" in
    # Setup
    install)        cmd_install ;;
    update)         cmd_update ;;
    audit)          cmd_audit ;;

    # Servers
    start)          cmd_start ;;
    start:admin)    cmd_start_admin ;;
    check-ports)    cmd_check_ports ;;
    kill-ports)     cmd_kill_ports ;;

    # Testing
    test)           cmd_test ;;
    test:e2e)       cmd_test_e2e ;;
    test:e2e:headed) cmd_test_e2e_headed ;;
    test:coverage)  cmd_test_coverage ;;
    test:frontend)  cmd_test_workspace frontend ;;
    test:admin)     cmd_test_workspace admin ;;
    test:backend)   cmd_test_workspace backend ;;

    # Validation
    lint)           cmd_lint ;;
    typecheck)      cmd_typecheck ;;
    validate)       cmd_validate ;;
    pre-commit)     cmd_pre_commit ;;

    # Building
    build)          cmd_build ;;
    build:frontend) cmd_build_workspace frontend ;;
    build:admin)    cmd_build_workspace admin ;;
    build:backend)  cmd_build_workspace backend ;;
    clean)          cmd_clean ;;

    # Git
    status)         cmd_status ;;
    diff)           cmd_diff ;;
    log)            cmd_log ;;

    # Utilities
    logs)           cmd_logs ;;
    env)            cmd_env ;;
    help|-h|--help) show_help ;;

    *)
      log_error "Unknown command: $cmd"
      show_help
      exit 1
      ;;
  esac
}

main "$@"
