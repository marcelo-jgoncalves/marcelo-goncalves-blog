# Invalidação de cache sob demanda em `/post/[slug]` (CloudFront)

## Contexto

Depois do fix de ISR de hoje, `/post/[slug]` passou a ser cacheado de verdade no CloudFront (`Cache-Control: s-maxage=60`, confirmado via `X-Cache: RefreshHit`). Isso resolveu o problema de performance, mas criou um dilema: `revalidate=60` é curto o suficiente pra correções do autor aparecerem rápido, mas isso significa pouco tempo de cache (mais invocações de Lambda) — e se aumentássemos pra, digamos, 300s ou 3600s pra ganhar mais cache hit, uma correção editorial ficaria invisível por até 1h. O Marcelo pediu uma funcionalidade de "limpar o cache" pra resolver isso: ao salvar/publicar um post no admin, o cache da página pública correspondente deveria ser invalidado imediatamente, permitindo usar uma janela de `revalidate` bem mais longa sem sacrificar frescor editorial.

**Decisão de escopo (igual ao padrão já usado no projeto pra Algolia #16 e job de reconciliação #23 — não otimizar prematuramente):** implementar **só a invalidação no CloudFront**, acionada pelo backend após cada escrita. **Não** implementar a infraestrutura completa de "on-demand revalidation" do Next.js/OpenNext (bucket S3 de cache + tabela DynamoDB de tags + fila SQS + rota webhook no frontend com segredo) — isso só importaria se o Lambda do `nextjs-server` ficasse "quente" entre uma edição e a próxima visita real, mantendo cache interno desatualizado independente do CloudFront. Tráfego real medido é de 2-20 req/dia (auditoria de performance, `docs/auditoria-performance/01-perf-load.md`) — nessa frequência, o Lambda fica frio na maioria das visitas, então a invalidação no CloudFront já força, na prática, uma renderização nova quase sempre. Reavaliar isso (Fase 2) só se o tráfego crescer a ponto do Lambda ficar quente com frequência.

## Achado que muda o desenho: dependência circular no Terraform

Tentei inicialmente buscar o `cloudfront_distribution_id` via `module.frontend.cloudfront_distribution_id` (output já existe em `infra/modules/frontend/outputs.tf:5-7`) pra passar como env var ao `module.lambda`. **Isso cria um ciclo**: `module.lambda` → (novo) `module.frontend` → `module.api-gateway` (via `api_url`) → `module.lambda` (via os invoke ARNs de `adminPosts`/`postScheduler`/etc., `infra/main.tf:41-51`). Terraform recusaria esse plano.

**Solução:** o ID da distribution vira uma variável simples (`var.frontend_cloudfront_distribution_id`), com o valor literal escrito direto em `infra/env/dev.tfvars`/`prd.tfvars` — não uma referência de módulo. Isso quebra o ciclo. Trade-off aceito: se a distribution CloudFront do frontend for um dia destruída/recriada (raro — só acontece em mudanças de config que forçam replacement), esse valor fica desatualizado até alguém atualizar manualmente o `.tfvars`. Vou deixar um comentário no `.tfvars` avisando isso.

## Implementação

### 1. Infra (`infra/`)
- **`infra/variables.tf`**: nova `variable "frontend_cloudfront_distribution_id"` (string).
- **`infra/env/dev.tfvars` / `prd.tfvars`**: `frontend_cloudfront_distribution_id = "E1XI31PS4HFJIH"` (dev — confirmado via `aws cloudfront list-distributions`; produção terá o seu próprio ID quando existir), com comentário explicando a dependência circular.
- **`infra/main.tf`**: passar `frontend_distribution_id = var.frontend_cloudfront_distribution_id` para `module "lambda"` (ao lado de `admin_origin` etc., linha ~27).
- **`infra/modules/lambda/variables.tf`**: nova `variable "frontend_distribution_id"`.
- **`infra/modules/lambda/lambda-iam.tf`**:
  - Novo `data "aws_caller_identity" "current" {}` no topo do arquivo (mesmo padrão já usado em `infra/modules/security-monitoring/main.tf:22`).
  - `adminPosts_policy` e `postScheduler_policy` ganham um novo statement: `Action = ["cloudfront:CreateInvalidation"]`, `Resource = ["arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/${var.frontend_distribution_id}"]`.
- **`infra/modules/lambda/main.tf`**: `adminPosts`/`postScheduler` ganham `FRONTEND_DISTRIBUTION_ID = var.frontend_distribution_id` no bloco `environment { variables = {...} }` (mesmo padrão de `POSTS_TABLE`/`ADMIN_ORIGIN`).
- `terraform fmt` + `terraform validate` + `terraform plan -var-file=env/dev.tfvars` localmente (sem apply — só via pipeline, regra já estabelecida no projeto).

### 2. Backend — novo módulo compartilhado
**`backend/src/common/cacheInvalidation.ts`** (novo, mesmo estilo de `postCounters.ts`):
```ts
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import { logger } from "./logger";

const cloudfront = new CloudFrontClient({});
const DISTRIBUTION_ID = process.env.FRONTEND_DISTRIBUTION_ID;

export async function invalidatePostCache(paths: string[]): Promise<void> {
  if (!DISTRIBUTION_ID || paths.length === 0) return;
  try {
    await cloudfront.send(new CreateInvalidationCommand({
      DistributionId: DISTRIBUTION_ID,
      InvalidationBatch: {
        Paths: { Quantity: paths.length, Items: paths },
        CallerReference: `${Date.now()}-${paths[0]}`,
      },
    }));
  } catch (err) {
    // Best-effort: nunca bloquear a resposta de save/publish por isso.
    // Pior caso sem invalidação: o post fica stale até o revalidate natural.
    logger.warn("cache_invalidation_failed", { paths, error: String(err) });
  }
}
```
- Nova dependência: `@aws-sdk/client-cloudfront` em `backend/package.json` (mesma versão major dos outros `@aws-sdk/*` já no projeto, `^3.934.0`).

### 3. Backend — pontos de chamada (mesmos 3 já mapeados nesta sessão)
- **`adminPosts/index.ts`, `savePost`** (depois do `PutCommand`, ~linha 171): chamar `invalidatePostCache(['/post/' + item.slug])`; se `item.status === "Publicado"` E (`existing` era undefined OU `existing.status !== "Publicado"`) — ou seja, o post passou a contar como publicado agora — adicionar `'/'` à lista de paths (homepage mostra posts recentes).
- **`adminPosts/index.ts`, `deletePost`** (depois do `DeleteCommand`, ~linha 188): chamar `invalidatePostCache(['/post/' + slug])`; se `existing?.status === "Publicado"`, incluir `'/'` também.
- **`postScheduler/index.ts`, `publishPost`** (depois do `UpdateCommand`, ~linha 86): sempre `invalidatePostCache(['/post/' + slug, '/'])` — é sempre uma transição Programado→Publicado, então sempre afeta a home.

### 4. Testes
- Novo `backend/src/common/cacheInvalidation.test.ts` (mock do `CloudFrontClient`, mirror do estilo de `postCounters.test.ts`): cobre caminho de sucesso, `DISTRIBUTION_ID` ausente (no-op), e falha da API (não deve lançar).
- Atualizar `adminPosts/index.test.ts` e `postScheduler/index.test.ts`: mock de `invalidatePostCache` e assert de que é chamado com os paths certos nos 3 pontos.

### 5. Não fazer agora (Fase 2, deferida)
- Rota webhook no Next.js (`app/api/revalidate/route.ts`) + `revalidatePath()`.
- Bucket S3 de cache do OpenNext + tabela DynamoDB de tags + fila SQS — infraestrutura que o OpenNext 3.1.3 precisaria pra on-demand revalidation funcionar de forma confiável entre múltiplas instâncias Lambda (confirmado via investigação: hoje não existe nenhuma dessas peças, o cache do OpenNext é só `/tmp` efêmero por instância).

## Verificação
1. `terraform fmt -check` / `terraform validate` / `terraform plan -var-file=env/dev.tfvars` limpos (já validei que não há mais ciclo nessa abordagem).
2. `npm test` no backend (96 → novos testes inclusos).
3. Commit + push → pipeline CD aplica o Terraform (IAM + env vars) e o build do backend.
4. Validação end-to-end real: editar um post publicado via admin (ou direto via API), e imediatamente depois `curl -I` a página pública do post — confirmar que o conteúdo novo aparece sem esperar os 60s do `revalidate`, e checar `X-Cache: Miss from cloudfront` na primeira requisição pós-invalidação (prova de que o CloudFront realmente jogou fora o cache antigo).
