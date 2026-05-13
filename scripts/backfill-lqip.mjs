#!/usr/bin/env node
/**
 * scripts/backfill-lqip.mjs
 *
 * Popula o campo imagem_lqip_base64 em todos os posts do DynamoDB que:
 *   1. Possuem imagem_destaque_url
 *   2. Ainda não têm imagem_lqip_base64
 *
 * Requer: AWS profile claude-dev com acesso ao DynamoDB e S3 assets.
 *
 * Uso:
 *   node scripts/backfill-lqip.mjs [--dry-run]
 *
 * --dry-run: lista os posts que seriam atualizados sem gravar no DynamoDB.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-providers";

// ── Configuração ────────────────────────────────────────────────────
const AWS_PROFILE    = "claude-dev";
const AWS_REGION     = "us-east-1";
const POSTS_TABLE    = process.env.POSTS_TABLE    || "marcelo-goncalves-blog-dev-posts";
const ASSETS_BUCKET  = process.env.ASSETS_BUCKET  || "marcelo-goncalves-blog-dev-assets";
const DRY_RUN        = process.argv.includes("--dry-run");

const credentials = fromIni({ profile: AWS_PROFILE });
const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: AWS_REGION, credentials })
);
const s3 = new S3Client({ region: AWS_REGION, credentials });

// ── Helpers ─────────────────────────────────────────────────────────

/** Extrai o basename do campo imagem_destaque_url.
 *  Exemplos de entrada:
 *    "https://cdn.../media/1234-foto-perfil"          → "1234-foto-perfil"
 *    "https://cdn.../media/1234-foto-perfil.webp"     → "1234-foto-perfil"
 *    "/media/1234-foto-perfil"                        → "1234-foto-perfil"
 */
function extractBasename(url) {
  if (!url) return null;
  // Remove protocolo e domínio, ficando com o path
  const withoutDomain = url.replace(/^https?:\/\/[^/]+/, "");
  // Remove /media/ prefix se presente
  const withoutMedia  = withoutDomain.replace(/^\/media\//, "");
  // Remove extensão se presente
  return withoutMedia.replace(/\.(webp|avif|jpg|jpeg|png)(\?.*)?$/i, "") || null;
}

async function fetchLqipFromS3(basename) {
  const key = `media/${basename}-lqip.webp`;
  try {
    const { Body } = await s3.send(new GetObjectCommand({
      Bucket: ASSETS_BUCKET,
      Key: key,
    }));
    if (!Body) return null;

    const chunks = [];
    for await (const chunk of Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    return `data:image/webp;base64,${buffer.toString("base64")}`;
  } catch (err) {
    if (err.name === "NoSuchKey" || err.$metadata?.httpStatusCode === 404) {
      return null; // arquivo lqip ainda não foi gerado
    }
    throw err;
  }
}

async function scanAllPosts() {
  const posts = [];
  let lastKey;

  do {
    const result = await dynamo.send(new ScanCommand({
      TableName: POSTS_TABLE,
      ProjectionExpression: "slug, imagem_destaque_url, imagem_lqip_base64",
      ExclusiveStartKey: lastKey,
    }));
    posts.push(...(result.Items || []));
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  return posts;
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔍 Backfill LQIP — tabela: ${POSTS_TABLE} | bucket: ${ASSETS_BUCKET}`);
  if (DRY_RUN) console.log("   ⚠️  Modo --dry-run: nenhum dado será gravado.\n");

  const posts = await scanAllPosts();
  console.log(`   ${posts.length} post(s) encontrado(s) no DynamoDB.\n`);

  const toProcess = posts.filter(
    (p) => p.imagem_destaque_url && !p.imagem_lqip_base64
  );
  const alreadyDone = posts.filter((p) => p.imagem_lqip_base64);

  console.log(`   ✅ ${alreadyDone.length} post(s) já com lqip (pulados).`);
  console.log(`   📋 ${toProcess.length} post(s) para processar.\n`);

  let updated = 0;
  let skipped = 0;
  let errors  = 0;

  for (const post of toProcess) {
    const basename = extractBasename(post.imagem_destaque_url);
    if (!basename) {
      console.log(`   ⚠️  [${post.slug}] URL sem basename válido — pulado.`);
      skipped++;
      continue;
    }

    process.stdout.write(`   🔄 [${post.slug}] basename="${basename}" ... `);

    let lqipBase64;
    try {
      lqipBase64 = await fetchLqipFromS3(basename);
    } catch (err) {
      console.log(`ERRO S3: ${err.message}`);
      errors++;
      continue;
    }

    if (!lqipBase64) {
      console.log("lqip.webp não encontrado no S3 — pulado.");
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`OK (dry-run, ${lqipBase64.length} chars)`);
      updated++;
      continue;
    }

    try {
      await dynamo.send(new UpdateCommand({
        TableName: POSTS_TABLE,
        Key: { slug: post.slug },
        UpdateExpression: "SET imagem_lqip_base64 = :lqip",
        ExpressionAttributeValues: { ":lqip": lqipBase64 },
      }));
      console.log(`gravado (${lqipBase64.length} chars)`);
      updated++;
    } catch (err) {
      console.log(`ERRO DynamoDB: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Resultado:`);
  console.log(`   ✅ Atualizados: ${updated}`);
  console.log(`   ⏭️  Pulados:    ${skipped}`);
  console.log(`   ❌ Erros:      ${errors}\n`);

  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error("\n❌ Erro fatal:", err.message);
  process.exit(1);
});
