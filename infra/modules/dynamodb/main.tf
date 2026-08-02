
variable "environment" {
  description = "Deployment environment (dev/prd)"
  type        = string
}

variable "project_name" {
  description = "Project name, used as prefix for all table names"
  type        = string
}

# Point-in-Time Recovery — desabilitado em dev por padrão (custo real, ~$0.20/GB-mês
# em us-east-1, achado de registro histórico arquivado fora do repo (marcelo-goncalves-blog-arquivo/docs-historico/investigacao-dynamodb.md), ponto 2). Mesmo padrão de
# toggle de enable_xray_tracing/enable_guardduty — ligar só quando convier.
variable "enable_point_in_time_recovery" {
  description = "Enables Point-in-Time Recovery on the 3 tables (posts/autores/categorias). Disabled in dev due to cost; enable in production."
  type        = bool
  default     = false
}

# --- Tabela 1: Posts (Seção 3.1) ---
resource "aws_dynamodb_table" "posts" {
  name         = "${var.project_name}-${var.environment}-posts"
  billing_mode = "PAY_PER_REQUEST" # Serverless puro
  hash_key     = "slug"

  # Sem isso, a tabela já é criptografada em repouso (default da AWS desde
  # 2018), mas com uma chave AWS-owned — sem visibilidade de uso via
  # CloudTrail/KMS. AWS-managed (este bloco) é igualmente gratuito e dá essa
  # auditabilidade (achado da auditoria AppSec, Cat. 3).
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

  # Sparse index markers — substituem e_projeto/e_popular (Number 0/1) como
  # hash_key das GSIs ProjetoPorData/PopularesPorData. O atributo só existe
  # no item quando o respectivo flag é 1 (REMOVE quando 0), então a GSI
  # nunca concentra 100% dos itens numa única partição de valor fixo "0".
  # Plano de migração completo: registro histórico arquivado fora do repo
  # (marcelo-goncalves-blog-arquivo/docs-historico/plano-migracao-gsi-dynamodb.md).
  attribute {
    name = "e_projeto_marker"
    type = "S"
  }

  attribute {
    name = "e_popular_marker"
    type = "S"
  }

  # Projections trocadas de ALL para INCLUDE (achado #13 da auditoria de
  # engenharia, registro histórico arquivado fora do repo em
  # marcelo-goncalves-blog-arquivo/docs-historico/auditoria-engenharia/07-*.md):
  # ALL duplicava conteudo_html (maior campo do item) em cada uma das 5 GSIs.
  # A lista de non_key_attributes abaixo foi extraída dos consumidores reais
  # (getPosts/adminPosts/postScheduler no backend + componentes de listagem
  # no frontend) — ver registro histórico arquivado (marcelo-goncalves-blog-arquivo/docs-historico/investigacao-dynamodb.md). As keys (hash/range da própria GSI +
  # chave primária da tabela) são sempre projetadas automaticamente pela AWS,
  # independente do projection_type, e não precisam aparecer na lista.

  # GSI 1: StatusPorData (Para /artigos, Home e listagem do admin)
  global_secondary_index {
    name            = "StatusPorData"
    hash_key        = "status"
    range_key       = "data_atualizacao"
    projection_type = "INCLUDE"
    non_key_attributes = [
      "titulo", "resumo", "imagem_destaque_url", "imagem_destaque_alt_text",
      "imagem_lqip_base64", "categoria_slug", "subcategoria_nome",
      "data_publicacao", "tempo_leitura_min", "autor_id",
      "e_popular", "e_projeto", # Admin: badges Popular/Projeto na listagem de posts
    ]
  }

  # GSI 2: CategoriaPorData (Para /categoria/[slug])
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

  # GSI 3: ProjetoPorData_v2 (Para /o-projeto) — sparse index via
  # e_projeto_marker (string, só existe quando e_projeto=1). Substitui a
  # GSI original (hash_key = e_projeto, Number 0/1 — anti-padrão de baixa
  # cardinalidade, achado #2 da auditoria de engenharia, mesmo registro
  # histórico arquivado citado acima). Migração completa: registro histórico
  # arquivado (marcelo-goncalves-blog-arquivo/docs-historico/plano-migracao-gsi-dynamodb.md).
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

  # GSI 4: PopularesPorData_v2 (Para seções "Populares") — mesma razão da
  # GSI 3 acima.
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

  # GSI 5: StatusProgramadoPorData (Para Lambda Scheduler) — postScheduler já
  # usa ProjectionExpression "slug, data_publicacao_programada, e_projeto";
  # só falta e_projeto na projeção da própria GSI (slug é a PK da tabela e
  # data_publicacao_programada é a range key — ambos sempre projetados).
  global_secondary_index {
    name               = "StatusProgramadoPorData"
    hash_key           = "status"
    range_key          = "data_publicacao_programada"
    projection_type    = "INCLUDE"
    non_key_attributes = ["e_projeto"]
  }
}

# --- Tabela 2: Autores (Seção 3.3) ---
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

# --- Tabela 3: Categorias (Seção 3.4) ---
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

# --- Tabela 4: Sessões do Admin (BFF) ---
# Sessão de servidor pro painel admin: o cookie httpOnly que o browser recebe
# carrega só um session_id opaco (UUID aleatório), nunca o JWT do Cognito. Este
# item é a fonte de verdade da sessão — revogar é só um DeleteItem, sem esperar
# o token expirar sozinho. `expires_at` é checado manualmente no código (Lambda
# adminSession/adminAuthorizer), não só via TTL — o TTL do DynamoDB é faxina
# best-effort (pode levar até 48h pra varrer), não é garantia de expiração
# imediata. Decisão da sessão 2026-07-24 (auditoria world-class → BFF).
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