### 0. Instruções para a IA de Engenharia (Como Usar Este Documento)

**Seu Papel:** Você é um Engenheiro de Software Sênior e especialista em DevOps. Seu trabalho **não** é construir o projeto inteiro de uma vez. Seu trabalho é atuar como meu **programador par (pair programmer)**.

**Meu Papel:** Eu sou o Arquiteto e o Gerente de Projeto (Marcelo). Eu vou orquestrar o processo.

**Como Vamos Trabalhar:**

1.  **O Blueprint é a nossa "Memória":** Este documento é a nossa "fonte única da verdade" e o nosso contexto de longo prazo. Você deve usá-lo como **referência**, não como um *prompt* único.
2.  **Trabalho Tarefa por Tarefa:** Eu vou lhe dar uma tarefa de cada vez (ex: "Gere o ficheiro Terraform para o DynamoDB", "Gere o código para o *endpoint* `GET /post/{slug}`", "Gere o componente React `PostCard`").
3.  **Foco Absoluto:** Em cada pedido, foque *apenas* na tarefa solicitada. Não tente gerar outros ficheiros ou código não solicitado.
4.  **Consistência:** Use *exatamente* o Stack Tecnológico (Parte 2), o Modelo de Dados (Parte 3), o Design System (Parte 5) e o Contrato de API (Parte 6) definidos neste documento.

---
---

### 1. Visão Geral e Objetivos do Projeto (O "Porquê")

* **1.1. O Conceito**
    * Blog de **autoridade** focado em Inteligência Artificial, Engenharia de Software (MLOps, Automação) e Arquitetura de Nuvem (AWS).
    * Autor principal e especialista: **Marcelo Gonçalves**.
* **1.2. O Diferencial Estratégico (USP)**
    * **Narrativa Central:** O blog é um produto da IA, documentado na série "O Projeto".
    * **Mensagem de Marca:** "Um blog sobre IA, construído <span class='highlight'>quase</span> 100% com IA."
    * **O "Quase":** Representa a curadoria, personalização e direção estratégica do especialista humano (Marcelo), garantindo qualidade e E-E-A-T.
* **1.3. Objetivos Principais (ATUALIZADO)**
    * **Autoridade (SEO):** Estabelecer E-E-A-T (Experiência, Especialidade, Autoridade, Confiabilidade) através da Biografia do Autor e da série "O Projeto".
    * **Monetização:** Gerar receita via Google AdSense em todos os templates.
    * **Geração de Leads (NOVO):** Capturar clientes de consultoria através de CTAs estratégicos que levam à Página "Serviços" (ex: na Caixa do Autor, no final da página "O Projeto").
    * **Engajamento:** Capturar e reter usuários com conteúdo de alta qualidade, CTAs de Newsletter e recirculação de tráfego ("Populares", "Relacionados").

---
---

### 2. Stack Tecnológico e Princípios de Engenharia (O "Como")

A arquitetura do projeto é 100% Serverless na AWS e deve ser dividida em duas partes desacopladas (Headless): **Frontend** e **Backend (CMS)**.

#### 2.1. Infraestrutura e Orquestração
* **Nuvem:** **Amazon Web Services (AWS)**.
* **Infraestrutura como Código (IaC):** **Terraform**.

#### 2.2. Frontend (O Blog Público)
* **Framework:** **Next.js**.
* **Deploy:** O Next.js **não** será hospedado na Vercel ou Amplify. Ele deve ser implantado "na mão" (self-hosted) na infra AWS, usando **OpenNext**.
* **Infra do Frontend (via Terraform):** O Terraform deve criar:
    * **Amazon S3:** Para os *assets* estáticos.
    * **Amazon CloudFront:** Como CDN e ponto de entrada principal.
    * **AWS Lambda / Lambda@Edge:** Para executar as funções SSR/ISR do OpenNext.

#### 2.3. Backend (O CMS Customizado)
* **API:** **Amazon API Gateway** (REST API).
* **Lógica do Backend:** **AWS Lambda** (Node.js/TypeScript).
* **Banco de Dados:** **Amazon DynamoDB**.
* **Autenticação (Admin):** **Amazon Cognito** (User Pools).
* **Armazenamento de Mídia:** **Amazon S3** (bucket privado de uploads).
* **Processamento de Imagem (NOVO):** Uma **`ImageProcessorLambda`** (usando a biblioteca **Sharp.js**) acionada por eventos S3 para converter uploads para WebP.

#### 2.4. Princípios de Engenharia e Qualidade (Requisito Mandatório)
* **Segurança (Shift-Left):** Seguir o princípio do **Least Privilege** (Mínimo Privilégio) em todas as políticas de IAM do Terraform. O bucket S3 de mídia deve ser privado, acessível apenas via CloudFront (usando OAI/OAC).
* **Qualidade de Código:** O código (TypeScript/Terraform) deve ser limpo, modular, reutilizável (componentes React, módulos Terraform) e seguir os padrões da indústria (ESLint/Prettier).
* **SEO Técnico:** O frontend Next.js deve ser otimizado para **Core Web Vitals**. Imagens devem ser servidas em formatos modernos (WebP), usar `loading="lazy"`, e o SSR deve funcionar perfeitamente.

#### 2.5. Logging & Observabilidade (Requisito Mandatório)
* **Serviço:** **Amazon CloudWatch Logs**.
* **Formato:** Os logs das Lambdas (Backend e Frontend SSR) devem ser **Logs Estruturados (JSON)** para facilitar a consulta (CloudWatch Logs Insights).
* **Níveis:** Os níveis de log devem ser controlados por variáveis de ambiente do Terraform:
    * **Ambiente `dev`:** Nível `DEBUG`. Logar tudo. Retenção de 7 dias.
    * **Ambiente `prod`:** Nível `INFO`/`WARN`. Logar apenas eventos-chave e erros. Retenção de 30 dias.

#### 2.6. Ambientes (Requisito Mandatório)
* O projeto deve ter dois ambientes totalmente isolados: `dev` (desenvolvimento) e `prod` (produção).
* **Arquitetura AWS:** Cada ambiente deve ser implantado em uma **Conta AWS separada** para isolamento total de segurança e faturamento.
* **Gestão de Infra:** O Terraform deve gerenciar ambos os ambientes usando o mesmo código base, com ficheiros de variáveis (`.tfvars`) separados (ex: `env/dev.tfvars` e `env/prd.tfvars`).

#### 2.7. Design Responsivo (Mobile-First) (Requisito Mandatório)
* **Metodologia:** Todo o desenvolvimento de frontend (Next.js) e CSS **DEVE** seguir a metodologia **Mobile-First**.
* **Processo:** A IA engenheira deve escrever o CSS base para ecrãs pequenos (ex: 360px de largura) primeiro. O CSS para *tablets* e *desktops* deve ser adicionado *depois*, usando *media queries* com `(min-width: ...)` (ex: `min-width: 768px`).
* **Teste de Fluidez:** Todos os 9 templates de página e todos os componentes da Seção 5 (ex: `PostCard`, `AuthorBox`) devem ser 100% fluidos e legíveis, e devem "empilhar" (stack) verticalmente de forma limpa em ecrãs pequenos.

#### 2.8. Acessibilidade (a11y) (Requisito Mandatório)
* **Padrão:** O site deve seguir as diretrizes **WCAG 2.1 (Nível AA)**.
* **HTML Semântico:** A IA engenheira deve usar tags HTML semânticas (`<nav>`, `<main>`, `<aside>`, `<article>`, etc.) em vez de `<div>` genéricos.
* **ARIA:** Componentes interativos (como o Menu Mobile) devem usar atributos ARIA (ex: `aria-label`, `aria-expanded`) para serem compreensíveis por leitores de ecrã.
* **Navegação por Teclado:** Todos os elementos interativos (links, botões, formulários) devem ser 100% acessíveis via tecla "TAB" e devem ter um estado `:focus` visualmente claro (usar `outline: 2px solid var(--blue-600);`).
* **Contraste:** Todas as combinações de cores de texto/fundo devem passar nos testes de contraste AA.
---
---

### 3. Modelo de Dados (O "Cérebro")

Definição das tabelas e índices no **Amazon DynamoDB**. (ATUALIZADO v1.2)

#### 3.1. Tabela 1: `Posts`
* **Propósito:** Armazena todo o conteúdo principal do blog.
* **Chave Primária (PK):** `slug` (string) (Ex: "como-construir-um-rag-serverless")
* **Atributos:**
    * `titulo` (string)
    * `conteudo_html` (string)
    * `resumo` (string)
    * `imagem_destaque_url` (string)
    * `imagem_destaque_alt_text` (string) **(Acessibilidade)**
    * `categoria_slug` (string)
    * `autor_id` (string)
    * `status` (string): (Valores: "Publicado", "Rascunho", "Programado")
    * `data_publicacao` (string): (ISO 8601)
    * `data_atualizacao` (string): (ISO 8601)
    * `data_publicacao_programada` (string, opcional)
    * `tempo_leitura_min` (number)
    * `e_popular` (boolean): (true/false)
    * `e_projeto` (boolean): (true/false)
    * `meta_titulo_seo` (string, opcional) **(NOVO - SEO)**
    * `meta_descricao_seo` (string, opcional) **(NOVO - SEO)**

#### 3.2. Índices Secundários Globais (GSIs) da Tabela `Posts`
* **GSI 1: `StatusPorData`** (Alimenta `/artigos` e `Homepage/Recentes`)
    * **PK:** `status`
    * **SK:** `data_atualizacao` (Ordenação descendente)
* **GSI 2: `CategoriaPorData`** (Alimenta `/categoria/[slug]`)
    * **PK:** `categoria_slug`
    * **SK:** `data_atualizacao` (Ordenação descendente)
* **GSI 3: `ProjetoPorData`** (Alimenta `/o-projeto`)
    * **PK:** `e_projeto` (Número: `1` para true)
    * **SK:** `data_publicacao` (Ordenação **ascendente** - para a timeline)
* **GSI 4: `PopularesPorData`** (Alimenta seções "Populares")
    * **PK:** `e_popular` (Número: `1` para true)
    * **SK:** `data_atualizacao` (Ordenação descendente)
* **GSI 5: `StatusProgramadoPorData`** (Alimenta a Lambda de Agendamento)
    * **PK:** `status` (para buscar `status="Programado"`)
    * **SK:** `data_publicacao_programada` (para buscar por data/hora)

#### 3.3. Tabela 2: `Autores`
* **Propósito:** Armazena dados do autor para E-E-A-T.
* **Chave Primária (PK):** `autor_id` (string) (Ex: "marcelo-goncalves")
* **Atributos:**
    * `nome_exibicao` (string): "Marcelo Gonçalves"
    * `bio` (string): (O texto completo da biografia v2)
    * `foto_avatar_url` (string)
    * `foto_avatar_alt_text` (string) **(Acessibilidade)**
    * `linkedin_url` (string)
    * `github_url` (string)
    * `instagram_url` (string, opcional)

#### 3.4. Tabela 3: `Categorias`
* **Propósito:** Alimenta os 6 cards da home e as páginas de categoria (para SEO).
* **Chave Primária (PK):** `categoria_slug` (string) (Ex: "tutoriais-aws")
* **Atributos:**
    * `nome_exibicao` (string): "Tutoriais AWS"
    * `descricao_seo` (string): "Guias práticos e tutoriais passo a passo..."
    * `icone_fa` (string): "fa-solid fa-cloud"

---
---
### 4. Arquitetura da Informação e Fluxo de Navegação (O "Mapa")

#### 4.1. Mapa de Templates (10 Páginas Aprovadas - ATUALIZADO)
1.  **Homepage** (`/`) - (v1.4)
2.  **Página de Post Padrão** (`/post/[slug]`) - (v1.9, com CTA de Serviços)
3.  **Página da Série "O Projeto"** (`/o-projeto`) - (v1.3, com CTA de Serviços)
4.  **Página de Arquivo (Todos os Artigos)** (`/artigos`) - (v1.1)
5.  **Página de Categoria** (`/categoria/[slug]`) - (v1.0)
6.  **Página "Sobre"** (`/sobre`) - (v1.3, com CTA de Serviços)
7.  **Página de Resultados de Busca** (`/busca`) - (v1.0)
8.  **Página "Newsletter"** (`/newsletter`) - (v1.0)
9.  **Página 404** (Não Encontrado) - (v1.1)
10. **Página "Serviços" (NOVO)** (`/servicos`) - (v1.2)

#### 4.2. Elementos Persistentes (Header/Footer - ATUALIZADO)
* **Header:** (Logo, Home, Artigos, O Projeto, **Serviços**, Sobre) - Links devem apontar para os templates da Seção 4.1.
* **Footer:** (Links de Categoria, Links Rápidos, Sociais) - Links devem apontar para os templates da Seção 4.1.

#### 4.3. Fluxos de Usuário Detalhados (ATUALIZADO)
* **Da `Homepage`:**
    * `Link "Serviços" (Header)` -> `Página "Serviços"`.
    * `Botão Hero` -> `Página de Arquivo`.
    * `Link "Ver todos os artigos →"` -> `Página de Arquivo`.
    * `Botão "Conheça 'O Projeto'"` -> `Página "O Projeto"`.
    * `Cards de Post` -> `Página de Post Padrão`.
    * `Cards de Categoria` (6) -> `Página de Categoria` correspondente.
    * `Botão CTA` -> `Página "Newsletter"`.
* **Da `Página de Post Padrão`:**
    * `Link "Serviços" (Header)` -> `Página "Serviços"`.
    * `Link CTA na Caixa do Autor` -> `Página "Serviços"`.
    * `Link da Tag/Categoria` (no Hero) -> `Página de Categoria` correspondente.
    * `Links Tabela de Conteúdo` -> Âncoras (`#id`) na mesma página.
    * `Cards de Post` (Populares) -> `Página de Post Padrão`.
* **Da `Página "O Projeto"`:**
    * `Link "Serviços" (Header)` -> `Página "Serviços"`.
    * `Botão CTA "Agendar Chamada"` (no final) -> `Página "Serviços"`.
    * `Links da Timeline` (Parte 1...) -> `Página de Post Padrão` correspondente.
    * `Links de Paginação` -> Mesma página (`/o-projeto/pagina/2`).
* **Da `Página de Artigos`:**
    * `Link "Serviços" (Header)` -> `Página "Serviços"`.
    * `Formulário de Busca` -> `Página de Resultados de Busca`.
    * `Cards de Post` -> `Página de Post Padrão`.
    * `Links de Paginação` -> Mesma página (`/artigos/pagina/2`).
* **Da `Página de Categoria`:**
    * `Link "Serviços" (Header)` -> `Página "Serviços"`.
    * `Cards de Post` -> `Página de Post Padrão`.
    * `Links de Paginação` -> Mesma página (`/categoria/[slug]/pagina/2`).
* **Da `Página "Sobre"`:**
    * `Link "Serviços" (Header)` -> `Página "Serviços"`.
    * `Botão CTA "Veja Meus Serviços"` -> `Página "Serviços"`.
    * `Botão "Acompanhe a jornada"` -> `Página "O Projeto"`.
    * `Cards de Post` (Populares) -> `Página de Post Padrão`.
* **Da `Página "Serviços"` (NOVO):**
    * `Link "Serviços" (Header)` -> `Página "Serviços"`.
    * `Botão "Conheça 'O Projeto'"` -> `Página "O Projeto"`.
    * `Botão CTA "Agendar Chamada"` (no final) -> `Página "Serviços"` (ou link externo de agendamento).
* **De todas as outras páginas (`Busca`, `Newsletter`, `404`):**
    * `Link "Serviços" (Header)` -> `Página "Serviços"`.

---
---

### 5. Design System e Componentes Reutilizáveis (O "Design")

Define os componentes de UI atómicos (React) que a IA engenheira deve construir primeiro. (Usando `~~~` para escapar os blocos de código).

#### 5.1. Paleta de Cores (Variáveis CSS Globais)
~~~css
:root {
    --aws-dark: #232F3E;
    --aws-orange: #FF9900;
    --gray-100: #f5f5f5;
    --gray-800: #2D3748;
    --blue-600: #3182CE;
    --gray-light: #f8fafc; /* ATUALIZADO */
    --gray-border: #e0e0e0; /* ATUALIZADO */
    --gray-text: #555; /* ATUALIZADO */
    --bg-light-gradient: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}
.highlight { color: var(--aws-orange); }
~~~

#### 5.2. Tipografia
* **Títulos:** `Space Grotesk` (Google Fonts)
* **Corpo:** `Inter` (Google Fonts)

#### 5.3. Iconografia
* **Fonte:** `FontAwesome` (v6.x)

#### 5.4. Componente: `PostCard`
* **Uso:** `Homepage`, `Página de Artigos`, `Página de Categoria`, etc.
* **CSS (Mobile-First ATUALIZADO):**
    ~~~css
    .post-card { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.05); display: flex; flex-direction: column; }
    .post-image { height: 200px; background-color: #eee; background-size: cover; background-position: center; }
    .post-content { padding: 25px; flex-grow: 1; display: flex; flex-direction: column; }
    .post-tag { display: inline-block; padding: 5px 10px; background-color: var(--aws-orange); color: white; border-radius: 4px; font-size: 0.8rem; margin-bottom: 10px; align-self: flex-start; }
    .post-card h3 { font-size: 1.3rem; margin-bottom: 10px; color: var(--aws-dark); font-family: 'Space Grotesk', sans-serif; }
    .post-card h3 a { color: inherit; text-decoration: none; }
    .post-card h3 a:hover { color: var(--aws-orange); }
    /* ATUALIZADO: Resumo oculto no mobile */
    .post-card p { color: #666; margin-bottom: 15px; flex-grow: 1; display: none; }
    .read-more { color: var(--aws-orange); text-decoration: none; font-weight: 500; }
    .posts-grid { display: grid; grid-template-columns: 1fr; gap: 30px; }

    @media (min-width: 768px) {
        .posts-grid { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
        /* ATUALIZADO: Resumo re-exibido no desktop */
        .post-card p { display: block; }
    }
    ~~~

#### 5.5. Componente: `Pagination`
* **Uso:** `Página de Artigos`, `Página de Categoria`, `Página "O Projeto"`, `Página de Busca`.
* **CSS (ATUALIZADO):**
    ~~~css
    .pagination { 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        gap: 10px; 
        margin-top: 60px;
        /* ATUALIZADO: Impede que os botões "encavalem" em telas pequenas */
        flex-wrap: wrap; 
    }
    .page-numbers { font-family: 'Space Grotesk', sans-serif; font-weight: 600; text-decoration: none; color: var(--gray-800); padding: 10px 15px; border: 1px solid #e0e0e0; border-radius: 6px; transition: all 0.3s; }
    .page-numbers:hover { background-color: #f8fafc; border-color: #ccc; }
    .page-numbers.current { background-color: var(--aws-orange); color: white; border-color: var(--aws-orange); }
    .page-numbers.dots { border: none; padding: 10px 5px; }
    ~~~

#### 5.6. Componente: `Buttons`
* **Uso:** Em todo o site.
* **CSS:**
    ~~~css
    .btn { display: inline-block; padding: 12px 30px; background-color: var(--aws-orange); color: var(--aws-dark); border-radius: 6px; text-decoration: none; font-weight: 600; transition: all 0.3s; }
    .btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255, 153, 0, 0.2); color: var(--aws-dark); background-color: #e68a00; }
    .btn-outline { background-color: transparent; border: 2px solid white; color: white; display: inline-block; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; transition: all 0.3s; }
    .btn-outline:hover { background-color: white; color: var(--aws-dark); box-shadow: none; transform: translateY(-3px); }
    .btn-outline-dark { background-color: transparent; border: 2px solid var(--aws-dark); color: var(--aws-dark); display: inline-block; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; transition: all 0.3s; }
    .btn-outline-dark:hover { background-color: var(--aws-dark); color: white; transform: translateY(-3px); }
    ~~~

#### 5.7. Componente: `AuthorBox` (ATUALIZADO)
* **Uso:** `Página de Post Padrão`.
* **Nota de Implementação (CRÍTICA):** O texto da biografia (`<p>`) dentro deste componente deve ser preenchido dinamicamente (via `GET /autor/{id}`) e deve ser programado para **incluir um link CTA para a `Página "Serviços"`**, como definido na Seção 4.3 (ex: "...*Precisa de um especialista? <a href='/servicos'>Clique aqui</a>.*").
* **CSS:**
    ~~~css
    .author-box { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 20px; margin-top: 60px; padding-top: 40px; border-top: 1px solid #e0e0e0; }
    .author-avatar { width: 80px; height: 80px; border-radius: 50%; background-color: #e0e0e0; flex-shrink: 0; }
    .author-info h4 { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; color: var(--aws-dark); margin-top: 0; margin-bottom: 5px; }
    .author-info p { font-size: 0.95rem; color: #666; margin-bottom: 15px; line-height: 1.5; }
    .author-info p a { color: var(--blue-600); text-decoration: underline; font-weight: 500; }
    .author-info p a:hover { color: var(--aws-dark); }
    .author-social { display: flex; justify-content: center; gap: 20px; }
    .author-social a { color: var(--gray-800); font-size: 1.5rem; text-decoration: none; transition: color 0.3s; }
    .author-social a:hover { color: var(--aws-orange); }

    @media (min-width: 768px) {
        .author-box { flex-direction: row; align-items: flex-start; text-align: left; gap: 25px; }
        .author-social { justify-content: flex-start; }
    }
    ~~~

#### 5.8. Componente: `TOCBox` (Tabela de Conteúdo)
* **Uso:** `Página de Post Padrão`.
* **CSS (ATUALIZADO):**
    ~~~css
    .toc-box { background-color: #f8fafc; border: 1px solid #e0e0e0; border-left: 4px solid var(--aws-orange); border-radius: 8px; padding: 20px; margin: 30px 0; }
    .toc-box h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; color: var(--aws-dark); margin-top: 0; margin-bottom: 15px; }
    .toc-box ol { padding-left: 20px; margin-bottom: 0; }
    .toc-box ol li { margin-bottom: 10px; font-size: 1rem; }
    .toc-box ol li a { text-decoration: none; color: var(--blue-600); border-bottom: none; }
    .toc-box ol li a:hover { color: var(--aws-dark); text-decoration: underline; }
    .toc-box ol ul { padding-left: 20px; margin-top: 10px; }
    ~~~

#### 5.9. Componente: `AdSenseBlock` (Placeholders)
* **Uso:** `Homepage`, `Página de Post Padrão`, `Página de Artigos`, `Página de Categoria`, `Página de Busca`.
* **Estratégia de Frontend (Next.js):** Este componente **não** deve carregar o script do AdSense de forma síncrona. Ele deve usar o componente `<Script>` do Next.js com a estratégia `strategy="lazyOnload"` para evitar o bloqueio da renderização e proteger os Core Web Vitals. O CSS abaixo é usado para que o componente *reserve* o espaço do anúncio (ex: 90px de altura) *antes* que o anúncio carregue, prevenindo o Cumulative Layout Shift (CLS).
* **CSS (Simplificado):**
    ~~~css
    /* ATUALIZADO: Classe unificada para Leaderboards */
    .adsense-placeholder {
        width: 100%;
        max-width: 728px;
        height: 90px;
        background-color: #e0e0e0;
        border: 2px dashed var(--gray-800);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        color: var(--gray-800);
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 500;
        /* border-radius: 8px; (Removido para consistência) */
        font-size: 0.9rem;
    }
    
    .adsense-placeholder-box {
        width: 300px;
        height: 250px;
        background-color: #e0e0e0;
        border: 2px dashed var(--gray-800);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        color: var(--gray-800);
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 500;
        /* border-radius: 8px; (Removido para consistência) */
    }
    ~~~

#### 5.10. Componente: `Header/Navbar` (ATUALIZADO)
* **Uso:** Em todas as páginas (Elemento Persistente).
* **HTML (ATUALIZADO):**
    ~~~html
    <header>
        <nav class="navbar">
            <a href="/" class="logo">Marcelo<span>Gonçalves</span></a>
            
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/artigos">Artigos</a>
                <a href="/o-projeto">O Projeto</a>
                <a href="/servicos" style="color: var(--aws-orange); font-weight: 600;">Serviços</a>
                <a href="/sobre">Sobre</a>
            </div>
            
            <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Abrir menu de navegação" aria-expanded="false" aria-controls="mobileMenu">
                <i class="fas fa-bars" aria-hidden="true"></i>
            </button>
            
            <div class="mobile-menu" id="mobileMenu">
                <a href="/">Home</a>
                <a href="/artigos">Artigos</a>
                <a href="/o-projeto">O Projeto</a>
                <a href="/servicos" style="color: var(--aws-orange); font-weight: 600;">Serviços</a>
                <a href="/sobre">Sobre</a>
            </div>
        </nav>
    </header>
    ~~~
* **CSS (Mobile-First ATUALIZADO):**
    ~~~css
    /* --- Header (Mobile-First) --- */
    header { 
        background-color: white; 
        box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        position: sticky; 
        top: 0; 
        z-index: 100; 
        padding: 0 20px; /* Padding mobile */
    }
    .navbar { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        padding: 20px 0; 
        max-width: 1200px; 
        margin: 0 auto; 
        position: relative; 
    }
    .logo { 
        font-family: 'Space Grotesk', sans-serif; 
        font-weight: 700; 
        font-size: 1.5rem; /* Tamanho mobile */
        color: var(--aws-dark); 
        text-decoration: none; 
    }
    .logo span { 
        color: var(--aws-orange); 
    }
    
    /* Menu Desktop escondido por padrão */
    .nav-links { 
        display: none; 
    }
    
    /* Botão Hambúrguer visível por padrão */
    .mobile-menu-btn { 
        display: block; 
        background: none; 
        border: none; 
        color: var(--aws-dark); 
        font-size: 24px; 
        cursor: pointer; 
    }
    
    /* Menu Mobile (Full-width) */
    .mobile-menu { 
        display: none; 
        position: absolute; 
        top: 100%; 
        right: -20px; 
        left: -20px;
        background: white; 
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        border-top: 1px solid var(--gray-border);
        z-index: 1000;
    }
    .mobile-menu.active { 
        display: block; 
    }
    .mobile-menu a { 
        display: block; 
        padding: 15px 20px; 
        text-decoration: none; 
        color: var(--gray-dark);
        font-weight: 500;
        border-bottom: 1px solid var(--gray-border);
    }
    .mobile-menu a:last-child {
        border-bottom: none;
    }
    .mobile-menu a:hover { 
        background: var(--gray-light); 
        color: var(--aws-orange); 
    }

    /* --- Media Query (Desktop) --- */
    @media (min-width: 768px) {
        header { 
            padding: 0 25px; /* Padding desktop */
        }
        .navbar { 
            padding: 20px 0; 
        }
        .logo {
            font-size: 1.8rem; /* Tamanho desktop */
        }
        
        /* Mostra o menu desktop */
        .nav-links { 
            display: flex; 
            gap: 30px; 
        }
        .nav-links a {
            text-decoration: none;
            color: var(--gray-800);
            font-weight: 500;
            transition: color 0.3s;
        }
        .nav-links a:hover {
            color: var(--aws-orange);
        }
        
        /* Esconde o menu mobile */
        .mobile-menu-btn { 
            display: none; 
        }
        .mobile-menu { 
            display: none !important; 
        }
    }
    ~~~
* **JavaScript (Para o Menu Mobile):**
    ~~~javascript
    // Menu Mobile
    document.addEventListener('DOMContentLoaded', () => {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                const isExpanded = mobileMenu.classList.toggle('active');
                mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
                mobileMenuBtn.setAttribute('aria-label', isExpanded ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
            });
            
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    mobileMenuBtn.setAttribute('aria-label', 'Abrir menu de navegação');
                });
            });
        }
    });
    ~~~

#### 5.11. Componente: `SkipLink` (Acessibilidade)
* **Uso:** Em todas as páginas, como o primeiro elemento focável.
* **Objetivo:** Permite que usuários de teclado pulem a navegação e vão direto para o conteúdo (`<main>`). O link deve estar visualmente oculto até receber `:focus`.
* **CSS (ATUALIZADO):**
    ~~~css
    .skip-link {
        position: absolute;
        left: 20px; 
        top: -60px; /* Posição inicial (fora da tela) */
        
        background: var(--aws-orange);
        color: var(--aws-dark);
        padding: 10px 15px;
        border-radius: 6px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        text-decoration: none;
        font-weight: 600;
        z-index: 9999;
        
        opacity: 0;
        transition: top 0.3s ease-out, opacity 0.3s ease-out;
    }
    .skip-link:focus {
        top: 20px; /* Posição final (visível) */
        opacity: 1; 
    }
    ~~~
* **HTML (a ser colocado logo após o `<body>`):**
    ~~~html
    <a href="#main-content" class="skip-link">Pular para o Conteúdo Principal</a>
    
    <main id="main-content">
        </main>
    ~~~

---
---

### 6. Contrato da API (A "Ponte")

Define a API REST que o Backend (Lambda) deve prover e o Frontend (Next.js) deve consumir. (ATUALIZADO v1.2)

**URL Base da API (por ambiente):**
* `dev`: `https://api-dev.marcelogoncalves.tech/v1`
* `prod`: `https://api.marcelogoncalves.tech/v1`

#### 6.1. 🌍 API Pública (Read-Only / Auth: None)

* **`GET /posts/recentes`**: Retorna os 3 posts (GSI `StatusPorData`, `Limit=3`).
    * **Resposta:** `{ "posts": [...] }`
* **`GET /posts/populares`**: Retorna os 3 posts (GSI `PopularesPorData`, `Limit=3`).
    * **Resposta:** `{ "posts": [...] }`
* **`GET /post/{slug}`**: Retorna o JSON completo de 1 post (`GetItem` `Posts`).
    * **Resposta:** `{ "post": {...} }`
* **`GET /autor/{id}`**: Retorna o JSON de 1 autor (`GetItem` `Autores`).
    * **Resposta:** `{ "autor": {...} }`
* **`GET /categorias`**: Retorna todas as categorias (da tabela `Categorias`).
    * **Resposta:** `{ "categorias": [...] }`
* **`GET /artigos`**: Paginado (GSI `StatusPorData`, `Limit=9`).
    * **Query Params:** `?nextToken=...`
    * **Resposta:** `{ "posts": [...], "nextToken": "..." }`
* **`GET /categoria/{slug}`**: Paginado (GSI `CategoriaPorData`, `Limit=9`).
    * **Query Params:** `?nextToken=...`
    * **Resposta (ATUALIZADA):** `{ "categoria": {...}, "posts": [...], "nextToken": "..." }`
* **`GET /projeto`**: Paginado (GSI `ProjetoPorData`, `Limit=5`, Ordem **Ascendente**).
    * **Query Params:** `?nextToken=...`
    * **Resposta:** `{ "posts": [...], "nextToken": "..." }`
* **`GET /busca?q={termo}`**: Paginado (`Scan` com Filtro na v1.0, `Limit=9`).
    * **Query Params:** `?q=...`, `?nextToken=...`
    * **Resposta:** `{ "termo_busca": "...", "posts": [...], "nextToken": "..." }`

#### 6.2. 🔒 API Admin (CRUD / Auth: Cognito JWT)
* **Posts:**
    * **`GET /admin/posts`**: Paginado. Lista TODOS os posts (Rascunhos + Publicados + Programados).
    * **`GET /admin/post/{slug}`**: Busca 1 post para o editor.
    * **`POST /admin/posts`**: Cria um novo post (aceita `status: "Programado"`, `data_publicacao_programada`, `imagem_destaque_alt_text`, `meta_titulo_seo`, `meta_descricao_seo`).
    * **`PUT /admin/post/{slug}`**: Atualiza um post (aceita todos os campos acima).
    * **`DELETE /admin/post/{slug}`**: Deleta um post.
* **Mídia:**
    * **`POST /admin/media/upload-url`**: Gera uma S3 Presigned URL para upload.
        * **Lógica:** A API retorna a `uploadURL` e a `publicURL` final já otimizada (ex: `.webp`), como definido na Seção 8.
        * **Corpo (JSON):** ~~~json
          { "nome_arquivo": "...", "tipo_arquivo": "..." }
          ~~~
        * **Resposta (JSON):** ~~~json
          { "uploadURL": "...", "publicURL": "..." }
          ~~~
* **Autores (NOVO):**
    * **`GET /admin/autores`**: Lista todos os autores.
    * **`GET /admin/autor/{id}`**: Busca 1 autor para o formulário de perfil. (Deve retornar 404 se não encontrado).
    * **`POST /admin/autores`**: Cria um novo autor (para o fluxo de "Upsert" do perfil).
    * **`PUT /admin/autor/{id}`**: Atualiza um autor existente (aceita `instagram_url` e `foto_avatar_alt_text`).
* **Categorias (NOVO):**
    * **`GET /admin/categorias`**: Lista todas as categorias para a tabela de gestão.
    * **`POST /admin/categorias`**: Cria uma nova categoria.
    * **`PUT /admin/categorias/{slug}`**: Atualiza uma categoria (aceita `descricao_seo`).
    * **`DELETE /admin/categorias/{slug}`**: Deleta uma categoria.

---
---

### 7. Definição Funcional do CMS Admin (A "Ferramenta")

Define a interface de administração interna. (ATUALIZADO v1.2)

* **Tecnologia:** **Vue.js (v3)**. O CMS Admin deve ser um SPA (Single Page Application) construído com Vue.js. A IA engenheira deve usar Vue para gerir o estado (vistas, modais) e a reatividade. O resultado final do *build* será um conjunto de ficheiros estáticos (`index.html`, `app.js`, `app.css`).
* **Hospedagem:** S3 Privado + CloudFront com restrição de acesso (WAF IP/Header Secreto).
* **Autenticação:** **Cognito Hosted UI**. O SPA Vue.js é responsável por:
    1.  Verificar `localStorage` por token.
    2.  Redirecionar para o Cognito se não houver.
    3.  Capturar o token da URL no *hash* de redirecionamento.
    4.  Incluir o token em todas as chamadas para a `/admin/` API.
* **Telas (Vistas/Rotas do Vue Router):**
    1.  **Vista 1: `view-dashboard`:** Tabela de posts (via `GET /admin/posts`). Botão `[+ Novo Post]`.
    2.  **Vista 2: `view-editor` (Formulário de Post):**
        * Campos: `titulo`, `slug`, `conteudo_html` (usar **Quill.js** ou **TinyMCE**), `resumo`, `categoria_slug` (select), `imagem_destaque_url` (input), `imagem_destaque_alt_text` (input - **Mandatório**, Blueprint v1.2), `meta_titulo_seo` (input - **Mandatório**, Blueprint v1.2), `meta_descricao_seo` (textarea - **Mandatório**, Blueprint v1.2), `e_popular` (check), `e_projeto` (check).
        * **Painel de Publicação:**
            * Botão `[Salvar Rascunho]` (envia `status: "Rascunho"`).
            * Botão `[Publicar]` (envia `status: "Publicado"`).
            * Link `(Programar)` que revela campos de data/hora (envia `status: "Programado"` e `data_publicacao_programada`).
    3.  **Vista 3: `view-categories` (NOVO):**
        * Tabela de categorias (via `GET /admin/categorias`).
        * Botão `[+ Nova Categoria]` (abre Modal).
        * Botões `[Editar]` (abre Modal com dados).
    4.  **Vista 4: `view-author-edit` (NOVO):**
        * Formulário de "Editar Perfil".
        * **Lógica "Upsert":** O Vue *store* deve chamar `GET /admin/autor/{id_do_usuario}`. Se 404, o formulário fica em branco (para `POST /admin/autores`). Se 200 OK, preenche o formulário (para `PUT /admin/autor/{id}`).
        * Campos: `nome_exibicao`, `bio` (Rich Text), `foto_avatar_url`, `foto_avatar_alt_text` (**Mandatório**, Blueprint v1.2), `linkedin_url`, `github_url`, `instagram_url` (Opcional, Blueprint v1.2).
* **Modais (Componentes Vue):**
    1.  **Modal `modal-upload`:** Para upload de imagens (chama `POST /admin/media/upload-url`).
    2.  **Modal `modal-category`:** Formulário para criar/editar categorias (chama `POST` ou `PUT /admin/categorias`).
* **CSS (Apenas para o Logo):**
    ~~~css
    .sidebar-logo {
        /* ... outros estilos ... */
        content: "Marcelo<span>Gonçalves</span> (Admin)";
    }
    ~~~

---
---

### 8. Fluxo de CI/CD e DevOps (A "Automação")

Define o processo de deploy automatizado. (ATUALIZADO v1.1)

* **Ferramenta:** **GitHub Actions**.
* **Estratégia de Ambiente:** Ambientes `dev` e `prod` em **Contas AWS separadas**.
* **Estratégia de Infra:** **Terraform** com ficheiros de variáveis por ambiente (**`env/dev.tfvars`** e **`env/prd.tfvars`**).
* **Autenticação AWS:** **OIDC (OpenID Connect)**. Sem chaves de acesso estáticas. O GitHub Actions deve assumir uma **IAM Role** (ex: `GitHubActions-Terraform-Role-Dev`) em cada conta, que confia no repositório e na branch.

* **Infra Adicional (Agendamento):** O Terraform deve criar:
    * Um **Amazon EventBridge Scheduler** (ex: "rodar a cada 15 minutos").
    * Uma **`PostSchedulerLambda`** (Lambda de Agendamento) que é acionada pelo EventBridge.
    * **Lógica da Lambda:** Buscar no GSI `StatusProgramadoPorData` por posts com `status="Programado"` E `data_publicacao_programada <= AGORA`. Para cada post encontrado, atualizar o `status` para "Publicado".

* **Infra Adicional (Otimização de Imagem):** O Terraform deve criar:
    * Um **Trigger de Evento S3** no *bucket* de *uploads* de mídia (para eventos `s3:ObjectCreated:*`).
    * Este evento S3 deve invocar uma nova função **`ImageProcessorLambda`**.
    * **Lógica da `ImageProcessorLambda` (v1.0):**
        1.  Recebe o evento S3 (com o nome do ficheiro original, ex: `meu-upload.png`).
        2.  Lê a imagem original do *bucket* de *uploads*.
        3.  Usa a biblioteca **Sharp.js** para:
            * a. Gerar a imagem *full*: redimensionar para max-width de **1280px**, converter para **WebP** (qualidade 80) e salvar como `[slug]-1280.webp`.
            * b. Gerar o *thumbnail*: redimensionar para max-width de **400px**, converter para **WebP** (qualidade 80) e salvar como `[slug]-400.webp`.
        4.  (Opcional, mas recomendado) Deletar o ficheiro original (`meu-upload.png`) do *bucket* de *uploads*.

* **Fluxo de Branch (Mandatório):**
    * **Push na `develop`:** Aciona o workflow de `dev`.
        * **Jobs:** `terraform apply -var-file="env/dev.tfvars" -auto-approve` (para infra, incluindo as novas Lambdas/EventBridge).
        * **Jobs:** Deploy do Frontend (Next.js), Backend (Lambdas) e Admin (SPA) para a **Conta AWS de Dev**.
    * **Merge na `main`:** Aciona o workflow de `prod`.
        * **Job 1 (Plano):** `terraform plan -var-file="env/prd.tfvars"`.
        * **Job 2 (Aprovação Manual):** O workflow **pausa** e exige aprovação manual na UI do GitHub.
        * **Job 3 (Apply):** Após aprovação, roda `terraform apply -var-file="env/prd.tfvars"`.
        * **Job 4 (Deploy):** Após aprovação, faz o deploy do Frontend, Backend e Admin para a **Conta AWS de Prod**.