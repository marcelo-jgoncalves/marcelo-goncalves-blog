output "user_pool_id" {
  description = "ID of the Cognito User Pool used for admin authentication"
  value       = aws_cognito_user_pool.admin_pool.id
}

output "user_pool_client_id" {
  description = "ID of the Cognito User Pool App Client (SPA, no client secret)"
  value       = aws_cognito_user_pool_client.admin_client.id
}

output "user_pool_arn" {
  description = "ARN of the Cognito User Pool, used by API Gateway's Cognito authorizer"
  value       = aws_cognito_user_pool.admin_pool.arn
}

output "cognito_domain" {
  description = "Cognito Hosted UI domain prefix"
  value       = aws_cognito_user_pool_domain.main.domain
}
