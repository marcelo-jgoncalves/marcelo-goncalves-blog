// backend/src/common/cacheInvalidation.ts
//
// Invalidação sob demanda do cache de borda (CloudFront) para /post/{slug}
// (e opcionalmente "/", que exibe posts recentes) — chamada pelos 3 pontos
// de escrita que mudam o conteúdo público de um post (adminPosts.savePost/
// deletePost, postScheduler.publishPost). Sem isso, o `revalidate=60` do
// Next.js só expira naturalmente; com isso, uma edição/publicação aparece
// no site público sem esperar a janela de cache (plano completo arquivado fora do
// repo: marcelo-goncalves-blog-arquivo/docs-historico/plano-cache-invalidation-cloudfront.md).
//
// Fase 1 apenas: não cobre o cache interno do OpenNext (efêmero, por
// instância Lambda) — deliberadamente deferido (CLAUDE.md, backlog #28)
// até haver tráfego real que justifique essa complexidade.
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import { logger } from "./logger";

const cloudfront = new CloudFrontClient({});
const DISTRIBUTION_ID = process.env.FRONTEND_DISTRIBUTION_ID;

// Best-effort: nunca lança — uma falha aqui não deve bloquear a resposta de
// save/publish/delete. Pior caso sem invalidação: o post fica stale até o
// revalidate natural (60s em /post/[slug], 300s em "/").
export async function invalidatePostCache(paths: string[]): Promise<void> {
  if (!DISTRIBUTION_ID || paths.length === 0) return;

  try {
    await cloudfront.send(
      new CreateInvalidationCommand({
        DistributionId: DISTRIBUTION_ID,
        InvalidationBatch: {
          Paths: { Quantity: paths.length, Items: paths },
          CallerReference: `${Date.now()}-${paths[0]}`,
        },
      }),
    );
  } catch (err) {
    logger.warn("cache_invalidation_failed", { paths, error: String(err) });
  }
}
