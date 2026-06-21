# --- 1. A API REST ---
resource "aws_api_gateway_rest_api" "main" {
  name        = "${var.project_name}-${var.environment}-api"
  description = "API principal do blog Marcelo Gonçalves"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# Autorizador Cognito (O "Porteiro")
resource "aws_api_gateway_authorizer" "cognito_auth" {
  name          = "CognitoAuthorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.main.id
  provider_arns = [var.cognito_user_pool_arn]
}

# Gateway Responses — quando o autorizador Cognito rejeita a requisição
# (token expirado/inválido/ausente), o API Gateway gera a resposta de erro
# ele mesmo, sem passar pela Lambda — e por isso sem os headers de CORS que
# a Lambda normalmente devolve. Sem isso, o browser bloqueia a resposta e o
# fetch() falha com "TypeError: Failed to fetch" em vez do 401/403 real,
# escondendo o erro de sessão expirada do tratamento de retry/redirect do admin.
resource "aws_api_gateway_gateway_response" "unauthorized_cors" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  response_type = "UNAUTHORIZED"
  status_code   = "401"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
  }
}

resource "aws_api_gateway_gateway_response" "access_denied_cors" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  response_type = "ACCESS_DENIED"
  status_code   = "403"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
  }
}

resource "aws_api_gateway_gateway_response" "default_4xx_cors" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  response_type = "DEFAULT_4XX"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
  }
}

resource "aws_api_gateway_gateway_response" "default_5xx_cors" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  response_type = "DEFAULT_5XX"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
  }
}

# --- 2. Recursos (Paths) ---

# /post
resource "aws_api_gateway_resource" "post" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "post"
}

# /post/{slug}
resource "aws_api_gateway_resource" "post_slug" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.post.id
  path_part   = "{slug}"
}

# /autor
resource "aws_api_gateway_resource" "autor" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "autor"
}

# /autor/{id}
resource "aws_api_gateway_resource" "autor_id" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.autor.id
  path_part   = "{id}"
}

# --- 3. Métodos e Integrações (Conexão com Lambda) ---

# GET /post/{slug} -> Lambda getPost
resource "aws_api_gateway_method" "get_post" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.post_slug.id
  http_method   = "GET"
  authorization = "NONE"
}

# --- Recursos Admin ---


# /admin/autores (Plural - Para Criar/Listar)
resource "aws_api_gateway_resource" "admin_autores" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.admin.id
  path_part   = "autores"
}

# /admin/autor (Singular - Já existe o recurso pai 'autor' público, mas aqui é filho de 'admin')
resource "aws_api_gateway_resource" "admin_autor_singular" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.admin.id
  path_part   = "autor"
}

# /admin/autor/{id}
resource "aws_api_gateway_resource" "admin_autor_id" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.admin_autor_singular.id
  path_part   = "{id}"
}


# /admin
resource "aws_api_gateway_resource" "admin" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "admin"
}

# /admin/posts
resource "aws_api_gateway_resource" "admin_posts" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.admin.id
  path_part   = "posts"
}

# --- Recurso: /admin/post (Singular) ---
resource "aws_api_gateway_resource" "admin_post_singular" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.admin.id
  path_part   = "post"
}

# --- Recurso: /admin/post/{slug} ---
resource "aws_api_gateway_resource" "admin_post_slug" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.admin_post_singular.id
  path_part   = "{slug}"
}

# Método ANY em /admin/post/{slug} (Protegido)
resource "aws_api_gateway_method" "admin_post_slug_any" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.admin_post_slug.id
  http_method   = "ANY"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_auth.id
}

resource "aws_api_gateway_integration" "admin_post_slug_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.admin_post_slug.id
  http_method             = aws_api_gateway_method.admin_post_slug_any.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.admin_posts_invoke_arn # Reutilizamos a mesma Lambda!
}

# --- CORS para /admin/post/{slug} (OPTIONS) ---
resource "aws_api_gateway_method" "admin_post_slug_options" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.admin_post_slug.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}


# --- Adicionar em infra/modules/api_gateway/main.tf ---

# --- Recursos de Autores (Admin) ---

# --- Métodos ---

# 1. ANY /admin/autor/{id} (GET para ler, PUT para editar) - Protegido
resource "aws_api_gateway_method" "admin_autor_id_any" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.admin_autor_id.id
  http_method   = "ANY"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_auth.id
}

resource "aws_api_gateway_integration" "admin_autor_id_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.admin_autor_id.id
  http_method             = aws_api_gateway_method.admin_autor_id_any.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.admin_authors_invoke_arn
}

# 2. OPTIONS /admin/autor/{id} (CORS)
resource "aws_api_gateway_method" "admin_autor_id_options" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.admin_autor_id.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "admin_autor_id_options_integration" {
  rest_api_id       = aws_api_gateway_rest_api.main.id
  resource_id       = aws_api_gateway_resource.admin_autor_id.id
  http_method       = aws_api_gateway_method.admin_autor_id_options.http_method
  type              = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "admin_autor_id_options_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.admin_autor_id.id
  http_method = aws_api_gateway_method.admin_autor_id_options.http_method
  status_code = "200"

  response_models = { "application/json" = "Empty" }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "admin_autor_id_options_response" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.admin_autor_id.id
  http_method = aws_api_gateway_method.admin_autor_id_options.http_method
  status_code = aws_api_gateway_method_response.admin_autor_id_options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT,DELETE'",
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  depends_on = [aws_api_gateway_method_response.admin_autor_id_options_200]
}

# Permissão para o Gateway invocar a Lambda
resource "aws_lambda_permission" "apigw_admin_authors" {
  statement_id  = "AllowAPIGatewayInvokeAdminAuthors"
  action        = "lambda:InvokeFunction"
  function_name = var.admin_authors_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

# Integração com a Lambda getPosts (reutilizando a mesma lambda)
resource "aws_api_gateway_integration" "get_populares_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.posts_populares.id
  http_method             = aws_api_gateway_method.get_populares.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_posts_invoke_arn
}

# --- NOVO RECURSO: /posts/populares ---
resource "aws_api_gateway_resource" "posts_populares" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.posts.id
  path_part   = "populares"
}

# Método GET para /posts/populares
resource "aws_api_gateway_method" "get_populares" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.posts_populares.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "admin_post_slug_options_integration" {
  rest_api_id       = aws_api_gateway_rest_api.main.id
  resource_id       = aws_api_gateway_resource.admin_post_slug.id
  http_method       = aws_api_gateway_method.admin_post_slug_options.http_method
  type              = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "admin_post_slug_options_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.admin_post_slug.id
  http_method = aws_api_gateway_method.admin_post_slug_options.http_method
  status_code = "200"

  response_models = { "application/json" = "Empty" }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "admin_post_slug_options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.admin_post_slug.id
  http_method = aws_api_gateway_method.admin_post_slug_options.http_method
  status_code = aws_api_gateway_method_response.admin_post_slug_options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT,DELETE'",
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_method_response.admin_post_slug_options_200]
}

# Método ANY em /admin/posts (Protegido pelo Cognito)
resource "aws_api_gateway_method" "admin_posts_any" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.admin_posts.id
  http_method = "ANY"

  # 🔒 AQUI ESTÁ A SEGURANÇA:
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_auth.id
}

# Integração com a Lambda adminPosts
resource "aws_api_gateway_integration" "admin_posts_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.admin_posts.id
  http_method             = aws_api_gateway_method.admin_posts_any.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.admin_posts_invoke_arn
}

# Método OPTIONS em /admin/posts (Público para CORS Preflight)
resource "aws_api_gateway_method" "admin_posts_options" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.admin_posts.id
  http_method   = "OPTIONS"
  authorization = "NONE" # 🔓 Aberto para o navegador testar
}

# Integração Mock (Responde 200 OK direto do Gateway, sem acordar a Lambda)
resource "aws_api_gateway_integration" "admin_posts_options_integration" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.admin_posts.id
  http_method = aws_api_gateway_method.admin_posts_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

# Resposta do Mock (Cabeçalhos CORS)
resource "aws_api_gateway_method_response" "admin_posts_options_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.admin_posts.id
  http_method = aws_api_gateway_method.admin_posts_options.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "admin_posts_options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.admin_posts.id
  http_method = aws_api_gateway_method.admin_posts_options.http_method
  status_code = aws_api_gateway_method_response.admin_posts_options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT,DELETE'",
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_method_response.admin_posts_options_200]
}

resource "aws_lambda_permission" "apigw_admin_posts" {
  statement_id  = "AllowAPIGatewayInvokeAdminPosts"
  action        = "lambda:InvokeFunction"
  function_name = var.admin_posts_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

resource "aws_api_gateway_integration" "get_post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.post_slug.id
  http_method             = aws_api_gateway_method.get_post.http_method
  integration_http_method = "POST" # Lambda requer POST para invocar
  type                    = "AWS_PROXY"
  uri                     = var.get_post_invoke_arn
}

# --- Recursos de Mídia ---

# /admin/media
resource "aws_api_gateway_resource" "admin_media" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.admin.id
  path_part   = "media"
}

# /admin/media/upload-url
resource "aws_api_gateway_resource" "admin_media_upload" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.admin_media.id
  path_part   = "upload-url"
}

# Método POST (Protegido)
resource "aws_api_gateway_method" "media_upload_post" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.admin_media_upload.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_auth.id
}

# Integração com a Lambda mediaUpload
resource "aws_api_gateway_integration" "media_upload_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.admin_media_upload.id
  http_method             = aws_api_gateway_method.media_upload_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.media_upload_invoke_arn
}

# Método OPTIONS (CORS Público)
resource "aws_api_gateway_method" "media_upload_options" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.admin_media_upload.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "media_upload_options_integration" {
  rest_api_id       = aws_api_gateway_rest_api.main.id
  resource_id       = aws_api_gateway_resource.admin_media_upload.id
  http_method       = aws_api_gateway_method.media_upload_options.http_method
  type              = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "media_upload_options_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.admin_media_upload.id
  http_method = aws_api_gateway_method.media_upload_options.http_method
  status_code = "200"

  response_models = { "application/json" = "Empty" }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "media_upload_options_response" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.admin_media_upload.id
  http_method = aws_api_gateway_method.media_upload_options.http_method
  status_code = aws_api_gateway_method_response.media_upload_options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'",
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_method_response.media_upload_options_200]
}

resource "aws_lambda_permission" "apigw_media_upload" {
  statement_id  = "AllowAPIGatewayInvokeMediaUpload"
  action        = "lambda:InvokeFunction"
  function_name = var.media_upload_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

# GET /autor/{id} -> Lambda getAuthor
resource "aws_api_gateway_method" "get_author" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.autor_id.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_author_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.autor_id.id
  http_method             = aws_api_gateway_method.get_author.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_author_invoke_arn
}

# --- 4. Permissões (Lambda Permission) ---
# Necessário para o API Gateway ter permissão de invocar a função

resource "aws_lambda_permission" "apigw_get_post" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.get_post_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_get_author" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.get_author_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

# --- 5. Deploy e Stage ---

resource "aws_api_gateway_stage" "main" {
  deployment_id        = aws_api_gateway_deployment.main.id
  rest_api_id          = aws_api_gateway_rest_api.main.id
  stage_name           = "v1"
  xray_tracing_enabled = var.enable_xray_tracing
}

# --- 1. Recursos para Listagem ---

# /posts (Já existe /post singular, agora criamos o plural)
resource "aws_api_gateway_resource" "posts" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "posts"
}

# /posts/recentes
resource "aws_api_gateway_resource" "posts_recentes" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.posts.id
  path_part   = "recentes"
}

# /artigos
resource "aws_api_gateway_resource" "artigos" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "artigos"
}

# /categoria
resource "aws_api_gateway_resource" "categoria" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "categoria"
}

# /categoria/{slug}
resource "aws_api_gateway_resource" "categoria_slug" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.categoria.id
  path_part   = "{slug}"
}

# --- 2. Integrações com a Lambda getPosts ---

# A. GET /posts/recentes
resource "aws_api_gateway_method" "get_recentes" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.posts_recentes.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_recentes_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.posts_recentes.id
  http_method             = aws_api_gateway_method.get_recentes.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_posts_invoke_arn
}

# B. GET /artigos (Paginado)
resource "aws_api_gateway_method" "get_artigos" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.artigos.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_artigos_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.artigos.id
  http_method             = aws_api_gateway_method.get_artigos.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_posts_invoke_arn
}

# C. GET /categoria/{slug}
resource "aws_api_gateway_method" "get_categoria" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.categoria_slug.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_categoria_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.categoria_slug.id
  http_method             = aws_api_gateway_method.get_categoria.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_posts_invoke_arn
}

# Permite que o API Gateway invoque a Lambda getPosts
resource "aws_lambda_permission" "apigw_get_posts" {
  statement_id  = "AllowAPIGatewayInvokeGetPosts"
  action        = "lambda:InvokeFunction"
  function_name = var.get_posts_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

# Recurso /busca
resource "aws_api_gateway_resource" "busca" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "busca"
}

# Método GET /busca
resource "aws_api_gateway_method" "get_busca" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.busca.id
  http_method   = "GET"
  authorization = "NONE"
}

# Integração GET /busca -> Lambda getPosts
resource "aws_api_gateway_integration" "get_busca_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.busca.id
  http_method             = aws_api_gateway_method.get_busca.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_posts_invoke_arn
}

# --- Recurso /projeto (Timeline) ---
resource "aws_api_gateway_resource" "projeto" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "projeto"
}

# Método GET /projeto
resource "aws_api_gateway_method" "get_projeto" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.projeto.id
  http_method   = "GET"
  authorization = "NONE"
}

# Integração /projeto -> Lambda getPosts
resource "aws_api_gateway_integration" "get_projeto_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.projeto.id
  http_method             = aws_api_gateway_method.get_projeto.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_posts_invoke_arn
}

# --- /admin/categorias ---

resource "aws_api_gateway_resource" "admin_categorias" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.admin.id
  path_part   = "categorias"
}

resource "aws_api_gateway_resource" "admin_categorias_slug" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.admin_categorias.id
  path_part   = "{slug}"
}

resource "aws_api_gateway_method" "admin_categorias_any" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.admin_categorias.id
  http_method   = "ANY"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_auth.id
}

resource "aws_api_gateway_integration" "admin_categorias_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.admin_categorias.id
  http_method             = aws_api_gateway_method.admin_categorias_any.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.admin_categorias_invoke_arn
}

resource "aws_api_gateway_method" "admin_categorias_options" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.admin_categorias.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "admin_categorias_options_integration" {
  rest_api_id       = aws_api_gateway_rest_api.main.id
  resource_id       = aws_api_gateway_resource.admin_categorias.id
  http_method       = aws_api_gateway_method.admin_categorias_options.http_method
  type              = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "admin_categorias_options_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.admin_categorias.id
  http_method = aws_api_gateway_method.admin_categorias_options.http_method
  status_code = "200"

  response_models = { "application/json" = "Empty" }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "admin_categorias_options_response" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.admin_categorias.id
  http_method = aws_api_gateway_method.admin_categorias_options.http_method
  status_code = aws_api_gateway_method_response.admin_categorias_options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT,DELETE'",
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_method_response.admin_categorias_options_200]
}

resource "aws_api_gateway_method" "admin_categorias_slug_any" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.admin_categorias_slug.id
  http_method   = "ANY"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_auth.id
}

resource "aws_api_gateway_integration" "admin_categorias_slug_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.admin_categorias_slug.id
  http_method             = aws_api_gateway_method.admin_categorias_slug_any.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.admin_categorias_invoke_arn
}

resource "aws_api_gateway_method" "admin_categorias_slug_options" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.admin_categorias_slug.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "admin_categorias_slug_options_integration" {
  rest_api_id       = aws_api_gateway_rest_api.main.id
  resource_id       = aws_api_gateway_resource.admin_categorias_slug.id
  http_method       = aws_api_gateway_method.admin_categorias_slug_options.http_method
  type              = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "admin_categorias_slug_options_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.admin_categorias_slug.id
  http_method = aws_api_gateway_method.admin_categorias_slug_options.http_method
  status_code = "200"

  response_models = { "application/json" = "Empty" }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "admin_categorias_slug_options_response" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.admin_categorias_slug.id
  http_method = aws_api_gateway_method.admin_categorias_slug_options.http_method
  status_code = aws_api_gateway_method_response.admin_categorias_slug_options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT,DELETE'",
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_method_response.admin_categorias_slug_options_200]
}

resource "aws_lambda_permission" "apigw_admin_categorias" {
  statement_id  = "AllowAPIGatewayInvokeAdminCategorias"
  action        = "lambda:InvokeFunction"
  function_name = var.admin_categorias_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

# Triggers

resource "aws_api_gateway_deployment" "main" {
  rest_api_id = aws_api_gateway_rest_api.main.id

  # O trigger calcula um hash de todos os recursos. Se qualquer um mudar, ele faz redeploy.
  triggers = {
    redeployment = sha1(jsonencode([
      # --- Recursos Públicos (Antigos) ---
      aws_api_gateway_resource.post_slug,
      aws_api_gateway_method.get_post,
      aws_api_gateway_integration.get_post_integration,
      aws_api_gateway_resource.autor_id,
      aws_api_gateway_method.get_author,
      aws_api_gateway_integration.get_author_integration,
      # --- Recursos Admin Plural (Antigos - /admin/posts) ---
      aws_api_gateway_resource.admin_posts,
      aws_api_gateway_method.admin_posts_any,
      aws_api_gateway_integration.admin_posts_integration,
      aws_api_gateway_method.admin_posts_options,
      aws_api_gateway_integration.admin_posts_options_integration,
      # --- Recursos Admin Singular (NOVOS - /admin/post/{slug}) ---
      aws_api_gateway_resource.admin_post_singular,
      aws_api_gateway_resource.admin_post_slug,
      # Método ANY (Protegido)
      aws_api_gateway_method.admin_post_slug_any,
      aws_api_gateway_integration.admin_post_slug_integration,
      # Método OPTIONS (CORS)
      aws_api_gateway_method.admin_post_slug_options,
      aws_api_gateway_integration.admin_post_slug_options_integration,
      # Método p/ MEDIA (CORS)
      aws_api_gateway_resource.admin_media,
      aws_api_gateway_resource.admin_media_upload,
      aws_api_gateway_method.media_upload_post,
      aws_api_gateway_integration.media_upload_integration,
      aws_api_gateway_method.media_upload_options,
      aws_api_gateway_integration_response.media_upload_options_response,
      aws_api_gateway_resource.posts_recentes,
      aws_api_gateway_method.get_recentes,
      aws_api_gateway_integration.get_recentes_integration,
      aws_api_gateway_resource.artigos,
      aws_api_gateway_method.get_artigos,
      aws_api_gateway_integration.get_artigos_integration,
      aws_api_gateway_resource.categoria_slug,
      aws_api_gateway_method.get_categoria,
      aws_api_gateway_integration.get_categoria_integration,
      aws_api_gateway_resource.posts_populares,
      aws_api_gateway_method.get_populares,
      aws_api_gateway_integration.get_populares_integration,
      aws_api_gateway_resource.busca,
      aws_api_gateway_method.get_busca,
      aws_api_gateway_integration.get_busca_integration,
      aws_api_gateway_resource.projeto,
      aws_api_gateway_method.get_projeto,
      aws_api_gateway_integration.get_projeto_integration,
      aws_api_gateway_resource.admin_autores,
      aws_api_gateway_resource.admin_autor_singular,
      aws_api_gateway_resource.admin_autor_id,
      aws_api_gateway_method.admin_autor_id_any,
      aws_api_gateway_integration.admin_autor_id_integration,
      aws_api_gateway_method.admin_autor_id_options,
      aws_api_gateway_integration.admin_autor_id_options_integration,
      aws_api_gateway_resource.admin_categorias,
      aws_api_gateway_method.admin_categorias_any,
      aws_api_gateway_integration.admin_categorias_integration,
      aws_api_gateway_method.admin_categorias_options,
      aws_api_gateway_integration.admin_categorias_options_integration,
      aws_api_gateway_resource.admin_categorias_slug,
      aws_api_gateway_method.admin_categorias_slug_any,
      aws_api_gateway_integration.admin_categorias_slug_integration,
      aws_api_gateway_method.admin_categorias_slug_options,
      aws_api_gateway_integration.admin_categorias_slug_options_integration,
      # Gateway Responses (CORS em erros do autorizador Cognito)
      aws_api_gateway_gateway_response.unauthorized_cors,
      aws_api_gateway_gateway_response.access_denied_cors,
      aws_api_gateway_gateway_response.default_4xx_cors,
      aws_api_gateway_gateway_response.default_5xx_cors,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}
