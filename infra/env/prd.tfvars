environment        = "prod"
project_name       = "marcelo-goncalves-blog"
aws_region         = "us-east-1"
log_level          = "INFO"
log_retention_days = 30

# Observabilidade
enable_cloudfront_logging = false  # setar true quando prod tiver tráfego real

# Lambda Provisioned Concurrency — 1 instância sempre aquecida elimina cold starts
provisioned_concurrency  = 1
