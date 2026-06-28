# infra/modules/media/s3.tf

# 1. O Bucket de Uploads (Que estava faltando)
resource "aws_s3_bucket" "uploads" {
  bucket        = "${var.project_name}-${var.environment}-uploads-raw"
  force_destroy = var.environment == "dev" ? true : false
}

# 2. Bloquear acesso público — uploads-raw só deve ser acessível via Lambda + presigned URLs
resource "aws_s3_bucket_public_access_block" "uploads_public_access" {
  bucket = aws_s3_bucket.uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 3. Configuração de CORS — restritiva (só admin + frontend CloudFront, sem wildcard)
resource "aws_s3_bucket_cors_configuration" "uploads_cors" {
  bucket = aws_s3_bucket.uploads.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    # Restringido aos domínios CloudFront reais — presigned URLs são emitidas
    # apenas pelo admin Vue (UploadModal.vue) para CORS preflight no browser.
    # Frontend nunca faz upload direto a este bucket (só imageProcessor).
    allowed_origins = [
      "https://${var.admin_origin}",
      "https://${var.frontend_origin}"
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  depends_on = [aws_s3_bucket_public_access_block.uploads_public_access]
}

# 3. Notificação S3 → Lambda imageProcessor
# Extensões normalizadas para minúsculas pelo mediaUpload Lambda (evita duplicação de triggers)
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.uploads.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.image_processor.arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".jpg"
  }

  lambda_function {
    lambda_function_arn = aws_lambda_function.image_processor.arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".jpeg"
  }

  lambda_function {
    lambda_function_arn = aws_lambda_function.image_processor.arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".png"
  }

  lambda_function {
    lambda_function_arn = aws_lambda_function.image_processor.arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".webp"
  }

  lambda_function {
    lambda_function_arn = aws_lambda_function.image_processor.arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".heic"
  }

  lambda_function {
    lambda_function_arn = aws_lambda_function.image_processor.arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".heif"
  }

  depends_on = [aws_lambda_permission.allow_s3]
}