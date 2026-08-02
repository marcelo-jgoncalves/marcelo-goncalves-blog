# media

Pipeline de imagens: buckets S3 (`uploads-raw`, `assets`) + Lambda `imageProcessor` disparada por notificação S3, gerando as 6 variantes AVIF/WebP por upload.

<!-- BEGIN_TF_DOCS -->
## Resources

| Name | Type |
| ---- | ---- |
| [aws_cloudwatch_log_group.image_processor](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_metric_alarm.image_processor_dlq_depth](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.image_processor_errors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.image_processor_throttles](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_iam_policy.image_processor_dlq_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.processor_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.processor_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.image_processor_dlq_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.processor_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_lambda_function.image_processor](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function_event_invoke_config.image_processor](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_event_invoke_config) | resource |
| [aws_lambda_permission.allow_s3](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_s3_bucket.uploads](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket_cors_configuration.uploads_cors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_cors_configuration) | resource |
| [aws_s3_bucket_notification.bucket_notification](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_notification) | resource |
| [aws_s3_bucket_public_access_block.uploads_public_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_public_access_block) | resource |
| [aws_sns_topic.image_processor_dlq_alerts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic) | resource |
| [aws_sns_topic.media_alerts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic) | resource |
| [aws_sns_topic_subscription.image_processor_dlq_email](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_subscription) | resource |
| [aws_sns_topic_subscription.media_alerts_email](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_subscription) | resource |
| [aws_sqs_queue.image_processor_dlq](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue) | resource |

## Inputs

| Name | Description | Type | Default | Required |
| ---- | ----------- | ---- | ------- | :------: |
| <a name="input_assets_bucket_name"></a> [assets\_bucket\_name](#input\_assets\_bucket\_name) | Name of the S3 bucket where imageProcessor writes optimized media variants | `string` | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Deployment environment (dev/prd) | `string` | n/a | yes |
| <a name="input_posts_table_arn"></a> [posts\_table\_arn](#input\_posts\_table\_arn) | ARN of the Posts DynamoDB table | `string` | n/a | yes |
| <a name="input_posts_table_name"></a> [posts\_table\_name](#input\_posts\_table\_name) | Name of the Posts DynamoDB table | `string` | n/a | yes |
| <a name="input_project_name"></a> [project\_name](#input\_project\_name) | Project name, used as prefix for all resource names | `string` | n/a | yes |
| <a name="input_admin_origin"></a> [admin\_origin](#input\_admin\_origin) | CloudFront domain of admin SPA (for CORS whitelist in uploads bucket) | `string` | `""` | no |
| <a name="input_alarm_email"></a> [alarm\_email](#input\_alarm\_email) | Email for imageProcessor alarm SNS notifications | `string` | `""` | no |
| <a name="input_dlq_alert_email"></a> [dlq\_alert\_email](#input\_dlq\_alert\_email) | E-mail notified when the imageProcessor DLQ receives a lost event. Independent of enable\_cloudwatch\_alarms — the DLQ alarm is always on. | `string` | `""` | no |
| <a name="input_enable_cloudwatch_alarms"></a> [enable\_cloudwatch\_alarms](#input\_enable\_cloudwatch\_alarms) | Creates a CloudWatch error/throttle alarm for the imageProcessor Lambda | `bool` | `false` | no |
| <a name="input_enable_xray_tracing"></a> [enable\_xray\_tracing](#input\_enable\_xray\_tracing) | Enables AWS X-Ray tracing on the imageProcessor Lambda | `bool` | `false` | no |
| <a name="input_frontend_origin"></a> [frontend\_origin](#input\_frontend\_origin) | CloudFront domain of frontend blog (for CORS whitelist in uploads bucket) | `string` | `""` | no |
| <a name="input_log_level"></a> [log\_level](#input\_log\_level) | Log level for Lambda functions | `string` | `"INFO"` | no |
| <a name="input_log_retention_days"></a> [log\_retention\_days](#input\_log\_retention\_days) | CloudWatch log retention in days | `number` | `7` | no |

## Outputs

| Name | Description |
| ---- | ----------- |
| <a name="output_image_processor_function_name"></a> [image\_processor\_function\_name](#output\_image\_processor\_function\_name) | Function name of the imageProcessor Lambda |
| <a name="output_uploads_bucket_arn"></a> [uploads\_bucket\_arn](#output\_uploads\_bucket\_arn) | ARN of the S3 bucket for raw media uploads |
| <a name="output_uploads_bucket_name"></a> [uploads\_bucket\_name](#output\_uploads\_bucket\_name) | Name of the S3 bucket for raw media uploads |
| <a name="output_uploads_bucket_regional_domain_name"></a> [uploads\_bucket\_regional\_domain\_name](#output\_uploads\_bucket\_regional\_domain\_name) | Regional domain name of the uploads bucket, used to build presigned POST URLs |
<!-- END_TF_DOCS -->