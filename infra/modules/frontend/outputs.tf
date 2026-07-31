output "cloudfront_url" {
  description = "CloudFront domain name of the public frontend distribution"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID of the public frontend, used for cache invalidation on demand"
  value       = aws_cloudfront_distribution.frontend.id
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket serving frontend static assets"
  value       = aws_s3_bucket.frontend_assets.id
}

output "lambda_function_name" {
  description = "Function name of the nextjs-server Lambda (OpenNext SSR)"
  value       = aws_lambda_function.nextjs_server.function_name
}
