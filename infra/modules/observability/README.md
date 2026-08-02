# observability

Dashboard CloudWatch unificado (golden signals), alarmes de SLO burn-rate e canary sintético opcional (Synthetics, ~US$3-4/mês quando ativo).

<!-- BEGIN_TF_DOCS -->
## Resources

| Name | Type |
| ---- | ---- |
| [aws_cloudwatch_composite_alarm.availability_burn_fast](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_composite_alarm) | resource |
| [aws_cloudwatch_composite_alarm.availability_burn_slow](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_composite_alarm) | resource |
| [aws_cloudwatch_dashboard.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_dashboard) | resource |
| [aws_cloudwatch_metric_alarm.availability_burn_fast_long](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.availability_burn_fast_short](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.availability_burn_slow_long](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.availability_burn_slow_short](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.canary_failure](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_iam_role.canary](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy.canary](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_s3_bucket.canary_artifacts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket_lifecycle_configuration.canary_artifacts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_lifecycle_configuration) | resource |
| [aws_s3_bucket_public_access_block.canary_artifacts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_public_access_block) | resource |
| [aws_sns_topic.canary_alerts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic) | resource |
| [aws_sns_topic.page_alerts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic) | resource |
| [aws_sns_topic.ticket_alerts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic) | resource |
| [aws_sns_topic_subscription.canary_alerts_email](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_subscription) | resource |
| [aws_sns_topic_subscription.page_alerts_email](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_subscription) | resource |
| [aws_sns_topic_subscription.ticket_alerts_email](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_subscription) | resource |
| [aws_synthetics_canary.heartbeat](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/synthetics_canary) | resource |
| [archive_file.canary_script](https://registry.terraform.io/providers/hashicorp/archive/latest/docs/data-sources/file) | data source |

## Inputs

| Name | Description | Type | Default | Required |
| ---- | ----------- | ---- | ------- | :------: |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region the observability resources are deployed to | `string` | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Deployment environment (dev/prd) | `string` | n/a | yes |
| <a name="input_project_name"></a> [project\_name](#input\_project\_name) | Project name, used as prefix for all resource names | `string` | n/a | yes |
| <a name="input_alarm_email"></a> [alarm\_email](#input\_alarm\_email) | Email for SNS notifications (canary failure alarm). | `string` | `""` | no |
| <a name="input_api_gateway_name"></a> [api\_gateway\_name](#input\_api\_gateway\_name) | API Gateway name, for the dashboard's traffic/latency/error widgets. | `string` | `""` | no |
| <a name="input_availability_slo"></a> [availability\_slo](#input\_availability\_slo) | API Gateway availability SLO (proportion of non-5xx requests), over a 30-day window. Defines the error budget used in the burn rate alarms. | `number` | `0.995` | no |
| <a name="input_enable_cloudwatch_alarms"></a> [enable\_cloudwatch\_alarms](#input\_enable\_cloudwatch\_alarms) | Creates the unified CloudWatch Dashboard (4 golden signals). Reuses the same flag as the other modules. | `bool` | `false` | no |
| <a name="input_enable_synthetic_canary"></a> [enable\_synthetic\_canary](#input\_enable\_synthetic\_canary) | Creates a CloudWatch Synthetics canary (heartbeat) that checks the public URL every 15min. Cost ~US$3-4/month when active — turn off in dev when not validating. | `bool` | `false` | no |
| <a name="input_frontend_url"></a> [frontend\_url](#input\_frontend\_url) | Public blog URL (with https://) that the canary should check. | `string` | `""` | no |
| <a name="input_lambda_function_names"></a> [lambda\_function\_names](#input\_lambda\_function\_names) | Map of friendly name -> real function\_name, for the dashboard's errors/throttles/duration widgets. | `map(string)` | `{}` | no |

## Outputs

No outputs.
<!-- END_TF_DOCS -->