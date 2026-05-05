variable "project_name" {}
variable "environment" {}
variable "api_url" {}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 7
}

variable "enable_xray_tracing" {
  description = "Habilita AWS X-Ray tracing na Lambda nextjs-server"
  type        = bool
  default     = false
}

variable "provisioned_concurrency" {
  description = "Instâncias Lambda pré-aquecidas (0 = off, >=1 = on). Ativar em prod para eliminar cold starts."
  type        = number
  default     = 0
}

variable "enable_cloudfront_logging" {
  description = "Habilita logs de acesso do CloudFront em bucket S3. Logs expiram conforme log_retention_days."
  type        = bool
  default     = false
}

