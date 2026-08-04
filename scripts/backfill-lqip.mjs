#!/usr/bin/env node
/**
 * scripts/backfill-lqip.mjs
 *
 * Populates the imagem_lqip_base64 field on every DynamoDB post that:
 *   1. Has imagem_destaque_url
 *   2. Doesn't yet have imagem_lqip_base64
 *
 * If the -lqip.webp file doesn't exist in S3, the script generates it from
 * the existing -1280.webp using Sharp, uploads it, and saves the base64.
 *
 * Requires: AWS_PROFILE=claude-dev (or credentials via AWS_* env vars)
 * Run from the backend/ directory, where Sharp is installed.
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

// Sharp is a CJS module, loaded via createRequire for ESM compatibility
const require = createRequire(import.meta.url);
const sharp   = require("sharp");

// -- Configuration ------------------------------------------------------
const AWS_REGION    = "us-east-1";
const POSTS_TABLE   = process.env.POSTS_TABLE   || "marcelo-goncalves-blog-dev-posts";
const ASSETS_BUCKET = process.env.ASSETS_BUCKET || "marcelo-goncalves-blog-dev-assets";
const DRY_RUN       = process.argv.includes("--dry-run");

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: AWS_REGION }));
const s3     = new S3Client({ region: AWS_REGION });

// -- Helpers --------------------------------------------------------------

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

/** Checks whether an object exists in S3 (without downloading its content). */
async function s3Exists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: ASSETS_BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

/** Fetches the existing file from S3 assets and returns it as a Buffer. */
async function fetchFromS3(key) {
  const { Body } = await s3.send(new GetObjectCommand({ Bucket: ASSETS_BUCKET, Key: key }));
  if (!Body) return null;
  return streamToBuffer(Body);
}

/**
 * Ensures the lqip.webp file exists in S3.
 * If it exists: reads and returns it as base64.
 * If not: generates it from -1280.webp via Sharp, uploads it, and returns base64.
 */
async function ensureLqipBase64(basename, dryRun) {
  const lqipKey   = `media/${basename}-lqip.webp`;
  const source1280 = `media/${basename}-1280.webp`;

  // 1. Check whether lqip already exists in S3
  if (await s3Exists(lqipKey)) {
    const buf = await fetchFromS3(lqipKey);
    if (buf) return `data:image/webp;base64,${buf.toString("base64")}`;
  }

  // 2. Fetch the 1280 variant as the source to generate the lqip
  let sourceBuffer;
  try {
    sourceBuffer = await fetchFromS3(source1280);
  } catch {
    return null; // source image not found
  }
  if (!sourceBuffer) return null;

  // 3. Generate lqip: 20px, quality 20, WebP
  const lqipBuffer = await sharp(sourceBuffer)
    .resize({ width: 20, withoutEnlargement: true })
    .toFormat("webp", { quality: 20 })
    .toBuffer();

  // 4. Upload to S3 (skip on dry-run)
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

// -- Main -----------------------------------------------------------------

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
