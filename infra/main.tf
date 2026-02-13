# infra/main.tf

module "dynamodb" {
  source = "./modules/dynamodb"

  environment  = var.environment
  project_name = var.project_name
}

module "lambda" {
  source = "./modules/lambda"

  environment  = var.environment
  project_name = var.project_name

  #ARNs das tabelas que vieram do módulo dynamodb
  posts_table_arn       = module.dynamodb.posts_table_arn
  autores_table_arn     = module.dynamodb.autores_table_arn
  uploads_bucket_name   = module.media.uploads_bucket_name
  uploads_bucket_arn    = module.media.uploads_bucket_arn
  categorias_table_arn  = module.dynamodb.categorias_table_arn
  categorias_table_name = module.dynamodb.categorias_table_name
}

module "api-gateway" {
  source = "./modules/api-gateway"

  environment  = var.environment
  project_name = var.project_name
  aws_region   = var.aws_region

  # Conecta as saídas do módulo lambda nas entradas do api-gateway
  get_post_invoke_arn            = module.lambda.get_post_invoke_arn
  get_post_function_name         = module.lambda.get_post_function_name
  get_author_invoke_arn          = module.lambda.get_author_invoke_arn
  get_author_function_name       = module.lambda.get_author_function_name
  cognito_user_pool_arn          = module.cognito.user_pool_arn
  admin_posts_invoke_arn         = module.lambda.admin_posts_invoke_arn
  admin_posts_function_name      = module.lambda.admin_posts_function_name
  media_upload_invoke_arn        = module.lambda.media_upload_invoke_arn
  media_upload_function_name     = module.lambda.media_upload_function_name
  get_posts_invoke_arn           = module.lambda.get_posts_invoke_arn
  get_posts_function_name        = module.lambda.get_posts_function_name
  admin_authors_invoke_arn       = module.lambda.admin_authors_invoke_arn
  admin_authors_function_name    = module.lambda.admin_authors_function_name
  admin_categories_invoke_arn    = module.lambda.admin_categories_invoke_arn
  admin_categories_function_name = module.lambda.admin_categories_function_name
}

module "frontend" {
  source = "./modules/frontend"

  environment  = var.environment
  project_name = var.project_name

  # Passamos a URL da API Backend para que o Frontend saiba quem chamar
  api_url = module.api-gateway.api_url
}

module "cognito" {
  source = "./modules/cognito"

  environment  = var.environment
  project_name = var.project_name
}

module "admin" {
  source = "./modules/admin"

  environment  = var.environment
  project_name = var.project_name
}

module "media" {
  source = "./modules/media"

  environment  = var.environment
  project_name = var.project_name

  # O Bucket de Assets (Frontend) é o destino das imagens otimizadas
  assets_bucket_name = module.frontend.s3_bucket_name
}