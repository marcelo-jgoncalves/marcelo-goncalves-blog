# Auditoria AppSec — Categoria 5: Supply Chain, Infraestrutura como Código e CI/CD

> Data: 2026-06-28
> Referência: OWASP ASVS V14 (Configuração/Build), AWS Well-Architected — Security Pillar
> Escopo: `.github/workflows/*.yml`, branch protection (verificado via GitHub API), Terraform (`infra/`).
> Apenas análise — nenhum código foi alterado nesta etapa.

## 🔴 Achados de alto impacto

### 1. Nenhuma branch protection em `main` nem em `develop`

Confirmado via API do GitHub (`gh api repos/.../branches/{main,develop}/protection` → `404 Branch not protected` para ambas). Não há nenhuma regra exigindo: review obrigatória antes de merge, status checks (CI) obrigatórios antes de merge/push, ou proibição de force-push.

Na prática, isso significa que a política documentada no `CLAUDE.md` ("Pipeline vermelha = trabalho incompleto. Investigar antes de continuar.") é hoje **inteiramente comportamental** — depende de quem está operando (humano ou IA) escolher segui-la. Não há controle técnico do lado do GitHub que impeça um push direto a `main` com testes quebrados, ou um force-push que reescreva histórico. Para um repositório agora **público**, isso também abre a porta para qualquer colaborador externo (se algum dia for adicionado) burlar revisão.

**Recomendação:** configurar branch protection em `main` (mínimo: exigir status check do `Deploy Pipeline (CD)` e do `Security Scan` antes de merge, proibir force-push) e considerar uma versão mais leve em `develop` (talvez só "exigir CI verde", já que é o branch de trabalho diário do projeto).

## 🟡 Achados de impacto médio

### 2. Semgrep roda só com `--severity ERROR` e rulesets genéricos de linguagem

`.github/workflows/security.yml` usa `--config p/typescript --config p/nodejs --severity ERROR` (backend, frontend e admin). Dois limitadores reais:
- `--severity ERROR` descarta tudo classificado como `WARNING`/`INFO` pelo Semgrep — muitos padrões de risco real (uso de `eval`, regex potencialmente vulnerável a ReDoS, parsing inseguro) são sinalizados como `WARNING`, não `ERROR`, nos rulesets públicos do Semgrep.
- Os rulesets usados são genéricos de linguagem (`p/typescript`, `p/nodejs`), não rulesets dedicados de segurança. Existem rulesets gratuitos prontos no Semgrep Registry (`p/owasp-top-ten`, `p/secrets`, `p/jwt`, `p/sql-injection`, `p/xss`) que dariam cobertura mais profunda sem custo adicional (Semgrep Community é gratuito) e sem mudar a ferramenta já adotada.

### 3. GitHub Actions referenciadas por tag mutável (`@v4`), não por SHA fixo

Todos os 3 workflows (`cd.yml`, `deploy.yml`, `security.yml`) usam `actions/checkout@v4`, `actions/setup-node@v4`, etc. — tags como `v4` podem, em teoria, ser re-apontadas pelo mantenedor da action para um commit diferente (inclusive maliciosamente, em caso de comprometimento da conta do mantenedor) sem que o nosso workflow mude uma linha. Pin por SHA completo (`actions/checkout@<sha>`) elimina essa classe de risco de supply chain. Trade-off real: perde-se atualização automática de patch da action — mitigável com Dependabot também cobrindo `.github/workflows` (hoje provavelmente só cobre `package.json`, não verificado nesta auditoria).

## 🟢 Pontos positivos (manter)

- **Autenticação AWS via OIDC** (`secrets.AWS_ROLE_ARN_DEV`/`AWS_ROLE_ARN_PROD`) — sem chave de longa duração armazenada como secret, exatamente a prática recomendada para CI/CD na AWS.
- `npm audit --audit-level=high` já roda em CI com gate (zero high/critical tolerado), Dependabot ativo para atualização de dependências.
- `permissions: contents: read` já declarado explicitamente em `security.yml` — least-privilege também no `GITHUB_TOKEN`, não só no IAM da AWS.
- **GitHub secret scanning + push protection habilitados** (sessão 53) — camada adicional gratuita, relevante agora que o repositório é público.
- Nenhuma credencial hardcoded encontrada em nenhum scan desta ou de auditorias anteriores.

## Resumo

O achado de maior impacto desta categoria não é uma falha de ferramenta — é a ausência completa de um controle estrutural (branch protection) que normalmente é o primeiro item de qualquer checklist de CI/CD security. As ferramentas de scanning que já existem (Semgrep, npm audit, secret scanning) são corretas na escolha, mas estão configuradas de forma mais permissiva do que poderiam ser sem custo adicional algum.
