#
# IAM roles + policies — one per Lambda function (least-privilege scoping).
# Each role grants ONLY the permissions that specific Lambda needs.
#
# Logs + X-Ray statements are included in every role (inert when disabled).

data "aws_caller_identity" "current" {}

# As 10 roles individuais (aws_iam_role.<nome>_role) viraram um único
# for_each (aws_iam_role.function_role["<nome>"]) abaixo. Sem os `moved`,
# o Terraform trataria a mudança de endereço como destroy+create das 10
# roles reais na AWS -- os blocos abaixo preservam o mapeamento no state,
# então o plan não mostra nenhuma mudança real de infraestrutura.
moved {
  from = aws_iam_role.getPost_role
  to   = aws_iam_role.function_role["getPost"]
}
moved {
  from = aws_iam_role.getAuthor_role
  to   = aws_iam_role.function_role["getAuthor"]
}
moved {
  from = aws_iam_role.getPosts_role
  to   = aws_iam_role.function_role["getPosts"]
}
moved {
  from = aws_iam_role.adminPosts_role
  to   = aws_iam_role.function_role["adminPosts"]
}
moved {
  from = aws_iam_role.adminAuthors_role
  to   = aws_iam_role.function_role["adminAuthors"]
}
moved {
  from = aws_iam_role.adminCategorias_role
  to   = aws_iam_role.function_role["adminCategorias"]
}
moved {
  from = aws_iam_role.adminSession_role
  to   = aws_iam_role.function_role["adminSession"]
}
moved {
  from = aws_iam_role.adminAuthorizer_role
  to   = aws_iam_role.function_role["adminAuthorizer"]
}
moved {
  from = aws_iam_role.mediaUpload_role
  to   = aws_iam_role.function_role["mediaUpload"]
}
moved {
  from = aws_iam_role.postScheduler_role
  to   = aws_iam_role.function_role["postScheduler"]
}

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

  # adminPosts/postScheduler invalidam o cache do CloudFront sob demanda
  # após save/publish/delete (plano completo arquivado fora do repo:
  # marcelo-goncalves-blog-arquivo/docs-historico/plano-cache-invalidation-cloudfront.md).
  cloudfront_invalidation_statement = {
    Action   = ["cloudfront:CreateInvalidation"]
    Effect   = "Allow"
    Resource = "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/${var.frontend_distribution_id}"
  }

  # Nomes das 10 Lambdas com role dedicada de least-privilege. Só a role
  # (assume_role_policy) é 100% idêntica entre elas -- por isso é a única
  # parte convertida em for_each; as policies abaixo continuam explícitas
  # uma a uma porque cada uma concede um conjunto diferente de permissões
  # (o ponto inteiro de existir uma role por função).
  lambda_role_names = [
    "getPost", "getAuthor", "getPosts", "adminPosts", "adminAuthors",
    "adminCategorias", "adminSession", "adminAuthorizer", "mediaUpload", "postScheduler",
  ]
}

resource "aws_iam_role" "function_role" {
  for_each = toset(local.lambda_role_names)
  name     = "${var.project_name}-${var.environment}-${each.key}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# --- getPost: read posts_table + autores_table (GetItem, Query) + categorias_table (Scan, category display name) ---
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
      {
        Action   = ["dynamodb:Scan"]
        Effect   = "Allow"
        Resource = var.categorias_table_arn
      },
      local.xray_statement
    ]
  })
}

resource "aws_iam_role_policy_attachment" "getPost_attach" {
  role       = aws_iam_role.function_role["getPost"].name
  policy_arn = aws_iam_policy.getPost_policy.arn
}

# --- getAuthor: read autores_table (GetItem, Query) ---
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
  role       = aws_iam_role.function_role["getAuthor"].name
  policy_arn = aws_iam_policy.getAuthor_policy.arn
}

# --- getPosts: read posts_table (GetItem, Query, Scan) + categorias_table (Scan, category display name) ---
resource "aws_iam_policy" "getPosts_policy" {
  name = "${var.project_name}-${var.environment}-getPosts-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      local.logs_statement,
      {
        Action = ["dynamodb:GetItem", "dynamodb:Query", "dynamodb:Scan"]
        Effect = "Allow"
        Resource = [
          var.posts_table_arn,
          "${var.posts_table_arn}/index/*",
        ]
      },
      {
        Action   = ["dynamodb:Scan"]
        Effect   = "Allow"
        Resource = var.categorias_table_arn
      },
      local.xray_statement
    ]
  })
}

resource "aws_iam_role_policy_attachment" "getPosts_attach" {
  role       = aws_iam_role.function_role["getPosts"].name
  policy_arn = aws_iam_policy.getPosts_policy.arn
}

# --- adminPosts: read-write posts_table (GetItem, Query, Scan, PutItem, UpdateItem, DeleteItem) ---
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
      local.cloudfront_invalidation_statement,
      local.xray_statement
    ]
  })
}

resource "aws_iam_role_policy_attachment" "adminPosts_attach" {
  role       = aws_iam_role.function_role["adminPosts"].name
  policy_arn = aws_iam_policy.adminPosts_policy.arn
}

# --- adminAuthors: read-write autores_table (GetItem, Query, Scan, PutItem, UpdateItem, DeleteItem) ---
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
  role       = aws_iam_role.function_role["adminAuthors"].name
  policy_arn = aws_iam_policy.adminAuthors_policy.arn
}

# --- adminCategorias: read-write categorias_table (GetItem, Query, Scan, PutItem, UpdateItem, DeleteItem) ---
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
  role       = aws_iam_role.function_role["adminCategorias"].name
  policy_arn = aws_iam_policy.adminCategorias_policy.arn
}

# --- adminSession: PutItem/GetItem/DeleteItem só na tabela de sessões.
# Nenhuma permissão de Cognito é necessária — o idToken é verificado via
# JWKS público (HTTPS), sem chamada a nenhuma API da AWS. ---
resource "aws_iam_policy" "adminSession_policy" {
  name = "${var.project_name}-${var.environment}-adminSession-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      local.logs_statement,
      {
        Action   = ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:DeleteItem"]
        Effect   = "Allow"
        Resource = var.admin_sessions_table_arn
      },
      local.xray_statement
    ]
  })
}

resource "aws_iam_role_policy_attachment" "adminSession_attach" {
  role       = aws_iam_role.function_role["adminSession"].name
  policy_arn = aws_iam_policy.adminSession_policy.arn
}

# --- adminAuthorizer: GetItem só na tabela de sessões (leitura, nunca
# escreve). Mesma observação sobre Cognito: verificação via JWKS, sem
# permissão IAM de nenhuma API do Cognito. ---
resource "aws_iam_policy" "adminAuthorizer_policy" {
  name = "${var.project_name}-${var.environment}-adminAuthorizer-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      local.logs_statement,
      {
        Action   = ["dynamodb:GetItem"]
        Effect   = "Allow"
        Resource = var.admin_sessions_table_arn
      },
      local.xray_statement
    ]
  })
}

resource "aws_iam_role_policy_attachment" "adminAuthorizer_attach" {
  role       = aws_iam_role.function_role["adminAuthorizer"].name
  policy_arn = aws_iam_policy.adminAuthorizer_policy.arn
}

# --- mediaUpload: S3 PutObject only on uploads bucket ---
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
  role       = aws_iam_role.function_role["mediaUpload"].name
  policy_arn = aws_iam_policy.mediaUpload_policy.arn
}

# --- postScheduler: Query StatusProgramadoPorData index + UpdateItem on posts_table ---
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
      local.cloudfront_invalidation_statement,
      local.xray_statement
    ]
  })
}

resource "aws_iam_role_policy_attachment" "postScheduler_attach" {
  role       = aws_iam_role.function_role["postScheduler"].name
  policy_arn = aws_iam_policy.postScheduler_policy.arn
}
