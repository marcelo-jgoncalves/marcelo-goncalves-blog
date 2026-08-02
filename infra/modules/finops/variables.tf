variable "project_name" {
  description = "Project name, used as prefix for all resource names"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev/prd)"
  type        = string
}

variable "alert_email" {
  description = "Email for budget overspend notifications"
  type        = string
  default     = ""
}

variable "enable_budget_alerts" {
  description = "Enables creation of Budget Alerts (false to keep minimum cost in dev)"
  type        = bool
  default     = false
}
