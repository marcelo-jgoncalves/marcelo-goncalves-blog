# infra/modules/api-gateway/alarms.tf
# CloudWatch alarms for API Gateway — gated by enable_cloudwatch_alarms

resource "aws_sns_topic" "api_alerts" {
  count = var.enable_cloudwatch_alarms ? 1 : 0
  name  = "${var.project_name}-${var.environment}-api-alerts"
}

resource "aws_sns_topic_subscription" "api_alerts_email" {
  count     = var.enable_cloudwatch_alarms && var.alarm_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.api_alerts[0].arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

resource "aws_cloudwatch_metric_alarm" "api_5xx" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-api-5xx"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5XXError"
  namespace           = "AWS/ApiGateway"
  period              = 60
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "API Gateway acumulou mais de 5 erros 5xx em 1 minuto"
  treat_missing_data  = "notBreaching"

  dimensions = {
    ApiName = "${var.project_name}-${var.environment}-api"
    Stage   = "v1"
  }

  alarm_actions = [aws_sns_topic.api_alerts[0].arn]
  ok_actions    = [aws_sns_topic.api_alerts[0].arn]
}

resource "aws_cloudwatch_metric_alarm" "api_latency_p99" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-api-latency-p99"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "IntegrationLatency"
  namespace           = "AWS/ApiGateway"
  period              = 300
  extended_statistic  = "p99"
  threshold           = 5000
  alarm_description   = "API Gateway P99 de latência de integração excedeu 5s"
  treat_missing_data  = "notBreaching"

  dimensions = {
    ApiName = "${var.project_name}-${var.environment}-api"
    Stage   = "v1"
  }

  alarm_actions = [aws_sns_topic.api_alerts[0].arn]
}
