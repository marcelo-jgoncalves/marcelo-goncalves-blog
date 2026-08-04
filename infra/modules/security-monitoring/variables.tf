variable "project_name" {
  description = "Project name, used as prefix for resource naming (alarms, GuardDuty detector)"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev/prd), used as suffix for resource naming"
  type        = string
}

variable "log_retention_days" {
  description = "Retention days of the monitored logs (used to align alarms/evaluation windows to the actual retention period)"
  type        = number
}

variable "enable_guardduty" {
  description = "Enables the GuardDuty detector. Has a 30-day free trial; afterward it charges by volume of events analyzed (~a few USD/month). Disabled in dev by default, enable when the production environment is created."
  type        = bool
  default     = false
}
