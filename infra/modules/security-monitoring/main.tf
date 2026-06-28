# infra/modules/security-monitoring/main.tf
#
# CloudTrail (log de auditoria de toda chamada de API na conta) + GuardDuty
# (detecção automatizada de ameaça). Achado da auditoria AppSec (Categoria 6,
# 🔴): confirmado via AWS CLI que nenhum dos dois existia na conta antes
# desta correção — sem isso, não havia nenhum rastro para investigar uso
# anômalo de credenciais (ex: a role assumida via OIDC pelo pipeline).
#
# NOTA para quem for deployar `prod` por primeira vez: GuardDuty (1 detector
# por conta/região) e CloudTrail são recursos de conta, não de aplicação —
# se dev e prod compartilharem a mesma conta AWS, instanciar este módulo
# duas vezes faz o segundo `apply` falhar ("detector already exists"). Se
# forem contas separadas (boa prática), está correto manter em ambas.

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "cloudtrail_logs" {
  bucket        = "${var.project_name}-${var.environment}-cloudtrail-logs"
  force_destroy = var.environment == "dev" ? true : false
}

resource "aws_s3_bucket_public_access_block" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id

  rule {
    id     = "expire-cloudtrail-logs"
    status = "Enabled"

    filter {}

    expiration {
      days = var.log_retention_days
    }
  }
}

resource "aws_s3_bucket_policy" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AWSCloudTrailAclCheck"
        Effect    = "Allow"
        Principal = { Service = "cloudtrail.amazonaws.com" }
        Action    = "s3:GetBucketAcl"
        Resource  = aws_s3_bucket.cloudtrail_logs.arn
      },
      {
        Sid       = "AWSCloudTrailWrite"
        Effect    = "Allow"
        Principal = { Service = "cloudtrail.amazonaws.com" }
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.cloudtrail_logs.arn}/AWSLogs/${data.aws_caller_identity.current.account_id}/*"
        Condition = {
          StringEquals = { "s3:x-amz-acl" = "bucket-owner-full-control" }
        }
      }
    ]
  })
}

resource "aws_cloudtrail" "main" {
  name                          = "${var.project_name}-${var.environment}-trail"
  s3_bucket_name                = aws_s3_bucket.cloudtrail_logs.id
  is_multi_region_trail         = true
  include_global_service_events = true
  enable_logging                = true

  depends_on = [aws_s3_bucket_policy.cloudtrail_logs]
}

resource "aws_guardduty_detector" "main" {
  enable = true
}
