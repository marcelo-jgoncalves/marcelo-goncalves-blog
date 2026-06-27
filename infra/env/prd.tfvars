environment        = "prod"
project_name       = "marcelo-goncalves-blog"
aws_region         = "us-east-1"
log_level          = "INFO"
log_retention_days = 30

# Observabilidade — OBRIGATÓRIO em produção (docs/contract.md).
# Sem estas 3 linhas, prod herdava os defaults de dev (tudo desligado) —
# achado #1, docs/auditoria-engenharia/08-infraestrutura-como-codigo.md.
enable_xray_tracing       = true
enable_cloudwatch_alarms  = true
alarm_email               = "" # preencher antes do primeiro deploy real de prod
enable_cloudfront_logging = false  # setar true quando prod tiver tráfego real

# Lambda Provisioned Concurrency — 1 instância sempre aquecida elimina cold starts
provisioned_concurrency  = 1
