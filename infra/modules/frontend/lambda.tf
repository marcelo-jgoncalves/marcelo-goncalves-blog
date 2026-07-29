
# infra/modules/frontend/lambda.tf

resource "aws_cloudwatch_log_group" "nextjs_server" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-nextjs-server"
  retention_in_days = var.log_retention_days
}

# Role para a Lambda do Next.js
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

# Permissões básicas de Log
resource "aws_iam_role_policy_attachment" "nextjs_logs" {
  role       = aws_iam_role.nextjs_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Permissão X-Ray (somente quando tracing ativo)
resource "aws_iam_role_policy_attachment" "nextjs_xray" {
  count      = var.enable_xray_tracing ? 1 : 0
  role       = aws_iam_role.nextjs_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
}

# A Função Lambda (Servidor SSR)
resource "aws_lambda_function" "nextjs_server" {
  function_name = "${var.project_name}-${var.environment}-nextjs-server"
  role          = aws_iam_role.nextjs_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"

  # Aumentamos memória e timeout para SSR (Next.js é pesado)
  memory_size = 1024
  timeout     = 30

  # Placeholder inicial (será substituído pelo build do Next.js no CI/CD)
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

# Provisioned Concurrency — mantém instâncias aquecidas para eliminar cold starts
# Ativar em produção: provisioned_concurrency = 1 no env/prd.tfvars
resource "aws_lambda_provisioned_concurrency_config" "nextjs_warm" {
  count                             = var.provisioned_concurrency > 0 ? 1 : 0
  function_name                     = aws_lambda_function.nextjs_server.function_name
  qualifier                         = aws_lambda_function.nextjs_server.version
  provisioned_concurrent_executions = var.provisioned_concurrency
}

# URL da Lambda com AWS_IAM — apenas CloudFront (via OAC) pode invocar
resource "aws_lambda_function_url" "nextjs_url" {
  function_name      = aws_lambda_function.nextjs_server.function_name
  authorization_type = "AWS_IAM"
}

# Permite somente o CloudFront invocar a Lambda (via OAC com SigV4)
resource "aws_lambda_permission" "allow_cloudfront" {
  statement_id  = "AllowCloudFrontServicePrincipalNextJS"
  action        = "lambda:InvokeFunctionUrl"
  function_name = aws_lambda_function.nextjs_server.function_name
  principal     = "cloudfront.amazonaws.com"
  source_arn    = aws_cloudfront_distribution.frontend.arn
}
