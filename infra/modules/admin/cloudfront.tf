
# --- S3 bucket for CloudFront access logs (created only if enable_cloudfront_logging=true) ---

resource "aws_s3_bucket" "cf_logs" {
  count  = var.enable_cloudfront_logging ? 1 : 0
  bucket = "${var.project_name}-${var.environment}-cf-admin-logs"

  # No own tags{}: Environment/Project here were a redundant subset of the
  # provider's default_tags (providers.tf).
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
  description                       = "Restricted access to Admin S3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Real security headers (HTTP), not meta tags. Admin is a static SPA
# (S3+Vite, no server), so only CloudFront can inject response headers.
# X-Frame-Options and X-Content-Type-Options NEVER work via <meta http-equiv>
# in any browser; only Content-Security-Policy is partially honored via meta
# (and not every directive, frame-ancestors is explicitly ignored by spec).
# Replaces the equivalent meta tags in admin/index.html.
resource "aws_cloudfront_response_headers_policy" "admin_security_headers" {
  name = "${var.project_name}-${var.environment}-admin-security-headers"

  security_headers_config {
    content_security_policy {
      # 'unsafe-inline' in style-src is necessary because Tiptap injects style=""
      # directly into the DOM (image NodeViewWrapper, Tippy.js popper used by
      # the bubble/floating menu). Without it, CSP silently blocks those
      # styles, breaking menu positioning and image dimensions in the editor.
      # A per-request nonce would avoid 'unsafe-inline' but requires SSR
      # middleware, not feasible for a static SPA. Acceptable risk: admin is
      # accessed by a single Cognito-authenticated user, so CSS injection in
      # this context has negligible practical impact.
      # blob: in img-src: UploadModal.vue previews the selected file via
      # URL.createObjectURL() before the upload completes: without it the
      # browser blocks the preview render (console error, upload itself
      # still works since it doesn't depend on the blob: URL rendering).
      content_security_policy = "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' data: https://cdnjs.cloudflare.com https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://cognito-idp.us-east-1.amazonaws.com https://*.auth.us-east-1.amazoncognito.com https://*.execute-api.us-east-1.amazonaws.com https://*.s3.amazonaws.com https://*.s3.us-east-1.amazonaws.com; frame-src https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://youtube-nocookie.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';"
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

  # API Gateway origin: makes the browser see admin and API as the SAME
  # origin (proxy /admin/* -> API Gateway). This is what allows the BFF
  # session cookie to use SameSite=Strict without a separate CSRF token
  # (see backend/src/functions/adminSession); without this proxy, admin and
  # API would be different origins and the cookie would require
  # SameSite=None + CSRF.
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

  # /admin/* must never be cached (dynamic, authenticated responses) and
  # needs to forward the session cookie plus the Cookie header on the origin
  # request; without this, the Lambda Authorizer/adminSession would never see
  # the cookie.
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

  # SPA routing: unknown routes fall back to index.html so Vue Router can
  # handle them client-side.
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
