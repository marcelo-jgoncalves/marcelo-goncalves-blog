#!/usr/bin/env node
/**
 * scripts/backfill-post-counters.mjs
 *
 * Initial seed for the aggregated counters (backend/src/common/postCounters.ts)
 * that replace the 2nd COUNT Query in getAllPosts/getProjectPosts (real finding
 * from docs/auditoria-performance/01-perf-load.md). Without this backfill, the
 * counter would start at zero and only become correct after a few writes
 * via adminPosts/postScheduler.
 *
 * Counts the real items (Scan + in-memory filter, only for this one-off run,
 * not the production read pattern) and writes via ADD, same as runtime.
 *
 * Runs via the AWS SDK directly (not the AWS CLI), see
 * memory/feedback_aws_cli_windows_encoding.md.
 *
 * Uso (a partir de scripts/, após `npm install` uma vez):
 *   AWS_PROFILE=claude-dev node backfill-post-counters.mjs [--dry-run] [--table marcelo-goncalves-blog-dev-posts]
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const AWS_REGION = "us-east-1";
const COUNTERS_SLUG = "__METADATA__#posts_counters";

function argValue(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : fallback;
}

const TABLE_NAME = argValue("--table", "marcelo-goncalves-blog-dev-posts");
const DRY_RUN = process.argv.includes("--dry-run");

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: AWS_REGION }));

async function scanAll(tableName) {
  const items = [];
  let lastKey;
  do {
    const result = await dynamo.send(new ScanCommand({
      TableName: tableName,
      ProjectionExpression: "slug, #status, e_projeto",
      ExpressionAttributeNames: { "#status": "status" },
      ExclusiveStartKey: lastKey,
    }));
    items.push(...(result.Items || []));
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);
  return items;
}

async function main() {
  console.log(`\n🔄 Backfill de contadores de posts — tabela: ${TABLE_NAME}`);
  if (DRY_RUN) console.log("   ⚠️  Modo --dry-run: nenhum dado será gravado.\n");

  const items = await scanAll(TABLE_NAME);
  console.log(`   ${items.length} item(ns) encontrado(s) (incluindo o de metadata, se já existir).\n`);

  const realPosts = items.filter((i) => i.slug !== COUNTERS_SLUG);
  const totalPublicado = realPosts.filter((i) => i.status === "Publicado").length;
  const totalProjetoPublicado = realPosts.filter((i) => i.status === "Publicado" && Number(i.e_projeto) === 1).length;

  console.log(`   total_publicado real: ${totalPublicado}`);
  console.log(`   total_projeto_publicado real: ${totalProjetoPublicado}\n`);

  const existing = await dynamo.send(new GetCommand({ TableName: TABLE_NAME, Key: { slug: COUNTERS_SLUG } }));
  if (existing.Item) {
    console.log(`   ⚠️  Item de metadata já existe (total_publicado=${existing.Item.total_publicado ?? 0}, total_projeto_publicado=${existing.Item.total_projeto_publicado ?? 0}).`);
    console.log(`      Este script faz ADD do delta necessário para igualar ao valor real contado agora, não SET absoluto.\n`);
  }

  const deltaTotal = totalPublicado - (existing.Item?.total_publicado ?? 0);
  const deltaProjeto = totalProjetoPublicado - (existing.Item?.total_projeto_publicado ?? 0);

  if (deltaTotal === 0 && deltaProjeto === 0) {
    console.log("   ✅ Contador já está correto — nada a fazer.\n");
    return;
  }

  console.log(`   Delta a aplicar: total_publicado ${deltaTotal >= 0 ? "+" : ""}${deltaTotal}, total_projeto_publicado ${deltaProjeto >= 0 ? "+" : ""}${deltaProjeto}`);

  if (DRY_RUN) {
    console.log("\n   (dry-run) nenhuma escrita realizada.\n");
    return;
  }

  await dynamo.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { slug: COUNTERS_SLUG },
    UpdateExpression: "ADD total_publicado :dt, total_projeto_publicado :dp",
    ExpressionAttributeValues: { ":dt": deltaTotal, ":dp": deltaProjeto },
  }));

  console.log("\n   ✅ Contador atualizado com sucesso.\n");
}

main().catch((err) => {
  console.error("\n❌ Erro fatal:", err.message);
  process.exit(1);
});
