output "cognito_user_pool_id" {
  value = module.cognito.user_pool_id
}

output "cognito_client_id" {
  value = module.cognito.user_pool_client_id
}

output "api_base_url" {
  value = module.api-gateway.api_url
}

output "frontend_url" {
  value = "https://${module.frontend.cloudfront_url}"
}

output "frontend_bucket" {
  value = module.frontend.s3_bucket_name
}

output "frontend_cloudfront_id" {
  value = module.frontend.cloudfront_distribution_id
}

output "admin_url" {
  value = "https://${module.admin.cloudfront_url}"
}

output "admin_bucket" {
  value = module.admin.s3_bucket_name
}

output "admin_cloudfront_id" {
  value = module.admin.cloudfront_distribution_id
}

output "uploads_bucket" {
  value = module.media.uploads_bucket_name
}
