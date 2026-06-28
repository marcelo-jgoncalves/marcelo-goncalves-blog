# infra/modules/lambda/lambda-iam.tf
#
# IAM roles + policies — one per Lambda function (least-privilege scoping).
# Each role grants ONLY the permissions that specific Lambda needs.
#
# Logs + X-Ray statements are included in every role (inert when disabled).

locals {
  xray_mode = var.enable_xray_tracing ? "Active" : "PassThrough"

  xray_statement = {
    Action   = ["xray:PutTraceSegments", "xray:PutTelemetryRecords", "xray:GetSamplingRules", "xray:GetSamplingTargets"]
    Effect   = "Allow"
    Resource = "*"
  }

  logs_statement = {
    Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    Effect   = "Allow"
    Resource = "arn:aws:logs:*:*:*"
  }
}

# --- getPost: read posts_table + autores_table (GetItem, Query) ---
resource "aws_iam_role" "getPost_role" {
  name = "${var.project_name}-${var.environment}-getPost-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "getPost_policy" {
  name = "${var.project_name}-${var.environment}-getPost-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      local.logs_statement,
      {
        Action = ["dynamodb:GetItem", "dynamodb:Query"]
        Effect = "Allow"
        Resource = [
          var.posts_table_arn,
          "${var.posts_table_arn}/index/*",
          var.autores_table_arn,
        ]
      },
      local.xray_statement
    ]
  })
}

resource "aws_iam_role_policy_attachment" "getPost_attach" {
  role       = aws_iam_role.getPost_role.name
  policy_arn = aws_iam_policy.getPost_policy.arn
}

# --- getAuthor: read autores_table (GetItem, Query) ---
resource "aws_iam_role" "getAuthor_role" {
  name = "${var.project_name}-${var.environment}-getAuthor-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "getAuthor_policy" {
  name = "${var.project_name}-${var.environment}-getAuthor-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      local.logs_statement,
      {
        Action = ["dynamodb:GetItem", "dynamodb:Query"]
        Effect = "Allow"
        Resource = [
          var.autores_table_arn,
          "${var.autores_table_arn}/index/*",
        ]
      },
      local.xray_statement
    ]
  })
}

resource "aws_iam_role_policy_attachment" "getAuthor_attach" {
  role       = aws_iam_role.getAuthor_role.name
  policy_arn = aws_iam_policy.getAuthor_policy.arn
}

# --- getPosts: read posts_table (Query, Scan) ---
resource "aws_iam_role" "getPosts_role" {
  name = "${var.project_name}-${var.environment}-getPosts-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "getPosts_policy" {
  name = "${var.project_name}-${var.environment}-getPosts-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      local.logs_statement,
      {
        Action = ["dynamodb:Query", "dynamodb:Scan"]
        Effect = "Allow"
        Resource = [
          var.posts_table_arn,
          "${var.posts_table_arn}/index/*",
        ]
      },
      local.xray_statement
    ]
  })
}

resource "aws_iam_role_policy_attachment" "getPosts_attach" {
  role       = aws_iam_role.getPosts_role.name
  policy_arn = aws_iam_policy.getPosts_policy.arn
}

# --- adminPosts: read-write posts_table (GetItem, Query, Scan, PutItem, UpdateItem, DeleteItem) ---
resource "aws_iam_role" "adminPosts_role" {
  name = "${var.project_name}-${var.environment}-adminPosts-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "adminPosts_policy" {
  name = "${var.project_name}-${var.environment}-adminPosts-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      local.logs_statement,
      {
        Action = [
          "dynamodb:GetItem", "dynamodb:Query", "dynamodb:Scan",
          "dynamodb:PutItem", "dynamodb:UpdateItem", "dynamodb:DeleteItem"
        ]
        Effect = "Allow"
        Resource = [
          var.posts_table_arn,
          "${var.posts_table_arn}/index/*",
        ]
      },
      local.xray_statement
    ]
  })
}

resource "aws_iam_role_policy_attachment" "adminPosts_attach" {
  role       = aws_iam_role.adminPosts_role.name
  policy_arn = aws_iam_policy.adminPosts_policy.arn
}

# --- adminAuthors: read-write autores_table (GetItem, Query, Scan, PutItem, UpdateItem, DeleteItem) ---
resource "aws_iam_role" "adminAuthors_role" {
  name = "${var.project_name}-${var.environment}-adminAuthors-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "adminAuthors_policy" {
  name = "${var.project_name}-${var.environment}-adminAuthors-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      local.logs_statement,
      {
        Action = [
          "dynamodb:GetItem", "dynamodb:Query", "dynamodb:Scan",
          "dynamodb:PutItem", "dynamodb:UpdateItem", "dynamodb:DeleteItem"
        ]
        Effect = "Allow"
        Resource = [
          var.autores_table_arn,
          "${var.autores_table_arn}/index/*",
        ]
      },
      local.xray_statement
    ]
  })
}

resource "aws_iam_role_policy_attachment" "adminAuthors_attach" {
  role       = aws_iam_role.adminAuthors_role.name
  policy_arn = aws_iam_policy.adminAuthors_policy.arn
}

# --- adminCategorias: read-write categorias_table (GetItem, Query, Scan, PutItem, UpdateItem, DeleteItem) ---
resource "aws_iam_role" "adminCategorias_role" {
  name = "${var.project_name}-${var.environment}-adminCategorias-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "adminCategorias_policy" {
  name = "${var.project_name}-${var.environment}-adminCategorias-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      local.logs_statement,
      {
        Action = [
          "dynamodb:GetItem", "dynamodb:Query", "dynamodb:Scan",
          "dynamodb:PutItem", "dynamodb:UpdateItem", "dynamodb:DeleteItem"
        ]
        Effect   = "Allow"
        Resource = var.categorias_table_arn
      },
      local.xray_statement
    ]
  })
}

resource "aws_iam_role_policy_attachment" "adminCategorias_attach" {
  role       = aws_iam_role.adminCategorias_role.name
  policy_arn = aws_iam_policy.adminCategorias_policy.arn
}

# --- mediaUpload: S3 PutObject only on uploads bucket ---
resource "aws_iam_role" "mediaUpload_role" {
  name = "${var.project_name}-${var.environment}-mediaUpload-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "mediaUpload_policy" {
  name = "${var.project_name}-${var.environment}-mediaUpload-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      local.logs_statement,
      {
        Action   = ["s3:PutObject"]
        Effect   = "Allow"
        Resource = "${var.uploads_bucket_arn}/*"
      },
      local.xray_statement
    ]
  })
}

resource "aws_iam_role_policy_attachment" "mediaUpload_attach" {
  role       = aws_iam_role.mediaUpload_role.name
  policy_arn = aws_iam_policy.mediaUpload_policy.arn
}

# --- postScheduler: Query StatusProgramadoPorData index + UpdateItem on posts_table ---
resource "aws_iam_role" "postScheduler_role" {
  name = "${var.project_name}-${var.environment}-postScheduler-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "postScheduler_policy" {
  name = "${var.project_name}-${var.environment}-postScheduler-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      local.logs_statement,
      {
        Action   = ["dynamodb:Query"]
        Effect   = "Allow"
        Resource = "${var.posts_table_arn}/index/StatusProgramadoPorData"
      },
      {
        Action   = ["dynamodb:UpdateItem"]
        Effect   = "Allow"
        Resource = var.posts_table_arn
      },
      local.xray_statement
    ]
  })
}

resource "aws_iam_role_policy_attachment" "postScheduler_attach" {
  role       = aws_iam_role.postScheduler_role.name
  policy_arn = aws_iam_policy.postScheduler_policy.arn
}
