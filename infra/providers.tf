# infra/providers.tf

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  # Nota: O backend S3 será configurado posteriormente no CI/CD.
  # Por enquanto, usaremos estado local para o primeiro bootstrap ou configuraremos via CLI.
}

provider "aws" {
  region  = var.aws_region
  profile = "devops-blog-dev"

  default_tags {
    tags = {
      Project     = "marcelo-goncalves-tech"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}