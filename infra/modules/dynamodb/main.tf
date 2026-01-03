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
    name = "e_projeto"
    type = "N" # Boolean armazenado como 0 ou 1 para índice
  }

  attribute {
    name = "data_publicacao"
    type = "S"
  }

  attribute {
    name = "e_popular"
    type = "N" # Boolean armazenado como 0 ou 1 para índice
  }
  
  attribute {
    name = "data_publicacao_programada"
    type = "S"
  }

  # GSI 1: StatusPorData (Para /artigos e Home)
  global_secondary_index {
    name               = "StatusPorData"
    hash_key           = "status"
    range_key          = "data_atualizacao"
    projection_type    = "ALL"
  }

  # GSI 2: CategoriaPorData (Para /categoria/[slug])
  global_secondary_index {
    name               = "CategoriaPorData"
    hash_key           = "categoria_slug"
    range_key          = "data_atualizacao"
    projection_type    = "ALL"
  }

  # GSI 3: ProjetoPorData (Para /o-projeto)
  global_secondary_index {
    name               = "ProjetoPorData"
    hash_key           = "e_projeto"
    range_key          = "data_publicacao" # Ordem ascendente será controlada na query
    projection_type    = "ALL"
  }

  # GSI 4: PopularesPorData (Para seções "Populares")
  global_secondary_index {
    name               = "PopularesPorData"
    hash_key           = "e_popular"
    range_key          = "data_atualizacao"
    projection_type    = "ALL"
  }
  
  # GSI 5: StatusProgramadoPorData (Para Lambda Scheduler)
  global_secondary_index {
    name               = "StatusProgramadoPorData"
    hash_key           = "status"
    range_key          = "data_publicacao_programada"
    projection_type    = "ALL" # Projetar tudo para facilitar a atualização
  }
}

# --- Tabela 2: Autores (Seção 3.3) ---
resource "aws_dynamodb_table" "autores" {
  name         = "${var.project_name}-${var.environment}-autores"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "autor_id"

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

  attribute {
    name = "categoria_slug"
    type = "S"
  }
}