# Relatório Técnico de Handover: Blog Marcelo Gonçalves
**Versão:** 4.0 (Frontend Público Finalizado)
**Data:** 05 de Dezembro de 2025
**Status:** Finalizar fase 3 (Frontend). Foco atual: Finalizar Página de Padrão de Post,Refinamento Visual e Finalização do Admin.
**Arquitetura:** Serverless AWS (Headless) | **IaC:** Terraform | **Frontend:** Next.js 15 (OpenNext)

---

## 0. 🚨 Onboarding Crítico (Leia Antes de Codar)

Se você é uma IA ou desenvolvedor assumindo este projeto, **LEIA ESTES ARQUIVOS PRIMEIRO**.

### 0.1. Arquivos de Contexto Obrigatório
1.  **`blueprint-v1.7.md`**: A "Bíblia" do projeto (Schema, Regras de Negócio, Rotas).
2.  **`frontend/app/globals.css`**: A **Fonte da Verdade Visual**. Contém toda a estrutura CSS (Grids, Timeline, Bio, Tipografia) e os estilos de componentes.
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
│   ├── app/                # App Router (globals.css, layout.tsx, page.tsx, etc.)
│   └── lib/api.ts          # Cliente API
└── admin/                  # CMS Interno (Vue.js 3 + Vite + Amplify)
```

---

## 1. Status Técnico Atual (O Que Está Pronto)

### 1.1. Frontend Público (Next.js 15) - **100% IMPLEMENTADO**
* **Páginas Criadas:**
    * Home (`/`)
    * Artigos (`/artigos`)
    * Busca (`/busca`)
    * Categoria Dinâmica (`/categoria/[slug]`)
    * O Projeto (Timeline) (`/o-projeto`)
    * Sobre (`/sobre`)
    * Serviços (`/servicos`)
    * Post Padrão (`/post/[slug]`)
    * 404 (`/not-found`)
* **Componentes Chave:**
    * **`Header.tsx`:** Client Component inteligente (destaque de link ativo + menu mobile).
    * **`NewsletterCTA.tsx`:** Componente reutilizável de captura de leads.
    * **`AdSenseBanner.tsx`:** Versão limpa (sólida), sem bordas tracejadas.
* **Estilização:** CSS Puro padronizado em `globals.css`. Design System completo (Cores, Tipografia, Espaçamentos).

### 1.2. Backend & Infraestrutura
* **Rotas API Gateway:** Todas as rotas públicas configuradas (`/busca`, `/projeto`, `/posts/*`, `/artigos`, `/categoria/*`).
* **Lambdas:**
    * **`getPosts`:** Atualizada com lógica de busca (`Scan` case-insensitive), paginação e ordenação ascendente para a Timeline (`/projeto`).
    * **`getPost`:** Corrigido erro crítico de apontamento de ZIP no Terraform (`main.tf` do módulo lambda).
* **Correções Críticas:** O CloudFront não repassa o header `Host` (fix 403), e o CORS está configurado para o Admin.

---

## 2. Backlog Prioritário (Ordem de Execução)

A próxima IA deve focar **exclusivamente** nestes itens para fechar o projeto:

### 2.1. Refinamento Visual Global (Polimento) - **PRIORIDADE 1**
* **Padronização de Espaçamento:** Revisar o `globals.css` para garantir que o ritmo vertical (margens entre seções) seja consistente em todas as páginas (validar margens de 60px/80px).
* **Responsividade Fina:** Testar o comportamento de quebra de grids (3 colunas -> 1 coluna) em tablets e garantir que o menu mobile feche ao clicar.

### 2.2. Finalização do CMS Admin (`/admin`) - **PRIORIDADE 2**
O Admin em Vue.js existe, mas o **Editor de Postagens** precisa ser finalizado.
* **Ferramenta de Escrita:** Integrar uma lib de Rich Text (como **Quill** ou **Tiptap**) no campo `conteudo_html` do Vue.
* **Metadados:** Conectar os campos de SEO (Título Meta, Descrição Meta, Alt Text) ao formulário de criação/edição e garantir que a Lambda `adminPosts` salve esses dados no DynamoDB.
* **Categorias:** Atualizar o `<select>` de categorias no `Editor.vue` para usar os **slugs oficiais** definidos no Frontend (`tutoriais-aws`, `ia-generativa`, etc.).

### 2.3. Fase 4: Pipeline de Produção (CI/CD)
* **GitHub Actions:** Configurar o pipeline para deploy automático em `prod` após merge na `main` (com aprovação manual via OIDC).

---

## 3. Notas Técnicas para a IA (Decisões de Design)

### 3.1. Arquitetura CSS (Importante)
* **Timeline Vertical (`/o-projeto`):** Implementada usando **CSS Grid** com 2 colunas e `display: contents` nos itens filhos para alinhamento sem hacks.
    * **Atenção:** Os banners AdSense dentro desta página usam um wrapper especial (`.timeline-banner-wrapper`) para ficarem fora do grid mas visualmente alinhados com o texto.
* **Página de Post (`/post/[slug]`):** Utiliza layout centralizado (`text-align: center` no header) com fundo limpo (sem cinza). O corpo do texto (`.article-body`) tem tipografia rica para H2, H3, listas e código.
* **Página Sobre (`/sobre`):** Utiliza layout flutuante (`float: left` no desktop) para a biografia, garantindo o "abraço" do texto na imagem.

### 3.2. Procedimentos de Deploy
* **Frontend:** Sempre rodar `npm run build:open` e zipar a pasta `.open-next/server-function/default`.
* **Backend:** Sempre rodar `node backend/build.js` antes do Terraform.