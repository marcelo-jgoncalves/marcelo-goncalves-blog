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

variable "log_level" {
  description = "Log level para as Lambdas. DEBUG em dev, INFO em prod."
  type        = string
  default     = "INFO"

  validation {
    condition     = contains(["DEBUG", "INFO", "WARN", "ERROR"], var.log_level)
    error_message = "log_level must be one of: DEBUG, INFO, WARN, ERROR."
  }
}

variable "log_retention_days" {
  description = "Retenção dos logs no CloudWatch em dias. 7 para dev, 30 para prod."
  type        = number
  default     = 7

  validation {
    condition     = contains([1, 3, 5, 7, 14, 30, 60, 90, 180, 365], var.log_retention_days)
    error_message = "log_retention_days deve ser um valor válido do CloudWatch: 1, 3, 5, 7, 14, 30, 60, 90, 180 ou 365."
  }
}