output "budget_alerts_topic_arn" {
  value       = try(aws_sns_topic.budget_alerts[0].arn, "")
  description = "ARN of the SNS topic for budget alerts (AWS Budgets can be linked manually)"
}
