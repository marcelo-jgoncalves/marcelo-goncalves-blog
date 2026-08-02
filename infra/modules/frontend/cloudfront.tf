
# --- Bucket S3 para logs de acesso do CloudFront (criado apenas se enable_cloudfront_logging=true) ---

resource "aws_s3_bucket" "cf_logs" {
  count  = var.enable_cloudfront_logging ? 1 : 0
  bucket = "${var.project_name}-${var.environment}-cf-frontend-logs"

  # Sem tags{} próprio: Environment/Project aqui eram subconjunto redundante
  # do default_tags do provider (providers.tf).
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
  description                       = "Restricted access to Frontend S3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# OAC para a Lambda Function URL — garante que só o CloudFront pode invocar
resource "aws_cloudfront_origin_access_control" "lambda_oac" {
  name                              = "${var.project_name}-${var.environment}-lambda-oac"
  description                       = "Restricted access to SSR Lambda via SigV4"
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

    # HSTS ausente até aqui (achado de auditoria 2026-07-24) — protege contra
    # downgrade HTTP mesmo sem domínio customizado ainda (funciona em
    # *.cloudfront.net normalmente). preload não habilitado: exigiria domínio
    # definitivo e envio à lista de preload do Chrome, fora de escopo agora.
    strict_transport_security {
      access_control_max_age_sec = 63072000 # 2 anos
      include_subdomains         = true
      preload                    = false
      override                   = true
    }
  }
}

# Modern cache policies (replacing legacy forwarded_values on the routes
# below — the default behavior still uses forwarded_values; migrate it in its
# own validated round, since it fronts every SSR page at once).

# "Except host": a Lambda Function URL origin rejects requests whose Host
# header doesn't match the URL's own domain (SigV4 signature mismatch).
data "aws_cloudfront_origin_request_policy" "all_viewer_except_host" {
  name = "Managed-AllViewerExceptHostHeader"
}

# Same behavior the default behavior's forwarded_values already had
# (min/default/max TTL = 0): no edge caching at all, every request goes to
# the Lambda. Combined with all_viewer_except_host above, the origin still
# gets the full query string it needs for pagination/search.
data "aws_cloudfront_cache_policy" "caching_disabled" {
  name = "Managed-CachingDisabled"
}

# No "Managed-" prefix: AWS only prefixes the older managed policies; the
# UseOriginCacheControlHeaders pair is listed without it (confirmed via
# `aws cloudfront list-cache-policies --type managed`).
data "aws_cloudfront_cache_policy" "use_origin_cache_control_qs" {
  name = "UseOriginCacheControlHeaders-QueryStrings"
}

# min = default = max is the only combination where CloudFront caches even
# when the origin sends Cache-Control: no-store — which is what App Router
# pages that read searchParams always send (see the /categoria/* behavior
# comment). 300s matches the revalidate the pages declare but can't honor.
resource "aws_cloudfront_cache_policy" "force_edge_300" {
  name    = "${var.project_name}-${var.environment}-force-edge-300"
  comment = "Pins a 300s edge TTL, overriding the origin's no-store"

  min_ttl     = 300
  default_ttl = 300
  max_ttl     = 300

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_gzip   = true
    enable_accept_encoding_brotli = true

    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "all"
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

  # --- /artigos: ISR works here (the page reads no searchParams), so the
  # origin emits s-maxage=300 and CloudFront just has to respect it. Managed
  # "UseOriginCacheControlHeaders-QueryStrings" does exactly that, with query
  # strings in the cache key. Confirmed live: X-Cache Hit with Age after the
  # first request.
  ordered_cache_behavior {
    path_pattern               = "/artigos"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "Lambda-SSR"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.frontend_security_headers.id

    cache_policy_id          = data.aws_cloudfront_cache_policy.use_origin_cache_control_qs.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host.id

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  # --- /categoria/* and /todos-artigos: these pages read searchParams
  # (pagination cursor), which forces dynamic rendering in the App Router and
  # makes Next.js emit Cache-Control: no-store on EVERY response — including
  # page 1 without any query string. CloudFront honors no-store whenever
  # min TTL is 0, so a TTL override via default_ttl alone never caches
  # anything (confirmed live: X-Cache Miss on every request). The custom
  # policy below pins min=default=max=300s, the one configuration where
  # CloudFront caches DESPITE the origin's no-store. Query strings stay in
  # the cache key — without that, /todos-artigos?nextToken=abc would serve
  # page 1's content. Staleness within the 300s window is bounded by the
  # on-demand invalidation fired on publish/delete transitions
  # (backend/src/common/cacheInvalidation.ts).
  ordered_cache_behavior {
    path_pattern               = "/categoria/*"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "Lambda-SSR"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.frontend_security_headers.id

    cache_policy_id          = aws_cloudfront_cache_policy.force_edge_300.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host.id

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  ordered_cache_behavior {
    path_pattern               = "/todos-artigos"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "Lambda-SSR"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.frontend_security_headers.id

    cache_policy_id          = aws_cloudfront_cache_policy.force_edge_300.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host.id

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  # --- Comportamento Padrão (Rota *): Manda para o Next.js (Lambda) ---
  # Last of the 4 Lambda-SSR behaviors migrated off deprecated forwarded_values
  # (the other 3 — /artigos, /categoria/*, /todos-artigos — moved earlier).
  # Managed-CachingDisabled reproduces the same min=default=max=0 TTLs this
  # behavior already had: ISR caching is handled by OpenNext, SSR caching
  # would require Suspense streaming.
  default_cache_behavior {
    allowed_methods            = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "Lambda-SSR"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.frontend_security_headers.id

    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host.id

    viewer_protocol_policy = "redirect-to-https"
    compress               = true # Gzip/Brotli — reduz payload HTML em ~70%
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
