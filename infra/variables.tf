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

variable "enable_xray_tracing" {
  description = "Habilita AWS X-Ray tracing ativo nas Lambdas e no API Gateway. Desativado em dev para reduzir custos."
  type        = bool
  default     = false
}

variable "enable_cloudwatch_alarms" {
  description = "Cria CloudWatch Alarms para erros de Lambda e 5xx do API Gateway. Desativado em dev."
  type        = bool
  default     = false
}

variable "alarm_email" {
  description = "Email para notificações SNS dos CloudWatch Alarms. Obrigatório se enable_cloudwatch_alarms=true."
  type        = string
  default     = ""
}

variable "enable_synthetic_canary" {
  description = "Cria um CloudWatch Synthetics canary (heartbeat) verificando a URL pública a cada 15min. Custo recorrente (~US$3-4/mês) independente de tráfego/deploy — variável própria, separada de enable_cloudwatch_alarms, para ligar/desligar em dev sob demanda."
  type        = bool
  default     = false
}

variable "enable_cloudfront_logging" {
  description = "Habilita logs de acesso do CloudFront em bucket S3. Logs expiram conforme log_retention_days. Desativado em dev para reduzir custos."
  type        = bool
  default     = false
}