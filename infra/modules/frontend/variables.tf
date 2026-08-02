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
  description = "Enables AWS X-Ray tracing on the nextjs-server Lambda"
  type        = bool
  default     = false
}

variable "provisioned_concurrency" {
  description = "Pre-warmed Lambda instances (0 = off, >=1 = on). Enable in prod to eliminate cold starts."
  type        = number
  default     = 0
}

variable "enable_cloudfront_logging" {
  description = "Enables CloudFront access logs in an S3 bucket. Logs expire per log_retention_days."
  type        = bool
  default     = false
}

