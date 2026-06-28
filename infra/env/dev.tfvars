environment        = "dev"
project_name       = "marcelo-goncalves-blog"
aws_region         = "us-east-1"
log_level          = "DEBUG"
log_retention_days = 7

# Observabilidade — desativado em dev para reduzir custos
enable_xray_tracing       = false
enable_cloudwatch_alarms  = false
alarm_email               = ""
enable_cloudfront_logging = false

# Canary sintético (~US$3-4/mês quando ligado) — variável própria,
# independente das demais. Ligar temporariamente (true) só para validar
# o heartbeat funcionando, depois voltar para false. Em prod fica sempre true.
enable_synthetic_canary = false

# GuardDuty (~poucos USD/mês após o trial de 30 dias) — desligado em dev.
# Ativar (true) quando o ambiente de produção for criado.
enable_guardduty = false

# Lambda Provisioned Concurrency — 0 = off (dev economiza custo)
# Em prod: setar para 1+ para eliminar cold starts
provisioned_concurrency = 0
