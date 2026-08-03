#
# IAM roles/policies (one per Lambda, least-privilege) live in lambda-iam.tf.

# --- CloudWatch Log Groups (explicit retention — created before the Lambdas) ---

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

resource "aws_cloudwatch_log_group" "admin_categorias" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-adminCategorias"
  retention_in_days = var.log_retention_days
}

resource "aws_cloudwatch_log_group" "admin_session" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-adminSession"
  retention_in_days = var.log_retention_days
}

resource "aws_cloudwatch_log_group" "admin_authorizer" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-adminAuthorizer"
  retention_in_days = var.log_retention_days
}

resource "aws_cloudwatch_log_group" "post_counter_reconciler" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-postCounterReconciler"
  retention_in_days = var.log_retention_days
}

# --- Lambda Functions ---

resource "aws_lambda_function" "media_upload" {
  function_name = "${var.project_name}-${var.environment}-mediaUpload"
  role          = aws_iam_role.function_role["mediaUpload"].arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  memory_size   = 512

  filename         = "${path.root}/builds/mediaUpload.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/mediaUpload.zip")

  environment {
    variables = {
      UPLOADS_BUCKET = var.uploads_bucket_name
      ADMIN_ORIGIN   = var.admin_origin
      LOG_LEVEL      = var.log_level
      XRAY_ENABLED   = tostring(var.enable_xray_tracing)
    }
  }

  tracing_config { mode = local.xray_mode }
  depends_on = [aws_cloudwatch_log_group.media_upload]
}

resource "aws_lambda_function" "get_post" {
  function_name = "${var.project_name}-${var.environment}-getPost"
  role          = aws_iam_role.function_role["getPost"].arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  memory_size   = 512

  filename         = "${path.root}/builds/getPost.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/getPost.zip")

  environment {
    variables = {
      POSTS_TABLE      = "${var.project_name}-${var.environment}-posts"
      AUTORES_TABLE    = "${var.project_name}-${var.environment}-autores"
      CATEGORIAS_TABLE = "${var.project_name}-${var.environment}-categorias"
      LOG_LEVEL        = var.log_level
      XRAY_ENABLED     = tostring(var.enable_xray_tracing)
    }
  }

  tracing_config { mode = local.xray_mode }
  depends_on = [aws_cloudwatch_log_group.get_post]
}

resource "aws_lambda_function" "get_author" {
  function_name = "${var.project_name}-${var.environment}-getAuthor"
  role          = aws_iam_role.function_role["getAuthor"].arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  memory_size   = 512

  filename         = "${path.root}/builds/getAuthor.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/getAuthor.zip")

  environment {
    variables = {
      AUTORES_TABLE = "${var.project_name}-${var.environment}-autores"
      LOG_LEVEL     = var.log_level
      XRAY_ENABLED  = tostring(var.enable_xray_tracing)
    }
  }

  tracing_config { mode = local.xray_mode }
  depends_on = [aws_cloudwatch_log_group.get_author]
}

resource "aws_lambda_function" "get_posts" {
  function_name = "${var.project_name}-${var.environment}-getPosts"
  role          = aws_iam_role.function_role["getPosts"].arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  memory_size   = 512

  filename         = "${path.root}/builds/getPosts.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/getPosts.zip")

  environment {
    variables = {
      POSTS_TABLE      = "${var.project_name}-${var.environment}-posts"
      CATEGORIAS_TABLE = "${var.project_name}-${var.environment}-categorias"
      LOG_LEVEL        = var.log_level
      XRAY_ENABLED     = tostring(var.enable_xray_tracing)
    }
  }

  tracing_config { mode = local.xray_mode }
  depends_on = [aws_cloudwatch_log_group.get_posts]
}

resource "aws_lambda_function" "admin_posts" {
  function_name = "${var.project_name}-${var.environment}-adminPosts"
  role          = aws_iam_role.function_role["adminPosts"].arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  memory_size   = 512

  filename         = "${path.root}/builds/adminPosts.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/adminPosts.zip")

  environment {
    variables = {
      POSTS_TABLE              = "${var.project_name}-${var.environment}-posts"
      ADMIN_ORIGIN             = var.admin_origin
      LOG_LEVEL                = var.log_level
      XRAY_ENABLED             = tostring(var.enable_xray_tracing)
      FRONTEND_DISTRIBUTION_ID = var.frontend_distribution_id
    }
  }

  tracing_config { mode = local.xray_mode }
  depends_on = [aws_cloudwatch_log_group.admin_posts]
}

resource "aws_lambda_function" "admin_authors" {
  function_name = "${var.project_name}-${var.environment}-adminAuthors"
  role          = aws_iam_role.function_role["adminAuthors"].arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  memory_size   = 512

  filename         = "${path.root}/builds/adminAuthors.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/adminAuthors.zip")

  environment {
    variables = {
      AUTHORS_TABLE = "${var.project_name}-${var.environment}-autores"
      ADMIN_ORIGIN  = var.admin_origin
      LOG_LEVEL     = var.log_level
      XRAY_ENABLED  = tostring(var.enable_xray_tracing)
    }
  }

  tracing_config { mode = local.xray_mode }
  depends_on = [aws_cloudwatch_log_group.admin_authors]
}

resource "aws_lambda_function" "admin_categorias" {
  function_name = "${var.project_name}-${var.environment}-adminCategorias"
  role          = aws_iam_role.function_role["adminCategorias"].arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  memory_size   = 512

  filename         = "${path.root}/builds/adminCategories.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/adminCategories.zip")

  environment {
    variables = {
      CATEGORIAS_TABLE = "${var.project_name}-${var.environment}-categorias"
      ADMIN_ORIGIN     = var.admin_origin
      LOG_LEVEL        = var.log_level
      XRAY_ENABLED     = tostring(var.enable_xray_tracing)
    }
  }

  tracing_config { mode = local.xray_mode }
  depends_on = [aws_cloudwatch_log_group.admin_categorias]
}

# --- adminSession (BFF): exchanges the client-side SRP idToken for an opaque session ---
resource "aws_lambda_function" "admin_session" {
  function_name = "${var.project_name}-${var.environment}-adminSession"
  role          = aws_iam_role.function_role["adminSession"].arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  memory_size   = 256

  filename         = "${path.root}/builds/adminSession.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/adminSession.zip")

  environment {
    variables = {
      ADMIN_SESSIONS_TABLE = "${var.project_name}-${var.environment}-admin-sessions"
      COGNITO_USER_POOL_ID = var.cognito_user_pool_id
      COGNITO_CLIENT_ID    = var.cognito_client_id
      ADMIN_ORIGIN         = var.admin_origin
      LOG_LEVEL            = var.log_level
      XRAY_ENABLED         = tostring(var.enable_xray_tracing)
    }
  }

  tracing_config { mode = local.xray_mode }
  depends_on = [aws_cloudwatch_log_group.admin_session]
}

# --- adminAuthorizer (REQUEST): replaces the native COGNITO_USER_POOLS on
# protected /admin/* routes — validates only the opaque session cookie. The
# Authorization Bearer fallback (legacy transition flow) was removed after
# confirming the cookie flow working end to end in production. ---
resource "aws_lambda_function" "admin_authorizer" {
  function_name = "${var.project_name}-${var.environment}-adminAuthorizer"
  role          = aws_iam_role.function_role["adminAuthorizer"].arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  memory_size   = 256

  filename         = "${path.root}/builds/adminAuthorizer.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/adminAuthorizer.zip")

  # COGNITO_USER_POOL_ID/COGNITO_CLIENT_ID removed along with the Bearer
  # fallback — no longer read by this handler.
  environment {
    variables = {
      ADMIN_SESSIONS_TABLE = "${var.project_name}-${var.environment}-admin-sessions"
      LOG_LEVEL            = var.log_level
      XRAY_ENABLED         = tostring(var.enable_xray_tracing)
    }
  }

  tracing_config { mode = local.xray_mode }
  depends_on = [aws_cloudwatch_log_group.admin_authorizer]
}

# --- PostSchedulerLambda ---
# Individual IAM role/policy in lambda-iam.tf (aws_iam_role.function_role["postScheduler"]).

resource "aws_lambda_function" "post_scheduler" {
  function_name = "${var.project_name}-${var.environment}-postScheduler"
  role          = aws_iam_role.function_role["postScheduler"].arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  timeout       = 30

  filename         = "${path.root}/builds/postScheduler.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/postScheduler.zip")

  environment {
    variables = {
      POSTS_TABLE              = "${var.project_name}-${var.environment}-posts"
      LOG_LEVEL                = var.log_level
      XRAY_ENABLED             = tostring(var.enable_xray_tracing)
      FRONTEND_DISTRIBUTION_ID = var.frontend_distribution_id
    }
  }

  tracing_config { mode = local.xray_mode }
  depends_on = [aws_cloudwatch_log_group.post_scheduler]
}

# --- postCounterReconciler ---
# Individual IAM role/policy in lambda-iam.tf (aws_iam_role.function_role["postCounterReconciler"]).
# Closes docs/backlog.md item #23: recounts the posts table once a day and
# self-heals postCounters.ts's aggregates if a write path ever drifts them.

resource "aws_lambda_function" "post_counter_reconciler" {
  function_name = "${var.project_name}-${var.environment}-postCounterReconciler"
  role          = aws_iam_role.function_role["postCounterReconciler"].arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  timeout       = 60 # full-table Scan, generous headroom over dev's current volume

  filename         = "${path.root}/builds/postCounterReconciler.zip"
  source_code_hash = filebase64sha256("${path.root}/builds/postCounterReconciler.zip")

  environment {
    variables = {
      POSTS_TABLE  = "${var.project_name}-${var.environment}-posts"
      LOG_LEVEL    = var.log_level
      XRAY_ENABLED = tostring(var.enable_xray_tracing)
    }
  }

  tracing_config { mode = local.xray_mode }
  depends_on = [aws_cloudwatch_log_group.post_counter_reconciler]
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
      Action = ["lambda:InvokeFunction"]
      Effect = "Allow"
      Resource = [
        aws_lambda_function.post_scheduler.arn,
        aws_lambda_function.post_counter_reconciler.arn,
      ]
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

  flexible_time_window { mode = "OFF" }

  schedule_expression = "rate(15 minutes)"

  target {
    arn      = aws_lambda_function.post_scheduler.arn
    role_arn = aws_iam_role.eventbridge_scheduler_role.arn
  }
}

resource "aws_scheduler_schedule" "post_counter_reconciler" {
  name       = "${var.project_name}-${var.environment}-post-counter-reconciler"
  group_name = "default"

  flexible_time_window { mode = "OFF" }

  # Daily, not on the 15-minute cadence of post_scheduler: this is a
  # self-healing safety net for a theoretical drift (docs/backlog.md item
  # #23), not a time-sensitive publish action — no reason to Scan the whole
  # table more often than that at this volume.
  schedule_expression = "rate(1 day)"

  target {
    arn      = aws_lambda_function.post_counter_reconciler.arn
    role_arn = aws_iam_role.eventbridge_scheduler_role.arn
  }
}
