# infra/modules/cognito/main.tf
# 1. User Pool (O diretório de usuários)
resource "aws_cognito_user_pool" "admin_pool" {
  name = "${var.project_name}-${var.environment}-admin-pool"

  # Política de Senha (Segurança básica)
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }

  # Login via E-mail
  auto_verified_attributes = ["email"]
  alias_attributes         = ["email"]

  admin_create_user_config {
    allow_admin_create_user_only = true # Apenas admins criam usuários (ninguém se cadastra sozinho)
  }
}

# 2. App Client (A interface para o Frontend Vue.js)
resource "aws_cognito_user_pool_client" "admin_client" {
  name = "${var.project_name}-${var.environment}-admin-client"

  user_pool_id = aws_cognito_user_pool.admin_pool.id
  
  # Configurações para SPA (Vue.js)
  generate_secret     = false # SPAs não conseguem guardar segredos, então desligamos
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH", 
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH" # Permite login direto user/senha (mais simples para admin interno)
  ]
  
  # Tokens válidos por 1 hora (Acesso) e 30 dias (Refresh)
  access_token_validity  = 60
  id_token_validity      = 60
  refresh_token_validity = 30
  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }
}

# 3. Domínio do Cognito (Para a Hosted UI, se usarmos)
resource "aws_cognito_user_pool_domain" "main" {
  domain       = "${var.project_name}-${var.environment}-auth"
  user_pool_id = aws_cognito_user_pool.admin_pool.id
}
