variable "project_name" {}
variable "environment" {}
variable "assets_bucket_name" {}
variable "posts_table_arn"  {}
variable "posts_table_name" {}

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
