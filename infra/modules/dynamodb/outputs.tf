
output "posts_table_name" {
  description = "Name of the Posts DynamoDB table"
  value       = aws_dynamodb_table.posts.name
}

output "posts_table_arn" {
  description = "ARN of the Posts DynamoDB table"
  value       = aws_dynamodb_table.posts.arn
}

output "autores_table_name" {
  description = "Name of the Autores DynamoDB table"
  value       = aws_dynamodb_table.autores.name
}

output "autores_table_arn" {
  description = "ARN of the Autores DynamoDB table"
  value       = aws_dynamodb_table.autores.arn
}

output "categorias_table_name" {
  description = "Name of the Categorias DynamoDB table"
  value       = aws_dynamodb_table.categorias.name
}

output "categorias_table_arn" {
  description = "ARN of the Categorias DynamoDB table"
  value       = aws_dynamodb_table.categorias.arn
}

output "admin_sessions_table_name" {
  description = "Name of the admin sessions (BFF) DynamoDB table"
  value       = aws_dynamodb_table.admin_sessions.name
}

output "admin_sessions_table_arn" {
  description = "ARN of the admin sessions (BFF) DynamoDB table"
  value       = aws_dynamodb_table.admin_sessions.arn
}
