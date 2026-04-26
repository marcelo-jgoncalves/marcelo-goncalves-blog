# infra/modules/frontend/cloudfront.tf

# OAC para o bucket S3 de assets estáticos
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "${var.project_name}-${var.environment}-oac"
  description                       = "Acesso restrito S3 Frontend"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# OAC para a Lambda Function URL — garante que só o CloudFront pode invocar
resource "aws_cloudfront_origin_access_control" "lambda_oac" {
  name                              = "${var.project_name}-${var.environment}-lambda-oac"
  description                       = "Acesso restrito Lambda SSR via SigV4"
  origin_access_control_origin_type = "lambda"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled         = true
  is_ipv6_enabled = true
  price_class     = "PriceClass_100" # Usa apenas NA/Europa (Mais barato para dev)

  # --- Origem 1: S3 (Assets) ---
  origin {
    domain_name              = aws_s3_bucket.frontend_assets.bucket_regional_domain_name
    origin_id                = "S3-Assets"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  # --- Origem 2: Lambda (SSR Server) com OAC — apenas CloudFront pode invocar ---
  origin {
    domain_name              = replace(aws_lambda_function_url.nextjs_url.function_url, "/^https?://([^/]*).*/", "$1")
    origin_id                = "Lambda-SSR"
    origin_access_control_id = aws_cloudfront_origin_access_control.lambda_oac.id

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # --- REGRA NOVA: Arquivos de Mídia (Uploads) vão para o S3 ---
  ordered_cache_behavior {
    path_pattern     = "media/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Assets" # Aponta para o bucket

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400    # 1 dia de cache
    max_ttl                = 31536000 # 1 ano
    compress               = true
  }


  # --- Comportamento Padrão (Rota *): Manda para o Next.js (Lambda) ---
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "Lambda-SSR"

    # Forwarding total (Cookies, Headers, QueryString) para o SSR funcionar
    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
      headers = ["Authorization"] # Importante passar Host
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  # --- Comportamento Estático (_next/static/*): Manda para o S3 ---
  # Isso economiza muito dinheiro e acelera o site!
  ordered_cache_behavior {
    path_pattern     = "_next/static/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "S3-Assets"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400    # 1 dia
    max_ttl                = 31536000 # 1 ano (Assets do Next têm hash no nome, são imutáveis)
    compress               = true
  }

  # Regra para imagens públicas (se houver)
  ordered_cache_behavior {
    path_pattern     = "static/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Assets"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
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
