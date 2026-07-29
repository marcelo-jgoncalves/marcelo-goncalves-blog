
output "posts_table_name" {
  value = aws_dynamodb_table.posts.name
}

output "posts_table_arn" {
  value = aws_dynamodb_table.posts.arn
}

output "autores_table_name" {
  value = aws_dynamodb_table.autores.name
}

output "autores_table_arn" {
  value = aws_dynamodb_table.autores.arn
}

output "categorias_table_name" {
  value = aws_dynamodb_table.categorias.name
}

output "categorias_table_arn" {
  value = aws_dynamodb_table.categorias.arn
}

output "admin_sessions_table_name" {
  value = aws_dynamodb_table.admin_sessions.name
}

output "admin_sessions_table_arn" {
  value = aws_dynamodb_table.admin_sessions.arn
}