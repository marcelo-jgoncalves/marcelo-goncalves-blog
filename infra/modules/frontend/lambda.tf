
# infra/modules/frontend/lambda.tf

resource "aws_cloudwatch_log_group" "nextjs_server" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-nextjs-server"
  retention_in_days = var.log_retention_days
}

# Role for the Next.js Lambda
resource "aws_iam_role" "nextjs_role" {
  name = "${var.project_name}-${var.environment}-nextjs-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# Basic log permissions
resource "aws_iam_role_policy_attachment" "nextjs_logs" {
  role       = aws_iam_role.nextjs_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# X-Ray permission (only when tracing is active)
resource "aws_iam_role_policy_attachment" "nextjs_xray" {
  count      = var.enable_xray_tracing ? 1 : 0
  role       = aws_iam_role.nextjs_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
}

# The Lambda function (SSR server)
resource "aws_lambda_function" "nextjs_server" {
  function_name = "${var.project_name}-${var.environment}-nextjs-server"
  role          = aws_iam_role.nextjs_role.arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"

  # Higher memory/timeout than the other Lambdas: SSR is heavier than a plain API handler
  memory_size = 1024
  timeout     = 30

  # Initial placeholder, replaced by the real Next.js build in CI/CD
  filename         = "${path.root}/builds/nextjs.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/nextjs.zip")

  environment {
    variables = {
      NODE_ENV     = "production"
      API_URL      = var.api_url
      XRAY_ENABLED = tostring(var.enable_xray_tracing)
    }
  }

  tracing_config { mode = var.enable_xray_tracing ? "Active" : "PassThrough" }
  depends_on = [aws_cloudwatch_log_group.nextjs_server]
}

# Provisioned Concurrency — keeps instances warm to eliminate cold starts
# Enable in production: provisioned_concurrency = 1 in env/prd.tfvars
resource "aws_lambda_provisioned_concurrency_config" "nextjs_warm" {
  count                             = var.provisioned_concurrency > 0 ? 1 : 0
  function_name                     = aws_lambda_function.nextjs_server.function_name
  qualifier                         = aws_lambda_function.nextjs_server.version
  provisioned_concurrent_executions = var.provisioned_concurrency
}

# Lambda URL with AWS_IAM — only CloudFront (via OAC) can invoke it
resource "aws_lambda_function_url" "nextjs_url" {
  function_name      = aws_lambda_function.nextjs_server.function_name
  authorization_type = "AWS_IAM"
}

# Allows only CloudFront to invoke the Lambda (via OAC with SigV4)
resource "aws_lambda_permission" "allow_cloudfront" {
  statement_id  = "AllowCloudFrontServicePrincipalNextJS"
  action        = "lambda:InvokeFunctionUrl"
  function_name = aws_lambda_function.nextjs_server.function_name
  principal     = "cloudfront.amazonaws.com"
  source_arn    = aws_cloudfront_distribution.frontend.arn
}
