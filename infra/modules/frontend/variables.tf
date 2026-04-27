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
