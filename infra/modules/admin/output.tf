output "cloudfront_url" {
  value = aws_cloudfront_distribution.admin.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.admin.id
}

output "s3_bucket_name" {
  value = aws_s3_bucket.admin_assets.id
}
