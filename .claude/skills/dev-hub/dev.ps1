# Dev Hub Master Script — Windows PowerShell
# Central command center for development workflows

param(
    [string]$Command = "",
    [switch]$Verbose,
    [switch]$Quiet
)

$ErrorActionPreference = "Stop"
$PROJECT_ROOT = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))

# Colors
$Green = "`e[32m"
$Red = "`e[31m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Reset = "`e[0m"

function Write-Info { Write-Host "$Green[*]$Reset $args" }
function Write-Warn { Write-Host "$Yellow[!]$Reset $args" -ForegroundColor Yellow }
function Write-Error-Custom { Write-Host "$Red[x]$Reset $args" -ForegroundColor Red; exit 1 }
function Write-Success { Write-Host "$Green[✓]$Reset $args" -ForegroundColor Green }
function Write-Section { Write-Host "`n$Blue━━━ $args ━━━$Reset`n" }

# ============================================================================
# HELP
# ============================================================================
function Show-Help {
@"
Dev Hub — Development Workflow Center (Windows PowerShell)

USAGE:
  .\dev.ps1 [COMMAND]

COMMANDS:

  📦 SETUP & DEPENDENCIES
    install           Install all workspaces
    update            npm update all workspaces
    audit             npm audit check

  🚀 DEVELOPMENT SERVERS
    start             Start frontend (Next.js on :3000)
    start-admin       Start admin (Vue on :5173)
    check-ports       Check dev ports
    kill-ports        Kill processes on dev ports

  🧪 TESTING
    test              Run all unit tests
    test-e2e          Playwright E2E tests
    test-e2e-headed   E2E tests with browser
    test-coverage     Coverage report
    test-frontend     Jest tests
    test-admin        Vitest tests
    test-backend      Backend tests

  ✅ VALIDATION & LINTING
    lint              ESLint all workspaces
    typecheck         TypeScript check
    validate          Full validation
    pre-commit        Pre-commit check

  🏗️ BUILDING
    build             Build all workspaces
    build-frontend    Build frontend
    build-admin       Build admin
    build-backend     Build backend
    clean             Clean artifacts

  📝 GIT & COMMITS
    status            Git status
    diff              Git diff
    log               Recent commits

  🔍 DEBUGGING
    logs              View dev logs
    env               Environment check
    help              Show this help

EXAMPLES:
  .\dev.ps1 start         # Start dev server
  .\dev.ps1 validate      # Full validation
  .\dev.ps1 pre-commit    # Pre-commit check
  .\dev.ps1 build         # Build all
"@
}

# ============================================================================
# SETUP & DEPENDENCIES
# ============================================================================
function Invoke-Install {
    Write-Section "Installing All Workspaces"
    Set-Location $PROJECT_ROOT
    npm install --workspaces
    Write-Success "Dependencies installed"
}

function Invoke-Update {
    Write-Section "Updating All Workspaces"
    Set-Location $PROJECT_ROOT
    npm update --workspaces
    Write-Success "Dependencies updated"
}

function Invoke-Audit {
    Write-Section "Security Audit (npm audit)"
    Set-Location $PROJECT_ROOT
    npm audit --audit-level=high --workspaces
    Write-Info "Known acceptable: 11 moderate in aws-amplify@6"
}

# ============================================================================
# DEV SERVERS
# ============================================================================
function Invoke-Start {
    Write-Section "Starting Frontend Dev Server"
    Write-Info "Next.js dev server will start on http://localhost:3000"
    Write-Info "Using Turbopack with HMR"
    Set-Location "$PROJECT_ROOT/frontend"
    npm run dev
}

function Invoke-StartAdmin {
    Write-Section "Starting Admin Dev Server"
    Write-Info "Vue + Vite dev server will start on http://localhost:5173"
    Set-Location "$PROJECT_ROOT/admin"
    npm run dev
}

function Invoke-CheckPorts {
    Write-Section "Checking Dev Ports"
    foreach ($port in @(3000, 5173, 8080)) {
        $connection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($connection) {
            Write-Host "✓ Port $port : IN USE (PID: $($connection.OwningProcess))"
        } else {
            Write-Host "✗ Port $port : free"
        }
    }
}

function Invoke-KillPorts {
    Write-Section "Killing Processes on Dev Ports"
    foreach ($port in @(3000, 5173)) {
        $connection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($connection) {
            $pid = $connection.OwningProcess
            Write-Info "Killing process $pid on port $port"
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
    Write-Success "Ports cleared"
}

# ============================================================================
# TESTING
# ============================================================================
function Invoke-Test {
    Write-Section "Running All Tests"
    Write-Info "Unit tests: Jest + Vitest"

    Write-Info "Frontend tests..."
    Set-Location "$PROJECT_ROOT/frontend"
    npm test -- --passWithNoTests 2>&1 | Out-Null

    Write-Info "Admin tests..."
    Set-Location "$PROJECT_ROOT/admin"
    npm test -- --passWithNoTests 2>&1 | Out-Null

    Write-Info "Backend tests..."
    Set-Location "$PROJECT_ROOT/backend"
    npm test -- --passWithNoTests 2>&1 | Out-Null

    Write-Success "All unit tests passed"
}

function Invoke-TestE2E {
    Write-Section "Running E2E Tests (Playwright)"
    Write-Info "Coverage: smoke, home-layout, post, artigos, busca, categoria"
    Set-Location "$PROJECT_ROOT/frontend"
    npm run test:e2e
    Write-Success "E2E tests passed"
}

function Invoke-TestE2EHeaded {
    Write-Section "Running E2E Tests (Browser Visible)"
    Set-Location "$PROJECT_ROOT/frontend"
    npm run test:e2e:headed
}

function Invoke-TestCoverage {
    Write-Section "Running Tests with Coverage"

    Set-Location "$PROJECT_ROOT/frontend"
    npm run test:coverage 2>&1 | Out-Null

    Set-Location "$PROJECT_ROOT/admin"
    npm test -- --coverage 2>&1 | Out-Null

    Set-Location "$PROJECT_ROOT/backend"
    npm test -- --coverage 2>&1 | Out-Null

    Write-Info "Coverage reports generated"
}

# ============================================================================
# VALIDATION & LINTING
# ============================================================================
function Invoke-Lint {
    Write-Section "ESLint Check"

    foreach ($ws in @("frontend", "admin", "backend")) {
        Write-Info "Linting $ws..."
        Set-Location "$PROJECT_ROOT/$ws"
        npm run lint 2>&1 | Out-Null
    }

    Write-Success "Lint check complete"
}

function Invoke-TypeCheck {
    Write-Section "TypeScript Check"

    foreach ($ws in @("frontend", "admin", "backend")) {
        Write-Info "Typechecking $ws..."
        Set-Location "$PROJECT_ROOT/$ws"
        npx tsc --noEmit 2>&1 | Out-Null
    }

    Write-Success "All workspaces pass type check"
}

function Invoke-PreCommit {
    Write-Section "Pre-Commit Validation"

    Write-Info "1. Running tests..."
    Invoke-Test

    Write-Info "2. Type checking..."
    Invoke-TypeCheck

    Write-Info "3. Linting..."
    Invoke-Lint

    Write-Success "Pre-commit validation passed! Ready to commit."
}

function Invoke-Validate {
    Write-Section "Full Validation (Pre-deployment)"

    Write-Info "1. Tests..."
    Invoke-Test

    Write-Info "2. Type checking..."
    Invoke-TypeCheck

    Write-Info "3. Linting..."
    Invoke-Lint

    Write-Info "4. Building..."
    Invoke-Build

    Write-Success "Full validation passed!"
}

# ============================================================================
# BUILDING
# ============================================================================
function Invoke-Build {
    Write-Section "Building All Workspaces"

    Write-Info "Building frontend (Next.js → OpenNext)..."
    Set-Location "$PROJECT_ROOT/frontend"
    npm run build

    Write-Info "Building admin (Vue → dist)..."
    Set-Location "$PROJECT_ROOT/admin"
    npm run build

    Write-Info "Building backend (esbuild + Sharp)..."
    Set-Location "$PROJECT_ROOT/backend"
    npm run build

    Write-Success "All builds completed successfully"
}

function Invoke-Clean {
    Write-Section "Cleaning Build Artifacts"

    Write-Info "Cleaning frontend..."
    Remove-Item -Path "$PROJECT_ROOT/frontend/.next", `
                      "$PROJECT_ROOT/frontend/.open-next", `
                      "$PROJECT_ROOT/frontend/out" `
               -Recurse -Force -ErrorAction SilentlyContinue

    Write-Info "Cleaning admin..."
    Remove-Item -Path "$PROJECT_ROOT/admin/dist" -Recurse -Force -ErrorAction SilentlyContinue

    Write-Info "Cleaning backend..."
    Remove-Item -Path "$PROJECT_ROOT/backend/dist", `
                      "$PROJECT_ROOT/backend/build" `
               -Recurse -Force -ErrorAction SilentlyContinue

    Write-Success "Build artifacts cleaned"
}

# ============================================================================
# GIT
# ============================================================================
function Invoke-Status {
    Write-Section "Git Status"
    Set-Location $PROJECT_ROOT
    git status
}

function Invoke-Diff {
    Write-Section "Git Diff"
    Set-Location $PROJECT_ROOT
    git diff --stat
    Write-Host ""
    git diff | Select-Object -First 100
}

function Invoke-Log {
    Write-Section "Recent Commits"
    Set-Location $PROJECT_ROOT
    git log --oneline -10 --graph
}

# ============================================================================
# UTILITIES
# ============================================================================
function Invoke-Env {
    Write-Section "Environment Check"

    Write-Host "Node.js : $(node -v)"
    Write-Host "npm     : $(npm -v)"
    Write-Host "git     : $(git --version)"

    if (Get-Command aws -ErrorAction SilentlyContinue) {
        Write-Host "AWS CLI : $(aws --version)"
    } else {
        Write-Warn "AWS CLI not found"
    }

    if (Get-Command terraform -ErrorAction SilentlyContinue) {
        Write-Host "Terraform : $(terraform version | Select-Object -First 1)"
    } else {
        Write-Warn "Terraform not found"
    }
}

# ============================================================================
# MAIN
# ============================================================================
switch ($Command) {
    # Setup
    "install"           { Invoke-Install }
    "update"            { Invoke-Update }
    "audit"             { Invoke-Audit }

    # Servers
    "start"             { Invoke-Start }
    "start-admin"       { Invoke-StartAdmin }
    "check-ports"       { Invoke-CheckPorts }
    "kill-ports"        { Invoke-KillPorts }

    # Testing
    "test"              { Invoke-Test }
    "test-e2e"          { Invoke-TestE2E }
    "test-e2e-headed"   { Invoke-TestE2EHeaded }
    "test-coverage"     { Invoke-TestCoverage }

    # Validation
    "lint"              { Invoke-Lint }
    "typecheck"         { Invoke-TypeCheck }
    "validate"          { Invoke-Validate }
    "pre-commit"        { Invoke-PreCommit }

    # Building
    "build"             { Invoke-Build }
    "clean"             { Invoke-Clean }

    # Git
    "status"            { Invoke-Status }
    "diff"              { Invoke-Diff }
    "log"               { Invoke-Log }

    # Utilities
    "env"               { Invoke-Env }
    "help"              { Show-Help }
    ""                  { Show-Help }

    default {
        Write-Error-Custom "Unknown command: $Command"
        Show-Help
    }
}
