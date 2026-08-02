# dynamodb

Tabelas DynamoDB (`posts`, `autores`, `categorias`) e suas GSIs esparsas. `e_popular`/`e_projeto` são Number (0/1), não Boolean — limitação de GSI.

<!-- BEGIN_TF_DOCS -->
## Resources

| Name | Type |
| ---- | ---- |
| [aws_dynamodb_table.admin_sessions](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table) | resource |
| [aws_dynamodb_table.autores](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table) | resource |
| [aws_dynamodb_table.categorias](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table) | resource |
| [aws_dynamodb_table.posts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table) | resource |

## Inputs

| Name | Description | Type | Default | Required |
| ---- | ----------- | ---- | ------- | :------: |
| <a name="input_environment"></a> [environment](#input\_environment) | Deployment environment (dev/prd) | `string` | n/a | yes |
| <a name="input_project_name"></a> [project\_name](#input\_project\_name) | Project name, used as prefix for all table names | `string` | n/a | yes |
| <a name="input_enable_point_in_time_recovery"></a> [enable\_point\_in\_time\_recovery](#input\_enable\_point\_in\_time\_recovery) | Enables Point-in-Time Recovery on the 3 tables (posts/autores/categorias). Disabled in dev due to cost; enable in production. | `bool` | `false` | no |

## Outputs

| Name | Description |
| ---- | ----------- |
| <a name="output_admin_sessions_table_arn"></a> [admin\_sessions\_table\_arn](#output\_admin\_sessions\_table\_arn) | ARN of the admin sessions (BFF) DynamoDB table |
| <a name="output_admin_sessions_table_name"></a> [admin\_sessions\_table\_name](#output\_admin\_sessions\_table\_name) | Name of the admin sessions (BFF) DynamoDB table |
| <a name="output_autores_table_arn"></a> [autores\_table\_arn](#output\_autores\_table\_arn) | ARN of the Autores DynamoDB table |
| <a name="output_autores_table_name"></a> [autores\_table\_name](#output\_autores\_table\_name) | Name of the Autores DynamoDB table |
| <a name="output_categorias_table_arn"></a> [categorias\_table\_arn](#output\_categorias\_table\_arn) | ARN of the Categorias DynamoDB table |
| <a name="output_categorias_table_name"></a> [categorias\_table\_name](#output\_categorias\_table\_name) | Name of the Categorias DynamoDB table |
| <a name="output_posts_table_arn"></a> [posts\_table\_arn](#output\_posts\_table\_arn) | ARN of the Posts DynamoDB table |
| <a name="output_posts_table_name"></a> [posts\_table\_name](#output\_posts\_table\_name) | Name of the Posts DynamoDB table |
<!-- END_TF_DOCS -->