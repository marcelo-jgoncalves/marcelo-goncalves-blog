
locals {
  xray_mode = var.enable_xray_tracing ? "Active" : "PassThrough"
}

resource "aws_cloudwatch_log_group" "image_processor" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-imageProcessor"
  retention_in_days = var.log_retention_days
}

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
        Action = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
        Effect = "Allow",
        Resource = [
          "${aws_s3_bucket.uploads.arn}/*",
          "arn:aws:s3:::${var.assets_bucket_name}/*"
        ]
      },
      {
        Action   = ["dynamodb:Scan", "dynamodb:UpdateItem"],
        Effect   = "Allow",
        Resource = var.posts_table_arn
      },
      {
        Action   = ["xray:PutTraceSegments", "xray:PutTelemetryRecords", "xray:GetSamplingRules", "xray:GetSamplingTargets"]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "processor_attach" {
  role       = aws_iam_role.processor_role.name
  policy_arn = aws_iam_policy.processor_policy.arn
}

resource "aws_lambda_function" "image_processor" {
  function_name = "${var.project_name}-${var.environment}-imageProcessor"
  role          = aws_iam_role.processor_role.arn
  handler       = "index.handler"
  runtime       = "nodejs24.x"
  memory_size   = 1024 # Image processing needs RAM/CPU headroom
  timeout       = 60

  # Initial placeholder, replaced by the real build in CI/CD
  filename         = "${path.root}/builds/imageProcessor.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/imageProcessor.zip")

  environment {
    variables = {
      DESTINATION_BUCKET = var.assets_bucket_name
      POSTS_TABLE        = var.posts_table_name
      LOG_LEVEL          = var.log_level
      XRAY_ENABLED       = tostring(var.enable_xray_tracing)
    }
  }

  tracing_config { mode = local.xray_mode }
  depends_on = [aws_cloudwatch_log_group.image_processor]
}

resource "aws_lambda_permission" "allow_s3" {
  statement_id  = "AllowExecutionFromS3"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.image_processor.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.uploads.arn
}
