variable "project_name" {}
variable "environment" {}
variable "api_url" {}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 7
}
