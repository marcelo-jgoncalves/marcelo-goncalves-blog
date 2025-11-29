# Relatório Técnico de Handover: Blog Marcelo Gonçalves
**Versão:** 3.1 (Consolidada)
**Data:** 29 de Novembro de 2025
**Status:** Fase 3 em Andamento (Homepage Finalizada).
**Arquitetura:** Serverless AWS (Headless) | **IaC:** Terraform | **Frontend:** Next.js 15 (OpenNext)

---

## 0. 🚨 Onboarding Crítico (Leia Antes de Codar)

Se você é uma IA ou desenvolvedor assumindo este projeto, **LEIA ESTES ARQUIVOS PRIMEIRO**.

### 0.1. Arquivos de Contexto Obrigatório
1.  **`blueprint-v1.7.md`**: A "Bíblia" do projeto (Schema, Regras de Negócio, Rotas).
2.  **`frontend/app/globals.css`**: Fonte da verdade visual. Contém variáveis (`--aws-orange`), tipografia (`.hero-title`) e grids.
3.  **`frontend/lib/api.ts`**: Cliente HTTP centralizado. Use-o para todos os fetches.
4.  **`infra/modules/api_gateway/main.tf`**: Definição de rotas e do estágio `v1`.
5.  **`backend/build.js`**: Script de build crítico para as Lambdas.

### 0.2. Mapa da Estrutura (Monorepo)
O projeto é um Monorepo com infraestrutura totalmente desacoplada do código.

```text
marcelogoncalves-tech/
├── blueprint-v1.7.md       # Regras de Negócio e Schema
├── handover.md             # Este documento
├── infra/                  # Terraform (Gerencia toda a AWS)
│   ├── modules/            # Módulos: api_gateway, cognito, dynamodb, frontend, admin, media, lambda
│   └── builds/             # Artefatos .zip gerados
├── backend/                # Lógica de Negócio (Node.js 20 + TypeScript)
│   └── build.js            # Script customizado (esbuild)
├── frontend/               # Blog Público (Next.js 15 + OpenNext v3)
│   ├── app/                # App Router (globals.css, layout.tsx, page.tsx)
│   └── lib/api.ts          # Cliente API
└── admin/                  # CMS Interno (Vue.js 3 + Vite + Amplify)
```

---

## 1. Status Técnico dos Componentes (Detalhes Críticos)

### 1.1. Infraestrutura (Terraform)
* **Estado:** Local (na máquina do Marcelo).
* **Módulo Frontend:** Configura S3 + CloudFront + Lambda URL.
    * **⚠️ Atenção:** O CloudFront foi configurado para **NÃO** repassar o header `Host` para a Lambda (correção de erro 403).
    * **⚠️ Atenção:** A rota `/media/*` no CloudFront aponta direto para o S3 (imagens), ignorando o Next.js.
* **Módulo Media:** Bucket S3 com CORS habilitado e Trigger para Lambda `imageProcessor`.
* **API Gateway:** REST API regional com Authorizer (`CognitoAuthorizer`) nas rotas `/admin/*`. Stage implantado: `v1`.

### 1.2. Backend (Lambdas)
* **Runtime:** Node.js 20.
* **Build System:** Script customizado (`backend/build.js`) usando `esbuild`. Força `format: 'cjs'` (CommonJS).
* **Sharp.js:** A função `imageProcessor` instala binários nativos Linux x64 durante o build. **Não alterar essa lógica.**
* **Endpoints Ativos:**
    * Públicos: `getPost`, `getPosts`, `getAuthor`.
    * Admin: `adminPosts` (CRUD + CORS Options), `mediaUpload` (Presigned URLs).
    * Trigger: `imageProcessor` (Redimensiona para 1280px WebP).

### 1.3. Frontend Público (Next.js)
* **Versão:** Next.js 15 (App Router).
* **Engine:** OpenNext v3.
* **⚠️ Breaking Change Next.js 15:** Em `page.tsx` e `layout.tsx`, `params` agora é uma **Promise**. O código já usa `await params`.
* **Estilização:** CSS Puro (`globals.css`). Tailwind foi removido.
* **Layout:** Mobile-First. Grid de 3 colunas e bordas arredondadas aplicadas via `@media (min-width: 768px)`.

### 1.4. Frontend Admin (Vue.js)
* **Stack:** Vue 3, Vite, Pinia, AWS Amplify.
* **Auth:** Conectado ao User Pool do Cognito.
* **Status:** Funcionalidades prontas (Login, Dashboard, Edição, Upload S3).

---

## 2. Backlog e Próximos Passos (Ordem de Execução)

A Homepage está pronta. A próxima IA deve seguir esta ordem:

### 2.1. Página de Arquivo (`/artigos`) - **PRIORIDADE 1**
* **Status:** Código base gerado.
* **A fazer:** Validar paginação visual e integração com `getAllPosts`.

### 2.2. Página de Categoria Dinâmica (`/categoria/[slug]`) - **PRIORIDADE 2**
* **A fazer:** Criar rota dinâmica, consumir endpoint `/categoria/{slug}` e implementar Hero com ícone.
* **Slugs Oficiais:** `inteligencia-artificial`, `cloud-computing`, `devops-automacao`, `seguranca-na-nuvem`, `engenharia-de-software`, `noticias-e-mercado`.

### 2.3. Página "O Projeto" (`/o-projeto`)
* **Requisitos:** Implementar a timeline vertical (CSS específico).

### 2.4. Ajustes no Admin (CMS)
* **Ação:** Atualizar o `<select>` de categorias no `admin/src/views/Editor.vue` para usar os **Slugs Oficiais** acima.

---

## 3. Procedimentos Operacionais Padrão (SOP)

**Atenção Crítica:** O Turbopack é sensível. Siga estes passos para limpar o ambiente se ocorrerem erros de "panic".

### 3.1. Limpeza de Cache (Panic Fix)
```bash
rm -rf frontend/.next
npm run dev
```

### 3.2. Deploy Manual do Frontend (Procedimento Crítico)
```bash
cd frontend
npm run build:open
# O ZIP deve ser criado DENTRO da pasta default, NÃO da raiz:
cd .open-next/server-function/default
zip -r ../../../../infra/builds/nextjs.zip .
cd ../../../..
# Sync de Assets:
aws s3 sync frontend/.open-next/assets s3://[BUCKET_ASSETS] --profile dev
# Atualizar Lambda:
cd infra
terraform apply -var-file="env/dev.tfvars" -auto-approve
```

---

## 4. Notas Finais para a IA
* **Estilo Visual:** Sempre consulte `frontend/app/globals.css` antes de criar novos estilos. A consistência com o protótipo (Space Grotesk, Cores) é prioridade.
* **Imagens:** O CloudFront serve imagens via `/media/*`. Se uma imagem não carregar, verifique se a URL no banco começa com `media/` ou é absoluta. O `PostCard` trata ambos, mas a variável `NEXT_PUBLIC_MEDIA_URL` deve estar correta.
* **CORS no Admin:** Se tiver problemas de "Network Error" no Admin, verifique se a Lambda `adminPosts` está retornando os headers CORS explicitamente no bloco `catch`.