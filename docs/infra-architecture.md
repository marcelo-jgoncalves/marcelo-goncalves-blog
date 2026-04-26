# 🏗️ Documentação de Arquitetura e Infraestrutura (IaC)
**Projeto:** IA Decifrada
**Stack:** Terraform + AWS Serverless
**Última Atualização:** Fase 3 (Homepage Implementada)

Este documento detalha a topologia da infraestrutura, as interdependências dos módulos Terraform e os "workarounds" técnicos implementados.

---

## 1. Visão Geral da Topologia AWS

A infraestrutura é modularizada para isolar responsabilidades. O estado é gerenciado localmente (por enquanto), implantado na conta `dev`.

### 1.1. Módulos Terraform (`infra/modules/`)

| Módulo | Responsabilidade | Recursos Chave |
| :--- | :--- | :--- |
| **`dynamodb`** | Camada de Dados | Tables: `posts`, `autores`, `categorias`. GSIs para query. |
| **`cognito`** | Identidade (Auth) | User Pool, App Client (sem secret). |
| **`lambda`** | Computação Backend | Functions Node.js 20 (API handlers). Shared IAM Roles. |
| **`api_gateway`** | Roteamento API | REST API, Resources, Methods, CORS, Cognito Authorizer. |
| **`media`** | Pipeline de Imagem | S3 Uploads (CORS), S3 Event Notification, Lambda Sharp.js. |
| **`frontend`** | Hospedagem Next.js | CloudFront, S3 Assets, Lambda URL (SSR). |
| **`admin`** | Hospedagem Vue.js | CloudFront, S3 Static Website (SPA Mode). |

---

## 2. Detalhes Críticos por Módulo (Deep Dive)

### 2.1. Módulo `dynamodb`
* **Billing:** PAY_PER_REQUEST (On-demand).
* **Tabela `posts`:**
    * **PK:** `slug` (String).
    * **GSI `StatusPorData`:** PK=`status`, SK=`data_atualizacao` (Ordenação descendente). Usado para listar posts recentes.
    * **GSI `CategoriaPorData`:** PK=`categoria_slug`, SK=`data_atualizacao`.
    * **GSI `PopularesPorData`:** PK=`e_popular` (Number 0/1), SK=`data_atualizacao`.

### 2.2. Módulo `lambda` (Backend)
* **Runtime:** `nodejs20.x`.
* **Build Pattern:** O script de build (`backend/build.js`) gera ZIPs contendo sempre `index.js` na raiz.
* **Funções Ativas:**
    * `getPost`, `getPosts`, `getAuthor` (Leitura Pública).
    * `adminPosts` (CRUD Protegido).
    * `mediaUpload` (Gera Presigned URL).
* **IAM:** Uma política compartilhada (`lambda_policy`) concede permissão de `PutItem`/`GetItem`/`Query` em todas as tabelas e Logs CloudWatch.

### 2.3. Módulo `api_gateway` (A Ponte)
* **Protocolo:** REST.
* **Autenticação:**
    * Rotas Públicas (`GET /post/*`): `authorization = "NONE"`.
    * Rotas Admin (`ANY /admin/*`): `authorization = "COGNITO_USER_POOLS"`.
* **CORS (Crucial):**
    * O Frontend roda em domínio diferente da API.
    * Toda rota Admin tem um método `OPTIONS` (MOCK) configurado manualmente para retornar headers `Access-Control-Allow-*`.
    * A Lambda `adminPosts` também retorna headers CORS no corpo da resposta (sucesso e erro).

### 2.4. Módulo `frontend` (Next.js + OpenNext)
* **Arquitetura:**
    * **S3 (`...-assets`):** Armazena `_next/static` e imagens processadas (`media/`). Privado (OAC).
    * **Lambda (`nextjs-server`):** Executa o SSR. Exposta via **Function URL**.
    * **CloudFront:**
        * Behavior `_next/static/*` -> S3.
        * Behavior `media/*` -> S3 (Imagens de upload).
        * Behavior Default (`*`) -> Lambda URL.
* **⚠️ Fix Crítico de Roteamento:** O CloudFront foi configurado para **NÃO** encaminhar o header `Host` para a Lambda, evitando erro 403 Forbidden da AWS.
* **Permissões:** Recurso `aws_lambda_permission` criado manualmente para permitir acesso público (`AuthType: NONE`) à Function URL.

### 2.5. Módulo `media` (Processamento de Imagem)
* **Fluxo:** Upload no S3 `raw` -> Gatilho S3 -> Lambda `imageProcessor`.
* **Lambda:**
    * Usa **Sharp.js**.
    * O Build script instala binários nativos (`--os=linux --cpu=x64`) específicos para Lambda.
    * Salva o arquivo processado (`.webp`, max 1280px) no bucket S3 do módulo `frontend` dentro da pasta `/media`.
* **Trigger:** Configurado para extensões `.png`, `.jpg`, `.jpeg`.

---

## 3. Interdependências (Wiring)

O arquivo `infra/main.tf` orquestra a passagem de dados entre módulos:

1.  `cognito` -> Exporta ARN -> `api_gateway` (Cria Authorizer).
2.  `dynamodb` -> Exporta ARNs -> `lambda` (Permissões IAM).
3.  `lambda` -> Exporta Invoke ARNs -> `api_gateway` (Integrações).
4.  `frontend` -> Exporta Bucket Name -> `media` (Destino das imagens processadas).
5.  `media` -> Exporta Bucket ARN -> `lambda` (Permissão de escrita para Presigned URL).

---

## 4. Procedimentos de Deploy (Cheat Sheet)

### 4.1. Quando mudar Infraestrutura (.tf)
```bash
cd infra
terraform apply -var-file="env/dev.tfvars" -auto-approve

### 4.2. Quando mudar Código Backend (.ts)

cd backend
npm run build
cd ../infra
terraform apply -var-file="env/dev.tfvars" -auto-approve

### 4.3. Quando mudar Frontend Next.js

Atenção: O ZIP deve ser criado a partir da subpasta default gerada pelo OpenNext.

cd frontend
npm run build:open
cd .open-next/server-function/default
zip -r ../../../../infra/builds/nextjs.zip .
cd ../../../..
aws s3 sync frontend/.open-next/assets s3://[BUCKET_NAME] --profile dev
cd infra
terraform taint module.frontend.aws_lambda_function.nextjs_server
terraform apply