
variable "environment" {
  description = "Deployment environment (dev/prd)"
  type        = string
}

variable "project_name" {
  description = "Project name, used as prefix for all table names"
  type        = string
}

# Point-in-Time Recovery — disabled in dev by default (real cost, ~$0.20/GB-month
# in us-east-1; see marcelo-goncalves-blog-arquivo/docs-historico/investigacao-dynamodb.md,
# point 2). Same toggle pattern as enable_xray_tracing/enable_guardduty — turn
# on only where it's worth the cost.
variable "enable_point_in_time_recovery" {
  description = "Enables Point-in-Time Recovery on the 3 tables (posts/autores/categorias). Disabled in dev due to cost; enable in production."
  type        = bool
  default     = false
}

# --- Table 1: Posts ---
resource "aws_dynamodb_table" "posts" {
  name         = "${var.project_name}-${var.environment}-posts"
  billing_mode = "PAY_PER_REQUEST" # Pure serverless
  hash_key     = "slug"

  # Without this, the table is already encrypted at rest (AWS default since
  # 2018), but with an AWS-owned key — no usage visibility via CloudTrail/KMS.
  # AWS-managed (this block) is equally free and provides that auditability.
  server_side_encryption {
    enabled = true
  }

  point_in_time_recovery {
    enabled = var.enable_point_in_time_recovery
  }

  attribute {
    name = "slug"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "data_atualizacao"
    type = "S"
  }

  attribute {
    name = "categoria_slug"
    type = "S"
  }

  attribute {
    name = "data_publicacao"
    type = "S"
  }

  attribute {
    name = "data_publicacao_programada"
    type = "S"
  }

  # Sparse index markers — replace e_projeto/e_popular (Number 0/1) as the
  # hash_key of the ProjetoPorData/PopularesPorData GSIs. The attribute only
  # exists on the item when the respective flag is 1 (REMOVEd when 0), so the
  # GSI never concentrates 100% of items in a single fixed-value "0" partition.
  # Full migration plan: marcelo-goncalves-blog-arquivo/docs-historico/plano-migracao-gsi-dynamodb.md.
  attribute {
    name = "e_projeto_marker"
    type = "S"
  }

  attribute {
    name = "e_popular_marker"
    type = "S"
  }

  # Projections switched from ALL to INCLUDE (marcelo-goncalves-blog-arquivo/docs-historico/auditoria-engenharia/07-*.md):
  # ALL was duplicating conteudo_html (the item's largest field) into each of
  # the 5 GSIs. The non_key_attributes list below was extracted from the real
  # consumers (getPosts/adminPosts/postScheduler in the backend + listing
  # components in the frontend) — see marcelo-goncalves-blog-arquivo/docs-historico/investigacao-dynamodb.md.
  # The keys (the GSI's own hash/range + the table's primary key) are always
  # auto-projected by AWS regardless of projection_type, so they don't need
  # to appear in the list.

  # GSI 1: StatusPorData (for /artigos, Home, and the admin listing)
  global_secondary_index {
    name            = "StatusPorData"
    hash_key        = "status"
    range_key       = "data_atualizacao"
    projection_type = "INCLUDE"
    non_key_attributes = [
      "titulo", "resumo", "imagem_destaque_url", "imagem_destaque_alt_text",
      "imagem_lqip_base64", "categoria_slug", "subcategoria_nome",
      "data_publicacao", "tempo_leitura_min", "autor_id",
      "e_popular", "e_projeto", # Admin: Popular/Project badges in the post listing
    ]
  }

  # GSI 2: CategoriaPorData (for /categoria/[slug])
  global_secondary_index {
    name            = "CategoriaPorData"
    hash_key        = "categoria_slug"
    range_key       = "data_atualizacao"
    projection_type = "INCLUDE"
    non_key_attributes = [
      "status", "titulo", "resumo", "imagem_destaque_url",
      "imagem_destaque_alt_text", "imagem_lqip_base64", "subcategoria_nome",
      "data_publicacao",
    ]
  }

  # GSI 3: ProjetoPorData_v2 (for /o-projeto) — sparse index via
  # e_projeto_marker (string, only exists when e_projeto=1). Replaces the
  # original GSI (hash_key = e_projeto, Number 0/1 — a low-cardinality
  # anti-pattern). Full migration plan: marcelo-goncalves-blog-arquivo/docs-historico/plano-migracao-gsi-dynamodb.md.
  global_secondary_index {
    name            = "ProjetoPorData_v2"
    hash_key        = "e_projeto_marker"
    range_key       = "data_publicacao"
    projection_type = "INCLUDE"
    non_key_attributes = [
      "status", "titulo", "resumo", "categoria_slug", "tempo_leitura_min",
      "imagem_destaque_url", "imagem_destaque_alt_text", "imagem_lqip_base64",
    ]
  }

  # GSI 4: PopularesPorData_v2 (for "Popular" sections) — same rationale as
  # GSI 3 above.
  global_secondary_index {
    name            = "PopularesPorData_v2"
    hash_key        = "e_popular_marker"
    range_key       = "data_atualizacao"
    projection_type = "INCLUDE"
    non_key_attributes = [
      "status", "titulo", "resumo", "imagem_destaque_url",
      "imagem_destaque_alt_text", "imagem_lqip_base64", "categoria_slug",
      "subcategoria_nome", "data_publicacao",
    ]
  }

  # GSI 5: StatusProgramadoPorData (for the Lambda scheduler) — postScheduler
  # already uses ProjectionExpression "slug, data_publicacao_programada,
  # e_projeto"; only e_projeto is missing from the GSI's own projection
  # (slug is the table's PK and data_publicacao_programada is the range
  # key — both always projected).
  global_secondary_index {
    name               = "StatusProgramadoPorData"
    hash_key           = "status"
    range_key          = "data_publicacao_programada"
    projection_type    = "INCLUDE"
    non_key_attributes = ["e_projeto"]
  }
}

# --- Table 2: Authors ---
resource "aws_dynamodb_table" "autores" {
  name         = "${var.project_name}-${var.environment}-autores"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "autor_id"

  server_side_encryption {
    enabled = true
  }

  point_in_time_recovery {
    enabled = var.enable_point_in_time_recovery
  }

  attribute {
    name = "autor_id"
    type = "S"
  }
}

# --- Table 3: Categories ---
resource "aws_dynamodb_table" "categorias" {
  name         = "${var.project_name}-${var.environment}-categorias"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "categoria_slug"

  server_side_encryption {
    enabled = true
  }

  point_in_time_recovery {
    enabled = var.enable_point_in_time_recovery
  }

  attribute {
    name = "categoria_slug"
    type = "S"
  }
}

# --- Table 4: Admin sessions (BFF) ---
# Server-side session for the admin panel: the httpOnly cookie the browser
# gets carries only an opaque session_id (random UUID), never the Cognito
# JWT. This item is the session's source of truth — revoking is just a
# DeleteItem, without waiting for the token to expire on its own.
# `expires_at` is checked manually in code (adminSession/adminAuthorizer
# Lambdas), not only via TTL — DynamoDB's TTL is best-effort housekeeping
# (can take up to 48h to sweep), not a guarantee of immediate expiration.
resource "aws_dynamodb_table" "admin_sessions" {
  name         = "${var.project_name}-${var.environment}-admin-sessions"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "session_id"

  server_side_encryption {
    enabled = true
  }

  ttl {
    attribute_name = "expires_at"
    enabled        = true
  }

  attribute {
    name = "session_id"
    type = "S"
  }
}