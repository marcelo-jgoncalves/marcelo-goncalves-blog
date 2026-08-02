# api-gateway

API Gateway HTTP API na frente das Lambdas do backend — rotas, CORS, Lambda Authorizer (admin), alarmes de latência p99.

<!-- BEGIN_TF_DOCS -->
## Resources

| Name | Type |
| ---- | ---- |
| [aws_api_gateway_authorizer.admin_cookie_auth](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_authorizer) | resource |
| [aws_api_gateway_deployment.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_deployment) | resource |
| [aws_api_gateway_gateway_response.access_denied_cors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_gateway_response) | resource |
| [aws_api_gateway_gateway_response.default_4xx_cors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_gateway_response) | resource |
| [aws_api_gateway_gateway_response.default_5xx_cors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_gateway_response) | resource |
| [aws_api_gateway_gateway_response.unauthorized_cors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_gateway_response) | resource |
| [aws_api_gateway_integration.admin_autor_id_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.admin_categorias_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.admin_categorias_slug_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.admin_post_slug_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.admin_posts_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.admin_session_delete_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.admin_session_get_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.admin_session_post_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.cors_preflight](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.get_artigos_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.get_author_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.get_busca_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.get_categoria_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.get_populares_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.get_post_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.get_projeto_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.get_recentes_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.media_upload_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration_response.cors_preflight](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration_response) | resource |
| [aws_api_gateway_method.admin_autor_id_any](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.admin_categorias_any](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.admin_categorias_slug_any](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.admin_post_slug_any](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.admin_posts_any](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.admin_session_delete](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.admin_session_get](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.admin_session_post](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.cors_preflight](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.get_artigos](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.get_author](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.get_busca](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.get_categoria](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.get_populares](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.get_post](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.get_projeto](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.get_recentes](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.media_upload_post](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method_response.cors_preflight_200](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method_response) | resource |
| [aws_api_gateway_method_settings.throttle_admin_session](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method_settings) | resource |
| [aws_api_gateway_method_settings.throttle_all](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method_settings) | resource |
| [aws_api_gateway_resource.admin](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.admin_autor_id](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.admin_autor_singular](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.admin_autores](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.admin_categorias](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.admin_categorias_slug](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.admin_media](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.admin_media_upload](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.admin_post_singular](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.admin_post_slug](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.admin_posts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.admin_session](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.artigos](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.autor](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.autor_id](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.busca](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.categoria](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.categoria_slug](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.post](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.post_slug](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.posts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.posts_populares](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.posts_recentes](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_resource.projeto](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_rest_api.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_rest_api) | resource |
| [aws_api_gateway_stage.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_stage) | resource |
| [aws_cloudwatch_metric_alarm.api_5xx](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.api_latency_p99](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_lambda_permission.apigw_admin_authorizer](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_lambda_permission.apigw_admin_authors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_lambda_permission.apigw_admin_categorias](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_lambda_permission.apigw_admin_posts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_lambda_permission.apigw_admin_session](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_lambda_permission.apigw_get_author](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_lambda_permission.apigw_get_post](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_lambda_permission.apigw_get_posts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_lambda_permission.apigw_media_upload](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_sns_topic.api_alerts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic) | resource |
| [aws_sns_topic_subscription.api_alerts_email](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_subscription) | resource |

## Inputs

| Name | Description | Type | Default | Required |
| ---- | ----------- | ---- | ------- | :------: |
| <a name="input_admin_authorizer_function_name"></a> [admin\_authorizer\_function\_name](#input\_admin\_authorizer\_function\_name) | Function name of the admin\_authorizer Lambda, used for the Lambda permission resource | `string` | n/a | yes |
| <a name="input_admin_authorizer_invoke_arn"></a> [admin\_authorizer\_invoke\_arn](#input\_admin\_authorizer\_invoke\_arn) | Invocation ARN of the admin\_authorizer Lambda, used as the API Gateway custom authorizer | `string` | n/a | yes |
| <a name="input_admin_authors_function_name"></a> [admin\_authors\_function\_name](#input\_admin\_authors\_function\_name) | Function name of the admin\_authors Lambda, used for the Lambda permission resource | `string` | n/a | yes |
| <a name="input_admin_authors_invoke_arn"></a> [admin\_authors\_invoke\_arn](#input\_admin\_authors\_invoke\_arn) | Invocation ARN of the admin\_authors Lambda | `string` | n/a | yes |
| <a name="input_admin_categorias_function_name"></a> [admin\_categorias\_function\_name](#input\_admin\_categorias\_function\_name) | Function name of the admin\_categorias Lambda, used for the Lambda permission resource | `string` | n/a | yes |
| <a name="input_admin_categorias_invoke_arn"></a> [admin\_categorias\_invoke\_arn](#input\_admin\_categorias\_invoke\_arn) | Invocation ARN of the admin\_categorias Lambda | `string` | n/a | yes |
| <a name="input_admin_origin"></a> [admin\_origin](#input\_admin\_origin) | Full origin (https://...) of the admin SPA — the only origin allowed on CORS preflight responses and gateway responses of protected routes | `string` | n/a | yes |
| <a name="input_admin_posts_function_name"></a> [admin\_posts\_function\_name](#input\_admin\_posts\_function\_name) | Function name of the admin\_posts Lambda, used for the Lambda permission resource | `string` | n/a | yes |
| <a name="input_admin_posts_invoke_arn"></a> [admin\_posts\_invoke\_arn](#input\_admin\_posts\_invoke\_arn) | Invocation ARN of the admin\_posts Lambda | `string` | n/a | yes |
| <a name="input_admin_session_function_name"></a> [admin\_session\_function\_name](#input\_admin\_session\_function\_name) | Function name of the admin\_session Lambda, used for the Lambda permission resource | `string` | n/a | yes |
| <a name="input_admin_session_invoke_arn"></a> [admin\_session\_invoke\_arn](#input\_admin\_session\_invoke\_arn) | Invocation ARN of the admin\_session Lambda | `string` | n/a | yes |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region the API Gateway is deployed to | `string` | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Deployment environment (dev/prd) | `string` | n/a | yes |
| <a name="input_get_author_function_name"></a> [get\_author\_function\_name](#input\_get\_author\_function\_name) | Function name of the get\_author Lambda, used for the Lambda permission resource | `string` | n/a | yes |
| <a name="input_get_author_invoke_arn"></a> [get\_author\_invoke\_arn](#input\_get\_author\_invoke\_arn) | Invocation ARN of the get\_author Lambda | `string` | n/a | yes |
| <a name="input_get_post_function_name"></a> [get\_post\_function\_name](#input\_get\_post\_function\_name) | Function name of the get\_post Lambda, used for the Lambda permission resource | `string` | n/a | yes |
| <a name="input_get_post_invoke_arn"></a> [get\_post\_invoke\_arn](#input\_get\_post\_invoke\_arn) | Invocation ARN of the get\_post Lambda | `string` | n/a | yes |
| <a name="input_get_posts_function_name"></a> [get\_posts\_function\_name](#input\_get\_posts\_function\_name) | Function name of the get\_posts Lambda, used for the Lambda permission resource | `string` | n/a | yes |
| <a name="input_get_posts_invoke_arn"></a> [get\_posts\_invoke\_arn](#input\_get\_posts\_invoke\_arn) | Invocation ARN of the get\_posts Lambda | `string` | n/a | yes |
| <a name="input_media_upload_function_name"></a> [media\_upload\_function\_name](#input\_media\_upload\_function\_name) | Function name of the media\_upload Lambda, used for the Lambda permission resource | `string` | n/a | yes |
| <a name="input_media_upload_invoke_arn"></a> [media\_upload\_invoke\_arn](#input\_media\_upload\_invoke\_arn) | Invocation ARN of the media\_upload Lambda | `string` | n/a | yes |
| <a name="input_project_name"></a> [project\_name](#input\_project\_name) | Project name, used as prefix for all resource names | `string` | n/a | yes |
| <a name="input_alarm_email"></a> [alarm\_email](#input\_alarm\_email) | Email for alarm notifications via SNS | `string` | `""` | no |
| <a name="input_enable_cloudwatch_alarms"></a> [enable\_cloudwatch\_alarms](#input\_enable\_cloudwatch\_alarms) | Creates CloudWatch alarms for API Gateway 5xx and latency | `bool` | `false` | no |
| <a name="input_enable_xray_tracing"></a> [enable\_xray\_tracing](#input\_enable\_xray\_tracing) | Enables AWS X-Ray tracing on the API Gateway stage | `bool` | `false` | no |
| <a name="input_throttle_burst_limit"></a> [throttle\_burst\_limit](#input\_throttle\_burst\_limit) | Burst of concurrent requests allowed before throttling | `number` | `40` | no |
| <a name="input_throttle_rate_limit"></a> [throttle\_rate\_limit](#input\_throttle\_rate\_limit) | Sustained requests per second, by default, across the whole stage | `number` | `20` | no |

## Outputs

| Name | Description |
| ---- | ----------- |
| <a name="output_api_gateway_domain_name"></a> [api\_gateway\_domain\_name](#output\_api\_gateway\_domain\_name) | Bare execute-api domain name of the API Gateway (no protocol, no stage path) |
| <a name="output_api_gateway_stage_path"></a> [api\_gateway\_stage\_path](#output\_api\_gateway\_stage\_path) | Stage path prefix of the API Gateway (e.g. /v1) |
| <a name="output_api_url"></a> [api\_url](#output\_api\_url) | Full invoke URL of the API Gateway stage |
<!-- END_TF_DOCS -->