
terraform {
  # Correção (auditoria 2026-08-02): `~> 1.8` com dois componentes libera
  # toda a série 1.x (>= 1.8, < 2.0) -- NÃO trava em 1.8.x como um comentário
  # anterior aqui afirmava (testado empiricamente: terraform 1.14.9 local
  # passa por essa constraint sem erro). Quem de fato pina o CD em 1.8.0 é
  # o literal TERRAFORM_VERSION/terraform_version nos workflows, não esta
  # linha. Migrado para 1.15.x (changelog 1.9→1.15 conferido via GitHub
  # releases API: nenhuma breaking change toca este projeto, só o locking
  # via DynamoDB no backend S3 sendo deprecado em favor de `use_lockfile`
  # — aviso, não erro; migração do locking em si fica pra depois, separada).
  required_version = "~> 1.15"

  required_providers {
    # Migrado de v5 pra v6 em 2026-08-02: nenhuma breaking change documentada
    # no guia oficial (rename de S3 `region`→`bucket_region`, etag computed-only
    # em CloudFront response headers policy, formato de id de Cognito user-in-group,
    # etc.) toca em recurso real deste projeto (confirmado via grep nos módulos
    # antes da migração) — sem gatilho de risco pra continuar adiando.
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # Remote state via S3 + DynamoDB locking.
  # Backend is configured at runtime — CI/CD passes -backend-config flags,
  # local dev uses infra/backend.hcl (gitignored).
  # Bootstrap: run scripts/bootstrap-state.sh once per AWS account.
  backend "s3" {
    # Values injected at `terraform init` via -backend-config or backend.hcl:
    #   bucket         = "marcelo-goncalves-blog-<env>-tfstate"
    #   key            = "blog/terraform.tfstate"
    #   region         = "us-east-1"
    #   dynamodb_table = "marcelo-goncalves-blog-<env>-tflock"
    #   encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  # Local dev: set AWS_PROFILE=devops-blog-dev or configure via ~/.aws/credentials.
  # CI/CD: credentials injected via OIDC (no static keys).

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
