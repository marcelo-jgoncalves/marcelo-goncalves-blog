# Deploy

## Fluxo atual

Push em `develop` dispara o pipeline de CD (GitHub Actions): build → `terraform apply` → deploy completo. Não existe ambiente de produção nem fluxo `plan-prod`/`approve-prod`/`deploy-prod` no momento — foram removidos deliberadamente quando a branch `main` deixou de ter commits próprios (histórico do formato anterior fica no Git, se servir de referência ao reconstruir, mas não assumir que deve ser idêntico).

**`terraform apply` é responsabilidade exclusiva do pipeline de CD** — nunca rodar localmente, mesmo com `-target`. Localmente, só `plan`/`validate`/`fmt`.

## Gatilho para reconstruir o fluxo de produção

Quando um ambiente de produção real existir: reconstruir `plan-prod`/`approve-prod`/`deploy-prod` em `cd.yml`, incluindo gate de aprovação manual pré-`apply`.

## Terraform

- State: S3, com locking S3-nativo (`use_lockfile`).
- CLI pinado em `infra/providers.tf`; provider AWS igualmente pinado.

## Rollback

Sem estratégia formal de rollback de produção ainda (não existe produção). Para `dev`, reverter via novo `terraform apply` a partir de um commit anterior ou correção direta.
