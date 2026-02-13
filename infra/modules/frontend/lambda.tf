# infra/modules/frontend/lambda.tf

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
      NODE_ENV = "production"
      # Injetamos a URL da API Backend aqui para o SSR funcionar
      NEXT_PUBLIC_API_URL = var.api_url
    }
  }
}

# URL Pública da Lambda (Para o CloudFront acessar)
resource "aws_lambda_function_url" "nextjs_url" {
  function_name      = aws_lambda_function.nextjs_server.function_name
  authorization_type = "NONE" # O CloudFront protege, a Lambda fica "aberta" mas com URL obscura
}

# ADIÇÃO CRÍTICA: Permite que qualquer pessoa (público) invoque a URL da função
resource "aws_lambda_permission" "allow_public_url" {
  statement_id           = "FunctionURLAllowPublicAccessTerraform"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.nextjs_server.function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}
