#
# CloudTrail (audit log of every API call in the account) + GuardDuty
# (automated threat detection). Confirmed via AWS CLI that neither existed
# in the account before this fix: without them, there was no trail to
# investigate anomalous credential use (e.g. the role assumed via OIDC by
# the pipeline).
#
# NOTE for whoever deploys `prod` for the first time: GuardDuty (1 detector
# per account/region) and CloudTrail are account-level resources, not
# application-level. If dev and prod share the same AWS account, instantiating
# this module twice will make the second `apply` fail ("detector already
# exists"). If they are separate accounts (best practice), keeping it in both
# is correct.
#
# GuardDuty has a real recurring cost (no permanent free tier, only a 30-day
# trial), hence it's gated by var.enable_guardduty, following the same
# pattern as enable_xray_tracing/enable_synthetic_canary (infra/variables.tf):
# off in dev, on once the production environment exists. CloudTrail stays
# always on: the first trail is free and the audit value (knowing who did
# what, even in dev) outweighs the near-zero cost.

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "cloudtrail_logs" {
  bucket        = "${var.project_name}-${var.environment}-cloudtrail-logs"
  force_destroy = var.environment == "dev" ? true : false
}

resource "aws_s3_bucket_public_access_block" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id

  rule {
    id     = "expire-cloudtrail-logs"
    status = "Enabled"

    filter {}

    expiration {
      days = var.log_retention_days
    }
  }
}

resource "aws_s3_bucket_policy" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AWSCloudTrailAclCheck"
        Effect    = "Allow"
        Principal = { Service = "cloudtrail.amazonaws.com" }
        Action    = "s3:GetBucketAcl"
        Resource  = aws_s3_bucket.cloudtrail_logs.arn
      },
      {
        Sid       = "AWSCloudTrailWrite"
        Effect    = "Allow"
        Principal = { Service = "cloudtrail.amazonaws.com" }
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.cloudtrail_logs.arn}/AWSLogs/${data.aws_caller_identity.current.account_id}/*"
        Condition = {
          StringEquals = { "s3:x-amz-acl" = "bucket-owner-full-control" }
        }
      }
    ]
  })
}

resource "aws_cloudtrail" "main" {
  name                          = "${var.project_name}-${var.environment}-trail"
  s3_bucket_name                = aws_s3_bucket.cloudtrail_logs.id
  is_multi_region_trail         = true
  include_global_service_events = true
  enable_logging                = true
  # Free, no infra of its own (SHA-256 digest files written next to the logs)
  # -- Trivy AWS-0016 flags trails that skip this, since without it a
  # compromised account could edit the log files with no way to detect it.
  enable_log_file_validation = true

  depends_on = [aws_s3_bucket_policy.cloudtrail_logs]
}

resource "aws_guardduty_detector" "main" {
  count = var.enable_guardduty ? 1 : 0

  enable = true
}
