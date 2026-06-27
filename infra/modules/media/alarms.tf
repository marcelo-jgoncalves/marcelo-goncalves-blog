# infra/modules/media/alarms.tf
# Alarme CloudWatch para a Lambda imageProcessor — ausente da lista original
# de monitored_functions do modulo lambda porque imageProcessor vive no
# modulo media (achado #2, docs/auditoria-engenharia/06-observabilidade.md).
# Topico SNS proprio, seguindo o mesmo padrao dos modulos lambda/api-gateway
# (cada modulo cria seu topico — evita dependencia circular entre modulos).

resource "aws_sns_topic" "media_alerts" {
  count = var.enable_cloudwatch_alarms ? 1 : 0
  name  = "${var.project_name}-${var.environment}-media-alerts"
}

resource "aws_sns_topic_subscription" "media_alerts_email" {
  count     = var.enable_cloudwatch_alarms && var.alarm_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.media_alerts[0].arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

resource "aws_cloudwatch_metric_alarm" "image_processor_errors" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-imageProcessor-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 60
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "Lambda imageProcessor acumulou mais de 5 erros em 1 minuto"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = aws_lambda_function.image_processor.function_name
  }

  alarm_actions = [aws_sns_topic.media_alerts[0].arn]
  ok_actions    = [aws_sns_topic.media_alerts[0].arn]
}

resource "aws_cloudwatch_metric_alarm" "image_processor_throttles" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-imageProcessor-throttles"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Throttles"
  namespace           = "AWS/Lambda"
  period              = 60
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "Lambda imageProcessor esta sendo throttled"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = aws_lambda_function.image_processor.function_name
  }

  alarm_actions = [aws_sns_topic.media_alerts[0].arn]
}
