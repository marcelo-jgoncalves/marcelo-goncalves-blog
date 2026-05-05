# infra/modules/admin/cloudfront.tf

# --- Bucket S3 para logs de acesso do CloudFront (criado apenas se enable_cloudfront_logging=true) ---

resource "aws_s3_bucket" "cf_logs" {
  count  = var.enable_cloudfront_logging ? 1 : 0
  bucket = "${var.project_name}-${var.environment}-cf-admin-logs"

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_s3_bucket_ownership_controls" "cf_logs" {
  count  = var.enable_cloudfront_logging ? 1 : 0
  bucket = aws_s3_bucket.cf_logs[0].id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "cf_logs" {
  count      = var.enable_cloudfront_logging ? 1 : 0
  depends_on = [aws_s3_bucket_ownership_controls.cf_logs]
  bucket     = aws_s3_bucket.cf_logs[0].id
  acl        = "log-delivery-write"
}

resource "aws_s3_bucket_lifecycle_configuration" "cf_logs" {
  count  = var.enable_cloudfront_logging ? 1 : 0
  bucket = aws_s3_bucket.cf_logs[0].id

  rule {
    id     = "expire-cf-logs"
    status = "Enabled"

    expiration {
      days = var.log_retention_days
    }
  }
}

resource "aws_cloudfront_origin_access_control" "admin_oac" {
  name                              = "${var.project_name}-${var.environment}-admin-oac"
  description                       = "Acesso restrito S3 Admin"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "admin" {
  enabled             = true
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100"
  default_root_object = "index.html" # Ponto de entrada do SPA

  origin {
    domain_name              = aws_s3_bucket.admin_assets.bucket_regional_domain_name
    origin_id                = "S3-Admin"
    origin_access_control_id = aws_cloudfront_origin_access_control.admin_oac.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Admin"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # ⚠️ Lógica de SPA (Single Page Application)
  # Redireciona rotas desconhecidas para o index.html para o Vue Router tratar
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  dynamic "logging_config" {
    for_each = var.enable_cloudfront_logging ? [1] : []
    content {
      include_cookies = false
      bucket          = aws_s3_bucket.cf_logs[0].bucket_domain_name
      prefix          = "cloudfront/"
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
