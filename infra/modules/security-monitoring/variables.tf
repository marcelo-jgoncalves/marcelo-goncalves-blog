variable "project_name" {
  description = "Nome do projeto, usado como prefixo de nomenclatura de recursos (alarmes, detector GuardDuty)"
  type        = string
}

variable "environment" {
  description = "Ambiente de deploy (dev/prd), usado como sufixo de nomenclatura de recursos"
  type        = string
}

variable "log_retention_days" {
  description = "Dias de retenção dos logs monitorados (usado para alinhar alarmes/janelas de avaliação ao período de retenção real)"
  type        = number
}

variable "enable_guardduty" {
  description = "Habilita o detector do GuardDuty. Tem 30 dias de trial gratuito; depois cobra por volume de eventos analisados (~poucos USD/mês). Desativado em dev por padrão — ativar quando o ambiente de produção for criado."
  type        = bool
  default     = false
}
