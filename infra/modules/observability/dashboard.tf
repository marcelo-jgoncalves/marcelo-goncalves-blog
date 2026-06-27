# infra/modules/observability/dashboard.tf
# Dashboard único correlacionando os Four Golden Signals (Google SRE):
# latência, tráfego, erros e saturação — hoje espalhados em alarmes
# isolados por recurso (api-gateway/lambda/media). Gated pelo mesmo
# enable_cloudwatch_alarms dos demais módulos (CloudWatch Dashboards:
# as 3 primeiras são gratuitas, este projeto não tem outras).

locals {
  lambda_errors_metrics = [
    for name, fn in var.lambda_function_names :
    ["AWS/Lambda", "Errors", "FunctionName", fn, { label = name, stat = "Sum" }]
  ]

  lambda_throttles_metrics = [
    for name, fn in var.lambda_function_names :
    ["AWS/Lambda", "Throttles", "FunctionName", fn, { label = name, stat = "Sum" }]
  ]

  lambda_duration_metrics = [
    for name, fn in var.lambda_function_names :
    ["AWS/Lambda", "Duration", "FunctionName", fn, { label = name, stat = "p99" }]
  ]

  base_widgets = [
    {
      type   = "metric"
      x      = 0
      y      = 0
      width  = 12
      height = 6
      properties = {
        title  = "Tráfego — Requests (API Gateway)"
        view   = "timeSeries"
        region = var.aws_region
        metrics = [
          ["AWS/ApiGateway", "Count", "ApiName", var.api_gateway_name, "Stage", "v1", { stat = "Sum", label = "Requests" }]
        ]
        period = 300
      }
    },
    {
      type   = "metric"
      x      = 12
      y      = 0
      width  = 12
      height = 6
      properties = {
        title  = "Latência — API Gateway Integration (p99)"
        view   = "timeSeries"
        region = var.aws_region
        metrics = [
          ["AWS/ApiGateway", "IntegrationLatency", "ApiName", var.api_gateway_name, "Stage", "v1", { stat = "p99", label = "p99" }]
        ]
        period = 300
      }
    },
    {
      type   = "metric"
      x      = 0
      y      = 6
      width  = 12
      height = 6
      properties = {
        title  = "Erros — API Gateway 4xx/5xx + Lambda Errors"
        view   = "timeSeries"
        region = var.aws_region
        metrics = concat([
          ["AWS/ApiGateway", "4XXError", "ApiName", var.api_gateway_name, "Stage", "v1", { stat = "Sum", label = "API 4xx" }],
          ["AWS/ApiGateway", "5XXError", "ApiName", var.api_gateway_name, "Stage", "v1", { stat = "Sum", label = "API 5xx" }]
        ], local.lambda_errors_metrics)
        period = 300
      }
    },
    {
      type   = "metric"
      x      = 12
      y      = 6
      width  = 12
      height = 6
      properties = {
        title   = "Saturação — Lambda Throttles + Duration p99"
        view    = "timeSeries"
        region  = var.aws_region
        metrics = concat(local.lambda_throttles_metrics, local.lambda_duration_metrics)
        period  = 300
      }
    }
  ]

  canary_widget = [{
    type   = "metric"
    x      = 0
    y      = 12
    width  = 24
    height = 6
    properties = {
      title  = "Synthetic Canary — Disponibilidade (heartbeat)"
      view   = "timeSeries"
      region = var.aws_region
      metrics = [
        ["CloudWatchSynthetics", "SuccessPercent", "CanaryName", "${var.project_name}-${var.environment}-heartbeat", { stat = "Average", label = "Success %" }]
      ]
      period = 300
    }
  }]

  widgets = concat(local.base_widgets, var.enable_synthetic_canary ? local.canary_widget : [])
}

resource "aws_cloudwatch_dashboard" "main" {
  count          = var.enable_cloudwatch_alarms ? 1 : 0
  dashboard_name = "${var.project_name}-${var.environment}-golden-signals"
  dashboard_body = jsonencode({ widgets = local.widgets })
}
