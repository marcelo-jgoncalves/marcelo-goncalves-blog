# Auditoria de Engenharia — Critério 5: Segurança

> Data: 2026-06-27
> Escopo: IAM least-privilege, secrets management, sanitização, CSP/CORS, SAST.
> Apenas análise — nenhum código foi alterado nesta etapa.

## 🔴 Achados de alto impacto

### 1. Headers de segurança do admin entregues via `<meta>`, não via HTTP header real — `X-Frame-Options` não funciona

`admin/index.html` define CSP e `X-Frame-Options: DENY` via `<meta http-equiv>`. Por especificação do browser, **`X-Frame-Options` é ignorado quando entregue por meta tag** — só tem efeito como header HTTP real. Ou seja, a proteção contra clickjacking que parece existir no código **não existe de fato** em runtime.

Além disso, a CSP (que via meta tag funciona para a maioria das diretivas) não declara `frame-ancestors` — que é a diretiva moderna de CSP que substitui o `X-Frame-Options` e que **funcionaria** via meta tag. Hoje não há nenhuma proteção efetiva contra o admin ser embutido em um iframe de terceiros.

**Recomendação:** mover os headers de segurança para CloudFront (Response Headers Policy no Terraform) e adicionar `frame-ancestors 'none'` na CSP.

### 2. O blog público (frontend) não tem Content-Security-Policy

`frontend/next.config.ts` define `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` — via `headers()` do Next.js, que **são** headers HTTP reais (correto, ao contrário do admin). Mas não há nenhuma diretiva CSP.

Isso inverte a priorização de risco: o admin (1 usuário autenticado, baixa exposição) tem uma CSP — ainda que não-funcional no ponto #1; o blog público (tráfego de qualquer visitante, AdSense, Google Fonts, GA4 futuro) é a superfície mais exposta a XSS real e é a que está sem essa camada.

**Recomendação:** definir CSP para o frontend, mesmo que inicialmente permissiva (`script-src 'self' + domínios de AdSense/GA4 já conhecidos`), entregue como header HTTP real (mesmo padrão do `next.config.ts` atual).

## 🟡 Achados de impacto médio

### 3. Duas camadas de sanitização HTML divergentes (cliente e servidor)

Existe sanitização client-side (DOMPurify em `admin/src/views/EditorView.vue`, roda antes do POST) e sanitização server-side (`backend/src/common/sanitizer.ts`, `sanitize-html`, é a que efetivamente persiste no DynamoDB). O commit `ec82c10` adicionou `iframe` ao allowlist do **cliente** (para embeds do YouTube), mas o allowlist do **backend** continua sem `iframe`. Resultado provável: o embed sobrevive no editor, mas é removido silenciosamente ao salvar — o backend é a autoridade final.

Se/quando `iframe` for adicionado ao allowlist do backend para corrigir isso, o atributo `src` precisa ser restringido a um allowlist de domínio (ex: só `youtube.com`/`youtube-nocookie.com`) — um `<iframe>` com `src` livre é um vetor real de clickjacking/phishing, mesmo em projeto de admin único.

### 4. Bucket `uploads-raw` sem `public_access_block` explícito e CORS com origem `*`

`infra/modules/media/s3.tf` não declara `aws_s3_bucket_public_access_block` (depende do default de conta, não declarado em código) e o CORS permite `allowed_origins = ["*"]` para PUT/POST/GET. Risco prático é baixo (acesso de escrita é via URL pré-assinada, que já exige sessão Cognito válida para ser emitida), mas não é least-privilege como está escrito — deveria declarar o bloqueio explicitamente e restringir CORS ao `ADMIN_ORIGIN`.

### 5. Política IAM única e compartilhada para os 3 Lambdas de admin

`admin_lambda_policy` concede `GetItem/Query/Scan/PutItem/UpdateItem/DeleteItem` nas tabelas de posts, autores **e** categorias para `adminPosts`, `adminAuthors` e `adminCategorias` igualmente — mesmo que `adminAuthors`, por exemplo, só precise da tabela de autores. Contradiz o "least privilege" que o próprio `contract.md` define como não-negociável. Risco prático baixo (sem fronteira multi-tenant), mas é o tipo de gap que cresce em custo de correção conforme mais Lambdas são adicionadas ao mesmo padrão.

### 6. Cognito ainda permite `ALLOW_USER_PASSWORD_AUTH` (já rastreado no backlog)

Já é o item #19 do backlog do `CLAUDE.md` ("migrar para SRP") — confirmado ainda presente em `infra/modules/cognito/main.tf`. Não é achado novo, só confirmação de que continua aberto.

## 🟢 Pontos positivos (manter)

- **Nenhuma credencial hardcoded encontrada** no código-fonte (busca por padrão de access key AWS retornou vazio); `.env*` corretamente no `.gitignore`.
- IAM **não usa role/policy única genérica** — cada função (pública, admin, media-upload, scheduler) tem policy própria, escopada a ARNs específicos de tabela/bucket, nunca `Resource: "*"` para os recursos de dados.
- `backend/src/common/sanitizer.ts` é um allowlist sólido: tags/atributos explícitos, schemes restritos a `http/https/mailto`, e força `rel="noopener noreferrer"` em todos os links — boa prática mesmo sem o CSP completo.
- Bucket de assets do frontend tem `block_public_acls/block_public_policy/ignore_public_acls` explicitamente `true` — acesso correto via CloudFront OAC, não bucket público.
- Rotas de admin no API Gateway corretamente protegidas por `COGNITO_USER_POOLS` authorizer.
- CI já roda Semgrep + Trivy + `npm audit` em múltiplas camadas (detalhado no critério 4) — cobertura de scanning automatizado é boa para o porte do projeto.

## Resumo

O maior gap deste critério é de **prioridade invertida**: a superfície de maior exposição real (blog público) tem menos proteção de headers do que a de menor exposição (admin), e a proteção do admin contra clickjacking não funciona como está implementada. Os demais achados (sanitização divergente, IAM levemente superprivilegiado, bucket de upload) são de risco baixo-médio dado o contexto de single-admin, mas valem correção porque o custo de corrigir agora é pequeno e cresce com o tempo.
