#!/usr/bin/env node
/**
 * scripts/backfill-gsi-markers.mjs
 *
 * Migração de GSI de baixa cardinalidade (docs/plano-migracao-gsi-dynamodb.md).
 * Popula os atributos esparsos e_popular_marker/e_projeto_marker — só
 * existem no item quando o respectivo flag é 1. Isso permite recriar as
 * GSIs PopularesPorData/ProjetoPorData com uma hash_key de alta
 * cardinalidade efetiva (sparse index), em vez de um Number 0/1.
 *
 * Roda via AWS SDK direto (não AWS CLI) — ver
 * memory/feedback_aws_cli_windows_encoding.md.
 *
 * Uso (a partir de scripts/, após `npm install` uma vez):
 *   AWS_PROFILE=claude-dev node backfill-gsi-markers.mjs [--dry-run] [--table marcelo-goncalves-blog-dev-posts]
 *
 * --dry-run: lista o que seria feito sem gravar nada.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const AWS_REGION = "us-east-1";

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
      ProjectionExpression: "slug, e_popular, e_projeto, e_popular_marker, e_projeto_marker",
      ExclusiveStartKey: lastKey,
    }));
    items.push(...(result.Items || []));
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);
  return items;
}

async function main() {
  console.log(`\n🔄 Backfill GSI markers — tabela: ${TABLE_NAME}`);
  if (DRY_RUN) console.log("   ⚠️  Modo --dry-run: nenhum dado será gravado.\n");

  const items = await scanAll(TABLE_NAME);
  console.log(`   ${items.length} item(ns) encontrado(s).\n`);

  let popularSet = 0, popularRemoved = 0, projetoSet = 0, projetoRemoved = 0, skipped = 0, errors = 0;

  for (const item of items) {
    const updates = {};
    const removes = [];

    // e_popular_marker: setar "POP" se e_popular=1, remover se já existir e e_popular!=1
    if (item.e_popular === 1) {
      if (item.e_popular_marker !== "POP") updates.e_popular_marker = "POP";
    } else if (item.e_popular_marker !== undefined) {
      removes.push("e_popular_marker");
    }

    // e_projeto_marker: setar "PROJ" se e_projeto=1, remover se já existir e e_projeto!=1
    if (item.e_projeto === 1) {
      if (item.e_projeto_marker !== "PROJ") updates.e_projeto_marker = "PROJ";
    } else if (item.e_projeto_marker !== undefined) {
      removes.push("e_projeto_marker");
    }

    if (Object.keys(updates).length === 0 && removes.length === 0) {
      skipped++;
      continue;
    }

    process.stdout.write(`   🔄 [${item.slug}] `);

    const setExpr = Object.keys(updates).length > 0
      ? "SET " + Object.keys(updates).map((k) => `${k} = :${k}`).join(", ")
      : "";
    const removeExpr = removes.length > 0 ? "REMOVE " + removes.join(", ") : "";
    const UpdateExpression = [setExpr, removeExpr].filter(Boolean).join(" ");
    const ExpressionAttributeValues = Object.keys(updates).length > 0
      ? Object.fromEntries(Object.entries(updates).map(([k, v]) => [`:${k}`, v]))
      : undefined;

    if (DRY_RUN) {
      console.log(`(dry-run) ${UpdateExpression}`);
      if (updates.e_popular_marker) popularSet++;
      if (removes.includes("e_popular_marker")) popularRemoved++;
      if (updates.e_projeto_marker) projetoSet++;
      if (removes.includes("e_projeto_marker")) projetoRemoved++;
      continue;
    }

    try {
      await dynamo.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { slug: item.slug },
        UpdateExpression,
        ExpressionAttributeValues,
      }));
      console.log(`OK (${UpdateExpression})`);
      if (updates.e_popular_marker) popularSet++;
      if (removes.includes("e_popular_marker")) popularRemoved++;
      if (updates.e_projeto_marker) projetoSet++;
      if (removes.includes("e_projeto_marker")) projetoRemoved++;
    } catch (err) {
      console.log(`ERRO: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Resultado:`);
  console.log(`   e_popular_marker setado: ${popularSet} | removido: ${popularRemoved}`);
  console.log(`   e_projeto_marker setado: ${projetoSet} | removido: ${projetoRemoved}`);
  console.log(`   Sem mudança necessária: ${skipped}`);
  console.log(`   Erros: ${errors}\n`);

  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error("\n❌ Erro fatal:", err.message);
  process.exit(1);
});
