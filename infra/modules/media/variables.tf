variable "project_name" {}
variable "environment" {}
variable "assets_bucket_name" {}

variable "log_level" {
  description = "Log level for Lambda functions"
  type        = string
  default     = "INFO"
}
