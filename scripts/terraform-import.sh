#!/usr/bin/env bash
# scripts/terraform-import.sh
# Reconstrói o Terraform state importando todos os recursos existentes na AWS.
# Executar a partir do diretório infra/:
#   cd infra && bash ../scripts/terraform-import.sh
#
# Pré-requisito: terraform init -backend-config=backend.hcl já executado.

set -euo pipefail

TF="terraform"
API="5duus31al8"           # API Gateway REST API ID
ACCOUNT="975707451904"     # AWS Account ID

ok()   { echo "  ✅ $1"; }
skip() { echo "  ⏭️  SKIP: $1 (não existe na AWS — será criado pelo Terraform)"; }

echo ""
echo "════════════════════════════════════════════════════════"
echo "  TERRAFORM STATE IMPORT — Blog Marcelo Gonçalves Dev  "
echo "════════════════════════════════════════════════════════"
echo ""

# ─── DynamoDB ────────────────────────────────────────────────
echo "── DynamoDB ──"
$TF import 'module.dynamodb.aws_dynamodb_table.posts'      'marcelo-goncalves-blog-dev-posts'      && ok posts
$TF import 'module.dynamodb.aws_dynamodb_table.autores'    'marcelo-goncalves-blog-dev-autores'    && ok autores
$TF import 'module.dynamodb.aws_dynamodb_table.categorias' 'marcelo-goncalves-blog-dev-categorias' && ok categorias

# ─── S3 Buckets ──────────────────────────────────────────────
echo "── S3 ──"
$TF import 'module.frontend.aws_s3_bucket.frontend_assets' 'marcelo-goncalves-blog-dev-assets'       && ok frontend_assets
$TF import 'module.admin.aws_s3_bucket.admin_assets'       'marcelo-goncalves-blog-dev-admin-assets' && ok admin_assets
$TF import 'module.media.aws_s3_bucket.uploads'            'marcelo-goncalves-blog-dev-uploads-raw'  && ok uploads

# ─── Cognito ─────────────────────────────────────────────────
echo "── Cognito ──"
$TF import 'module.cognito.aws_cognito_user_pool.admin_pool'           'us-east-1_EuJTxL0vs'                              && ok user_pool
$TF import 'module.cognito.aws_cognito_user_pool_client.admin_client'  'us-east-1_EuJTxL0vs/18in861ahqnlagnbh7tl84rr1d' && ok user_pool_client

# ─── IAM (roles/policies que JÁ existem e têm o mesmo nome) ──
echo "── IAM (existentes) ──"
$TF import 'module.frontend.aws_iam_role.nextjs_role' \
    'marcelo-goncalves-blog-dev-nextjs-role' && ok nextjs_role

$TF import 'module.frontend.aws_iam_role_policy_attachment.nextjs_logs' \
    'marcelo-goncalves-blog-dev-nextjs-role/arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole' && ok nextjs_logs_attach

$TF import 'module.media.aws_iam_role.processor_role' \
    'marcelo-goncalves-blog-dev-processor-role' && ok processor_role

$TF import 'module.media.aws_iam_policy.processor_policy' \
    "arn:aws:iam::${ACCOUNT}:policy/marcelo-goncalves-blog-dev-processor-policy" && ok processor_policy

$TF import 'module.media.aws_iam_role_policy_attachment.processor_attach' \
    "marcelo-goncalves-blog-dev-processor-role/arn:aws:iam::${ACCOUNT}:policy/marcelo-goncalves-blog-dev-processor-policy" && ok processor_attach

# NOTA: As novas roles (public-lambda-role, admin-lambda-role, media-upload-role,
# scheduler-lambda-role) NÃO existem na AWS — serão criadas pelo Terraform.

# ─── CloudWatch Log Groups ────────────────────────────────────
echo "── CloudWatch Log Groups ──"
$TF import 'module.lambda.aws_cloudwatch_log_group.get_post'     '/aws/lambda/marcelo-goncalves-blog-dev-getPost'     && ok lg_getPost
$TF import 'module.lambda.aws_cloudwatch_log_group.get_author'   '/aws/lambda/marcelo-goncalves-blog-dev-getAuthor'   && ok lg_getAuthor
$TF import 'module.lambda.aws_cloudwatch_log_group.get_posts'    '/aws/lambda/marcelo-goncalves-blog-dev-getPosts'    && ok lg_getPosts
$TF import 'module.lambda.aws_cloudwatch_log_group.admin_posts'  '/aws/lambda/marcelo-goncalves-blog-dev-adminPosts'  && ok lg_adminPosts
$TF import 'module.lambda.aws_cloudwatch_log_group.admin_authors' '/aws/lambda/marcelo-goncalves-blog-dev-adminAuthors' && ok lg_adminAuthors
$TF import 'module.lambda.aws_cloudwatch_log_group.media_upload' '/aws/lambda/marcelo-goncalves-blog-dev-mediaUpload' && ok lg_mediaUpload
$TF import 'module.frontend.aws_cloudwatch_log_group.nextjs_server' '/aws/lambda/marcelo-goncalves-blog-dev-nextjs-server' && ok lg_nextjs
$TF import 'module.media.aws_cloudwatch_log_group.image_processor' '/aws/lambda/marcelo-goncalves-blog-dev-imageProcessor' && ok lg_imageProcessor

# Esses log groups não existem — serão criados pelo Terraform
skip 'module.lambda.aws_cloudwatch_log_group.admin_categorias (/aws/lambda/...-adminCategorias)'
skip 'module.lambda.aws_cloudwatch_log_group.post_scheduler  (/aws/lambda/...-postScheduler)'

# ─── Lambda Functions ─────────────────────────────────────────
echo "── Lambda Functions ──"
$TF import 'module.lambda.aws_lambda_function.get_post'      'marcelo-goncalves-blog-dev-getPost'      && ok fn_getPost
$TF import 'module.lambda.aws_lambda_function.get_author'    'marcelo-goncalves-blog-dev-getAuthor'    && ok fn_getAuthor
$TF import 'module.lambda.aws_lambda_function.get_posts'     'marcelo-goncalves-blog-dev-getPosts'     && ok fn_getPosts
$TF import 'module.lambda.aws_lambda_function.admin_posts'   'marcelo-goncalves-blog-dev-adminPosts'   && ok fn_adminPosts
$TF import 'module.lambda.aws_lambda_function.admin_authors' 'marcelo-goncalves-blog-dev-adminAuthors' && ok fn_adminAuthors
$TF import 'module.lambda.aws_lambda_function.media_upload'  'marcelo-goncalves-blog-dev-mediaUpload'  && ok fn_mediaUpload
$TF import 'module.frontend.aws_lambda_function.nextjs_server'    'marcelo-goncalves-blog-dev-nextjs-server'    && ok fn_nextjs
$TF import 'module.media.aws_lambda_function.image_processor' 'marcelo-goncalves-blog-dev-imageProcessor' && ok fn_imageProcessor

# Esses não existem na AWS — serão criados pelo Terraform
skip 'module.lambda.aws_lambda_function.admin_categorias (adminCategorias não existe, só adminCategories)'
skip 'module.lambda.aws_lambda_function.post_scheduler'

# ─── Lambda Function URL ─────────────────────────────────────
echo "── Lambda Function URL ──"
$TF import 'module.frontend.aws_lambda_function_url.nextjs_url' \
    'marcelo-goncalves-blog-dev-nextjs-server' && ok fn_url_nextjs

# ─── CloudFront OACs ─────────────────────────────────────────
echo "── CloudFront OACs ──"
$TF import 'module.frontend.aws_cloudfront_origin_access_control.oac'       'E2EKVB1KJWARBY' && ok oac_s3
$TF import 'module.admin.aws_cloudfront_origin_access_control.admin_oac'    'E2KE59F9TP8QJU' && ok oac_admin
# lambda_oac não existe — será criado pelo Terraform (novo recurso de segurança)
skip 'module.frontend.aws_cloudfront_origin_access_control.lambda_oac'

# ─── CloudFront Distributions ────────────────────────────────
echo "── CloudFront Distributions ──"
$TF import 'module.frontend.aws_cloudfront_distribution.frontend' 'E1XI31PS4HFJIH' && ok cf_frontend
$TF import 'module.admin.aws_cloudfront_distribution.admin'       'E2665FPJZ0D8AB' && ok cf_admin

# ─── API Gateway REST API + Authorizer ───────────────────────
echo "── API Gateway ──"
$TF import 'module.api-gateway.aws_api_gateway_rest_api.main'         "$API"           && ok apigw_api
$TF import 'module.api-gateway.aws_api_gateway_authorizer.cognito_auth' "${API}/xuwfkt" && ok apigw_auth

# Resources (paths)
$TF import 'module.api-gateway.aws_api_gateway_resource.post'                "${API}/95xtgj" && ok apigw_r_post
$TF import 'module.api-gateway.aws_api_gateway_resource.post_slug'           "${API}/5831q4" && ok apigw_r_post_slug
$TF import 'module.api-gateway.aws_api_gateway_resource.autor'               "${API}/r2sx0d" && ok apigw_r_autor
$TF import 'module.api-gateway.aws_api_gateway_resource.autor_id'            "${API}/wxr5ow" && ok apigw_r_autor_id
$TF import 'module.api-gateway.aws_api_gateway_resource.admin'               "${API}/rf1obs" && ok apigw_r_admin
$TF import 'module.api-gateway.aws_api_gateway_resource.admin_posts'         "${API}/d0xlz1" && ok apigw_r_admin_posts
$TF import 'module.api-gateway.aws_api_gateway_resource.admin_post_singular' "${API}/0qpurl" && ok apigw_r_admin_post
$TF import 'module.api-gateway.aws_api_gateway_resource.admin_post_slug'     "${API}/mpwmu0" && ok apigw_r_admin_post_slug
$TF import 'module.api-gateway.aws_api_gateway_resource.admin_autores'       "${API}/13dbm4" && ok apigw_r_admin_autores
$TF import 'module.api-gateway.aws_api_gateway_resource.admin_autor_singular' "${API}/pcyx9w" && ok apigw_r_admin_autor
$TF import 'module.api-gateway.aws_api_gateway_resource.admin_autor_id'      "${API}/dgov85" && ok apigw_r_admin_autor_id
$TF import 'module.api-gateway.aws_api_gateway_resource.admin_media'         "${API}/v8rvrt" && ok apigw_r_admin_media
$TF import 'module.api-gateway.aws_api_gateway_resource.admin_media_upload'  "${API}/9vqj9h" && ok apigw_r_admin_media_upload
$TF import 'module.api-gateway.aws_api_gateway_resource.posts'               "${API}/72opnu" && ok apigw_r_posts
$TF import 'module.api-gateway.aws_api_gateway_resource.posts_recentes'      "${API}/cluohb" && ok apigw_r_recentes
$TF import 'module.api-gateway.aws_api_gateway_resource.posts_populares'     "${API}/q2df5d" && ok apigw_r_populares
$TF import 'module.api-gateway.aws_api_gateway_resource.artigos'             "${API}/or5a4f" && ok apigw_r_artigos
$TF import 'module.api-gateway.aws_api_gateway_resource.categoria'           "${API}/kib3to" && ok apigw_r_categoria
$TF import 'module.api-gateway.aws_api_gateway_resource.categoria_slug'      "${API}/pqv53s" && ok apigw_r_categoria_slug
$TF import 'module.api-gateway.aws_api_gateway_resource.busca'               "${API}/q4y2ds" && ok apigw_r_busca
$TF import 'module.api-gateway.aws_api_gateway_resource.projeto'             "${API}/ottegb" && ok apigw_r_projeto
$TF import 'module.api-gateway.aws_api_gateway_resource.admin_categorias'    "${API}/v15t8a" && ok apigw_r_admin_cat
$TF import 'module.api-gateway.aws_api_gateway_resource.admin_categorias_slug' "${API}/t4e90u" && ok apigw_r_admin_cat_slug

# Methods
$TF import 'module.api-gateway.aws_api_gateway_method.get_post'                 "${API}/5831q4/GET"     && ok m_get_post
$TF import 'module.api-gateway.aws_api_gateway_method.get_author'               "${API}/wxr5ow/GET"     && ok m_get_author
$TF import 'module.api-gateway.aws_api_gateway_method.admin_post_slug_any'      "${API}/mpwmu0/ANY"     && ok m_admin_post_any
$TF import 'module.api-gateway.aws_api_gateway_method.admin_post_slug_options'  "${API}/mpwmu0/OPTIONS" && ok m_admin_post_opt
$TF import 'module.api-gateway.aws_api_gateway_method.admin_posts_any'          "${API}/d0xlz1/ANY"     && ok m_admin_posts_any
$TF import 'module.api-gateway.aws_api_gateway_method.admin_posts_options'      "${API}/d0xlz1/OPTIONS" && ok m_admin_posts_opt
$TF import 'module.api-gateway.aws_api_gateway_method.admin_autor_id_any'       "${API}/dgov85/ANY"     && ok m_admin_autor_any
$TF import 'module.api-gateway.aws_api_gateway_method.admin_autor_id_options'   "${API}/dgov85/OPTIONS" && ok m_admin_autor_opt
$TF import 'module.api-gateway.aws_api_gateway_method.get_recentes'             "${API}/cluohb/GET"     && ok m_recentes
$TF import 'module.api-gateway.aws_api_gateway_method.get_artigos'              "${API}/or5a4f/GET"     && ok m_artigos
$TF import 'module.api-gateway.aws_api_gateway_method.get_categoria'            "${API}/pqv53s/GET"     && ok m_categoria
$TF import 'module.api-gateway.aws_api_gateway_method.get_populares'            "${API}/q2df5d/GET"     && ok m_populares
$TF import 'module.api-gateway.aws_api_gateway_method.get_busca'                "${API}/q4y2ds/GET"     && ok m_busca
$TF import 'module.api-gateway.aws_api_gateway_method.get_projeto'              "${API}/ottegb/GET"     && ok m_projeto
$TF import 'module.api-gateway.aws_api_gateway_method.media_upload_post'        "${API}/9vqj9h/POST"    && ok m_media_post
$TF import 'module.api-gateway.aws_api_gateway_method.media_upload_options'     "${API}/9vqj9h/OPTIONS" && ok m_media_opt
$TF import 'module.api-gateway.aws_api_gateway_method.admin_categorias_any'     "${API}/v15t8a/ANY"     && ok m_admin_cat_any
$TF import 'module.api-gateway.aws_api_gateway_method.admin_categorias_options' "${API}/v15t8a/OPTIONS" && ok m_admin_cat_opt
$TF import 'module.api-gateway.aws_api_gateway_method.admin_categorias_slug_any' "${API}/t4e90u/ANY"    && ok m_admin_cat_slug_any

# Integrations
$TF import 'module.api-gateway.aws_api_gateway_integration.get_post_integration'                    "${API}/5831q4/GET"     && ok i_get_post
$TF import 'module.api-gateway.aws_api_gateway_integration.get_author_integration'                  "${API}/wxr5ow/GET"     && ok i_get_author
$TF import 'module.api-gateway.aws_api_gateway_integration.admin_post_slug_integration'             "${API}/mpwmu0/ANY"     && ok i_admin_post_any
$TF import 'module.api-gateway.aws_api_gateway_integration.admin_post_slug_options_integration'     "${API}/mpwmu0/OPTIONS" && ok i_admin_post_opt
$TF import 'module.api-gateway.aws_api_gateway_integration.admin_posts_integration'                 "${API}/d0xlz1/ANY"     && ok i_admin_posts_any
$TF import 'module.api-gateway.aws_api_gateway_integration.admin_posts_options_integration'         "${API}/d0xlz1/OPTIONS" && ok i_admin_posts_opt
$TF import 'module.api-gateway.aws_api_gateway_integration.admin_autor_id_integration'              "${API}/dgov85/ANY"     && ok i_admin_autor_any
$TF import 'module.api-gateway.aws_api_gateway_integration.admin_autor_id_options_integration'      "${API}/dgov85/OPTIONS" && ok i_admin_autor_opt
$TF import 'module.api-gateway.aws_api_gateway_integration.get_recentes_integration'                "${API}/cluohb/GET"     && ok i_recentes
$TF import 'module.api-gateway.aws_api_gateway_integration.get_artigos_integration'                 "${API}/or5a4f/GET"     && ok i_artigos
$TF import 'module.api-gateway.aws_api_gateway_integration.get_categoria_integration'               "${API}/pqv53s/GET"     && ok i_categoria
$TF import 'module.api-gateway.aws_api_gateway_integration.get_populares_integration'               "${API}/q2df5d/GET"     && ok i_populares
$TF import 'module.api-gateway.aws_api_gateway_integration.get_busca_integration'                   "${API}/q4y2ds/GET"     && ok i_busca
$TF import 'module.api-gateway.aws_api_gateway_integration.get_projeto_integration'                 "${API}/ottegb/GET"     && ok i_projeto
$TF import 'module.api-gateway.aws_api_gateway_integration.media_upload_integration'                "${API}/9vqj9h/POST"    && ok i_media_post
$TF import 'module.api-gateway.aws_api_gateway_integration.media_upload_options_integration'        "${API}/9vqj9h/OPTIONS" && ok i_media_opt
$TF import 'module.api-gateway.aws_api_gateway_integration.admin_categorias_integration'            "${API}/v15t8a/ANY"     && ok i_admin_cat_any
$TF import 'module.api-gateway.aws_api_gateway_integration.admin_categorias_options_integration'    "${API}/v15t8a/OPTIONS" && ok i_admin_cat_opt
$TF import 'module.api-gateway.aws_api_gateway_integration.admin_categorias_slug_integration'       "${API}/t4e90u/ANY"     && ok i_admin_cat_slug_any

# Method Responses + Integration Responses (CORS)
$TF import 'module.api-gateway.aws_api_gateway_method_response.admin_post_slug_options_200'                  "${API}/mpwmu0/OPTIONS/200" && ok mr_admin_post_opt
$TF import 'module.api-gateway.aws_api_gateway_integration_response.admin_post_slug_options_integration_response' "${API}/mpwmu0/OPTIONS/200" && ok ir_admin_post_opt
$TF import 'module.api-gateway.aws_api_gateway_method_response.admin_posts_options_200'                      "${API}/d0xlz1/OPTIONS/200" && ok mr_admin_posts_opt
$TF import 'module.api-gateway.aws_api_gateway_integration_response.admin_posts_options_integration_response' "${API}/d0xlz1/OPTIONS/200" && ok ir_admin_posts_opt
$TF import 'module.api-gateway.aws_api_gateway_method_response.admin_autor_id_options_200'                   "${API}/dgov85/OPTIONS/200" && ok mr_admin_autor_opt
$TF import 'module.api-gateway.aws_api_gateway_integration_response.admin_autor_id_options_response'         "${API}/dgov85/OPTIONS/200" && ok ir_admin_autor_opt
$TF import 'module.api-gateway.aws_api_gateway_method_response.media_upload_options_200'                     "${API}/9vqj9h/OPTIONS/200" && ok mr_media_opt
$TF import 'module.api-gateway.aws_api_gateway_integration_response.media_upload_options_response'           "${API}/9vqj9h/OPTIONS/200" && ok ir_media_opt
$TF import 'module.api-gateway.aws_api_gateway_method_response.admin_categorias_options_200'                 "${API}/v15t8a/OPTIONS/200" && ok mr_admin_cat_opt
$TF import 'module.api-gateway.aws_api_gateway_integration_response.admin_categorias_options_response'       "${API}/v15t8a/OPTIONS/200" && ok ir_admin_cat_opt

# Deployment + Stage
$TF import 'module.api-gateway.aws_api_gateway_deployment.main' "${API}/w7e8m9" && ok apigw_deployment
$TF import 'module.api-gateway.aws_api_gateway_stage.main'      "${API}/v1"     && ok apigw_stage

echo ""
echo "════════════════════════════════════════════════════════"
echo "  IMPORT CONCLUÍDO"
echo ""
echo "  Próximos passos:"
echo "  1. Crie os ZIPs placeholder: bash ../scripts/build-placeholders.sh"
echo "  2. terraform plan -var-file=env/dev.tfvars 2>&1 | tee /tmp/tf-plan.txt"
echo "  3. Revise os drifts antes de aplicar"
echo "════════════════════════════════════════════════════════"
