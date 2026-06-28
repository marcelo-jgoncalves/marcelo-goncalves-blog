# infra/modules/dynamodb/main.tf

variable "environment" {
  type = string
}

variable "project_name" {
  type = string
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
  # Ver docs/plano-migracao-gsi-dynamodb.md.
  attribute {
    name = "e_projeto_marker"
    type = "S"
  }

  attribute {
    name = "e_popular_marker"
    type = "S"
  }

  # GSI 1: StatusPorData (Para /artigos e Home)
  global_secondary_index {
    name            = "StatusPorData"
    hash_key        = "status"
    range_key       = "data_atualizacao"
    projection_type = "ALL"
  }

  # GSI 2: CategoriaPorData (Para /categoria/[slug])
  global_secondary_index {
    name            = "CategoriaPorData"
    hash_key        = "categoria_slug"
    range_key       = "data_atualizacao"
    projection_type = "ALL"
  }

  # GSI 3: ProjetoPorData_v2 (Para /o-projeto) — sparse index via
  # e_projeto_marker (string, só existe quando e_projeto=1). Substitui a
  # GSI original (hash_key = e_projeto, Number 0/1 — anti-padrão de baixa
  # cardinalidade, achado #2 de docs/auditoria-engenharia/07-*.md). Migração
  # completa em docs/plano-migracao-gsi-dynamodb.md.
  global_secondary_index {
    name            = "ProjetoPorData_v2"
    hash_key        = "e_projeto_marker"
    range_key       = "data_publicacao"
    projection_type = "ALL"
  }

  # GSI 4: PopularesPorData_v2 (Para seções "Populares") — mesma razão da
  # GSI 3 acima.
  global_secondary_index {
    name            = "PopularesPorData_v2"
    hash_key        = "e_popular_marker"
    range_key       = "data_atualizacao"
    projection_type = "ALL"
  }

  # GSI 5: StatusProgramadoPorData (Para Lambda Scheduler)
  global_secondary_index {
    name            = "StatusProgramadoPorData"
    hash_key        = "status"
    range_key       = "data_publicacao_programada"
    projection_type = "ALL" # Projetar tudo para facilitar a atualização
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

  attribute {
    name = "categoria_slug"
    type = "S"
  }
}