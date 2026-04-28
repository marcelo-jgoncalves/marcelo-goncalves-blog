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

variable "uploads_bucket_name" {
  description = "Nome do bucket S3 de uploads de mídia"
  type        = string
}

variable "uploads_bucket_arn" {
  description = "ARN do bucket S3 de uploads de mídia"
  type        = string
}
