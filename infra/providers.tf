
terraform {
  # Trava alinhada à versão real usada pelo CD (.github/workflows/cd.yml e
  # deploy.yml, TERRAFORM_VERSION/terraform_version: 1.8.0) -- terraform
  # apply só roda via pipeline (nunca local), então essa é a versão que
  # realmente escreve o state; um terraform local mais novo é bloqueado
  # aqui em vez de arriscar gravar um state em formato incompatível.
  # Gap de 7 minors vs. 1.15.x estável (auditoria 2026-08-02): decisão
  # deliberada de não perseguir, não lacuna esquecida — revisitar só se
  # um recurso novo de Terraform CLI virar necessidade real do projeto.
  required_version = "~> 1.8"

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
