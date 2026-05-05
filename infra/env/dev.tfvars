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

# Lambda Provisioned Concurrency — 0 = off (dev economiza custo)
# Em prod: setar para 1+ para eliminar cold starts
provisioned_concurrency  = 0
