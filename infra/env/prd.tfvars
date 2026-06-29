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
alarm_email               = "marcelo.mjgoncalves@gmail.com"
enable_cloudfront_logging = false # setar true quando prod tiver tráfego real
enable_synthetic_canary   = true  # monitoramento contínuo de disponibilidade, sempre ativo em prod
enable_guardduty          = true  # detecção de ameaça sempre ativa em prod (achado AppSec Cat. 6)

# PITR no DynamoDB — protege contra delete/corrupção acidental (inclusive humana)
# em produção. Custo real (~$0.20/GB-mês), aceitável dado o benefício em prod.
enable_point_in_time_recovery = true

# Lambda Provisioned Concurrency — 1 instância sempre aquecida elimina cold starts
provisioned_concurrency = 1
