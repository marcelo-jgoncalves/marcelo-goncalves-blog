# --- IAM: Role pública (read-only DynamoDB) ---
resource "aws_iam_role" "public_lambda_role" {
  name = "${var.project_name}-${var.environment}-public-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "public_lambda_policy" {
  name = "${var.project_name}-${var.environment}-public-lambda-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Action = ["dynamodb:GetItem", "dynamodb:Query", "dynamodb:Scan"]
        Effect = "Allow"
        Resource = [
          var.posts_table_arn,
          "${var.posts_table_arn}/index/*",
          var.autores_table_arn,
          "${var.autores_table_arn}/index/*",
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "public_lambda_attach" {
  role       = aws_iam_role.public_lambda_role.name
  policy_arn = aws_iam_policy.public_lambda_policy.arn
}

# --- IAM: Role admin (read-write DynamoDB) ---
resource "aws_iam_role" "admin_lambda_role" {
  name = "${var.project_name}-${var.environment}-admin-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "admin_lambda_policy" {
  name = "${var.project_name}-${var.environment}-admin-lambda-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Action = [
          "dynamodb:GetItem", "dynamodb:Query", "dynamodb:Scan",
          "dynamodb:PutItem", "dynamodb:UpdateItem", "dynamodb:DeleteItem"
        ]
        Effect = "Allow"
        Resource = [
          var.posts_table_arn,
          "${var.posts_table_arn}/index/*",
          var.autores_table_arn,
          "${var.autores_table_arn}/index/*",
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "admin_lambda_attach" {
  role       = aws_iam_role.admin_lambda_role.name
  policy_arn = aws_iam_policy.admin_lambda_policy.arn
}

# --- IAM: Role mediaUpload (S3 PutObject somente no bucket de uploads) ---
resource "aws_iam_role" "media_upload_role" {
  name = "${var.project_name}-${var.environment}-media-upload-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "media_upload_policy" {
  name = "${var.project_name}-${var.environment}-media-upload-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Action   = ["s3:PutObject"]
        Effect   = "Allow"
        Resource = "${var.uploads_bucket_arn}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "media_upload_attach" {
  role       = aws_iam_role.media_upload_role.name
  policy_arn = aws_iam_policy.media_upload_policy.arn
}

# --- CloudWatch Log Groups (com retenção explícita) ---
# Criados antes das Lambdas para evitar que o runtime crie grupos sem retenção.

resource "aws_cloudwatch_log_group" "media_upload" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-mediaUpload"
  retention_in_days = var.log_retention_days
}

resource "aws_cloudwatch_log_group" "get_post" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-getPost"
  retention_in_days = var.log_retention_days
}

resource "aws_cloudwatch_log_group" "get_author" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-getAuthor"
  retention_in_days = var.log_retention_days
}

resource "aws_cloudwatch_log_group" "get_posts" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-getPosts"
  retention_in_days = var.log_retention_days
}

resource "aws_cloudwatch_log_group" "admin_posts" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-adminPosts"
  retention_in_days = var.log_retention_days
}

resource "aws_cloudwatch_log_group" "admin_authors" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-adminAuthors"
  retention_in_days = var.log_retention_days
}

resource "aws_cloudwatch_log_group" "post_scheduler" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-postScheduler"
  retention_in_days = var.log_retention_days
}

# --- Lambda Functions ---

resource "aws_lambda_function" "media_upload" {
  function_name = "${var.project_name}-${var.environment}-mediaUpload"
  role          = aws_iam_role.media_upload_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"

  filename         = "${path.root}/builds/mediaUpload.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/mediaUpload.zip")

  environment {
    variables = {
      UPLOADS_BUCKET = var.uploads_bucket_name
      LOG_LEVEL      = var.log_level
    }
  }

  depends_on = [aws_cloudwatch_log_group.media_upload]
}

resource "aws_lambda_function" "get_post" {
  function_name = "${var.project_name}-${var.environment}-getPost"
  role          = aws_iam_role.public_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"

  filename         = "${path.root}/builds/getPost.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/getPost.zip")

  environment {
    variables = {
      POSTS_TABLE   = "${var.project_name}-${var.environment}-posts"
      AUTORES_TABLE = "${var.project_name}-${var.environment}-autores"
      LOG_LEVEL     = var.log_level
    }
  }

  depends_on = [aws_cloudwatch_log_group.get_post]
}

resource "aws_lambda_function" "get_author" {
  function_name = "${var.project_name}-${var.environment}-getAuthor"
  role          = aws_iam_role.public_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"

  filename         = "${path.root}/builds/getAuthor.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/getAuthor.zip")

  environment {
    variables = {
      AUTORES_TABLE = "${var.project_name}-${var.environment}-autores"
      LOG_LEVEL     = var.log_level
    }
  }

  depends_on = [aws_cloudwatch_log_group.get_author]
}

resource "aws_lambda_function" "get_posts" {
  function_name = "${var.project_name}-${var.environment}-getPosts"
  role          = aws_iam_role.public_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"

  filename         = "${path.root}/builds/getPosts.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/getPosts.zip")

  environment {
    variables = {
      POSTS_TABLE = "${var.project_name}-${var.environment}-posts"
      LOG_LEVEL   = var.log_level
    }
  }

  depends_on = [aws_cloudwatch_log_group.get_posts]
}

resource "aws_lambda_function" "admin_posts" {
  function_name = "${var.project_name}-${var.environment}-adminPosts"
  role          = aws_iam_role.admin_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"

  filename         = "${path.root}/builds/adminPosts.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/adminPosts.zip")

  environment {
    variables = {
      POSTS_TABLE = "${var.project_name}-${var.environment}-posts"
      LOG_LEVEL   = var.log_level
    }
  }

  depends_on = [aws_cloudwatch_log_group.admin_posts]
}

resource "aws_lambda_function" "admin_authors" {
  function_name = "${var.project_name}-${var.environment}-adminAuthors"
  role          = aws_iam_role.admin_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"

  filename         = "${path.root}/builds/adminAuthors.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/adminAuthors.zip")

  environment {
    variables = {
      AUTHORS_TABLE = "${var.project_name}-${var.environment}-autores"
      LOG_LEVEL     = var.log_level
    }
  }

  depends_on = [aws_cloudwatch_log_group.admin_authors]
}

# --- PostSchedulerLambda ---

resource "aws_iam_role" "scheduler_lambda_role" {
  name = "${var.project_name}-${var.environment}-scheduler-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "scheduler_lambda_policy" {
  name = "${var.project_name}-${var.environment}-scheduler-lambda-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Action   = ["dynamodb:Query"]
        Effect   = "Allow"
        Resource = "${var.posts_table_arn}/index/StatusProgramadoPorData"
      },
      {
        Action   = ["dynamodb:UpdateItem"]
        Effect   = "Allow"
        Resource = var.posts_table_arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "scheduler_lambda_attach" {
  role       = aws_iam_role.scheduler_lambda_role.name
  policy_arn = aws_iam_policy.scheduler_lambda_policy.arn
}

resource "aws_lambda_function" "post_scheduler" {
  function_name = "${var.project_name}-${var.environment}-postScheduler"
  role          = aws_iam_role.scheduler_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 300

  filename         = "${path.root}/builds/postScheduler.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/postScheduler.zip")

  environment {
    variables = {
      POSTS_TABLE = "${var.project_name}-${var.environment}-posts"
      LOG_LEVEL   = var.log_level
    }
  }

  depends_on = [aws_cloudwatch_log_group.post_scheduler]
}

# --- EventBridge Scheduler ---

resource "aws_iam_role" "eventbridge_scheduler_role" {
  name = "${var.project_name}-${var.environment}-eventbridge-scheduler-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "scheduler.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "eventbridge_scheduler_policy" {
  name = "${var.project_name}-${var.environment}-eventbridge-scheduler-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action   = ["lambda:InvokeFunction"]
      Effect   = "Allow"
      Resource = aws_lambda_function.post_scheduler.arn
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eventbridge_scheduler_attach" {
  role       = aws_iam_role.eventbridge_scheduler_role.name
  policy_arn = aws_iam_policy.eventbridge_scheduler_policy.arn
}

resource "aws_scheduler_schedule" "post_scheduler" {
  name       = "${var.project_name}-${var.environment}-post-scheduler"
  group_name = "default"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = "rate(15 minutes)"

  target {
    arn      = aws_lambda_function.post_scheduler.arn
    role_arn = aws_iam_role.eventbridge_scheduler_role.arn
  }
}
