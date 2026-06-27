# backend — Lambdas do Blog Marcelo Gonçalves

Node.js 20 + TypeScript. 9 Lambdas (`src/functions/*`), build via esbuild + Sharp (image processing).

## Não há servidor de desenvolvimento local

As Lambdas rodam apenas na AWS — não existe `npm run dev`. Para testar lógica localmente, use os testes unitários (Jest, com client DynamoDB/S3 mockado) ou `aws lambda invoke` contra o ambiente de dev (ver `CLAUDE.md`).

```bash
npm install
npm test              # Jest — não precisa de nenhuma variável de ambiente local
npm run build         # esbuild + empacotamento (gera infra/builds/*.zip)
```

## Variáveis de ambiente

Não usamos `.env`/`dotenv` neste workspace — todo env var de Lambda é injetado pelo **Terraform** (`infra/modules/lambda/main.tf`), nunca lido de arquivo local. As variáveis reais usadas pelo código (`POSTS_TABLE`, `AUTORES_TABLE`, `CATEGORIAS_TABLE`, `UPLOADS_BUCKET`, `DESTINATION_BUCKET`, `ADMIN_ORIGIN`, `LOG_LEVEL`, `XRAY_ENABLED`) são definidas só em `infra/`, não em `.tfvars` de app.

## Regras não-negociáveis

- **Nunca** `console.log` — sempre `logger.info/debug/warn/error` de `src/common/logger.ts`.
- **Nunca** persistir HTML de post sem passar por `sanitizePostHtml()` (`src/common/sanitizer.ts`).
- Novas Lambdas: incluir `tracing_config` no Terraform desde o primeiro commit.

## Mais contexto

Ver `CLAUDE.md` e `docs/contract.md` na raiz do monorepo.
