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
variable "admin_session_invoke_arn" {}
variable "admin_session_function_name" {}
variable "admin_authorizer_invoke_arn" {}
variable "admin_authorizer_function_name" {}

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

# Throttling de stage (achado da auditoria AppSec, Cat. 4) — sem isso a API
# inteira, incluindo as rotas públicas sem autenticação, não tinha nenhum
# limite de requisições. Aplicado via method_settings, não usage_plan, para
# não exigir API key nas rotas públicas existentes.
variable "throttle_rate_limit" {
  description = "Requisições por segundo sustentadas, por padrão, em todo o stage"
  type        = number
  default     = 20
}

variable "throttle_burst_limit" {
  description = "Burst de requisições simultâneas permitido antes do throttling"
  type        = number
  default     = 40
}