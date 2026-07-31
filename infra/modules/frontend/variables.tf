variable "project_name" {
  description = "Project name, used as prefix for all resource names"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev/prd)"
  type        = string
}

variable "api_url" {
  description = "Base URL of the API Gateway, injected as API_URL runtime env var into the nextjs-server Lambda"
  type        = string
}

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

