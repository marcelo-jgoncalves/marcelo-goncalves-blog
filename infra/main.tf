# infra/main.tf

module "dynamodb" {
  source = "./modules/dynamodb"

  environment  = var.environment
  project_name = var.project_name
}

module "lambda" {
  source = "./modules/lambda"

  environment              = var.environment
  project_name             = var.project_name
  log_level                = var.log_level
  log_retention_days       = var.log_retention_days
  enable_xray_tracing      = var.enable_xray_tracing
  enable_cloudwatch_alarms = var.enable_cloudwatch_alarms
  alarm_email              = var.alarm_email

  posts_table_arn      = module.dynamodb.posts_table_arn
  autores_table_arn    = module.dynamodb.autores_table_arn
  categorias_table_arn = module.dynamodb.categorias_table_arn
  uploads_bucket_name  = module.media.uploads_bucket_name
  uploads_bucket_arn   = module.media.uploads_bucket_arn
  admin_origin         = "https://${module.admin.cloudfront_url}"
}

module "api-gateway" {
  source = "./modules/api-gateway"

  environment              = var.environment
  project_name             = var.project_name
  aws_region               = var.aws_region
  enable_xray_tracing      = var.enable_xray_tracing
  enable_cloudwatch_alarms = var.enable_cloudwatch_alarms
  alarm_email              = var.alarm_email

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
  admin_categorias_invoke_arn    = module.lambda.admin_categorias_invoke_arn
  admin_categorias_function_name = module.lambda.admin_categorias_function_name
}

module "frontend" {
  source = "./modules/frontend"

  environment               = var.environment
  project_name              = var.project_name
  log_retention_days        = var.log_retention_days
  enable_xray_tracing       = var.enable_xray_tracing
  enable_cloudfront_logging = var.enable_cloudfront_logging
  api_url                   = module.api-gateway.api_url
}

module "cognito" {
  source = "./modules/cognito"

  environment  = var.environment
  project_name = var.project_name
}

module "admin" {
  source = "./modules/admin"

  environment               = var.environment
  project_name              = var.project_name
  enable_cloudfront_logging = var.enable_cloudfront_logging
  log_retention_days        = var.log_retention_days
}

module "media" {
  source = "./modules/media"

  environment              = var.environment
  project_name             = var.project_name
  log_level                = var.log_level
  log_retention_days       = var.log_retention_days
  enable_xray_tracing      = var.enable_xray_tracing
  enable_cloudwatch_alarms = var.enable_cloudwatch_alarms
  alarm_email              = var.alarm_email
  admin_origin             = module.admin.cloudfront_url
  frontend_origin          = module.frontend.cloudfront_url
  assets_bucket_name       = module.frontend.s3_bucket_name
  posts_table_arn          = module.dynamodb.posts_table_arn
  posts_table_name         = module.dynamodb.posts_table_name
}

module "observability" {
  source = "./modules/observability"

  environment              = var.environment
  project_name             = var.project_name
  aws_region               = var.aws_region
  enable_cloudwatch_alarms = var.enable_cloudwatch_alarms
  enable_synthetic_canary  = var.enable_synthetic_canary
  alarm_email              = var.alarm_email
  frontend_url             = "https://${module.frontend.cloudfront_url}"
  api_gateway_name         = "${var.project_name}-${var.environment}-api"

  lambda_function_names = {
    getPost         = module.lambda.get_post_function_name
    getAuthor       = module.lambda.get_author_function_name
    getPosts        = module.lambda.get_posts_function_name
    adminPosts      = module.lambda.admin_posts_function_name
    adminAuthors    = module.lambda.admin_authors_function_name
    adminCategorias = module.lambda.admin_categorias_function_name
    mediaUpload     = module.lambda.media_upload_function_name
    postScheduler   = module.lambda.post_scheduler_function_name
    imageProcessor  = module.media.image_processor_function_name
  }
}

module "finops" {
  source = "./modules/finops"

  environment              = var.environment
  project_name             = var.project_name
  budget_monthly_limit_usd = var.budget_monthly_limit_usd
  alert_email              = var.budget_alert_email
  enable_budget_alerts     = var.enable_budget_alerts
}

module "security_monitoring" {
  source = "./modules/security-monitoring"

  environment        = var.environment
  project_name       = var.project_name
  log_retention_days = var.log_retention_days
  enable_guardduty   = var.enable_guardduty
}