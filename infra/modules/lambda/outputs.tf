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