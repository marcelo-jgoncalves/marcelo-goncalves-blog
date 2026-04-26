# infra/providers.tf

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
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
      Project     = "marcelo-goncalves-tech"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
