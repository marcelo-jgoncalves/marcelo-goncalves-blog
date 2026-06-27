# infra/modules/observability/canary.tf
# CloudWatch Synthetics heartbeat — monitoramento sintético contínuo,
# independente de deploy/tráfego real. Gated por enable_synthetic_canary
# (variável própria, separada de enable_cloudwatch_alarms — custo
# recorrente mesmo sem nenhum deploy acontecer, então fica fácil
# ligar/desligar em dev sem afetar os demais alarmes).
#
# Runtime syn-nodejs-puppeteer — confirmar a versão mais recente em
# https://docs.aws.amazon.com/AmazonSynthetics/latest/userguide/CloudWatch_Synthetics_Canaries_Library.html
# antes do primeiro apply (AWS deprecia versões antigas periodicamente).

data "archive_file" "canary_script" {
  count       = var.enable_synthetic_canary ? 1 : 0
  type        = "zip"
  source_dir  = "${path.module}/canary-src"
  output_path = "${path.module}/canary-src.zip"
}

resource "aws_s3_bucket" "canary_artifacts" {
  count         = var.enable_synthetic_canary ? 1 : 0
  bucket        = "${var.project_name}-${var.environment}-canary-artifacts"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "canary_artifacts" {
  count  = var.enable_synthetic_canary ? 1 : 0
  bucket = aws_s3_bucket.canary_artifacts[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "canary_artifacts" {
  count  = var.enable_synthetic_canary ? 1 : 0
  bucket = aws_s3_bucket.canary_artifacts[0].id

  rule {
    id     = "expire-artifacts"
    status = "Enabled"
    filter {}
    expiration {
      days = 14
    }
  }
}

resource "aws_iam_role" "canary" {
  count = var.enable_synthetic_canary ? 1 : 0
  name  = "${var.project_name}-${var.environment}-canary-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "canary" {
  count = var.enable_synthetic_canary ? 1 : 0
  name  = "${var.project_name}-${var.environment}-canary-policy"
  role  = aws_iam_role.canary[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:PutObject", "s3:GetBucketLocation"]
        Resource = [aws_s3_bucket.canary_artifacts[0].arn, "${aws_s3_bucket.canary_artifacts[0].arn}/*"]
      },
      {
        Effect   = "Allow"
        Action   = ["s3:ListAllMyBuckets"]
        Resource = "*"
      },
      {
        Effect   = "Allow"
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = "arn:aws:logs:${var.aws_region}:*:log-group:/aws/lambda/cwsyn-*"
      },
      {
        Effect   = "Allow"
        Action   = ["cloudwatch:PutMetricData"]
        Resource = "*"
        Condition = {
          StringEquals = { "cloudwatch:namespace" = "CloudWatchSynthetics" }
        }
      },
      {
        Effect   = "Allow"
        Action   = ["xray:PutTraceSegments"]
        Resource = "*"
      }
    ]
  })
}

resource "aws_synthetics_canary" "heartbeat" {
  count                = var.enable_synthetic_canary ? 1 : 0
  name                 = "${var.project_name}-${var.environment}-heartbeat"
  artifact_s3_location = "s3://${aws_s3_bucket.canary_artifacts[0].id}/"
  execution_role_arn   = aws_iam_role.canary[0].arn
  handler              = "heartbeat.handler"
  zip_file             = data.archive_file.canary_script[0].output_path
  runtime_version      = "syn-nodejs-puppeteer-9.1"
  start_canary         = true

  schedule {
    expression = "rate(15 minutes)"
  }

  run_config {
    timeout_in_seconds = 60
    active_tracing     = true
    environment_variables = {
      TARGET_URL = var.frontend_url
    }
  }
}

resource "aws_sns_topic" "canary_alerts" {
  count = var.enable_synthetic_canary ? 1 : 0
  name  = "${var.project_name}-${var.environment}-canary-alerts"
}

resource "aws_sns_topic_subscription" "canary_alerts_email" {
  count     = var.enable_synthetic_canary && var.alarm_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.canary_alerts[0].arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

resource "aws_cloudwatch_metric_alarm" "canary_failure" {
  count               = var.enable_synthetic_canary ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-canary-failure"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 2
  metric_name         = "SuccessPercent"
  namespace           = "CloudWatchSynthetics"
  period              = 900
  statistic           = "Average"
  threshold           = 100
  alarm_description   = "Heartbeat canary falhou em ${var.frontend_url} por 2 execuções consecutivas"
  treat_missing_data  = "breaching"

  dimensions = {
    CanaryName = aws_synthetics_canary.heartbeat[0].name
  }

  alarm_actions = [aws_sns_topic.canary_alerts[0].arn]
  ok_actions    = [aws_sns_topic.canary_alerts[0].arn]
}
