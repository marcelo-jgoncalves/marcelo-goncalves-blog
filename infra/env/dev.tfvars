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

# PITR no DynamoDB (~$0.20/GB-mês, custo real) — desligado em dev.
# Ativar (true) só quando o ambiente de produção for criado (docs/investigacao-dynamodb.md, ponto 2).
enable_point_in_time_recovery = false

# Lambda Provisioned Concurrency — 0 = off (dev economiza custo)
# Em prod: setar para 1+ para eliminar cold starts
provisioned_concurrency = 0

# Distribution CloudFront do frontend — valor literal (ver comentário em
# infra/variables.tf sobre o ciclo que uma referência de módulo criaria).
# Confirmado via `aws cloudfront list-distributions` (dominio dsns2wusdrj9z.cloudfront.net).
# Se a distribution for recriada, atualizar este ID manualmente.
frontend_cloudfront_distribution_id = "E1XI31PS4HFJIH"

# Domínio do API Gateway existente — valor literal (mesmo motivo de ciclo,
# ver comentário em infra/variables.tf). REST API já deployada (sessão 53,
# BFF do admin): https://5duus31al8.execute-api.us-east-1.amazonaws.com/v1.
# Se a REST API for recriada, atualizar este domínio manualmente.
admin_api_gateway_domain_name = "5duus31al8.execute-api.us-east-1.amazonaws.com"
admin_api_gateway_stage_path  = "/v1"
