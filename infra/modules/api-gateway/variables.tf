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

variable "admin_origin" {
  description = "Full origin (https://...) of the admin SPA: the only origin allowed on CORS preflight responses and gateway responses of protected routes"
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
  description = "Enables AWS X-Ray tracing on the API Gateway stage"
  type        = bool
  default     = false
}

variable "enable_cloudwatch_alarms" {
  description = "Creates CloudWatch alarms for API Gateway 5xx and latency"
  type        = bool
  default     = false
}

variable "alarm_email" {
  description = "Email for alarm notifications via SNS"
  type        = string
  default     = ""
}

# Stage-level throttling: without it, the whole API, including the public
# unauthenticated routes, had no request limit at all. Applied via
# method_settings rather than usage_plan, to avoid requiring an API key on
# the existing public routes.
variable "throttle_rate_limit" {
  description = "Sustained requests per second, by default, across the whole stage"
  type        = number
  default     = 100
}

variable "throttle_burst_limit" {
  description = "Burst of concurrent requests allowed before throttling"
  type        = number
  default     = 200
}