# Plano — Auditoria Completa de Application Security (World-Class Standard)

> Status: **✅ executada em 2026-06-28.** Resultado completo em `docs/auditoria-appsec/` (sumário executivo em `00-metodologia.md`). 4 achados de alto impacto, 13 de impacto médio — ver backlog de remediação no sumário.
> Diferença em relação à auditoria de engenharia anterior (`docs/auditoria-engenharia/06-criterio-seguranca.md`): aquela tratou segurança como **1 de 12 critérios** (visão panorâmica). Esta é uma auditoria **dedicada e profunda**, só de AppSec, usando frameworks reconhecidos como vara de medir — é isso que torna o resultado "world-class" e não uma lista ad hoc de boas práticas.

## 1. Objetivo

Avaliar a aplicação inteira (frontend, backend, admin, infraestrutura) contra padrões de segurança reconhecidos internacionalmente, produzir achados classificados por severidade, e gerar um backlog de remediação — nos mesmos moldes da auditoria de engenharia já feita (`docs/auditoria-engenharia/`, sessão 49), mas com profundidade de especialista em AppSec em vez de uma passada generalista.

## 2. Frameworks de referência (a régua do "world-class")

| Framework | Por que usar |
|---|---|
| **OWASP ASVS** (Application Security Verification Standard) v5 | É o padrão de fato para auditoria de segurança de aplicação — estruturado em capítulos verificáveis (V1-V17), com níveis de rigor (L1/L2/L3). Usamos como **checklist mestre** desta auditoria. |
| **OWASP Top 10 (2021)** | Vocabulário comum de vulnerabilidades web — usado para classificar achados, não como checklist primário (ASVS já cobre tudo isso e mais). |
| **OWASP API Security Top 10 (2023)** | Nosso backend é 100% API (API Gateway + Lambda) — riscos como *Broken Object Level Authorization*, *Excessive Data Exposure* e *Lack of Rate Limiting* são mais bem cobertos por este framework do que pelo Top 10 web genérico. |
| **AWS Well-Architected Framework — Security Pillar** | Toda a infra é AWS-nativa (Lambda, DynamoDB, S3, CloudFront, Cognito, API Gateway) — este pillar cobre o que é específico de nuvem (IAM, detecção, resposta a incidentes, proteção de dados) que ASVS não cobre por ser framework-agnóstico de cloud. |

**Nível de rigor escolhido:** ASVS **Level 1** como piso obrigatório (aplicável a qualquer app exposta à internet) + itens selecionados do **Level 2** onde o risco justifica (autenticação do admin, upload de mídia, dados de terceiros). Level 3 (alta garantia — bancos, saúde) é desproporcional para um blog com 1 admin e sem dados sensíveis de usuários finais — não faz parte do escopo.

## 3. Escopo (componentes cobertos)

| Componente | O que entra na auditoria |
|---|---|
| `frontend/` | Next.js 16 SSR (Lambda), CSP/headers (parcialmente já corrigido sessão 53), client-side data handling, formulário de newsletter |
| `backend/` | 9 Lambdas, validação de entrada, sanitização HTML, lógica de autorização, tratamento de erro/logging |
| `admin/` | Vue 3 SPA, fluxo de autenticação Cognito (Amplify), DOMPurify, upload de mídia |
| `infra/` | IAM, Cognito, API Gateway, DynamoDB, S3, CloudFront, Terraform state (S3 backend) |
| `.github/workflows/` | CI/CD — segredos, permissões de token, SAST (Semgrep), supply chain das Actions |

**Fora de escopo** (justificativa): pentest de rede/infraestrutura física (tudo é serverless gerenciado pela AWS), engenharia social/phishing, criptoanálise de algoritmos padrão da AWS (TLS/AES geridos pela plataforma), conformidade LGPD/legal completa (já endereçada como item de conteúdo no backlog, não é AppSec).

## 4. Estrutura proposta (categorias, mapeadas a ASVS + achados preliminares já visíveis nesta etapa de planejamento)

Cada categoria abaixo vira um arquivo em `docs/auditoria-appsec/0X-categoria.md` na execução real (mesmo padrão de `docs/auditoria-engenharia/`). Os "achados preliminares" já identificados durante o planejamento estão marcados — **precisam ser confirmados/investigados a fundo na execução**, não são veredito final.

### V1 — Arquitetura e Modelagem de Ameaças
O que verificar: data flow diagram real (onde dados sensíveis trafegam: credenciais admin, conteúdo de posts, imagens), superfícies de ataque por componente, trust boundaries (browser→CloudFront→Lambda→DynamoDB).

### V2 — Autenticação (Cognito)
**Achados preliminares** (`infra/modules/cognito/main.tf`):
- `ALLOW_USER_PASSWORD_AUTH` habilitado junto com SRP — já é backlog item #19 do `CLAUDE.md`, esta auditoria formaliza o risco com profundidade ASVS (V2.1 — credenciais não devem trafegar em texto claro nem usar fluxo direto user/senha quando SRP está disponível).
- Sem MFA configurado (`mfa_configuration` ausente = `OFF` por padrão) — para uma conta de admin único com poder total sobre o conteúdo público, ASVS V2.8 recomenda MFA mesmo em apps pequenas.
- Password policy: mínimo 8 caracteres, sem exigência de símbolo — abaixo do recomendado ASVS V2.1.1 (mínimo 12, ou 8 + MFA como compensação).
- Sem `advanced_security_mode` (Cognito risk-based auth / detecção de credencial comprometida) — avaliar custo vs. benefício dado o porte do projeto.

### V3 — Gestão de Sessão
Tokens JWT via Amplify: access token 60min, refresh 30 dias. Verificar: revogação de sessão no logout (Cognito `globalSignOut`?), armazenamento do token no browser (localStorage vs httpOnly cookie — XSS pode roubar token se for localStorage), proteção CSRF (N/A se token não for cookie).

### V4 — Controle de Acesso
IAM least-privilege por Lambda já implementado (sessão 52). Verificar nesta auditoria: **todas** as rotas administrativas no API Gateway exigem o Cognito Authorizer (não só algumas), e se há alguma rota "esquecida" sem proteção — checar `infra/modules/api-gateway/main.tf` rota por rota.

### V5 — Validação de Entrada e Sanitização
- **Achado preliminar:** não há lib de validação de schema (`zod`/`joi`/etc.) no `backend/package.json` — validação de payload parece ser manual/ad hoc em cada Lambda. ASVS V5.1 pede validação positiva (allowlist) de todo input antes de processar.
- Sanitização HTML (`backend/src/common/sanitizer.ts`) já documentada e recentemente corrigida (iframe XSS, sessão 52) — esta auditoria revalida o allowlist completo, não só o achado já corrigido.
- Verificar *mass assignment*: `savePost`/`adminPosts` aceita o objeto inteiro do client? Um campo extra malicioso (ex: forjar `e_popular_marker` direto) seria persistido sem filtro?

### V6 — Criptografia
- S3: `frontend_assets`/`assets` confirmados com SSE-S3 (AES256) + bucket versioning + public access block (`infra/modules/frontend/s3.tf`). Confirmar mesma postura nos buckets do admin e `uploads-raw`.
- DynamoDB: sem `server_side_encryption` explícito no Terraform — checar se está usando a criptografia padrão da AWS (ativa por padrão desde 2018) ou se precisa ser declarada explicitamente por clareza/compliance.
- **Achado preliminar:** nenhuma distribution CloudFront define `minimum_protocol_version`/`ssl_support_method` — ambas usam `cloudfront_default_certificate = true`, que não permite fixar uma versão mínima de TLS moderna (`TLSv1.2_2021`). Isso só é configurável com certificado ACM customizado — bloqueado até existir domínio definitivo (backlog item já existente).

### V7 — Tratamento de Erros e Logging
Logger estruturado já obrigatório (`backend/src/common/logger.ts`, nunca `console.log`). Verificar: mensagens de erro retornadas ao client não vazam stack trace/detalhes internos; logs nunca contêm senha/token/PII em texto claro.

### V8 — Proteção de Dados
Minimização de dados (quais campos de autor/usuário são realmente necessários), política de retenção de backups (`scripts/backups/`, atualmente local e gitignored — sem rotação/expiração definida).

### V9 — Segurança de Comunicação
TLS em todas as camadas (CloudFront, API Gateway, DynamoDB) — gerenciado pela AWS por padrão. HSTS já adicionado no admin (sessão 53) — avaliar se vale adicionar no frontend também (hoje só CSP foi adicionado lá; X-Frame-Options/HSTS já vêm do Lambda, mas confirmar HSTS está realmente presente).

### V10 — Configuração e Implantação
- CSP/X-Frame-Options reais: ✅ feito (sessão 53).
- S3 public access block: ✅ feito (sessão 51, uploads-raw).
- IAM least-privilege: ✅ feito (sessão 52).
- **Achado preliminar:** `security.yml` (Semgrep) roda só com `--severity ERROR`, descartando achados `WARNING`/`INFO` que frequentemente incluem padrões reais de risco (ex: uso de `eval`, regex insegura, hardcoded paths). Vale reavaliar o threshold.
- **Achado preliminar:** Semgrep usa só `p/typescript` e `p/nodejs` — rulesets genéricos de linguagem, não de segurança dedicada. Existem rulesets prontos (`p/owasp-top-ten`, `p/secrets`, `p/jwt`, `p/sql-injection`) que dariam cobertura mais profunda sem custo adicional (Semgrep Community é gratuito).

### V11 — Lógica de Negócio / Abuse Cases
- **Achado preliminar:** nenhum `usage_plan`/throttling configurado no API Gateway — a API está exposta sem limite de requisições por cliente. Risco de abuso (scraping agressivo, custo inesperado de Lambda/DynamoDB, ou DoS de baixo esforço).
- Upload de mídia: verificar limites de tamanho de arquivo e validação de tipo real (magic bytes, não só extensão/Content-Type declarado pelo client) em `mediaUpload`/`imageProcessor`.

### V12 — Segurança de Arquivos e Upload
Pipeline de imagem (`imageProcessor`, Sharp.js): risco de "decompression bomb" (imagem pequena que expande para gigabytes na memória), SSRF (se algum fluxo aceitar URL externa para processar), validação de formato real vs. extensão confiada.

### V13 — Segurança de API (OWASP API Top 10)
- *Broken Object Level Authorization*: como há só 1 admin por design (`AUTHOR_ID` fixo, já documentado como N/A em memória do projeto), esse risco é estruturalmente baixo — mas vale confirmar que nenhuma rota aceita um `id`/`slug` arbitrário de outro recurso sem checagem alguma.
- *Excessive Data Exposure*: confirmar que `getPost`/`getPosts` não retornam campos internos (ex: markers de GSI, metadados de auditoria) que não deveriam ir ao client público.
- *Lack of Rate Limiting*: mesmo achado do V11.

### V14 — Dependências e Supply Chain
- `npm audit --audit-level=high` já roda em CI (zero high/critical tolerado). Dependabot já ativo.
- **Achado preliminar:** GitHub Actions no workflow usam tags (`@v4`) em vez de SHA fixo — risco clássico de supply chain (uma tag pode ser re-apontada). Avaliar custo/benefício de pin por SHA dado o porte do projeto.
- Considerar `npm audit` também em `--audit-level=moderate` informativo (sem quebrar build) para visibilidade dos 19/22 moderate já aceitos como risco conhecido — confirmar que continuam sendo só os mesmos, não cresceram.

### V15 — Infraestrutura como Código / Configuração Cloud
- **Achado preliminar:** nenhuma ferramenta de scan estático de IaC (`tfsec`, `checkov`, `terrascan`) está configurada no CI — hoje a auditoria de Terraform é 100% manual/humana. Rodar uma passada com `checkov` ou `tfsec` é rápido e gratuito, pode achar configurações erradas que passaram despercebidas.
- CloudTrail/GuardDuty/AWS Config: confirmar se existem na conta (não aparecem em nenhum módulo Terraform do projeto) — se não existirem, é uma lacuna de *detecção*, não de prevenção, mas relevante para "world-class".

### V16 — Segurança de CI/CD
OIDC já usado para assumir role AWS (`secrets.AWS_ROLE_ARN_DEV/PROD`, sem chave de longa duração) — boa prática já presente. Verificar: branch protection rules no GitHub (exige review antes de merge em `main`?), permissões do `GITHUB_TOKEN` em cada workflow (`permissions: contents: read` já presente em `security.yml` — confirmar nos outros 2 workflows).

### V17 — Observabilidade de Segurança
Alarmes de SLO de erro/latência já existem (sessão 50). Não há alarme específico para eventos de segurança (tentativas de login falhas em excesso, atividade IAM anômala). Avaliar se GuardDuty (achado V15) cobriria isso de forma mais barata que alarmes customizados.

## 5. Metodologia de verificação (por categoria)

| Método | Quando usar |
|---|---|
| Code review estático (leitura direta dos arquivos reais) | Toda a validação de input, sanitização, lógica de autorização |
| Revisão de IaC (`terraform plan`/`show`, leitura de `.tf`) | IAM, criptografia, configuração de rede/CDN |
| Teste dinâmico real contra `dev` (`curl`, DevTools) | Headers HTTP, comportamento de auth, rate limiting (tentar exceder) |
| Ferramentas automatizadas novas a avaliar | `tfsec`/`checkov` (IaC), `gitleaks`/`trufflehog` (segredos no histórico git, relevante agora que o repo é público), Semgrep com rulesets de segurança dedicados |
| Tentativa controlada de exploração (sempre em `dev`, nunca prod) | Clickjacking (já validado sessão 53), tentar mass assignment em `savePost`, tentar exceder rate limit |

## 6. Ordem de execução proposta

Diferente da auditoria de engenharia (que ordenou a **implementação** por risco ascendente), a **auditoria em si** deve ser feita primeiro nas categorias que tudo mais depende — autenticação e controle de acesso —, porque um achado crítico ali muda a prioridade de tudo o resto:

1. V2/V3/V4 — Autenticação, Sessão, Controle de Acesso (fundação)
2. V5/V12/V13 — Validação de entrada, upload, API (superfície de ataque mais exposta)
3. V6/V9/V10 — Criptografia, comunicação, configuração (já parcialmente feito, fechar o que falta)
4. V11 — Abuse cases / rate limiting
5. V14/V15/V16 — Supply chain, IaC, CI/CD
6. V1/V7/V8/V17 — Modelagem de ameaças (documentação), logging, proteção de dados, observabilidade (fecham o ciclo)

A **remediação** dos achados, por outro lado, segue a convenção já estabelecida no projeto: ordem ascendente de risco de quebrar algo em produção.

## 7. Entregáveis

- `docs/auditoria-appsec/00-metodologia.md` — versão final deste plano + sumário executivo pós-execução
- `docs/auditoria-appsec/0X-categoria.md` — 1 arquivo por categoria (V1-V17, agrupáveis onde fizer sentido), mesmo padrão de `docs/auditoria-engenharia/`
- Achados classificados por severidade (Critical/High/Medium/Low/Info — escala qualitativa, CVSS completo é desproporcional para o porte do projeto)
- Backlog de remediação integrado ao `CLAUDE.md` seção 10, mesmo padrão dos achados anteriores

## 8. Estimativa de esforço

| Etapa | Tempo estimado |
|---|---|
| V2-V4 (Auth/Sessão/Acesso) | 1h |
| V5/V12/V13 (Validação/Upload/API) | 1h30 |
| V6/V9/V10 (Cripto/Comunicação/Config) | 45min (boa parte já feita) |
| V11 (Abuse cases/Rate limiting) | 45min |
| V14/V15/V16 (Supply chain/IaC/CI-CD) | 1h |
| V1/V7/V8/V17 (Threat model/Logging/Dados/Observabilidade) | 1h |
| Consolidação dos achados + backlog | 45min |
| **Total** | **~6h45min**, divisível em múltiplas sessões |

## 9. Fora de escopo (explicitamente)

- Pentest de rede/infraestrutura física — não aplicável (100% serverless gerenciado)
- Engenharia social / phishing simulado
- Conformidade legal completa (LGPD) — já é item de conteúdo separado no backlog, não é achado técnico de AppSec
- ASVS Level 3 (alta garantia) — desproporcional para o porte e natureza do projeto

## 10. Fonte interna

- Auditoria de engenharia anterior (critério 6): `docs/auditoria-engenharia/06-criterio-seguranca.md`
- Fixes de segurança já aplicados (não re-auditar do zero, só revalidar): IAM scoping (sessão 52), GSI/sanitizer (sessão 52), CSP/X-Frame-Options (sessão 53), S3 uploads-raw (sessão 51)
- Backlog existente já relacionado: `CLAUDE.md` itens #18 (WAF admin), #19 (Cognito SRP)
