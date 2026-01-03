# infra/variables.tf

variable "aws_region" {
  description = "Região da AWS para deploy"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Ambiente de deploy (dev ou prod)"
  type        = string
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "marcelo-goncalves-blog"
}