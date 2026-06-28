output "budget_alerts_topic_arn" {
  value       = try(aws_sns_topic.budget_alerts[0].arn, "")
  description = "ARN do SNS topic para alertas de orçamento (AWS Budgets pode ser linkado manualmente)"
}
