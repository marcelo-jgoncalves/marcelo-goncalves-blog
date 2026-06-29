variable "project_name" {}
variable "environment" {}
variable "posts_table_arn" {}
variable "autores_table_arn" {}
variable "uploads_bucket_name" {}
variable "uploads_bucket_arn" {}

variable "log_level" {
  description = "Log level for Lambda functions (DEBUG in dev, INFO in prod)"
  type        = string
  default     = "INFO"
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
  description = "Cria alarmes CloudWatch de erro para todas as funções Lambda"
  type        = bool
  default     = false
}

variable "alarm_email" {
  description = "E-mail para notificações SNS dos alarmes Lambda"
  type        = string
  default     = ""
}
