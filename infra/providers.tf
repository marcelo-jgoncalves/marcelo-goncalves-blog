
terraform {
  # `~>` with two version components allows the whole major series
  # (>= 1.15, < 2.0), not just 1.15.x -- a tighter pin would need `~> 1.15.0`.
  # The CD's actual version is the literal TERRAFORM_VERSION/terraform_version
  # in the workflows; keep both in sync manually, this constraint alone
  # doesn't enforce it.
  required_version = "~> 1.15"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # Remote state via S3, with S3-native locking (use_lockfile) -- no
  # DynamoDB table involved.
  # Backend is configured at runtime — CI/CD passes -backend-config flags,
  # local dev uses infra/backend.hcl (gitignored).
  # Bootstrap: run scripts/bootstrap-state.sh once per AWS account.
  backend "s3" {
    # Values injected at `terraform init` via -backend-config or backend.hcl:
    #   bucket       = "marcelo-goncalves-blog-<env>-tfstate"
    #   key          = "blog/terraform.tfstate"
    #   region       = "us-east-1"
    #   use_lockfile = true
    #   encrypt      = true
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
