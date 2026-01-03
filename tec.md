Relatório Técnico de Engenharia: Blog Marcelo Gonçalves
Data: 23 de Novembro de 2025 Status: Fases 1 e 2 Completas. Fase 3 em Andamento. Arquitetura: Serverless AWS (Headless) Gerenciamento: Terraform (IaC)

1. Visão Geral da Arquitetura (O "Estado da Arte")
O projeto é um Monorepo dividido em 4 camadas principais. A infraestrutura é totalmente desacoplada do código.

1.1. Estrutura de Diretórios
Plaintext

marcelogoncalves-tech/
├── infra/                  # Terraform (Gerencia toda a AWS)
│   ├── modules/            # Módulos: api_gateway, cognito, dynamodb, frontend, admin, media, lambda
│   ├── builds/             # Artefatos .zip gerados pelo build do backend/frontend
│   └── env/                # Variáveis por ambiente (dev.tfvars)
├── backend/                # Lógica de Negócio (Lambdas Node.js 20 + TypeScript)
│   ├── src/functions/      # Endpoints isolados
│   └── build.js            # Script de Build Customizado (Crítico)
├── frontend/               # Blog Público (Next.js 15 + OpenNext v3)
├── admin/                  # CMS Interno (Vue.js 3 + Vite + Amplify)
└── blueprint-v1.7.md       # FONTE ÚNICA DA VERDADE (Regras de Negócio e Schema)
2. Status dos Componentes e Decisões Técnicas
2.1. Infraestrutura (Terraform)
Estado: Local (na máquina do Marcelo).

Módulos Críticos:

frontend: Configura S3 + CloudFront + Lambda URL.

Atenção: O CloudFront NÃO repassa o header Host para a Lambda (correção de erro 403).

Atenção: A rota /media/* no CloudFront aponta direto para o S3 (para servir imagens de upload), ignorando o Next.js.

api_gateway: REST API regional. Possui um Authorizer (CognitoAuthorizer) para rotas /admin/*.

media: Bucket S3 com CORS habilitado e Trigger para Lambda imageProcessor.

2.2. Backend (Lambdas)
Runtime: Node.js 20.

Build System (backend/build.js): Script customizado usando esbuild.

Formato: Força format: 'cjs' (CommonJS) para compatibilidade com Lambda.

Sharp.js: A função imageProcessor instala binários nativos Linux x64 durante o build. Não alterar essa lógica.

Endpoints Ativos:

getPost, getPosts, getAuthor (Públicos).

adminPosts (CRUD Protegido + CORS Options).

mediaUpload (Gera Presigned URLs S3).

imageProcessor (Trigger S3 -> Redimensiona para 1280px WebP).

2.3. Frontend Público (Next.js)
Versão: Next.js 15 (App Router).

Engine: OpenNext v3.

Deploy Manual (Procedimento Crítico):

O build (npm run build:open) gera a pasta .open-next/server-function/default.

O ZIP deve ser criado a partir de dentro da pasta default, não da pasta pai. O index.mjs deve estar na raiz do ZIP.

Estilização: CSS Puro (globals.css). Tailwind foi removido.

O CSS Global foi totalmente refatorado para fidelidade ao protótipo (Fontes Space Grotesk, Cores --aws-orange, Grid de 3 colunas).

Breaking Change Next.js 15: Em page.tsx, params é uma Promise. O código já usa await params.

2.4. Frontend Admin (Vue.js)
Stack: Vue 3, Vite, Pinia, AWS Amplify.

Auth: Conectado ao User Pool do Cognito (usuário admin criado manualmente via CLI).

Funcionalidades Prontas: Login, Dashboard (Listagem), Criação/Edição de Posts, Upload de Imagem (Direct to S3).

3. Procedimentos Operacionais Padrão (SOP)
A nova IA deve seguir estes comandos para deploy e manutenção.

Para Atualizar o Backend (API/Lambdas):
Bash

cd backend
npm run build  # Gera os ZIPs em infra/builds/
cd ../infra
terraform apply -var-file="env/dev.tfvars" -auto-approve
Para Atualizar o Frontend Público (Next.js):
Bash

cd frontend
npm run build:open
cd .open-next/server-function/default
zip -r ../../../../infra/builds/nextjs.zip .  # Zipa o conteúdo correto
cd ../../../.. # Volta à raiz
# Sync Assets
aws s3 sync frontend/.open-next/assets s3://[OUTPUT_BUCKET_FRONTEND] --profile dev
# Apply Infra (Atualiza código Lambda)
cd infra
terraform taint module.frontend.aws_lambda_function.nextjs_server # Força update
terraform apply -var-file="env/dev.tfvars" -auto-approve
Para Atualizar o Admin (Vue.js):
Bash

cd admin
npm run build
cd ..
aws s3 sync admin/dist s3://[OUTPUT_BUCKET_ADMIN] --profile dev
4. Backlog Restante (O Que Falta Fazer)
Estamos no meio da Fase 3. A Homepage ainda não pronta (Layout, Header, Footer, Grid de Posts) e ainda faltam as outras páginas públicas.

Próximas Tarefas da IA:
Página de Arquivo (/artigos):

Criar frontend/app/artigos/page.tsx.

Implementar paginação (botões Anterior/Próximo) usando o nextToken da API getPosts.

Reutilizar o componente PostCard.

Página de Categoria (/categoria/[slug]):

Criar rota dinâmica.

Filtrar posts pela categoria.

Adicionar Hero específico da categoria (ícone + descrição).

Página "O Projeto" (/o-projeto):

Implementar a Timeline (CSS específico necessário).

Consumir a API com filtro e_projeto=1.

Página "Serviços" (/servicos):

Página estática com CTAs de conversão.

Busca (/busca):

Implementar barra de busca funcional.

Criar página de resultados que consome a API com filtro ?q=....

CI/CD (Fase 4):

Automatizar todos os procedimentos manuais da Seção 3 usando GitHub Actions.

5. Notas Finais para a IA
Estilo Visual: Sempre consulte o arquivo frontend/app/globals.css antes de criar novos estilos. A consistência com o protótipo (cores, fontes Space Grotesk) é prioridade máxima.

Imagens: O CloudFront serve imagens via /media/*. Se uma imagem não carregar, verifique se o caminho no banco começa com media/ ou se é uma URL completa.

CORS: Se tiver problemas de Network Error no Admin, verifique se a Lambda adminPosts está retornando os headers CORS no bloco catch. Já corrigimos isso uma vez.

O projeto está estável. Pode prosseguir com a criação das páginas restantes.