variable "project_name" {
  description = "Project name, used as prefix for all resource names"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev/prd)"
  type        = string
}

variable "aws_region" {
  description = "AWS region the API Gateway is deployed to"
  type        = string
}

variable "get_post_invoke_arn" {
  description = "Invocation ARN of the get_post Lambda"
  type        = string
}

variable "get_post_function_name" {
  description = "Function name of the get_post Lambda, used for the Lambda permission resource"
  type        = string
}

variable "get_author_invoke_arn" {
  description = "Invocation ARN of the get_author Lambda"
  type        = string
}

variable "get_author_function_name" {
  description = "Function name of the get_author Lambda, used for the Lambda permission resource"
  type        = string
}

variable "cognito_user_pool_arn" {
  description = "ARN of the Cognito User Pool used by the API Gateway Cognito authorizer"
  type        = string
}

variable "admin_posts_invoke_arn" {
  description = "Invocation ARN of the admin_posts Lambda"
  type        = string
}

variable "admin_posts_function_name" {
  description = "Function name of the admin_posts Lambda, used for the Lambda permission resource"
  type        = string
}

variable "media_upload_invoke_arn" {
  description = "Invocation ARN of the media_upload Lambda"
  type        = string
}

variable "media_upload_function_name" {
  description = "Function name of the media_upload Lambda, used for the Lambda permission resource"
  type        = string
}

variable "get_posts_invoke_arn" {
  description = "Invocation ARN of the get_posts Lambda"
  type        = string
}

variable "get_posts_function_name" {
  description = "Function name of the get_posts Lambda, used for the Lambda permission resource"
  type        = string
}

variable "admin_authors_invoke_arn" {
  description = "Invocation ARN of the admin_authors Lambda"
  type        = string
}

variable "admin_authors_function_name" {
  description = "Function name of the admin_authors Lambda, used for the Lambda permission resource"
  type        = string
}

variable "admin_categorias_invoke_arn" {
  description = "Invocation ARN of the admin_categorias Lambda"
  type        = string
}

variable "admin_categorias_function_name" {
  description = "Function name of the admin_categorias Lambda, used for the Lambda permission resource"
  type        = string
}

variable "admin_session_invoke_arn" {
  description = "Invocation ARN of the admin_session Lambda"
  type        = string
}

variable "admin_session_function_name" {
  description = "Function name of the admin_session Lambda, used for the Lambda permission resource"
  type        = string
}

variable "admin_authorizer_invoke_arn" {
  description = "Invocation ARN of the admin_authorizer Lambda, used as the API Gateway custom authorizer"
  type        = string
}

variable "admin_authorizer_function_name" {
  description = "Function name of the admin_authorizer Lambda, used for the Lambda permission resource"
  type        = string
}

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