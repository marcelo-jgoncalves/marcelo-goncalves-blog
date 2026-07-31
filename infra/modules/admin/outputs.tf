output "cloudfront_url" {
  description = "CloudFront domain name of the admin SPA distribution"
  value       = aws_cloudfront_distribution.admin.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID of the admin SPA"
  value       = aws_cloudfront_distribution.admin.id
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket serving the admin SPA static assets"
  value       = aws_s3_bucket.admin_assets.id
}
