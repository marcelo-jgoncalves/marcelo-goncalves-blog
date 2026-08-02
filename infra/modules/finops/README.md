# finops

Tópico SNS para alertas de orçamento. O `aws_budgets_budget` em si é criado manualmente no console (ver comentário em `main.tf`) — sintaxe do provider para esse recurso varia por versão.

<!-- BEGIN_TF_DOCS -->
## Resources

| Name | Type |
| ---- | ---- |
| [aws_sns_topic.budget_alerts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic) | resource |
| [aws_sns_topic_subscription.budget_alerts_email](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_subscription) | resource |

## Inputs

| Name | Description | Type | Default | Required |
| ---- | ----------- | ---- | ------- | :------: |
| <a name="input_environment"></a> [environment](#input\_environment) | Deployment environment (dev/prd) | `string` | n/a | yes |
| <a name="input_project_name"></a> [project\_name](#input\_project\_name) | Project name, used as prefix for all resource names | `string` | n/a | yes |
| <a name="input_alert_email"></a> [alert\_email](#input\_alert\_email) | Email for budget overspend notifications | `string` | `""` | no |
| <a name="input_enable_budget_alerts"></a> [enable\_budget\_alerts](#input\_enable\_budget\_alerts) | Enables creation of Budget Alerts (false to keep minimum cost in dev) | `bool` | `false` | no |

## Outputs

| Name | Description |
| ---- | ----------- |
| <a name="output_budget_alerts_topic_arn"></a> [budget\_alerts\_topic\_arn](#output\_budget\_alerts\_topic\_arn) | ARN of the SNS topic for budget alerts (AWS Budgets can be linked manually) |
<!-- END_TF_DOCS -->