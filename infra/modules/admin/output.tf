output "cloudfront_url" {
  value = aws_cloudfront_distribution.admin.domain_name
}

output "s3_bucket_name" {
  value = aws_s3_bucket.admin_assets.id
}
