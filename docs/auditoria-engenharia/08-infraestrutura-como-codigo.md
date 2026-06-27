# Auditoria de Engenharia — Critério 8: Infraestrutura como Código

> Data: 2026-06-27
> Escopo: modularização Terraform, gestão de state, reprodutibilidade dev→prod.
> Apenas análise — nenhum código foi alterado nesta etapa.

## 🔴 Achados de alto impacto

### 1. `prd.tfvars` não define observabilidade — contradiz o próprio `contract.md`

`infra/env/prd.tfvars` não define `enable_xray_tracing`, `enable_cloudwatch_alarms` nem `alarm_email`. Sem override, esses valores caem no default de `variables.tf`: `false`, `false`, `""` — **os mesmos valores de dev**.

Isso contradiz diretamente o `docs/contract.md`, que declara ambos como **obrigatórios em produção** e inclusive mostra um exemplo de `prod.tfvars` com `enable_xray_tracing = true`, `enable_cloudwatch_alarms = true` e `alarm_email = "oncall@example.com"` — exemplo que **não corresponde ao arquivo real do repositório**.

Hoje isso não tem efeito prático (prod não existe — confirmado no `CLAUDE.md`), mas é exatamente o tipo de gap que só aparece tarde: se `main` for deployado para prod sem alguém notar essa lacuna, o ambiente de produção nasce sem alarme nem tracing, mesmo a infraestrutura para isso já existindo (ver critério 6).

**Recomendação:** corrigir `prd.tfvars` antes do primeiro deploy real de produção — é a única ação deste achado que precisa acontecer antes de prod existir.

## 🟡 Achados de impacto médio

### 2. Tag `Project` nos recursos não corresponde ao nome real do projeto

`infra/providers.tf:33`: `default_tags.Project = "marcelo-goncalves-tech"`. Em todo o resto do projeto (nomes de recursos, buckets, `project_name` var) o valor usado é `"marcelo-goncalves-blog"`. Qualquer relatório de custo (Cost Explorer, billing alerts) filtrado pela tag `Project=marcelo-goncalves-blog` não vai encontrar nada — silenciosamente.

## 🟢 Pontos positivos (manter)

- **State remoto correto**: S3 + lock via DynamoDB, configuração de backend injetada em runtime (`-backend-config` no CI, `backend.hcl` gitignored localmente) — segredos/valores específicos de ambiente nunca entram no código versionado.
- **Decisão documentada e correta sobre o que committar**: `.gitignore` deixa explícito, em comentário, por que `infra/env/*.tfvars` é commitado ("não têm segredos") — evita o anti-padrão comum de tratar todo `.tfvars` como secreto por padrão, sem critério.
- **`log_retention_days` aplicado de forma consistente** em todos os log groups (10 ocorrências confirmadas) — 7 dias em dev, 30 em prod, evita custo de retenção de logs sem limite.
- **`provisioned_concurrency` é uma diferença deliberada e documentada** entre ambientes (0 em dev por custo, 1 em prod para eliminar cold start) — exatamente o tipo de trade-off que deveria ser explícito, e está.
- **Modularização clara**: 7 módulos (`lambda`, `api-gateway`, `dynamodb`, `cognito`, `frontend`, `admin`, `media`) com responsabilidade única cada.
- **Versão do provider AWS fixada** (`~> 5.0`) — evita risco de major version flutuante.
- `terraform fmt --check` + `terraform validate` + Trivy já gateiam todo PR (detalhado no critério 4).

## Resumo

A engenharia de Terraform em si é sólida — state management, modularização e tagging (exceto o nome do projeto) seguem boas práticas. O único achado real de risco é a lacuna de observabilidade no `prd.tfvars`, e é objetivamente o mais fácil de corrigir: trocar 3 valores antes do primeiro `terraform apply` em produção.
