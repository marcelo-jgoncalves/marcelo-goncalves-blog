variable "project_name" {}
variable "environment" {}
variable "aws_region" {}
variable "get_post_invoke_arn" {}
variable "get_post_function_name" {}
variable "get_author_invoke_arn" {}
variable "get_author_function_name" {}
variable "cognito_user_pool_arn" {}
variable "admin_posts_invoke_arn" {}
variable "admin_posts_function_name" {}
variable "media_upload_invoke_arn" {}
variable "media_upload_function_name" {}
variable "get_posts_invoke_arn" {}
variable "get_posts_function_name" {}
variable "admin_authors_invoke_arn" {}
variable "admin_authors_function_name" {}
variable "admin_categorias_invoke_arn" {}
variable "admin_categorias_function_name" {}

variable "enable_xray_tracing" {
  description = "Habilita AWS X-Ray tracing no API Gateway stage"
  type        = bool
  default     = false
}

variable "enable_cloudwatch_alarms" {
  description = "Cria alarmes CloudWatch para 5xx e latência do API Gateway"
  type        = bool
  default     = false
}

variable "alarm_email" {
  description = "E-mail para notificações dos alarmes via SNS"
  type        = string
  default     = ""
}