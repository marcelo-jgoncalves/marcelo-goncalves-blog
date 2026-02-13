# infra/modules/media/lambda.tf

# 1. Role IAM
resource "aws_iam_role" "processor_role" {
  name = "${var.project_name}-${var.environment}-processor-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# 2. Policy (Logs + S3 RW)
resource "aws_iam_policy" "processor_policy" {
  name = "${var.project_name}-${var.environment}-processor-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
        Effect   = "Allow",
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        # Ler do bucket de uploads E escrever no bucket de assets (final)
        Action = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
        Effect = "Allow",
        Resource = [
          "${aws_s3_bucket.uploads.arn}/*",
          "arn:aws:s3:::${var.assets_bucket_name}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "processor_attach" {
  role       = aws_iam_role.processor_role.name
  policy_arn = aws_iam_policy.processor_policy.arn
}

# 3. A Função Lambda
resource "aws_lambda_function" "image_processor" {
  function_name = "${var.project_name}-${var.environment}-imageProcessor"
  role          = aws_iam_role.processor_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  memory_size   = 1024 # Processamento de imagem precisa de RAM/CPU
  timeout       = 60

  # Placeholder inicial
  filename         = "${path.root}/builds/imageProcessor.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/imageProcessor.zip")

  environment {
    variables = {
      DESTINATION_BUCKET = var.assets_bucket_name
    }
  }
}

# 4. Permissão para o S3 invocar a Lambda
resource "aws_lambda_permission" "allow_s3" {
  statement_id  = "AllowExecutionFromS3"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.image_processor.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.uploads.arn
}
