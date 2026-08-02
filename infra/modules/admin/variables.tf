variable "project_name" {
  description = "Project name, used as prefix for resource naming (S3 bucket, CloudFront distribution)"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev/prd), used as suffix for resource naming"
  type        = string
}

variable "log_retention_days" {
  description = "CloudFront S3 log retention in days (lifecycle rule)."
  type        = number
  default     = 7
}

variable "enable_cloudfront_logging" {
  description = "Enables CloudFront access logs in an S3 bucket. Logs expire per log_retention_days."
  type        = bool
  default     = false
}

variable "api_gateway_domain_name" {
  description = "API Gateway domain (no stage), used as the origin of the same-origin /admin/* proxy — avoids cross-origin CORS and allows a SameSite=Strict cookie on the BFF session."
  type        = string
}

variable "api_gateway_stage_path" {
  description = "API Gateway stage path (e.g. /v1), used as origin_path of the /admin/* proxy"
  type        = string
}
