output "user_pool_id" {
  value = aws_cognito_user_pool.admin_pool.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.admin_client.id
}

output "user_pool_arn" {
  value = aws_cognito_user_pool.admin_pool.arn
}

output "cognito_domain" {
  value = aws_cognito_user_pool_domain.main.domain
}
