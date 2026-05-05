variable "project_name" {}
variable "environment" {}

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
