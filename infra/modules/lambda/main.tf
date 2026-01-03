# --- 1. IAM Role (Identidade das Lambdas) ---
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-${var.environment}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# --- 2. IAM Policy (Permissões: Logs e DynamoDB) ---
resource "aws_iam_policy" "lambda_policy" {
  name = "${var.project_name}-${var.environment}-lambda-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        # Permissão para escrever logs no CloudWatch
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        # Permissão para ler as tabelas DynamoDB
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ]
        Effect   = "Allow"
        Resource = [
          var.posts_table_arn,
          "${var.posts_table_arn}/index/*", # Permitir acesso aos GSIs
          var.autores_table_arn
        ]
      }
    ]
  })
}

# Anexa a política à role
resource "aws_iam_role_policy_attachment" "lambda_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

resource "aws_iam_policy" "upload_policy" {
  name = "${var.project_name}-${var.environment}-upload-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action   = "s3:PutObject",
      Effect   = "Allow",
      Resource = "${var.uploads_bucket_arn}/*"
    }]
  })
}

resource "aws_lambda_function" "media_upload" {
  function_name = "${var.project_name}-${var.environment}-mediaUpload"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"

  filename         = "${path.root}/builds/mediaUpload.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/mediaUpload.zip")

  environment {
    variables = {
      UPLOADS_BUCKET = var.uploads_bucket_name
    }
  }
}

# Anexa a permissão de S3 à Role principal (que é compartilhada por simplicidade neste projeto)
resource "aws_iam_role_policy_attachment" "upload_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.upload_policy.arn
}

# --- 3. Funções Lambda (Definições) ---
# Função: Get Post (Lê um post pelo slug)
resource "aws_lambda_function" "get_post" {
  function_name = "${var.project_name}-${var.environment}-getPost"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"

  filename         = "${path.root}/builds/getPost.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/getPost.zip")

  environment {
    variables = {
      POSTS_TABLE = "${var.project_name}-${var.environment}-posts"
      AUTORES_TABLE = "${var.project_name}-${var.environment}-autores"
    }
  }
}

# Função: Get Author (Lê um autor pelo ID)
resource "aws_lambda_function" "get_author" {
  function_name = "${var.project_name}-${var.environment}-getAuthor"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  
  # CORREÇÃO AQUI: Usar path.root em vez de path.module
  filename         = "${path.root}/builds/getAuthor.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/getAuthor.zip")

  environment {
    variables = {
      AUTORES_TABLE = "${var.project_name}-${var.environment}-autores"
    }
  }
}

resource "aws_lambda_function" "admin_posts" {
  function_name = "${var.project_name}-${var.environment}-adminPosts"
  role          = aws_iam_role.lambda_role.arn # Reutilizamos a role (já tem acesso ao DynamoDB)
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  
  filename         = "${path.root}/builds/adminPosts.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/adminPosts.zip")

  environment {
    variables = {
      POSTS_TABLE = "${var.project_name}-${var.environment}-posts"
    }
  }
}

resource "aws_lambda_function" "get_posts" {
  function_name = "${var.project_name}-${var.environment}-getPosts"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  
  filename         = "${path.root}/builds/getPosts.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/getPosts.zip")

  environment {
    variables = {
      POSTS_TABLE = "${var.project_name}-${var.environment}-posts"
    }
  }
}

# Função: Admin Authors (CRUD de Autores para o CMS)
resource "aws_lambda_function" "admin_authors" {
  function_name = "${var.project_name}-${var.environment}-adminAuthors"
  role          = aws_iam_role.lambda_role.arn # Reutiliza a role com acesso ao DynamoDB
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  
  filename         = "${path.root}/builds/adminAuthors.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/adminAuthors.zip")

  environment {
    variables = {
      AUTHORS_TABLE = "${var.project_name}-${var.environment}-autores"
    }
  }
}