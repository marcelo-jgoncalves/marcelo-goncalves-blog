# Auditoria de Engenharia — Critério 4: CI/CD, Pipeline e Engenharia de Repositório

> Data: 2026-06-27
> Escopo: robustez dos workflows, gates de qualidade, tempo de pipeline, e a questão monorepo vs. polyrepo.
> Apenas análise — nenhum código foi alterado nesta etapa.

## Mapa de workflows existentes

| Workflow | Gatilho | O que faz |
|---|---|---|
| `deploy.yml` (PR validator) | PR para `main`/`develop` | Por workspace (backend/frontend/admin): `npm audit --audit-level=high` + `npm test`. Para infra: `terraform fmt --check` + `validate` + Trivy (CRITICAL/HIGH) |
| `security.yml` | push/PR em `develop`/`main` | Semgrep (severity ERROR) em backend/frontend/admin |
| `cd.yml` | push em `develop`/`main` | Build (backend esbuild, frontend OpenNext) → deploy dev automático (`develop`) ou plan + aprovação manual + apply (`main`→prod) |

## 🔴 Achados de alto impacto

### 1. O build só é validado *depois* do merge, não antes

`deploy.yml` (o gate de PR) roda apenas `npm test` e `npm audit` por workspace — **nunca** `npm run build`, nem `tsc --noEmit`, nem `vue-tsc --build`. A primeira vez que o build de fato é executado é em `cd.yml`, que só roda em push para `develop`/`main` — ou seja, **depois** que o código já foi merged e o pipeline já está deployando para infraestrutura real (dev hoje, prod no futuro).

Um erro de build do Next.js, um erro de tipo que o Jest não exercita, ou uma falha do `vite build` passam pela revisão de PR sem serem detectados, e só aparecem quando o deploy já está em andamento.

**Recomendação:** adicionar `npm run build` (frontend/admin) e `tsc --noEmit` (os 3 workspaces) como step do `deploy.yml`, antes do merge.

### 2. Os 64 testes E2E (Playwright) nunca rodam em CI

O frontend tem `npm run test:e2e` configurado e funcional (confirmado no critério 3), mas nenhum workflow o invoca. A suíte de testes com melhor cobertura de regressão do projeto está disponível só localmente — nunca protege um PR ou um deploy automaticamente.

**Recomendação:** adicionar um job de E2E no `deploy.yml` (ou pós-deploy no `cd.yml`, rodando contra a URL real de dev) — esta segunda opção é preferível: valida o ambiente que de fato vai para o ar.

## 🟡 Achados de impacto médio

### 3. Lint não roda em CI (referência cruzada com critério 2)

Já reportado em `02-qualidade-de-codigo.md` — mencionado aqui porque é um gap de desenho de pipeline, não só de configuração de workspace.

### 4. Nenhum smoke test pós-deploy

`cd.yml` faz `terraform apply` + sync S3 + invalidação CloudFront e encerra. Não há nenhum `curl`/health-check confirmando que a URL de dev (ou prod) respondeu 200 após a invalidação. Hoje a validação "funcionou" é manual (você abrindo o browser).

### 5. CI roda a matriz inteira em todo PR, sem filtro por path

Nenhum workflow usa `paths:` no gatilho. Um PR que toca só `frontend/` ainda dispara jobs de backend, admin e terraform. No tamanho atual (poucos minutos de pipeline) o custo é baixo, mas cresce proporcionalmente conforme os workspaces crescem.

## 🟢 Pontos positivos (manter)

- **Sem credenciais estáticas de AWS** — autenticação via OIDC (`role-to-assume` + `permissions: id-token: write`), aderente ao princípio least-privilege do `contract.md`.
- **Separação plan/apply em produção** — `plan-prod` gera o plano, salva como artefato, gate de **aprovação manual** (`environment: production`), e só então `terraform apply tfplan-prod` usa exatamente o plano aprovado (não um novo plan no momento do apply). Isso evita a janela clássica de drift entre "o que foi aprovado" e "o que foi aplicado" — prática de nível sênior.
- **Scan de segurança em 2 camadas**: Trivy (IaC, CRITICAL/HIGH) + Semgrep (SAST de código, severity ERROR) + `npm audit --audit-level=high` por workspace — cobertura de segurança automatizada acima da média para o porte do projeto.
- **Dependabot semanal** já mantém dependências atualizadas (achado de sessão anterior, confirmado ainda válido).
- Builds de backend e frontend rodam em paralelo (`build-backend`/`build-frontend` sem dependência entre si) — bom uso de paralelismo no `cd.yml`.

---

## Engenharia de repositório: monorepo vs. polyrepo

### Estado atual

O repositório se descreve como monorepo (`package.json` raiz: `"description": "Monorepo: ..."`), mas **não é um monorepo de verdade** — não há `workspaces` configurado. Cada workspace (`frontend/`, `backend/`, `admin/`) tem seu próprio `package.json` e `package-lock.json`, instalado independentemente (`cd X && npm install`). Na prática é uma **pasta única contendo 3 projetos Node independentes** + Terraform — não um grafo de dependências unificado.

### Veredito: monorepo é a escolha certa para este caso — manter, mas formalizar

Razões específicas para este projeto (não é resposta genérica):

1. **Dono único, sem fronteira de equipe.** O argumento mais forte a favor de polyrepo é isolamento de ownership/release entre times. Com 1 desenvolvedor, esse argumento não existe.
2. **Acoplamento real e frequente entre as 3 camadas.** Mudar um campo do `Post` (achado #1 do critério 1) toca backend, admin e frontend ao mesmo tempo. Em polyrepo isso vira 3 PRs coordenados manualmente, em 3 repos, com risco de versões dessincronizadas entre deploys — pior do que a duplicação de tipos que já existe hoje.
3. **Infra acoplada ao código que ela hospeda.** Adicionar uma Lambda nova exige mudança simultânea em `backend/src/functions/` e `infra/modules/lambda/`. Isso é exatamente o caso de uso onde IaC-no-monorepo funciona bem — uma única PR, um único CI run, histórico atômico.
4. **Custo operacional de polyrepo não tem quem absorva.** Polyrepo exigiria: publicar/versionar um pacote de tipos compartilhado, duplicar segredos/config de CI em múltiplos repos, coordenar PRs cross-repo. Isso é overhead de plataforma que só se paga com múltiplos times.
5. **Estágio do projeto.** Pré-produção, otimizando para velocidade de mudança e refactors atômicos de schema — exatamente o que monorepo favorece.

### O que falta para ser um monorepo de verdade (não apenas chamado assim)

- **Adotar `workspaces` no `package.json` raiz** (npm ou pnpm workspaces) — lockfile único, deps compartilhadas hospedadas, e abre caminho para um workspace `packages/shared-types` (resolve o achado #1 do critério 1 de uma vez).
- **Avaliar Turborepo** (mais leve que Nx, encaixa bem num stack 100% JS/TS) para cache de build/test e execução `--filter` (só roda o que mudou) — resolve o achado #5 deste critério sem reescrever os workflows do zero.
- **Path filters nos workflows** (`paths:` no `on:`) — ganho imediato e de baixo esforço, independente de adotar uma ferramenta de monorepo.

### Quando reconsiderar polyrepo

Se no futuro houver um segundo engenheiro dedicado só ao admin, ou uma exigência de compliance que demande isolamento de acesso por repositório — nenhum dos dois é o caso hoje.

## Resumo do critério 4

O pipeline tem boas práticas de segurança e de promoção para produção (OIDC, plan/apply separado, scans em camadas), mas o gate de PR é mais fraco do que o gate de deploy — build e E2E só são exercitados depois do merge. A escolha de monorepo está certa para o estágio do projeto; falta só torná-lo um monorepo de fato (workspaces formais) em vez de 3 projetos soltos numa mesma pasta.
