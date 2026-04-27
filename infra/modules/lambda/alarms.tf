# infra/modules/lambda/alarms.tf
# CloudWatch alarms for all Lambda functions — gated by enable_cloudwatch_alarms

resource "aws_sns_topic" "lambda_alerts" {
  count = var.enable_cloudwatch_alarms ? 1 : 0
  name  = "${var.project_name}-${var.environment}-lambda-alerts"
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
  alarm_description   = "Lambda ${each.key} acumulou mais de 5 erros em 1 minuto"
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
  alarm_description   = "Lambda ${each.key} está sendo throttled"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = each.value
  }

  alarm_actions = [aws_sns_topic.lambda_alerts[0].arn]
}
