output "uploads_bucket_name" {
  description = "Name of the S3 bucket for raw media uploads"
  value       = aws_s3_bucket.uploads.id
}

output "uploads_bucket_arn" {
  description = "ARN of the S3 bucket for raw media uploads"
  value       = aws_s3_bucket.uploads.arn
}

output "uploads_bucket_regional_domain_name" {
  description = "Regional domain name of the uploads bucket, used to build presigned POST URLs"
  value       = aws_s3_bucket.uploads.bucket_regional_domain_name
}

output "image_processor_function_name" {
  description = "Function name of the imageProcessor Lambda"
  value       = aws_lambda_function.image_processor.function_name
}
