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
