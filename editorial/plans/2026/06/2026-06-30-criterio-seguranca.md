---
id: POST-PLAN-2026-006
schema_version: "1.0"
title: "Post 5 da série: Segurança — \"A proteção que existe no código mas não no navegador\""
created_at: 2026-06-30
updated_at: 2026-06-30
status: idea
channels: []
source_skill: post-planejamento
planned_publication:
published_at:
canonical_content:
related_case:
related_work_items: []
tags: []
contains_sensitive_content: false
---

<!-- Migrado de projects/publishing-content/postagens/06-criterio-seguranca.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post 5 da série: Segurança — "A proteção que existe no código mas não no navegador"

## Títulos alternativos
- "`X-Frame-Options` via `<meta>`: o header que finge funcionar"
- "Protegemos o lugar errado primeiro"

## Tese central

Existe uma categoria de bug de segurança mais perigosa que "esquecemos de proteger": **achar que protegemos**. O post usa um achado muito específico e verificável — um header de segurança configurado, presente no código, mas que o próprio navegador ignora por especificação — como porta de entrada para um tema maior: a prioridade de proteção estava invertida (mais proteção no admin de baixo tráfego, menos no blog público de alto tráfego).

## Por que importa

É um exemplo perfeito de "código que passa revisão visual mas não faz o que parece fazer" — extremamente comum em configuração de segurança porque poucos revisores checam comportamento real de browser, só leem a intenção do código.

## Storytelling sugerido

Abra de forma técnica e direta, sem rodeios: mostre o trecho de `admin/index.html` com `<meta http-equiv="X-Frame-Options" content="DENY">` e deixe a frase pousar — "parece proteção contra clickjacking". Depois, o fato seco: por especificação, navegadores ignoram `X-Frame-Options` fora de um header HTTP real; em meta tag, esse valor nunca teve efeito. Não é uma regressão recente, é uma proteção que nunca existiu, apesar de estar escrita.

Vire a câmera: o blog público — superfície de tráfego real, anúncios, fontes externas — usa headers reais (via `next.config.ts`, que funciona) mas não tem Content-Security-Policy nenhuma. A prioridade estava invertida: mais cobertura (ainda que quebrada) onde o risco real é menor.

Terceiro beat, mais técnico para quem quiser se aprofundar: duas camadas de sanitização de HTML (cliente e servidor) que divergiram — um commit recente liberou `<iframe>` no sanitizador do cliente (para embeds do YouTube) sem espelhar a mudança no servidor, que é a autoridade final antes de persistir no banco.

Fechamento: segurança não é "ter a lista de proteções". É verificar, uma por uma, se cada proteção realmente produz o efeito que o nome sugere.

## Provas e exemplos reais

- `admin/index.html`: `<meta http-equiv="Content-Security-Policy" content="...">` e `<meta http-equiv="X-Frame-Options" content="DENY">` — o segundo é inerte por spec de browser; a CSP não declara `frame-ancestors` (a diretiva moderna que substituiria o X-Frame-Options e que *funcionaria* via meta tag).
- `frontend/next.config.ts`: headers reais via `headers()` do Next.js (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) — corretos como header HTTP, mas sem nenhuma diretiva CSP.
- Commit `ec82c10` ("allow div/span/iframe in pre-save HTML sanitizer") adicionou `iframe` ao DOMPurify client-side em `EditorView.vue`; `backend/src/common/sanitizer.ts` (autoridade final) continua sem `iframe` no `ALLOWED_TAGS`.
- Bucket S3 `uploads-raw`: sem `aws_s3_bucket_public_access_block` explícito; CORS com `allowed_origins = ["*"]`.
- Uma única IAM policy (`admin_lambda_policy`) concede leitura/escrita nas tabelas de posts, autores e categorias para os 3 Lambdas de admin igualmente, mesmo quando cada um só usa uma tabela.
- Contraponto positivo real: nenhuma credencial hardcoded encontrada no código; IAM por função, escopado a ARNs específicos (nunca `Resource: "*"`); `sanitize-html` allowlist (tags/atributos/schemes restritos, `rel=noopener noreferrer` forçado); bucket de assets do frontend corretamente bloqueado, acesso só via CloudFront OAC; rotas admin protegidas por Cognito authorizer no API Gateway.

## Conceitos a explicar

- **Clickjacking**: ataque que embute seu site num iframe invisível para induzir clique em outro contexto — `X-Frame-Options`/`frame-ancestors` são as defesas padrão.
- **CSP (Content-Security-Policy)**: política que restringe de onde scripts/estilos/recursos podem ser carregados — reduz o impacto de um XSS mesmo se ele ocorrer.
- **Allowlist vs. denylist em sanitização**: permitir explicitamente um conjunto pequeno e conhecido de tags/atributos é mais seguro do que tentar bloquear tudo que é perigoso (lista de bloqueio nunca está completa).

## Estrutura sugerida (H2s)

1. O header que está lá, mas nunca funcionou
2. A proteção que falta exatamente onde mais precisa
3. Duas camadas de sanitização, uma dessincronizada da outra
4. O padrão por trás dos três achados: verificar efeito, não intenção
5. O que isso ensina sobre revisar segurança em qualquer projeto

## Fecho / CTA

Aponta para o post de Observabilidade ("proteção que existe mas está desligada é o mesmo padrão do próximo capítulo — só que em monitoramento, não em headers").

## Fonte interna

`docs/auditoria-engenharia/05-seguranca.md`
