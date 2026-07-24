output "get_post_invoke_arn" {
  value = aws_lambda_function.get_post.invoke_arn
}

output "get_post_function_name" {
  value = aws_lambda_function.get_post.function_name
}

output "get_author_invoke_arn" {
  value = aws_lambda_function.get_author.invoke_arn
}

output "get_author_function_name" {
  value = aws_lambda_function.get_author.function_name
}

output "admin_posts_invoke_arn" {
  value = aws_lambda_function.admin_posts.invoke_arn
}

output "admin_posts_function_name" {
  value = aws_lambda_function.admin_posts.function_name
}

output "media_upload_invoke_arn" {
  value = aws_lambda_function.media_upload.invoke_arn
}

output "media_upload_function_name" {
  value = aws_lambda_function.media_upload.function_name
}

output "get_posts_invoke_arn" {
  value = aws_lambda_function.get_posts.invoke_arn
}

output "get_posts_function_name" {
  value = aws_lambda_function.get_posts.function_name
}

output "admin_authors_invoke_arn" {
  value = aws_lambda_function.admin_authors.invoke_arn
}

output "admin_authors_function_name" {
  value = aws_lambda_function.admin_authors.function_name
}

output "admin_categorias_invoke_arn" {
  value = aws_lambda_function.admin_categorias.invoke_arn
}

output "admin_categorias_function_name" {
  value = aws_lambda_function.admin_categorias.function_name
}

output "post_scheduler_function_name" {
  value = aws_lambda_function.post_scheduler.function_name
}

output "admin_session_invoke_arn" {
  value = aws_lambda_function.admin_session.invoke_arn
}

output "admin_session_function_name" {
  value = aws_lambda_function.admin_session.function_name
}

output "admin_authorizer_invoke_arn" {
  value = aws_lambda_function.admin_authorizer.invoke_arn
}

output "admin_authorizer_function_name" {
  value = aws_lambda_function.admin_authorizer.function_name
}