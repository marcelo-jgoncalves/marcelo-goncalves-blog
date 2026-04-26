output "cloudfront_url" {
  value = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.frontend.id
}

output "s3_bucket_name" {
  value = aws_s3_bucket.frontend_assets.id
}

output "lambda_function_name" {
  value = aws_lambda_function.nextjs_server.function_name
}
