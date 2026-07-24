# infra/variables.tf

variable "aws_region" {
  description = "Região da AWS para deploy"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Ambiente de deploy (dev ou prod)"
  type        = string
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "marcelo-goncalves-blog"
}

variable "log_level" {
  description = "Log level para as Lambdas. DEBUG em dev, INFO em prod."
  type        = string
  default     = "INFO"

  validation {
    condition     = contains(["DEBUG", "INFO", "WARN", "ERROR"], var.log_level)
    error_message = "log_level must be one of: DEBUG, INFO, WARN, ERROR."
  }
}

variable "log_retention_days" {
  description = "Retenção dos logs no CloudWatch em dias. 7 para dev, 30 para prod."
  type        = number
  default     = 7

  validation {
    condition     = contains([1, 3, 5, 7, 14, 30, 60, 90, 180, 365], var.log_retention_days)
    error_message = "log_retention_days deve ser um valor válido do CloudWatch: 1, 3, 5, 7, 14, 30, 60, 90, 180 ou 365."
  }
}

variable "enable_xray_tracing" {
  description = "Habilita AWS X-Ray tracing ativo nas Lambdas e no API Gateway. Desativado em dev para reduzir custos."
  type        = bool
  default     = false
}

variable "enable_point_in_time_recovery" {
  description = "Habilita Point-in-Time Recovery nas 3 tabelas DynamoDB (posts/autores/categorias). Desativado em dev por custo (~$0.20/GB-mês); ativar em produção."
  type        = bool
  default     = false
}

variable "enable_cloudwatch_alarms" {
  description = "Cria CloudWatch Alarms para erros de Lambda e 5xx do API Gateway. Desativado em dev."
  type        = bool
  default     = false
}

variable "alarm_email" {
  description = "Email para notificações SNS dos CloudWatch Alarms. Obrigatório se enable_cloudwatch_alarms=true."
  type        = string
  default     = ""
}

variable "enable_synthetic_canary" {
  description = "Cria um CloudWatch Synthetics canary (heartbeat) verificando a URL pública a cada 15min. Custo recorrente (~US$3-4/mês) independente de tráfego/deploy — variável própria, separada de enable_cloudwatch_alarms, para ligar/desligar em dev sob demanda."
  type        = bool
  default     = false
}

variable "enable_cloudfront_logging" {
  description = "Habilita logs de acesso do CloudFront em bucket S3. Logs expiram conforme log_retention_days. Desativado em dev para reduzir custos."
  type        = bool
  default     = false
}

variable "enable_budget_alerts" {
  description = "Cria AWS Budgets com alertas via SNS quando limite mensal é atingido. Desativado em dev para manter custo zero."
  type        = bool
  default     = false
}

variable "budget_monthly_limit_usd" {
  description = "Limite orçamentário mensal em USD para ativar alertas. Default: 100 USD (margem de segurança para dev)."
  type        = number
  default     = 100
}

variable "budget_alert_email" {
  description = "Email para notificações de orçamento excedido via AWS Budgets. Obrigatório se enable_budget_alerts=true."
  type        = string
  default     = ""
}

variable "enable_guardduty" {
  description = "Habilita o detector do GuardDuty. Tem 30 dias de trial gratuito; depois cobra por volume de eventos analisados (~poucos USD/mês). Desativado em dev por padrão — ativar quando o ambiente de produção for criado."
  type        = bool
  default     = false
}

variable "frontend_cloudfront_distribution_id" {
  description = "ID da distribution CloudFront do frontend (module.frontend), usado por adminPosts/postScheduler para invalidar cache sob demanda. Valor literal, não referência de módulo — module.lambda -> module.frontend -> module.api-gateway -> module.lambda criaria um ciclo no Terraform. Atualizar manualmente se a distribution for recriada (raro)."
  type        = string
}

variable "admin_api_gateway_domain_name" {
  description = "Domínio do API Gateway (ex: abc123.execute-api.us-east-1.amazonaws.com), usado pelo CloudFront do admin (module.admin) como origin do proxy same-origin /admin/*. Valor literal, não referência de módulo — module.admin -> module.api-gateway -> module.lambda -> module.admin (via admin_origin) criaria um ciclo no Terraform. Atualizar manualmente se a REST API for recriada (raro)."
  type        = string
}

variable "admin_api_gateway_stage_path" {
  description = "Path do stage do API Gateway (ex: /v1), usado junto com admin_api_gateway_domain_name no origin_path do proxy /admin/* do CloudFront do admin. Mesmo motivo de valor literal do var acima."
  type        = string
  default     = "/v1"
}