# ==============================================================================
# CONTROLE DE ACESSO (OAC) - Faltava este bloco!
# ==============================================================================
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "${var.project_name}-${var.environment}-oac"
  description                       = "Acesso restrito S3 Frontend"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ==============================================================================
# DISTRIBUIÇÃO CLOUDFRONT (Com Cache Desativado para Debug)
# ==============================================================================
resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100" 
  
  # --- Origem 1: S3 (Assets) ---
  origin {
    domain_name              = aws_s3_bucket.frontend_assets.bucket_regional_domain_name
    origin_id                = "S3-Assets"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  # --- Origem 2: Lambda (SSR Server) ---
  origin {
    # Remove o https:// para evitar erros de parsing
    domain_name = replace(aws_lambda_function_url.nextjs_url.function_url, "/^https?://([^/]*).*/", "$1")
    origin_id   = "Lambda-SSR"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # ========================================================================
  # REGRAS DE CACHE (ASSETS) - Mantém cache para performance básica
  # ========================================================================

  # 1. Arquivos de Mídia (Uploads) -> S3
  ordered_cache_behavior {
    path_pattern     = "media/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Assets"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
  }

  # 2. Arquivos Estáticos do Next.js (_next/static/*) -> S3
  ordered_cache_behavior {
    path_pattern     = "_next/static/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "S3-Assets"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
  }
  
  # 3. Imagens Públicas (static/*) -> S3
  ordered_cache_behavior {
    path_pattern     = "static/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Assets"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  # ========================================================================
  # 🚨 MODO DEBUG: CACHE DESATIVADO (SSR/Páginas)
  # ========================================================================
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "Lambda-SSR"

    # Managed-CachingDisabled (AWS)
    cache_policy_id = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"

    # Managed-AllViewer (AWS) - Passa tudo para o Lambda
    origin_request_policy_id = "216adef6-5c7f-47e4-b989-5492eafa07d3"

    viewer_protocol_policy = "redirect-to-https"
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