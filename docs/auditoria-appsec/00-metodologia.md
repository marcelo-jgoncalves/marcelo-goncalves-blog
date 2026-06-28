# Auditoria AppSec — Sumário Executivo e Metodologia

> Data de execução: 2026-06-28
> Plano original: `docs/plano-auditoria-appsec.md`
> Frameworks de referência: OWASP ASVS v5 (Level 1 + itens selecionados de L2), OWASP API Security Top 10 2023, AWS Well-Architected Framework — Security Pillar.
> Esta é uma auditoria **dedicada e profunda** de AppSec — diferente da auditoria de engenharia anterior (`docs/auditoria-engenharia/05-seguranca.md`), que tratou segurança como 1 de 12 critérios. A maioria dos achados daquela auditoria já foi corrigida (IAM least-privilege, CSP/X-Frame-Options, sanitizer iframe, S3 uploads-raw) — esta auditoria não repete o que já foi fechado, vai mais a fundo no que ainda não tinha sido olhado.

## Como foi executada

Análise estática de código (leitura direta de todos os 8 Lambdas, Terraform de todos os módulos, workflows de CI/CD) combinada com verificação **real** contra o ambiente: consultas diretas à conta AWS via CLI (GuardDuty, CloudTrail, DynamoDB encryption) e à API do GitHub (branch protection). Nenhuma exploração ativa foi tentada contra os endpoints de produção/dev além do que já havia sido validado em sessões anteriores (headers HTTP via `curl`).

## Sumário de achados por severidade

| Severidade | Quantidade | Categorias afetadas |
|---|---|---|
| 🔴 Alto impacto | 4 | Autenticação (1), Validação de Entrada (1), CI/CD (1), Observabilidade (1) |
| 🟡 Impacto médio | 13 | Todas as 6 categorias |
| 🟢 Pontos positivos confirmados | 20+ | Todas as 6 categorias |

## Os 4 achados de alto impacto, em ordem de leitura recomendada

1. **[Categoria 1] Cognito sem MFA + login por senha ainda habilitado** — único ponto de autenticação de todo o sistema, sem nenhuma camada de defesa além da senha.
2. **[Categoria 2] `adminAuthors` não sanitiza `bio` — stored XSS real no blog público** (`PostFooter.tsx`, `AuthorBox.tsx`, ambos via `dangerouslySetInnerHTML`). Viola regra não-negociável já existente no `CLAUDE.md` para `conteudo_html`, só não aplicada a este campo.
3. **[Categoria 5] Nenhuma branch protection em `main` nem `develop`** — confirmado via API do GitHub, 404 nos dois.
4. **[Categoria 6] Nenhum CloudTrail nem GuardDuty na conta AWS** — confirmado via AWS CLI, zero detectores/trails.

**O fio condutor entre os 4:** os achados #1 e #2 formam uma cadeia direta — comprometer a única conta admin (achado #1, sem MFA) dá a um atacante acesso imediato ao achado #2 (editar a própria bio para injetar script contra todo visitante do blog). Os achados #3 e #4 são sobre **detecção e contenção**: mesmo que #1 e #2 sejam corrigidos, ainda não haveria como saber se algo do tipo aconteceu no passado, nem impedir um push direto e não revisado que reintroduza qualquer um dos dois.

## Backlog de remediação (ordem ascendente de risco de implementação, convenção já usada nas auditorias anteriores deste projeto)

> **Atualização pós-execução (mesma sessão, 2026-06-28):** itens 1, 4, 6, 9 (parcial), 11, 12 já foram corrigidos. Ver checkmarks abaixo e os arquivos de categoria correspondentes para o detalhe de cada correção, validação (`terraform plan`, testes, lint) e o que ficou de fora do escopo.

| # | Ação | Achado relacionado | Risco de implementar | Status |
|---|---|---|---|---|
| 1 | Padronizar erro genérico em `adminPosts`/`adminCategorias`/`mediaUpload` (já é o padrão nos outros 5 Lambdas) | Cat. 6, #2 | Nenhum | ✅ Corrigido |
| 1b | *(fora da ordem original, fixado por ser trivial junto do #2)* Sanitizar `bio` em `adminAuthors` | Cat. 2, #1 (🔴) | Baixo | ✅ Corrigido |
| 2 | ~~Aplicar `sanitizePostHtml()` (ou equivalente) em `bio` no `adminAuthors`~~ | Cat. 2, #1 (🔴) | Baixo | ✅ Corrigido (ver 1b) |
| 3 | Configurar branch protection em `main` (status checks obrigatórios, sem force-push) | Cat. 5, #1 (🔴) | Nenhum (config GitHub, não código) | Pendente |
| 4 | Expandir Semgrep: rulesets de segurança dedicados + revisar threshold de severidade | Cat. 5, #2 | Baixo | ✅ Rulesets adicionados (severidade ainda `ERROR` — ver nota) |
| 5 | Habilitar CloudTrail (1 trail multi-região) + GuardDuty (1 detector) | Cat. 6, #1 (🔴) | Baixo (ativação de serviço AWS) | Pendente |
| 6 | `usage_plan`/throttling no API Gateway | Cat. 4, #1 | Médio (precisa calibrar limites sem afetar tráfego legítimo) | ✅ Corrigido |
| 7 | Habilitar MFA `OPTIONAL` no Cognito + fortalecer password policy | Cat. 1, #1 (🔴) parcial, #2 | Médio (comunicar ao único usuário) | Password policy ✅; MFA pendente |
| 8 | Migrar para `ALLOW_USER_SRP_AUTH` exclusivo (fecha item #19 do backlog já existente) | Cat. 1, #1 (🔴) completo | Médio-alto (testar fluxo de login do admin antes) | Pendente |
| 9 | Allowlist de `Content-Type` + limite de tamanho em `mediaUpload` | Cat. 2, #3 / Cat. 4, #2 | Médio | Allowlist ✅; limite de tamanho pendente (exige presigned POST) |
| 10 | Introduzir lib de validação de schema (`zod`) + fechar mass assignment em `savePost` | Cat. 2, #2, #4 | Médio-alto (toca lógica central de salvamento de post) | Pendente |
| 11 | Pin de GitHub Actions por SHA | Cat. 5, #3 | Baixo (manutenção contínua) | ✅ Corrigido (incluindo `trivy-action@master` → versão pinada, achado adicional) |
| 12 | DynamoDB: declarar SSE explícito com chave KMS AWS-managed | Cat. 3, #2 | Médio (recriação de configuração de tabela existente) | ✅ Corrigido (update in-place, sem recriação) |
| 13 | TLS moderno via CloudFront (`minimum_protocol_version`) | Cat. 3, #1 | Bloqueado — depende de domínio definitivo (pré-condição externa) | Bloqueado |

## Achados novos descobertos durante a remediação (fora do escopo original)

1. **JSON-LD vulnerável a quebra de tag via `titulo`/`resumo` não escapados** — 9 ocorrências de `dangerouslySetInnerHTML={{ __html: JSON.stringify(x) }}` no frontend (`layout.tsx` e 7 páginas). `JSON.stringify` não escapa `<`/`>`/`/`; um título de post com `</script><script>...` quebraria a tag. Descoberto ao testar localmente os novos rulesets do Semgrep em severidade `WARNING`. **Não corrigido** — fica para uma próxima sessão, fora do escopo desta rodada de achados médios. Ver `docs/auditoria-appsec/05-supply-chain-iac-cicd.md`.
2. **`deploy.yml` já tinha um scanner de IaC (Trivy `config` mode)** que a Categoria 5 original não havia notado — mas só dispara em `pull_request`, não no fluxo real de push direto a `develop` usado neste projeto. Corrigido o texto da auditoria; o gap funcional (workflow não exercitado no fluxo real) continua aberto.

## Validação da remediação

`npm run lint` + `tsc --noEmit -p tsconfig.test.json` + `npm test` (backend: 121/121, +1 teste novo de allowlist; frontend: 81/81) limpos. `terraform fmt`/`validate`/`plan -var-file=env/dev.tfvars`: 1 to add (`aws_api_gateway_method_settings.throttle_all`), 18 to change (Cognito password policy, DynamoDB SSE ×3, source_code_hash de Lambdas afetadas + nextjs_server, drift pré-existente não relacionado em `aws_api_gateway_gateway_response`), 0 to destroy.

## Índice das categorias

| Arquivo | Categoria | ASVS |
|---|---|---|
| `01-autenticacao-sessao-controle-acesso.md` | Autenticação, Sessão, Controle de Acesso | V2, V3, V4 |
| `02-validacao-entrada-upload-api.md` | Validação de Entrada, Upload, API | V5, V12, API Top 10 |
| `03-criptografia-comunicacao-configuracao.md` | Criptografia, Comunicação, Configuração | V6, V9, V10 |
| `04-logica-negocio-abuse-cases.md` | Lógica de Negócio / Abuse Cases | V11 |
| `05-supply-chain-iac-cicd.md` | Supply Chain, IaC, CI/CD | V14, V15, V16 |
| `06-arquitetura-logging-dados-observabilidade.md` | Arquitetura, Logging, Dados, Observabilidade | V1, V7, V8, V17 |

## Avaliação geral

A base já é sólida — sessões anteriores fecharam corretamente IAM least-privilege, CSP/headers reais, sanitização de `conteudo_html`, e bucket hardening. O padrão que se repete nesta auditoria mais profunda é o mesmo identificado na auditoria de engenharia: **controles que existem em um lugar mas não foram replicados de forma consistente** (sanitização aplicada a `conteudo_html` mas não a `bio`; tratamento de erro genérico em 5 Lambdas mas não nos outros 3) — e **ausência de camadas de detecção** (CloudTrail/GuardDuty, branch protection, rate limiting) que não previnem um ataque específico, mas são o que separa "corrigir um bug" de um programa de segurança world-class, que assume que algo vai falhar e se prepara para perceber e conter.
