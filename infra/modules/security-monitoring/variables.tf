variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "log_retention_days" {
  type = number
}

variable "enable_guardduty" {
  description = "Habilita o detector do GuardDuty. Tem 30 dias de trial gratuito; depois cobra por volume de eventos analisados (~poucos USD/mês). Desativado em dev por padrão — ativar quando o ambiente de produção for criado."
  type        = bool
  default     = false
}
