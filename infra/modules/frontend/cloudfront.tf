# infra/modules/frontend/cloudfront.tf

# --- Bucket S3 para logs de acesso do CloudFront (criado apenas se enable_cloudfront_logging=true) ---

resource "aws_s3_bucket" "cf_logs" {
  count  = var.enable_cloudfront_logging ? 1 : 0
  bucket = "${var.project_name}-${var.environment}-cf-frontend-logs"

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# CloudFront exige ACL habilitado no bucket de logs
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

# Logs expiram no mesmo período que os logs do CloudWatch
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

# Único header de segurança que faltava: o Lambda SSR (next.config.ts
# headers()) já envia X-Frame-Options, X-Content-Type-Options, Referrer-Policy
# e Permissions-Policy via header HTTP real — mas nunca enviou
# Content-Security-Policy. Esta policy adiciona só esse header (evita
# duplicar/conflitar com os que o Lambda já envia corretamente).
# script-src/style-src precisam de 'unsafe-inline': o app usa o script inline
# de Consent Mode v2 (frontend/app/layout.tsx) e inline style={{}} em vários
# componentes — migrar para nonce/hash exigiria middleware por requisição,
# fora de escopo desta correção. frame-src libera embeds de YouTube nos posts
# (mesmo allowlist do sanitizer, ver backend/src/common/sanitizer.ts).
resource "aws_cloudfront_response_headers_policy" "frontend_security_headers" {
  name = "${var.project_name}-${var.environment}-frontend-security-headers"

  security_headers_config {
    content_security_policy {
      content_security_policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-src https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://youtube-nocookie.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';"
      override                = true
    }
  }
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled         = true
  is_ipv6_enabled = true
  price_class     = "PriceClass_200" # NA/Europa + América do Sul (Brasil) — obrigatório para blog PT-BR

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

  # --- REGRA: Arquivos de Mídia servidos do bucket de assets (imageProcessor grava aqui) ---
  ordered_cache_behavior {
    path_pattern     = "media/*"
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
    min_ttl                = 0
    default_ttl            = 86400    # 1 dia de cache
    max_ttl                = 31536000 # 1 ano
    compress               = true
  }


  # --- Assets estáticos de raiz: favicon, manifest, logo, touch icons ---
  # Estes arquivos vivem em public/ → sincronizados no S3 pelo pipeline.
  # Sem behaviors específicos, o CloudFront os mandaria para o Lambda (que não os serve).

  ordered_cache_behavior {
    path_pattern     = "*.ico"
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

  ordered_cache_behavior {
    path_pattern     = "*.webmanifest"
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
    max_ttl                = 86400
    compress               = true
  }

  ordered_cache_behavior {
    path_pattern     = "apple-touch-icon.png"
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

  ordered_cache_behavior {
    path_pattern     = "favicon-*.png"
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

  ordered_cache_behavior {
    path_pattern     = "logo-desktop.*"
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

  # --- /artigos e /categoria/*: TTL explícito de 300s no CloudFront ---
  # Estas rotas leem searchParams (cursor de paginação), o que força renderização
  # dinâmica no App Router e faz o Next.js emitir Cache-Control: no-store.
  # O CloudFront normalmente respeita esse header; aqui sobrescrevemos o TTL
  # diretamente para dar cache de 5 min na borda (match do revalidate: 300
  # declarado nas páginas, que sem ISR funcional era no-op silencioso).
  # query_string=true mantém entradas separadas por combinação de cursor —
  # sem isso, /artigos?nextToken=abc serviria o conteúdo da página 1.

  ordered_cache_behavior {
    path_pattern     = "/artigos"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "Lambda-SSR"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.frontend_security_headers.id

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
      headers = ["Authorization"]
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    min_ttl                = 0
    default_ttl            = 300
    max_ttl                = 300
  }

  ordered_cache_behavior {
    path_pattern     = "/categoria/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "Lambda-SSR"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.frontend_security_headers.id

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
      headers = ["Authorization"]
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    min_ttl                = 0
    default_ttl            = 300
    max_ttl                = 300
  }

  # --- Comportamento Padrão (Rota *): Manda para o Next.js (Lambda) ---
  default_cache_behavior {
    allowed_methods            = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "Lambda-SSR"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.frontend_security_headers.id

    forwarded_values {
      query_string = true # Necessário para paginação (?nextToken) e busca (?q)
      cookies {
        forward = "none" # Blog público sem auth — cookies não afetam o render
      }
      headers = ["Authorization"]
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true # Gzip/Brotli — reduz payload HTML em ~70%
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0 # ISR cache gerenciado pelo OpenNext; SSR caching requer Suspense streaming
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

  # Regra para imagens públicas (badges, assets estáticos de /public/static/)
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
    min_ttl                = 0
    default_ttl            = 86400    # 1 dia
    max_ttl                = 31536000 # 1 ano
    compress               = true
  }

  # Sem isso, um 403/404 (ex: variante do imageProcessor ainda não gerada)
  # fica cacheado no edge pelo TTL padrão da AWS (300s) — como media/* ignora
  # query string, o cache-buster (?retry=) do admin não consegue contornar
  # isso, e o editor esgota suas 5 tentativas (10s) antes do cache expirar,
  # mostrando "Imagem indisponível" mesmo com a variante já existindo no S3.
  custom_error_response {
    error_code            = 403
    error_caching_min_ttl = 1
  }

  custom_error_response {
    error_code            = 404
    error_caching_min_ttl = 1
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
