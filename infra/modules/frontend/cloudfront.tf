
# --- S3 bucket for CloudFront access logs (created only if enable_cloudfront_logging=true) ---

resource "aws_s3_bucket" "cf_logs" {
  count  = var.enable_cloudfront_logging ? 1 : 0
  bucket = "${var.project_name}-${var.environment}-cf-frontend-logs"

  # No own tags{} block: Environment/Project here were a redundant subset
  # of the provider's default_tags (providers.tf).
}

# CloudFront requires ACL enabled on the logs bucket
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

# Logs expire on the same schedule as the CloudWatch logs
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

resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "${var.project_name}-${var.environment}-oac"
  description                       = "Restricted access to Frontend S3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# OAC for the Lambda Function URL: ensures only CloudFront can invoke it
resource "aws_cloudfront_origin_access_control" "lambda_oac" {
  name                              = "${var.project_name}-${var.environment}-lambda-oac"
  description                       = "Restricted access to SSR Lambda via SigV4"
  origin_access_control_origin_type = "lambda"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# The only missing security header: the Lambda SSR (next.config.ts headers())
# already sends X-Frame-Options, X-Content-Type-Options, Referrer-Policy and
# Permissions-Policy via real HTTP headers, but never sent
# Content-Security-Policy. This policy adds only that header, to avoid
# duplicating/conflicting with what the Lambda already sends correctly.
# script-src/style-src need 'unsafe-inline': the app uses the inline Consent
# Mode v2 script (frontend/app/layout.tsx) and inline style={{}} in several
# components; migrating to nonce/hash would require per-request middleware,
# out of scope here. frame-src allows YouTube embeds in posts (same allowlist
# as the sanitizer, see backend/src/common/sanitizer.ts).
resource "aws_cloudfront_response_headers_policy" "frontend_security_headers" {
  name = "${var.project_name}-${var.environment}-frontend-security-headers"

  security_headers_config {
    content_security_policy {
      content_security_policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-src https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://youtube-nocookie.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';"
      override                = true
    }

    # HSTS was missing: protects against HTTP downgrade even without a custom
    # domain yet (works normally on *.cloudfront.net). preload not enabled:
    # would require a final domain and submission to Chrome's preload list,
    # out of scope for now.
    strict_transport_security {
      access_control_max_age_sec = 63072000 # 2 years
      include_subdomains         = true
      preload                    = false
      override                   = true
    }
  }
}

# Modern cache policies (replacing legacy forwarded_values on the routes
# below): the default behavior still uses forwarded_values, migrate it in its
# own validated round, since it fronts every SSR page at once.

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

# Same TTL/query-string semantics as the AWS-managed
# "UseOriginCacheControlHeaders-QueryStrings" policy above, but without its
# header whitelist. That managed policy whitelists "host" among its cache-key
# headers: cache policy headers are forwarded to origin in addition to
# whatever the origin request policy sends, so it silently reintroduces the
# exact Host-header/SigV4 mismatch that all_viewer_except_host exists to
# avoid on a Lambda Function URL origin. Confirmed live: /artigos 403'd with
# AccessDeniedException from CloudFront (Lambda never even invoked, no
# matching CloudWatch log entries) until this custom policy replaced the
# managed one.
resource "aws_cloudfront_cache_policy" "origin_cache_control_qs_no_host" {
  name    = "${var.project_name}-${var.environment}-origin-cache-control-qs-no-host"
  comment = "Like the managed UseOriginCacheControlHeaders-QueryStrings, minus the Host header"

  min_ttl     = 0
  default_ttl = 0
  max_ttl     = 31536000

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_gzip   = true
    enable_accept_encoding_brotli = true

    cookies_config {
      cookie_behavior = "all"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "all"
    }
  }
}

# min = default = max is the only combination where CloudFront caches even
# when the origin sends Cache-Control: no-store, which is what App Router
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
  price_class     = "PriceClass_200" # NA/Europe + South America (Brazil): required for the PT-BR blog audience

  # --- Origem 1: S3 (Assets) ---
  origin {
    domain_name              = aws_s3_bucket.frontend_assets.bucket_regional_domain_name
    origin_id                = "S3-Assets"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  # --- Origin 2: Lambda (SSR Server) with OAC, only CloudFront can invoke it ---
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

  # --- Media files served from the assets bucket (imageProcessor writes here) ---
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
    default_ttl            = 86400    # 1 day cache
    max_ttl                = 31536000 # 1 year
    compress               = true
  }


  # --- Root-level static assets: favicon, manifest, logo, touch icons ---
  # These files live in public/, synced to S3 by the pipeline. Without explicit
  # behaviors, CloudFront would route them to the Lambda, which doesn't serve public/.

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
  # origin emits s-maxage=300 and CloudFront just has to respect it.
  # origin_cache_control_qs_no_host does exactly that, with query strings in
  # the cache key, see its comment above for why it's a custom policy and
  # not the AWS-managed one with the same name.
  ordered_cache_behavior {
    path_pattern               = "/artigos"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "Lambda-SSR"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.frontend_security_headers.id

    cache_policy_id          = aws_cloudfront_cache_policy.origin_cache_control_qs_no_host.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host.id

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  # --- /categoria/* and /todos-artigos: these pages read searchParams
  # (pagination cursor), which forces dynamic rendering in the App Router and
  # makes Next.js emit Cache-Control: no-store on EVERY response, including
  # page 1 without any query string. CloudFront honors no-store whenever
  # min TTL is 0, so a TTL override via default_ttl alone never caches
  # anything (confirmed live: X-Cache Miss on every request). The custom
  # policy below pins min=default=max=300s, the one configuration where
  # CloudFront caches DESPITE the origin's no-store. Query strings stay in
  # the cache key, without that, /todos-artigos?nextToken=abc would serve
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

  # --- Default behavior (route *): forwards to Next.js (Lambda) ---
  # Last of the 4 Lambda-SSR behaviors migrated off deprecated forwarded_values
  # (the other 3: /artigos, /categoria/*, /todos-artigos, moved earlier).
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
    compress               = true # Gzip/Brotli: reduces HTML payload by ~70%
  }

  # --- Static behavior (_next/static/*): served from S3 instead of Lambda,
  # cheaper and faster for hashed, immutable build assets ---
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
    default_ttl            = 86400    # 1 day
    max_ttl                = 31536000 # 1 year (Next assets are hashed in the filename, immutable)
    compress               = true
  }

  # Rule for public images (badges, static assets from /public/static/)
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
    default_ttl            = 86400    # 1 day
    max_ttl                = 31536000 # 1 year
    compress               = true
  }

  # Without this, a 403/404 (e.g. an imageProcessor variant not generated yet)
  # gets cached at the edge for the AWS default TTL (300s). Since media/*
  # ignores the query string, the admin's cache-buster (?retry=) can't work
  # around it, and the editor exhausts its 5 retries (10s) before the cache
  # expires, showing "Image unavailable" even though the variant already
  # exists in S3.
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
