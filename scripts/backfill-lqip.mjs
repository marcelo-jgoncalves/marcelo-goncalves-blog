#!/usr/bin/env node
/**
 * scripts/backfill-lqip.mjs
 *
 * Popula o campo imagem_lqip_base64 em todos os posts do DynamoDB que:
 *   1. Possuem imagem_destaque_url
 *   2. Ainda não têm imagem_lqip_base64
 *
 * Se o arquivo -lqip.webp não existir no S3, o script o gera a partir do
 * -1280.webp existente usando Sharp, faz o upload e salva o base64.
 *
 * Requer: AWS_PROFILE=claude-dev (ou credenciais via env vars AWS_*)
 * Executar a partir do diretório backend/ onde Sharp está instalado.
 *
 * Uso (a partir de backend/):
 *   AWS_PROFILE=claude-dev node ../scripts/backfill-lqip.mjs [--dry-run]
 *
 * --dry-run: lista o que seria feito sem gravar nada.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { createRequire } from "module";

// Sharp é um módulo CJS — carregado via createRequire para compatibilidade ESM
const require = createRequire(import.meta.url);
const sharp   = require("sharp");

// ── Configuração ────────────────────────────────────────────────────
const AWS_REGION    = "us-east-1";
const POSTS_TABLE   = process.env.POSTS_TABLE   || "marcelo-goncalves-blog-dev-posts";
const ASSETS_BUCKET = process.env.ASSETS_BUCKET || "marcelo-goncalves-blog-dev-assets";
const DRY_RUN       = process.argv.includes("--dry-run");

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: AWS_REGION }));
const s3     = new S3Client({ region: AWS_REGION });

// ── Helpers ─────────────────────────────────────────────────────────

function extractBasename(url) {
  if (!url) return null;
  const withoutDomain = url.replace(/^https?:\/\/[^/]+/, "");
  const withoutMedia  = withoutDomain.replace(/^\/media\//, "");
  return withoutMedia.replace(/\.(webp|avif|jpg|jpeg|png)(\?.*)?$/i, "") || null;
}

async function streamToBuffer(body) {
  const chunks = [];
  for await (const chunk of body) chunks.push(chunk);
  return Buffer.concat(chunks);
}

/** Verifica se um objeto existe no S3 (sem baixar o conteúdo). */
async function s3Exists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: ASSETS_BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

/** Busca o arquivo existente no S3 assets e retorna como Buffer. */
async function fetchFromS3(key) {
  const { Body } = await s3.send(new GetObjectCommand({ Bucket: ASSETS_BUCKET, Key: key }));
  if (!Body) return null;
  return streamToBuffer(Body);
}

/**
 * Garante que o arquivo lqip.webp existe no S3.
 * Se existir: lê e retorna como base64.
 * Se não existir: gera a partir do -1280.webp via Sharp, faz upload e retorna base64.
 */
async function ensureLqipBase64(basename, dryRun) {
  const lqipKey   = `media/${basename}-lqip.webp`;
  const source1280 = `media/${basename}-1280.webp`;

  // 1. Verificar se lqip já existe no S3
  if (await s3Exists(lqipKey)) {
    const buf = await fetchFromS3(lqipKey);
    if (buf) return `data:image/webp;base64,${buf.toString("base64")}`;
  }

  // 2. Buscar a variante 1280 como fonte para gerar o lqip
  let sourceBuffer;
  try {
    sourceBuffer = await fetchFromS3(source1280);
  } catch {
    return null; // imagem fonte não encontrada
  }
  if (!sourceBuffer) return null;

  // 3. Gerar lqip: 20px, quality 20, WebP
  const lqipBuffer = await sharp(sourceBuffer)
    .resize({ width: 20, withoutEnlargement: true })
    .toFormat("webp", { quality: 20 })
    .toBuffer();

  // 4. Upload para S3 (pular no dry-run)
  if (!dryRun) {
    await s3.send(new PutObjectCommand({
      Bucket: ASSETS_BUCKET,
      Key: lqipKey,
      Body: lqipBuffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    }));
  }

  return `data:image/webp;base64,${lqipBuffer.toString("base64")}`;
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

  const toProcess  = posts.filter((p) => p.imagem_destaque_url && !p.imagem_lqip_base64);
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
      lqipBase64 = await ensureLqipBase64(basename, DRY_RUN);
    } catch (err) {
      console.log(`ERRO ao gerar lqip: ${err.message}`);
      errors++;
      continue;
    }

    if (!lqipBase64) {
      console.log("imagem fonte não encontrada no S3 — pulado.");
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
