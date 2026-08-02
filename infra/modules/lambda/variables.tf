variable "project_name" {
  description = "Project name, used as prefix for all resource names"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev/prd)"
  type        = string
}

variable "posts_table_arn" {
  description = "ARN of the Posts DynamoDB table"
  type        = string
}

variable "autores_table_arn" {
  description = "ARN of the Autores DynamoDB table"
  type        = string
}

variable "uploads_bucket_name" {
  description = "Name of the S3 bucket for raw media uploads"
  type        = string
}

variable "uploads_bucket_arn" {
  description = "ARN of the S3 bucket for raw media uploads"
  type        = string
}

variable "log_level" {
  description = "Log level for Lambda functions (DEBUG in dev, INFO in prod)"
  type        = string
  default     = "INFO"
}

variable "dlq_alert_email" {
  description = "E-mail notified when the postScheduler DLQ receives a lost event. Independent of enable_cloudwatch_alarms — the DLQ alarm is always on."
  type        = string
  default     = ""
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 7
}

variable "categorias_table_arn" {
  description = "ARN of the Categorias DynamoDB table"
  type        = string
}

variable "admin_origin" {
  description = "Allowed CORS origin for admin Lambdas (CloudFront admin URL)"
  type        = string
  default     = "*"
}

variable "frontend_distribution_id" {
  description = "CloudFront distribution ID of the public frontend, used by adminPosts/postScheduler to invalidate the cache of /post/{slug} (and /) on demand after a write"
  type        = string
}

variable "enable_xray_tracing" {
  description = "Enable AWS X-Ray active tracing on Lambda functions"
  type        = bool
  default     = false
}

variable "enable_cloudwatch_alarms" {
  description = "Creates CloudWatch error alarms for all Lambda functions"
  type        = bool
  default     = false
}

variable "alarm_email" {
  description = "Email for Lambda alarm SNS notifications"
  type        = string
  default     = ""
}

variable "admin_sessions_table_arn" {
  description = "ARN of the admin sessions (BFF) DynamoDB table, used by adminSession/adminAuthorizer"
  type        = string
}

variable "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool, used by adminSession/adminAuthorizer to verify the idToken via JWKS"
  type        = string
}

variable "cognito_client_id" {
  description = "ID of the Cognito App Client, used by adminSession/adminAuthorizer to verify the idToken via JWKS"
  type        = string
}
