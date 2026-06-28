#!/usr/bin/env node
/**
 * scripts/backup-posts-table.mjs
 *
 * Backup completo (scan) da tabela posts, salvo como JSON local. Roda via
 * AWS SDK direto (não AWS CLI) — AWS CLI no Windows corrompe caracteres
 * não-ASCII em conteudo_html (codepage 850), causando crash a meio do
 * stream. Ver memory/feedback_aws_cli_windows_encoding.md.
 *
 * Uso (a partir de scripts/, após `npm install` uma vez):
 *   AWS_PROFILE=claude-dev node backup-posts-table.mjs [--table marcelo-goncalves-blog-dev-posts]
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { writeFileSync } from "fs";

const AWS_REGION = "us-east-1";

function argValue(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : fallback;
}

const TABLE_NAME = argValue("--table", "marcelo-goncalves-blog-dev-posts");

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: AWS_REGION }));

async function scanAll(tableName) {
  const items = [];
  let lastKey;
  do {
    const result = await dynamo.send(new ScanCommand({
      TableName: tableName,
      ExclusiveStartKey: lastKey,
    }));
    items.push(...(result.Items || []));
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);
  return items;
}

async function main() {
  console.log(`\n📦 Backup — tabela: ${TABLE_NAME}\n`);

  const items = await scanAll(TABLE_NAME);
  console.log(`   ${items.length} item(ns) lido(s).`);

  const date = new Date().toISOString().slice(0, 10);
  const outPath = new URL(`./backups/${TABLE_NAME}-backup-${date}.json`, import.meta.url);
  writeFileSync(outPath, JSON.stringify({ tableName: TABLE_NAME, exportedAt: new Date().toISOString(), itemCount: items.length, items }, null, 2), "utf-8");

  console.log(`   ✅ Salvo em: ${outPath.pathname}\n`);
}

main().catch((err) => {
  console.error("\n❌ Erro fatal:", err.message);
  process.exit(1);
});
