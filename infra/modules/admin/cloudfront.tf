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

# Headers de segurança reais (HTTP), não meta tags. Admin é uma SPA estática
# (S3+Vite, sem servidor) — só o CloudFront pode injetar headers de resposta.
# X-Frame-Options e X-Content-Type-Options NUNCA funcionam via <meta http-equiv>
# em nenhum browser; só Content-Security-Policy é parcialmente honrado via meta
# (e nem todas as diretivas — frame-ancestors é explicitamente ignorado por spec).
# Substitui os metas equivalentes em admin/index.html.
resource "aws_cloudfront_response_headers_policy" "admin_security_headers" {
  name = "${var.project_name}-${var.environment}-admin-security-headers"

  security_headers_config {
    content_security_policy {
      # 'unsafe-inline' em style-src é necessário porque o Tiptap injeta style=""
      # diretamente no DOM (NodeViewWrapper de imagens, popper do Tippy.js usado
      # no bubble/floating menu). Sem isso o CSP bloqueia esses estilos
      # silenciosamente, quebrando posicionamento de menus e dimensões de imagens
      # no editor. Nonce por requisição resolveria sem 'unsafe-inline', mas exige
      # middleware SSR — inviável para SPA estática. Risco aceitável: admin é
      # acessado por um único usuário autenticado via Cognito; CSS injection nesse
      # contexto tem impacto prático negligenciável.
      content_security_policy = "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' data: https://cdnjs.cloudflare.com https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://cognito-idp.us-east-1.amazonaws.com https://*.auth.us-east-1.amazoncognito.com https://*.execute-api.us-east-1.amazonaws.com https://*.s3.amazonaws.com https://*.s3.us-east-1.amazonaws.com; frame-src https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://youtube-nocookie.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';"
      override                = true
    }
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    content_type_options {
      override = true
    }
    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
    strict_transport_security {
      access_control_max_age_sec = 63072000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
  }
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

  # Origin do API Gateway — faz o browser enxergar o admin e a API como a
  # MESMA origem (proxy /admin/* -> API Gateway). Isso é o que permite o
  # cookie de sessão do BFF usar SameSite=Strict sem token CSRF separado
  # (ver backend/src/functions/adminSession) — sem este proxy, admin e API
  # seriam origens diferentes e o cookie exigiria SameSite=None + CSRF.
  origin {
    domain_name = var.api_gateway_domain_name
    origin_id   = "API-Gateway-Admin"
    origin_path = var.api_gateway_stage_path

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # /admin/* nunca deve ser cacheado (respostas dinâmicas, autenticadas) e
  # precisa repassar o cookie de sessão + o header Cookie na requisição de
  # origem — sem isso o Lambda Authorizer/adminSession nunca veria o cookie.
  ordered_cache_behavior {
    path_pattern     = "/admin/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "API-Gateway-Admin"

    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Content-Type"]
      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  default_cache_behavior {
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-Admin"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.admin_security_headers.id

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
