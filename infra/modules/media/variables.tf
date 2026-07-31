variable "project_name" {
  description = "Project name, used as prefix for all resource names"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev/prd)"
  type        = string
}

variable "assets_bucket_name" {
  description = "Name of the S3 bucket where imageProcessor writes optimized media variants"
  type        = string
}

variable "posts_table_arn" {
  description = "ARN of the Posts DynamoDB table"
  type        = string
}

variable "posts_table_name" {
  description = "Name of the Posts DynamoDB table"
  type        = string
}

variable "log_level" {
  description = "Log level for Lambda functions"
  type        = string
  default     = "INFO"
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 7
}

variable "enable_xray_tracing" {
  description = "Habilita AWS X-Ray tracing na Lambda imageProcessor"
  type        = bool
  default     = false
}

variable "enable_cloudwatch_alarms" {
  description = "Cria alarme CloudWatch de erro/throttle para a Lambda imageProcessor"
  type        = bool
  default     = false
}

variable "alarm_email" {
  description = "E-mail para notificacoes SNS do alarme de imageProcessor"
  type        = string
  default     = ""
}

variable "admin_origin" {
  description = "CloudFront domain of admin SPA (for CORS whitelist in uploads bucket)"
  type        = string
  default     = ""
}

variable "frontend_origin" {
  description = "CloudFront domain of frontend blog (for CORS whitelist in uploads bucket)"
  type        = string
  default     = ""
}
