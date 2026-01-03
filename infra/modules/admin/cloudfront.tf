# infra/modules/admin/cloudfront.tf

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

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
