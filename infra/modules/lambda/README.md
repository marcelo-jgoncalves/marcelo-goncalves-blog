# lambda

As 9 Lambdas do backend (Node.js 20), roles IAM, alarmes de erro/throttle. Convenção de nomenclatura de recurso é `snake_case`; chaves de `for_each` de IAM ainda em `camelCase` (CLAUDE.md §10 #47, correção deferida).

<!-- BEGIN_TF_DOCS -->
## Resources

| Name | Type |
| ---- | ---- |
| [aws_cloudwatch_log_group.admin_authorizer](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.admin_authors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.admin_categorias](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.admin_posts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.admin_session](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.get_author](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.get_post](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.get_posts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.media_upload](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.post_scheduler](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_metric_alarm.lambda_errors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.lambda_throttles](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.post_scheduler_dlq_depth](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_iam_policy.adminAuthorizer_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.adminAuthors_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.adminCategorias_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.adminPosts_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.adminSession_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.eventbridge_scheduler_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.getAuthor_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.getPost_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.getPosts_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.mediaUpload_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.postScheduler_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.post_scheduler_dlq_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.eventbridge_scheduler_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.function_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.adminAuthorizer_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.adminAuthors_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.adminCategorias_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.adminPosts_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.adminSession_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.eventbridge_scheduler_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.getAuthor_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.getPost_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.getPosts_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.mediaUpload_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.postScheduler_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.post_scheduler_dlq_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_lambda_function.admin_authorizer](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function.admin_authors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function.admin_categorias](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function.admin_posts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function.admin_session](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function.get_author](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function.get_post](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function.get_posts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function.media_upload](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function.post_scheduler](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function_event_invoke_config.post_scheduler](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_event_invoke_config) | resource |
| [aws_scheduler_schedule.post_scheduler](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/scheduler_schedule) | resource |
| [aws_sns_topic.lambda_alerts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic) | resource |
| [aws_sns_topic.post_scheduler_dlq_alerts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic) | resource |
| [aws_sns_topic_subscription.lambda_alerts_email](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_subscription) | resource |
| [aws_sns_topic_subscription.post_scheduler_dlq_email](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_subscription) | resource |
| [aws_sqs_queue.post_scheduler_dlq](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |

## Inputs

| Name | Description | Type | Default | Required |
| ---- | ----------- | ---- | ------- | :------: |
| <a name="input_admin_sessions_table_arn"></a> [admin\_sessions\_table\_arn](#input\_admin\_sessions\_table\_arn) | ARN of the admin sessions (BFF) DynamoDB table, used by adminSession/adminAuthorizer | `string` | n/a | yes |
| <a name="input_autores_table_arn"></a> [autores\_table\_arn](#input\_autores\_table\_arn) | ARN of the Autores DynamoDB table | `string` | n/a | yes |
| <a name="input_categorias_table_arn"></a> [categorias\_table\_arn](#input\_categorias\_table\_arn) | ARN of the Categorias DynamoDB table | `string` | n/a | yes |
| <a name="input_cognito_client_id"></a> [cognito\_client\_id](#input\_cognito\_client\_id) | ID of the Cognito App Client, used by adminSession/adminAuthorizer to verify the idToken via JWKS | `string` | n/a | yes |
| <a name="input_cognito_user_pool_id"></a> [cognito\_user\_pool\_id](#input\_cognito\_user\_pool\_id) | ID of the Cognito User Pool, used by adminSession/adminAuthorizer to verify the idToken via JWKS | `string` | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Deployment environment (dev/prd) | `string` | n/a | yes |
| <a name="input_frontend_distribution_id"></a> [frontend\_distribution\_id](#input\_frontend\_distribution\_id) | CloudFront distribution ID of the public frontend, used by adminPosts/postScheduler to invalidate the cache of /post/{slug} (and /) on demand after a write | `string` | n/a | yes |
| <a name="input_posts_table_arn"></a> [posts\_table\_arn](#input\_posts\_table\_arn) | ARN of the Posts DynamoDB table | `string` | n/a | yes |
| <a name="input_project_name"></a> [project\_name](#input\_project\_name) | Project name, used as prefix for all resource names | `string` | n/a | yes |
| <a name="input_uploads_bucket_arn"></a> [uploads\_bucket\_arn](#input\_uploads\_bucket\_arn) | ARN of the S3 bucket for raw media uploads | `string` | n/a | yes |
| <a name="input_uploads_bucket_name"></a> [uploads\_bucket\_name](#input\_uploads\_bucket\_name) | Name of the S3 bucket for raw media uploads | `string` | n/a | yes |
| <a name="input_admin_origin"></a> [admin\_origin](#input\_admin\_origin) | Allowed CORS origin for admin Lambdas (CloudFront admin URL) | `string` | `"*"` | no |
| <a name="input_alarm_email"></a> [alarm\_email](#input\_alarm\_email) | Email for Lambda alarm SNS notifications | `string` | `""` | no |
| <a name="input_dlq_alert_email"></a> [dlq\_alert\_email](#input\_dlq\_alert\_email) | E-mail notified when the postScheduler DLQ receives a lost event. Independent of enable\_cloudwatch\_alarms — the DLQ alarm is always on. | `string` | `""` | no |
| <a name="input_enable_cloudwatch_alarms"></a> [enable\_cloudwatch\_alarms](#input\_enable\_cloudwatch\_alarms) | Creates CloudWatch error alarms for all Lambda functions | `bool` | `false` | no |
| <a name="input_enable_xray_tracing"></a> [enable\_xray\_tracing](#input\_enable\_xray\_tracing) | Enable AWS X-Ray active tracing on Lambda functions | `bool` | `false` | no |
| <a name="input_log_level"></a> [log\_level](#input\_log\_level) | Log level for Lambda functions (DEBUG in dev, INFO in prod) | `string` | `"INFO"` | no |
| <a name="input_log_retention_days"></a> [log\_retention\_days](#input\_log\_retention\_days) | CloudWatch log retention in days | `number` | `7` | no |

## Outputs

| Name | Description |
| ---- | ----------- |
| <a name="output_admin_authorizer_function_name"></a> [admin\_authorizer\_function\_name](#output\_admin\_authorizer\_function\_name) | Function name of the admin\_authorizer Lambda |
| <a name="output_admin_authorizer_invoke_arn"></a> [admin\_authorizer\_invoke\_arn](#output\_admin\_authorizer\_invoke\_arn) | Invocation ARN of the admin\_authorizer Lambda, used as the API Gateway custom authorizer |
| <a name="output_admin_authors_function_name"></a> [admin\_authors\_function\_name](#output\_admin\_authors\_function\_name) | Function name of the admin\_authors Lambda |
| <a name="output_admin_authors_invoke_arn"></a> [admin\_authors\_invoke\_arn](#output\_admin\_authors\_invoke\_arn) | Invocation ARN of the admin\_authors Lambda, used by the API Gateway integration |
| <a name="output_admin_categorias_function_name"></a> [admin\_categorias\_function\_name](#output\_admin\_categorias\_function\_name) | Function name of the admin\_categorias Lambda |
| <a name="output_admin_categorias_invoke_arn"></a> [admin\_categorias\_invoke\_arn](#output\_admin\_categorias\_invoke\_arn) | Invocation ARN of the admin\_categorias Lambda, used by the API Gateway integration |
| <a name="output_admin_posts_function_name"></a> [admin\_posts\_function\_name](#output\_admin\_posts\_function\_name) | Function name of the admin\_posts Lambda |
| <a name="output_admin_posts_invoke_arn"></a> [admin\_posts\_invoke\_arn](#output\_admin\_posts\_invoke\_arn) | Invocation ARN of the admin\_posts Lambda, used by the API Gateway integration |
| <a name="output_admin_session_function_name"></a> [admin\_session\_function\_name](#output\_admin\_session\_function\_name) | Function name of the admin\_session Lambda |
| <a name="output_admin_session_invoke_arn"></a> [admin\_session\_invoke\_arn](#output\_admin\_session\_invoke\_arn) | Invocation ARN of the admin\_session Lambda, used by the API Gateway integration |
| <a name="output_get_author_function_name"></a> [get\_author\_function\_name](#output\_get\_author\_function\_name) | Function name of the get\_author Lambda |
| <a name="output_get_author_invoke_arn"></a> [get\_author\_invoke\_arn](#output\_get\_author\_invoke\_arn) | Invocation ARN of the get\_author Lambda, used by the API Gateway integration |
| <a name="output_get_post_function_name"></a> [get\_post\_function\_name](#output\_get\_post\_function\_name) | Function name of the get\_post Lambda |
| <a name="output_get_post_invoke_arn"></a> [get\_post\_invoke\_arn](#output\_get\_post\_invoke\_arn) | Invocation ARN of the get\_post Lambda, used by the API Gateway integration |
| <a name="output_get_posts_function_name"></a> [get\_posts\_function\_name](#output\_get\_posts\_function\_name) | Function name of the get\_posts Lambda |
| <a name="output_get_posts_invoke_arn"></a> [get\_posts\_invoke\_arn](#output\_get\_posts\_invoke\_arn) | Invocation ARN of the get\_posts Lambda, used by the API Gateway integration |
| <a name="output_media_upload_function_name"></a> [media\_upload\_function\_name](#output\_media\_upload\_function\_name) | Function name of the media\_upload Lambda |
| <a name="output_media_upload_invoke_arn"></a> [media\_upload\_invoke\_arn](#output\_media\_upload\_invoke\_arn) | Invocation ARN of the media\_upload Lambda, used by the API Gateway integration |
| <a name="output_post_scheduler_function_name"></a> [post\_scheduler\_function\_name](#output\_post\_scheduler\_function\_name) | Function name of the post\_scheduler Lambda (EventBridge-triggered, no API Gateway integration) |
<!-- END_TF_DOCS -->