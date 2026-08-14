#!/usr/bin/env node
// Deterministic validator for Publication Receipts (editorial/receipts/) and
// Outcomes (editorial/outcomes/) — prompt-evolucao-subsistema-editorial.md
// §18-20, §25. Same no-LLM rationale as scripts/validate-editorial-plans.mjs.
//
// Both directories are stub contracts as of Fase E: no code writes these
// files automatically yet (CMS integration is design-doc-only). This
// validator exists so the contract is enforceable the moment real records
// start showing up, instead of retrofitting enforcement later.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import Ajv from 'ajv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const RECEIPTS_DIR = path.join(REPO_ROOT, 'editorial', 'receipts');
const OUTCOMES_DIR = path.join(REPO_ROOT, 'editorial', 'outcomes');
const PLANS_DIR = path.join(REPO_ROOT, 'editorial', 'plans');

const PII_PATTERNS = [
  { name: 'email', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ },
  { name: 'phone', regex: /\(?\d{2,3}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}/ },
];

function ajvInstance() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  ajv.addFormat('date', {
    validate: (value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      const d = new Date(`${value}T00:00:00Z`);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
    },
  });
  ajv.addFormat('date-time', {
    validate: (value) => !Number.isNaN(new Date(value).getTime()),
  });
  ajv.addFormat('uri', {
    validate: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
  });
  return ajv;
}

function loadJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function listRecordFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => (f.endsWith('.yml') || f.endsWith('.yaml')) && f !== 'README.md')
    .map((f) => path.join(dir, f));
}

function parseYamlFile(file) {
  try {
    const data = yaml.load(readFileSync(file, 'utf8'), { schema: yaml.JSON_SCHEMA });
    return { data: data ?? {} };
  } catch (err) {
    return { error: `invalid YAML: ${err.message}` };
  }
}

function knownPlanIds() {
  const ids = new Set();
  if (!existsSync(PLANS_DIR)) return ids;
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'templates') continue;
        walk(full);
      } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
        const match = readFileSync(full, 'utf8').match(/^id:\s*(\S+)/m);
        if (match) ids.add(match[1]);
      }
    }
  };
  walk(PLANS_DIR);
  return ids;
}

function scanForPii(rawText) {
  const hits = [];
  for (const { name, regex } of PII_PATTERNS) {
    if (regex.test(rawText)) hits.push(name);
  }
  return hits;
}

export function validateReceiptFile(file, validate, planIds) {
  const errors = [];
  const raw = readFileSync(file, 'utf8');
  const { data, error } = parseYamlFile(file);
  if (error) return { errors: [error] };

  if (!validate(data)) {
    for (const e of validate.errors) errors.push(`schema: ${e.instancePath || '(root)'} ${e.message}`);
  }

  // codex CLI review: a receipt pointing at a plan id that doesn't exist
  // is a broken link a schema-shape check alone can't catch.
  if (data.editorial_plan_id && planIds && !planIds.has(data.editorial_plan_id)) {
    errors.push(`editorial_plan_id "${data.editorial_plan_id}" does not match any known plan id`);
  }

  const piiHits = scanForPii(raw);
  if (piiHits.length > 0) errors.push(`possible PII pattern(s) detected (${piiHits.join(', ')}) - receipts must never carry raw personal data`);

  return { errors, data };
}

export function validateOutcomeFile(file, validate, planIds, receiptsById) {
  const errors = [];
  const raw = readFileSync(file, 'utf8');
  const { data, error } = parseYamlFile(file);
  if (error) return { errors: [error] };

  if (!validate(data)) {
    for (const e of validate.errors) errors.push(`schema: ${e.instancePath || '(root)'} ${e.message}`);
  }

  // Cross-reference: an outcome pointing at a plan id that doesn't exist
  // is a broken link, not a schema-shape problem, so it's checked here.
  if (data.editorial_plan_id && planIds && !planIds.has(data.editorial_plan_id)) {
    errors.push(`editorial_plan_id "${data.editorial_plan_id}" does not match any known plan id`);
  }

  // codex CLI review: publication_id being required only checked shape,
  // not that a matching receipt actually exists - a fabricated
  // PUB-2026-999 would have passed. Now requires a real receipt file with
  // that id, and that the receipt agrees on which plan it's for.
  // receiptsById being undefined (vs. an empty Map) distinguishes "caller
  // has no receipt context, skip this check" from "caller knows there are
  // zero real receipts, so any publication_id must fail" - the latter is
  // exactly the fabricated-id gap the codex review found, and an
  // empty-Map-means-skip check (size > 0) would have silently reintroduced it.
  if (data.publication_id && receiptsById) {
    const receipt = receiptsById.get(data.publication_id);
    if (!receipt) {
      errors.push(`publication_id "${data.publication_id}" does not match any known Publication Receipt`);
    } else if (receipt.editorial_plan_id && data.editorial_plan_id && receipt.editorial_plan_id !== data.editorial_plan_id) {
      errors.push(
        `publication_id "${data.publication_id}" belongs to a receipt for plan "${receipt.editorial_plan_id}", not "${data.editorial_plan_id}"`
      );
    }
  }

  if (data.measurement_period && data.measurement_period.from && data.measurement_period.to) {
    if (data.measurement_period.to < data.measurement_period.from) {
      errors.push('measurement_period.to is before measurement_period.from');
    }
  }

  // §20: an outcome must never fold the plan's ex-ante hypothesis text
  // back into itself - the two artifacts stay in separate directories by
  // construction (editorial/plans/ vs editorial/outcomes/), which this
  // check makes explicit rather than assumed.
  if (path.dirname(file) === PLANS_DIR) {
    errors.push('outcome file must not live inside editorial/plans/ - plan and outcome are separate artifacts');
  }

  const piiHits = scanForPii(raw);
  if (piiHits.length > 0) errors.push(`possible PII pattern(s) detected (${piiHits.join(', ')}) - outcomes must use aggregate/sanitized data only`);

  return { errors, data };
}

export function main() {
  const receiptSchema = loadJson(path.join(REPO_ROOT, 'editorial', 'schema', 'publication-receipt.schema.json'));
  const outcomeSchema = loadJson(path.join(REPO_ROOT, 'editorial', 'schema', 'outcome.schema.json'));
  const ajv = ajvInstance();
  const validateReceipt = ajv.compile(receiptSchema);
  const validateOutcome = ajv.compile(outcomeSchema);

  const receiptFiles = listRecordFiles(RECEIPTS_DIR);
  const outcomeFiles = listRecordFiles(OUTCOMES_DIR);
  const planIds = knownPlanIds();

  let hadErrors = false;
  const seenReceiptIds = new Map();
  const receiptsById = new Map();

  for (const file of receiptFiles.sort()) {
    const relPath = path.relative(REPO_ROOT, file);
    const { errors, data } = validateReceiptFile(file, validateReceipt, planIds);
    if (data && data.publication_id) {
      if (seenReceiptIds.has(data.publication_id)) {
        errors.push(`duplicate publication_id, already used by ${seenReceiptIds.get(data.publication_id)}`);
      } else {
        seenReceiptIds.set(data.publication_id, relPath);
        receiptsById.set(data.publication_id, data);
      }
    }
    if (errors.length > 0) {
      hadErrors = true;
      console.error(`\nFAIL ${relPath}`);
      for (const e of errors) console.error(`  - ${e}`);
    }
  }

  const seenOutcomeIds = new Map();

  for (const file of outcomeFiles.sort()) {
    const relPath = path.relative(REPO_ROOT, file);
    const { errors, data } = validateOutcomeFile(file, validateOutcome, planIds, receiptsById);
    if (data && data.outcome_id) {
      if (seenOutcomeIds.has(data.outcome_id)) {
        errors.push(`duplicate outcome_id, already used by ${seenOutcomeIds.get(data.outcome_id)}`);
      } else {
        seenOutcomeIds.set(data.outcome_id, relPath);
      }
    }
    if (errors.length > 0) {
      hadErrors = true;
      console.error(`\nFAIL ${relPath}`);
      for (const e of errors) console.error(`  - ${e}`);
    }
  }

  const total = receiptFiles.length + outcomeFiles.length;
  console.log(`\nValidated ${receiptFiles.length} receipt(s), ${outcomeFiles.length} outcome(s).`);
  if (total === 0) {
    console.log('No records yet - both directories are stub contracts pending real CMS integration (Fase F).');
  }
  if (hadErrors) {
    console.error('Validation failed.');
    process.exit(1);
  }
  console.log('All records valid.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
