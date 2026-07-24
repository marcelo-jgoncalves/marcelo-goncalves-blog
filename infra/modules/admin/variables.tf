variable "project_name" {
  description = "Nome do projeto, usado como prefixo de nomenclatura de recursos (bucket S3, distribution CloudFront)"
  type        = string
}

variable "environment" {
  description = "Ambiente de deploy (dev/prd), usado como sufixo de nomenclatura de recursos"
  type        = string
}

variable "log_retention_days" {
  description = "Retenção dos logs S3 do CloudFront em dias (lifecycle rule)."
  type        = number
  default     = 7
}

variable "enable_cloudfront_logging" {
  description = "Habilita logs de acesso do CloudFront em bucket S3. Logs expiram conforme log_retention_days."
  type        = bool
  default     = false
}
