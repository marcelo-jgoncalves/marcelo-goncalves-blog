#
# Alerta baseado em error budget (Google SRE Workbook: "Multiwindow,
# Multi-Burn-Rate Alerts"), não em threshold arbitrário sobre métrica
# bruta. O SLI é a proporção de requests não-5xx do API Gateway; o SLO
# é var.availability_slo (default 99.5% em 30 dias); o que sobra (0.5%)
# é o error budget. Cada alarme dispara quando a TAXA DE CONSUMO desse
# budget excede um múltiplo — não quando "erros > N", que é arbitrário.
#
# 2 severidades, cada uma com 2 janelas (curta + longa) combinadas via
# Composite Alarm — só dispara quando AMBAS confirmam, evitando
# falso-positivo de pico isolado (flapping):
#   - fast burn (page):   5min + 1h,  burn rate 14.4x -> consome 2% do
#     budget mensal em 1h se sustentado.
#   - slow burn (ticket):  1h + 6h,   burn rate 6x    -> consome 5% do
#     budget mensal em 6h se sustentado.

locals {
  error_budget = 1 - var.availability_slo

  fast_burn_rate          = 14.4
  slow_burn_rate          = 6
  fast_burn_threshold_pct = local.fast_burn_rate * local.error_budget * 100
  slow_burn_threshold_pct = local.slow_burn_rate * local.error_budget * 100

  api_dimensions = {
    ApiName = var.api_gateway_name
    Stage   = "v1"
  }
}

resource "aws_sns_topic" "page_alerts" {
  count = var.enable_cloudwatch_alarms ? 1 : 0
  name  = "${var.project_name}-${var.environment}-slo-page"
}

resource "aws_sns_topic_subscription" "page_alerts_email" {
  count     = var.enable_cloudwatch_alarms && var.alarm_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.page_alerts[0].arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

resource "aws_sns_topic" "ticket_alerts" {
  count = var.enable_cloudwatch_alarms ? 1 : 0
  name  = "${var.project_name}-${var.environment}-slo-ticket"
}

resource "aws_sns_topic_subscription" "ticket_alerts_email" {
  count     = var.enable_cloudwatch_alarms && var.alarm_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.ticket_alerts[0].arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

# --- Fast burn (page): janela curta (5min) + janela longa (1h) ---

resource "aws_cloudwatch_metric_alarm" "availability_burn_fast_short" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-availability-burn-fast-short"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  threshold           = local.fast_burn_threshold_pct
  alarm_description   = "Burn rate ${local.fast_burn_rate}x of the availability error budget — short window (5min)"
  treat_missing_data  = "notBreaching"

  metric_query {
    id          = "errorRatio"
    expression  = "(e5xx / requests) * 100"
    label       = "Error Ratio %"
    return_data = true
  }
  metric_query {
    id = "e5xx"
    metric {
      metric_name = "5XXError"
      namespace   = "AWS/ApiGateway"
      period      = 300
      stat        = "Sum"
      dimensions  = local.api_dimensions
    }
  }
  metric_query {
    id = "requests"
    metric {
      metric_name = "Count"
      namespace   = "AWS/ApiGateway"
      period      = 300
      stat        = "Sum"
      dimensions  = local.api_dimensions
    }
  }
}

resource "aws_cloudwatch_metric_alarm" "availability_burn_fast_long" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-availability-burn-fast-long"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  threshold           = local.fast_burn_threshold_pct
  alarm_description   = "Burn rate ${local.fast_burn_rate}x of the availability error budget — long window (1h), confirms the short window"
  treat_missing_data  = "notBreaching"

  metric_query {
    id          = "errorRatio"
    expression  = "(e5xx / requests) * 100"
    label       = "Error Ratio %"
    return_data = true
  }
  metric_query {
    id = "e5xx"
    metric {
      metric_name = "5XXError"
      namespace   = "AWS/ApiGateway"
      period      = 3600
      stat        = "Sum"
      dimensions  = local.api_dimensions
    }
  }
  metric_query {
    id = "requests"
    metric {
      metric_name = "Count"
      namespace   = "AWS/ApiGateway"
      period      = 3600
      stat        = "Sum"
      dimensions  = local.api_dimensions
    }
  }
}

resource "aws_cloudwatch_composite_alarm" "availability_burn_fast" {
  count             = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name        = "${var.project_name}-${var.environment}-availability-burn-fast"
  alarm_rule        = "ALARM(\"${aws_cloudwatch_metric_alarm.availability_burn_fast_short[0].alarm_name}\") AND ALARM(\"${aws_cloudwatch_metric_alarm.availability_burn_fast_long[0].alarm_name}\")"
  alarm_description = "PAGE: burning the availability error budget fast enough to exhaust it within a few days if sustained."

  alarm_actions = [aws_sns_topic.page_alerts[0].arn]
  ok_actions    = [aws_sns_topic.page_alerts[0].arn]
}

# --- Slow burn (ticket): janela curta (1h) + janela longa (6h) ---

resource "aws_cloudwatch_metric_alarm" "availability_burn_slow_short" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-availability-burn-slow-short"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  threshold           = local.slow_burn_threshold_pct
  alarm_description   = "Burn rate ${local.slow_burn_rate}x of the availability error budget — short window (1h)"
  treat_missing_data  = "notBreaching"

  metric_query {
    id          = "errorRatio"
    expression  = "(e5xx / requests) * 100"
    label       = "Error Ratio %"
    return_data = true
  }
  metric_query {
    id = "e5xx"
    metric {
      metric_name = "5XXError"
      namespace   = "AWS/ApiGateway"
      period      = 3600
      stat        = "Sum"
      dimensions  = local.api_dimensions
    }
  }
  metric_query {
    id = "requests"
    metric {
      metric_name = "Count"
      namespace   = "AWS/ApiGateway"
      period      = 3600
      stat        = "Sum"
      dimensions  = local.api_dimensions
    }
  }
}

resource "aws_cloudwatch_metric_alarm" "availability_burn_slow_long" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-availability-burn-slow-long"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  threshold           = local.slow_burn_threshold_pct
  alarm_description   = "Burn rate ${local.slow_burn_rate}x of the availability error budget — long window (6h), confirms the short window"
  treat_missing_data  = "notBreaching"

  metric_query {
    id          = "errorRatio"
    expression  = "(e5xx / requests) * 100"
    label       = "Error Ratio %"
    return_data = true
  }
  metric_query {
    id = "e5xx"
    metric {
      metric_name = "5XXError"
      namespace   = "AWS/ApiGateway"
      period      = 21600
      stat        = "Sum"
      dimensions  = local.api_dimensions
    }
  }
  metric_query {
    id = "requests"
    metric {
      metric_name = "Count"
      namespace   = "AWS/ApiGateway"
      period      = 21600
      stat        = "Sum"
      dimensions  = local.api_dimensions
    }
  }
}

resource "aws_cloudwatch_composite_alarm" "availability_burn_slow" {
  count             = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name        = "${var.project_name}-${var.environment}-availability-burn-slow"
  alarm_rule        = "ALARM(\"${aws_cloudwatch_metric_alarm.availability_burn_slow_short[0].alarm_name}\") AND ALARM(\"${aws_cloudwatch_metric_alarm.availability_burn_slow_long[0].alarm_name}\")"
  alarm_description = "TICKET: burning the availability error budget at a rate worth investigating, without page urgency."

  alarm_actions = [aws_sns_topic.ticket_alerts[0].arn]
  ok_actions    = [aws_sns_topic.ticket_alerts[0].arn]
}
