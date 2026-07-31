variable "project_name" {
  description = "Project name, used as prefix for all resource names"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev/prd)"
  type        = string
}

variable "budget_monthly_limit_usd" {
  description = "Limite orçamentário mensal em USD para alertar"
  type        = number
  default     = 100
}

variable "alert_email" {
  description = "E-mail para notificações de orçamento excedido"
  type        = string
  default     = ""
}

variable "enable_budget_alerts" {
  description = "Habilita criação de Budget Alerts (false para manter custo mínimo em dev)"
  type        = bool
  default     = false
}
