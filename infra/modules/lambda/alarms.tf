# CloudWatch alarms for all Lambda functions — gated by enable_cloudwatch_alarms

resource "aws_sns_topic" "lambda_alerts" {
  count = var.enable_cloudwatch_alarms ? 1 : 0
  name  = "${var.project_name}-${var.environment}-lambda-alerts"
  # AWS-managed key (free) -- Trivy AWS-0095 flags unencrypted topics.
  kms_master_key_id = "alias/aws/sns"
}

resource "aws_sns_topic_subscription" "lambda_alerts_email" {
  count     = var.enable_cloudwatch_alarms && var.alarm_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.lambda_alerts[0].arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

locals {
  monitored_functions = var.enable_cloudwatch_alarms ? {
    getPost         = aws_lambda_function.get_post.function_name
    getAuthor       = aws_lambda_function.get_author.function_name
    getPosts        = aws_lambda_function.get_posts.function_name
    adminPosts      = aws_lambda_function.admin_posts.function_name
    adminAuthors    = aws_lambda_function.admin_authors.function_name
    adminCategorias = aws_lambda_function.admin_categorias.function_name
    mediaUpload     = aws_lambda_function.media_upload.function_name
    postScheduler   = aws_lambda_function.post_scheduler.function_name
    adminSession    = aws_lambda_function.admin_session.function_name
    adminAuthorizer = aws_lambda_function.admin_authorizer.function_name
  } : {}
}

resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  for_each = local.monitored_functions

  alarm_name          = "${var.project_name}-${var.environment}-${each.key}-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 60
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "Lambda ${each.key} accumulated more than 5 errors in 1 minute"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = each.value
  }

  alarm_actions = [aws_sns_topic.lambda_alerts[0].arn]
  ok_actions    = [aws_sns_topic.lambda_alerts[0].arn]
}

resource "aws_cloudwatch_metric_alarm" "lambda_throttles" {
  for_each = local.monitored_functions

  alarm_name          = "${var.project_name}-${var.environment}-${each.key}-throttles"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Throttles"
  namespace           = "AWS/Lambda"
  period              = 60
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "Lambda ${each.key} is being throttled"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = each.value
  }

  alarm_actions = [aws_sns_topic.lambda_alerts[0].arn]
}
