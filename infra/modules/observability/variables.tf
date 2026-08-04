variable "project_name" {
  description = "Project name, used as prefix for all resource names"
  type        = string
}
variable "environment" {
  description = "Deployment environment (dev/prd)"
  type        = string
}
variable "aws_region" {
  description = "AWS region the observability resources are deployed to"
  type        = string
}

variable "enable_cloudwatch_alarms" {
  description = "Creates the unified CloudWatch Dashboard (4 golden signals). Reuses the same flag as the other modules."
  type        = bool
  default     = false
}

variable "enable_synthetic_canary" {
  description = "Creates a CloudWatch Synthetics canary (heartbeat) that checks the public URL every 15min. Cost ~US$3-4/month when active, turn off in dev when not validating."
  type        = bool
  default     = false
}

variable "alarm_email" {
  description = "Email for SNS notifications (canary failure alarm)."
  type        = string
  default     = ""
}

variable "frontend_url" {
  description = "Public blog URL (with https://) that the canary should check."
  type        = string
  default     = ""
}

variable "api_gateway_name" {
  description = "API Gateway name, for the dashboard's traffic/latency/error widgets."
  type        = string
  default     = ""
}

variable "lambda_function_names" {
  description = "Map of friendly name -> real function_name, for the dashboard's errors/throttles/duration widgets."
  type        = map(string)
  default     = {}
}

variable "availability_slo" {
  description = "API Gateway availability SLO (proportion of non-5xx requests), over a 30-day window. Defines the error budget used in the burn rate alarms."
  type        = number
  default     = 0.995

  validation {
    condition     = var.availability_slo > 0 && var.availability_slo < 1
    error_message = "availability_slo must be a proportion between 0 and 1 (e.g. 0.995 for 99.5%)."
  }
}
