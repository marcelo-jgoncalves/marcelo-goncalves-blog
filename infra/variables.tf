
variable "aws_region" {
  description = "AWS region for deploy"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (dev or prod)"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "marcelo-goncalves-blog"
}

variable "log_level" {
  description = "Log level for the Lambdas. DEBUG in dev, INFO in prod."
  type        = string
  default     = "INFO"

  validation {
    condition     = contains(["DEBUG", "INFO", "WARN", "ERROR"], var.log_level)
    error_message = "log_level must be one of: DEBUG, INFO, WARN, ERROR."
  }
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days. 7 for dev, 30 for prod."
  type        = number
  default     = 7

  validation {
    condition     = contains([1, 3, 5, 7, 14, 30, 60, 90, 180, 365], var.log_retention_days)
    error_message = "log_retention_days must be a valid CloudWatch value: 1, 3, 5, 7, 14, 30, 60, 90, 180 or 365."
  }
}

variable "enable_xray_tracing" {
  description = "Enables active AWS X-Ray tracing on the Lambdas and API Gateway. Disabled in dev to reduce costs."
  type        = bool
  default     = false
}

variable "enable_point_in_time_recovery" {
  description = "Enables Point-in-Time Recovery on the 3 DynamoDB tables (posts/autores/categorias). Disabled in dev due to cost (~$0.20/GB-month); enable in production."
  type        = bool
  default     = false
}

variable "enable_cloudwatch_alarms" {
  description = "Creates CloudWatch Alarms for Lambda errors and API Gateway 5xx. Disabled in dev."
  type        = bool
  default     = false
}

variable "alarm_email" {
  description = "Email for SNS notifications of the CloudWatch Alarms. Required if enable_cloudwatch_alarms=true."
  type        = string
  default     = ""
}

variable "dlq_alert_email" {
  description = "E-mail notified when a DLQ (imageProcessor/postScheduler) receives an event lost after retries. Deliberately separate from alarm_email and always on (the DLQ alarm does not depend on enable_cloudwatch_alarms): a message in a DLQ is genuinely lost data, even in dev."
  type        = string
  default     = ""
}

variable "enable_synthetic_canary" {
  description = "Creates a CloudWatch Synthetics canary (heartbeat) checking the public URL every 15min. Recurring cost (~US$3-4/month) regardless of traffic/deploy — a separate flag from enable_cloudwatch_alarms, so it can be toggled in dev on demand."
  type        = bool
  default     = false
}

variable "enable_cloudfront_logging" {
  description = "Enables CloudFront access logs in an S3 bucket. Logs expire per log_retention_days. Disabled in dev to reduce costs."
  type        = bool
  default     = false
}

variable "enable_budget_alerts" {
  description = "Creates AWS Budgets with SNS alerts when the monthly limit is reached. Disabled in dev to keep cost at zero."
  type        = bool
  default     = false
}

variable "budget_alert_email" {
  description = "Email for AWS Budgets overspend notifications. Required if enable_budget_alerts=true."
  type        = string
  default     = ""
}

variable "enable_guardduty" {
  description = "Enables the GuardDuty detector. Has a 30-day free trial; afterward it charges by volume of events analyzed (~a few USD/month). Disabled in dev by default — enable when the production environment is created."
  type        = bool
  default     = false
}

variable "frontend_cloudfront_distribution_id" {
  description = "CloudFront distribution ID of the frontend (module.frontend), used by adminPosts/postScheduler to invalidate cache on demand. Literal value, not a module reference — module.lambda -> module.frontend -> module.api-gateway -> module.lambda would create a Terraform cycle. Update manually if the distribution is recreated (rare)."
  type        = string
}

variable "admin_api_gateway_domain_name" {
  description = "API Gateway domain (e.g. abc123.execute-api.us-east-1.amazonaws.com), used by the admin CloudFront (module.admin) as the origin of the same-origin /admin/* proxy. Literal value, not a module reference — module.admin -> module.api-gateway -> module.lambda -> module.admin (via admin_origin) would create a Terraform cycle. Update manually if the REST API is recreated (rare)."
  type        = string
}

variable "admin_api_gateway_stage_path" {
  description = "API Gateway stage path (e.g. /v1), used together with admin_api_gateway_domain_name in the origin_path of the admin CloudFront's /admin/* proxy. Same reason for a literal value as the var above."
  type        = string
  default     = "/v1"
}
