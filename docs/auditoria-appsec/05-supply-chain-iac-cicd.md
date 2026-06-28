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

## 🟡 Achados de impacto médio — ✅ corrigidos (mesma sessão, ver nota de correção abaixo)

### 2. ~~Semgrep roda só com `--severity ERROR` e rulesets genéricos de linguagem~~ — ✅ corrigido

`.github/workflows/security.yml` usava `--config p/typescript --config p/nodejs --severity ERROR` (backend, frontend e admin) — rulesets genéricos de linguagem, não dedicados de segurança. **Corrigido:** adicionados `--config p/owasp-top-ten --config p/secrets --config p/jwt` nos 3 scans, mantendo `--severity ERROR` por ora (testado localmente: 0 findings novos nesse nível, mudança segura). Em `--severity WARNING` os rulesets novos já confirmaram, de forma independente, o achado de stored XSS da Categoria 2 (`PostFooter.tsx`/`AuthorBox.tsx`) — e revelaram um achado novo, não catalogado nesta auditoria original: ver nota abaixo.

**Achado novo descoberto durante a correção (fora do escopo original, não corrigido ainda):** os mesmos rulesets, em `--severity WARNING`, sinalizaram 9 ocorrências de `dangerouslySetInnerHTML={{ __html: JSON.stringify(x) }}` usadas para JSON-LD (`layout.tsx`, `post/[slug]/page.tsx`, `categoria/[slug]/page.tsx`, `artigos/page.tsx`, `sobre/page.tsx`, `servicos/page.tsx`, `o-projeto/page.tsx`). `JSON.stringify` não escapa `<`/`>`/`/` por padrão — um `titulo` de post contendo `</script><script>...` quebraria para fora da tag (titulo não passa por `sanitizePostHtml`, só `conteudo_html` e agora `bio` passam). Mitigação padrão é trocar `<` por `<` no JSON antes de embutir. Não implementado nesta correção — é um achado novo, fora do escopo original dos 13 itens médios, fica para triagem antes de elevar o gate de CI para `WARNING`.

### 3. ~~GitHub Actions referenciadas por tag mutável (`@v4`), não por SHA fixo~~ — ✅ corrigido

Todos os 3 workflows (`cd.yml`, `deploy.yml`, `security.yml`) usavam `actions/checkout@v4`, `actions/setup-node@v4`, etc. — tags mutáveis. **Corrigido:** todas as referências (`actions/checkout`, `actions/setup-node`, `actions/cache`, `actions/upload-artifact`, `actions/download-artifact`, `aws-actions/configure-aws-credentials`, `hashicorp/setup-terraform`) pinadas ao SHA do commit atual da tag, com a versão preservada em comentário (`@<sha> # v4`). **Achado adicional encontrado e corrigido no mesmo gesto:** `aquasecurity/trivy-action@master` (em `deploy.yml`) estava referenciando a branch `master` diretamente — pior prática que uma tag mutável, já que `master` muda a cada commit do mantenedor. Pinado para a última release (`v0.36.0`).

## Correção a um achado desta própria auditoria — Trivy já cobre parte do scan de IaC

A Categoria original não mencionou (erro desta auditoria, corrigido agora): `deploy.yml` já roda `aquasecurity/trivy-action` em modo `scan-type: config` contra todo o repositório, com `exit-code: 1` para severidade `CRITICAL`/`HIGH` — isso **é** um scanner estático de IaC (Trivy absorveu boa parte das regras do `tfsec`). A ressalva real: esse workflow (`deploy.yml`, "Validação de Pull Request") só roda em `pull_request`, não em `push` direto a `develop`/`main` — e este projeto, na prática, opera com push direto à `develop` na maior parte do tempo (sem abrir PR). Ou seja, o scanner existe, mas não é exercitado pelo fluxo de trabalho real usado neste projeto. Ver `estudos/08-iac-security-scanning.md` (corrigido também).

## 🟢 Pontos positivos (manter)

- **Autenticação AWS via OIDC** (`secrets.AWS_ROLE_ARN_DEV`/`AWS_ROLE_ARN_PROD`) — sem chave de longa duração armazenada como secret, exatamente a prática recomendada para CI/CD na AWS.
- `npm audit --audit-level=high` já roda em CI com gate (zero high/critical tolerado), Dependabot ativo para atualização de dependências.
- `permissions: contents: read` já declarado explicitamente em `security.yml` — least-privilege também no `GITHUB_TOKEN`, não só no IAM da AWS.
- **GitHub secret scanning + push protection habilitados** (sessão 53) — camada adicional gratuita, relevante agora que o repositório é público.
- Nenhuma credencial hardcoded encontrada em nenhum scan desta ou de auditorias anteriores.

## Resumo

O achado de maior impacto desta categoria não é uma falha de ferramenta — é a ausência completa de um controle estrutural (branch protection) que normalmente é o primeiro item de qualquer checklist de CI/CD security. As ferramentas de scanning que já existem (Semgrep, npm audit, secret scanning) são corretas na escolha, mas estão configuradas de forma mais permissiva do que poderiam ser sem custo adicional algum.
