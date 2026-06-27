variable "project_name" {}
variable "environment" {}
variable "aws_region" {}

variable "enable_cloudwatch_alarms" {
  description = "Cria o CloudWatch Dashboard unificado (4 golden signals). Reaproveita o mesmo flag dos demais módulos."
  type        = bool
  default     = false
}

variable "enable_synthetic_canary" {
  description = "Cria um CloudWatch Synthetics canary (heartbeat) que verifica a URL pública a cada 15min. Custo ~US$3-4/mês quando ativo — desligar em dev quando não estiver validando."
  type        = bool
  default     = false
}

variable "alarm_email" {
  description = "E-mail para notificações via SNS (alarme de falha do canary)."
  type        = string
  default     = ""
}

variable "frontend_url" {
  description = "URL pública do blog (com https://) que o canary deve verificar."
  type        = string
  default     = ""
}

variable "api_gateway_name" {
  description = "Nome do API Gateway, para os widgets de tráfego/latência/erros do dashboard."
  type        = string
  default     = ""
}

variable "lambda_function_names" {
  description = "Mapa nome-amigável -> function_name real, para os widgets de erros/throttles/duration do dashboard."
  type        = map(string)
  default     = {}
}
