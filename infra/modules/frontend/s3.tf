# infra/modules/frontend/s3.tf

# 1. O Bucket de Assets
resource "aws_s3_bucket" "frontend_assets" {
  bucket = "${var.project_name}-${var.environment}-assets"

  # Boa Prática: Forçar destruição em dev para facilitar limpeza (cuidado em prod!)
  force_destroy = var.environment == "dev" ? true : false

  tags = {
    Name = "Frontend Assets"
  }
}

# 2. Boa Prática: Controle de Versão (Segurança contra deleção acidental/sobrescrita)
resource "aws_s3_bucket_versioning" "assets_versioning" {
  bucket = aws_s3_bucket.frontend_assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

# 3. Boa Prática: Criptografia em Repouso (Default)
resource "aws_s3_bucket_server_side_encryption_configuration" "assets_encryption" {
  bucket = aws_s3_bucket.frontend_assets.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# 4. Boa Prática: Bloqueio Total de Acesso Público (Segurança Máxima)
resource "aws_s3_bucket_public_access_block" "assets_block" {
  bucket = aws_s3_bucket.frontend_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 5. Política do bucket de assets: Permitir APENAS o CloudFront ler
resource "aws_s3_bucket_policy" "allow_cloudfront" {
  bucket = aws_s3_bucket.frontend_assets.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = { Service = "cloudfront.amazonaws.com" }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend_assets.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend.arn
          }
        }
      }
    ]
  })
}

# 6. Política do bucket de uploads: Permitir CloudFront servir a mídia
resource "aws_s3_bucket_policy" "allow_cloudfront_uploads" {
  bucket = var.uploads_bucket_name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipalMedia"
        Effect    = "Allow"
        Principal = { Service = "cloudfront.amazonaws.com" }
        Action    = "s3:GetObject"
        Resource  = "${var.uploads_bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend.arn
          }
        }
      }
    ]
  })
  depends_on = [aws_cloudfront_distribution.frontend]
}
