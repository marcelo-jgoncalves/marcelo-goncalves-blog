#
# FinOps: SNS topic para notificações de orçamento (AWS Budgets pode ser
# criado manualmente via AWS Console quando necessário — sintaxe do Terraform
# para aws_budgets_budget varia conforme provider version).
#
# Referência para criação manual: AWS Budgets → Create budget → Monthly budget
# → SPENDING → Limit: definir manualmente → Notifications → Email

resource "aws_sns_topic" "budget_alerts" {
  count = var.enable_budget_alerts ? 1 : 0
  name  = "${var.project_name}-${var.environment}-budget-alerts"

  # Sem tags{} próprio: os 3 valores aqui eram idênticos ao default_tags do
  # provider (providers.tf) -- redundância pura, o AWS provider já aplica.
}

resource "aws_sns_topic_subscription" "budget_alerts_email" {
  count     = var.enable_budget_alerts && var.alert_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.budget_alerts[0].arn
  protocol  = "email"
  endpoint  = var.alert_email
}
