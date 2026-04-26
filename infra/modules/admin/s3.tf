# infra/modules/admin/s3.tf

resource "aws_s3_bucket" "admin_assets" {
  bucket        = "${var.project_name}-${var.environment}-admin-assets"
  force_destroy = var.environment == "dev" ? true : false

  tags = {
    Name = "Admin Assets"
  }
}

resource "aws_s3_bucket_versioning" "admin_versioning" {
  bucket = aws_s3_bucket.admin_assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "admin_block" {
  bucket = aws_s3_bucket.admin_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "allow_cloudfront" {
  bucket = aws_s3_bucket.admin_assets.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = { Service = "cloudfront.amazonaws.com" }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.admin_assets.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.admin.arn
          }
        }
      }
    ]
  })
}
