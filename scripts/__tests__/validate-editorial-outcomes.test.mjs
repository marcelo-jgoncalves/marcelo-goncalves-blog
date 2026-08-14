import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import Ajv from 'ajv';
import { validateReceiptFile, validateOutcomeFile } from '../validate-editorial-outcomes.mjs';

const REPO_ROOT = path.resolve(import.meta.dirname, '..', '..');
const receiptSchema = JSON.parse(
  readFileSync(path.join(REPO_ROOT, 'editorial', 'schema', 'publication-receipt.schema.json'), 'utf8')
);
const outcomeSchema = JSON.parse(
  readFileSync(path.join(REPO_ROOT, 'editorial', 'schema', 'outcome.schema.json'), 'utf8')
);

function ajvInstance() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  ajv.addFormat('date', /^\d{4}-\d{2}-\d{2}$/);
  ajv.addFormat('date-time', { validate: (v) => !Number.isNaN(new Date(v).getTime()) });
  ajv.addFormat('uri', {
    validate: (v) => {
      try {
        new URL(v);
        return true;
      } catch {
        return false;
      }
    },
  });
  return ajv;
}

function writeYaml(dir, name, content) {
  const full = path.join(dir, name);
  writeFileSync(full, content);
  return full;
}

const VALID_RECEIPT = `
publication_id: PUB-2026-001
editorial_plan_id: POST-PLAN-2026-001
platform_content_id: cms-abc123
canonical_url: https://mgoncalves.dev/artigos/some-post
published_at: 2026-08-14T12:00:00Z
environment: production
verification_source: cms-api
schema_version: "1.0"
`;

const VALID_OUTCOME = `
outcome_id: OUTCOME-2026-001
editorial_plan_id: POST-PLAN-2026-001
publication_id: PUB-2026-001
measurement_period:
  from: 2026-08-14
  to: 2026-09-14
metrics:
  pageviews: 1200
qualified_leads: 3
attributable_revenue: null
learnings:
  - "readers engaged most with the code examples"
limitations:
  - "small sample size, one month only"
data_quality: measured
provenance:
  - "GA4 export 2026-09-15"
schema_version: "1.0"
`;

test('receipt: valid record passes schema and PII scan', () => {
  const ajv = ajvInstance();
  const validate = ajv.compile(receiptSchema);
  const dir = mkdtempSync(path.join(tmpdir(), 'receipt-test-'));
  try {
    const file = writeYaml(dir, 'PUB-2026-001.yml', VALID_RECEIPT);
    const { errors } = validateReceiptFile(file, validate);
    assert.deepEqual(errors, []);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('receipt: missing required field fails', () => {
  const ajv = ajvInstance();
  const validate = ajv.compile(receiptSchema);
  const dir = mkdtempSync(path.join(tmpdir(), 'receipt-test-'));
  try {
    const bad = VALID_RECEIPT.replace('environment: production\n', '');
    const file = writeYaml(dir, 'bad.yml', bad);
    const { errors } = validateReceiptFile(file, validate);
    assert.ok(errors.some((e) => e.includes('schema:')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('receipt: non-https canonical_url fails', () => {
  const ajv = ajvInstance();
  const validate = ajv.compile(receiptSchema);
  const dir = mkdtempSync(path.join(tmpdir(), 'receipt-test-'));
  try {
    const bad = VALID_RECEIPT.replace('https://mgoncalves.dev', 'http://mgoncalves.dev');
    const file = writeYaml(dir, 'bad.yml', bad);
    const { errors } = validateReceiptFile(file, validate);
    assert.ok(errors.some((e) => e.includes('schema:')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('receipt: embedded PII is rejected even if schema-valid', () => {
  const ajv = ajvInstance();
  const validate = ajv.compile(receiptSchema);
  const dir = mkdtempSync(path.join(tmpdir(), 'receipt-test-'));
  try {
    const withPii = VALID_RECEIPT + '\n# contact: someone@example.com\n';
    const file = writeYaml(dir, 'bad.yml', withPii);
    const { errors } = validateReceiptFile(file, validate);
    assert.ok(errors.some((e) => e.includes('PII')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('outcome: valid record passes', () => {
  const ajv = ajvInstance();
  const validate = ajv.compile(outcomeSchema);
  const dir = mkdtempSync(path.join(tmpdir(), 'outcome-test-'));
  try {
    const file = writeYaml(dir, 'OUTCOME-2026-001.yml', VALID_OUTCOME);
    const { errors } = validateOutcomeFile(file, validate, new Set(['POST-PLAN-2026-001']));
    assert.deepEqual(errors, []);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('outcome: missing publication_id fails (spec requires a publication ref)', () => {
  const ajv = ajvInstance();
  const validate = ajv.compile(outcomeSchema);
  const dir = mkdtempSync(path.join(tmpdir(), 'outcome-test-'));
  try {
    const bad = VALID_OUTCOME.replace('publication_id: PUB-2026-001\n', '');
    const file = writeYaml(dir, 'bad.yml', bad);
    const { errors } = validateOutcomeFile(file, validate, new Set(['POST-PLAN-2026-001']));
    assert.ok(errors.some((e) => e.includes('schema:')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('outcome: metrics without provenance fails', () => {
  const ajv = ajvInstance();
  const validate = ajv.compile(outcomeSchema);
  const dir = mkdtempSync(path.join(tmpdir(), 'outcome-test-'));
  try {
    const bad = VALID_OUTCOME.replace(/provenance:\n  - "GA4 export 2026-09-15"\n/, 'provenance: []\n');
    const file = writeYaml(dir, 'bad.yml', bad);
    const { errors } = validateOutcomeFile(file, validate, new Set(['POST-PLAN-2026-001']));
    assert.ok(errors.some((e) => e.includes('schema:')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('outcome: reference to unknown plan id fails', () => {
  const ajv = ajvInstance();
  const validate = ajv.compile(outcomeSchema);
  const dir = mkdtempSync(path.join(tmpdir(), 'outcome-test-'));
  try {
    const file = writeYaml(dir, 'OUTCOME-2026-001.yml', VALID_OUTCOME);
    const { errors } = validateOutcomeFile(file, validate, new Set(['POST-PLAN-2026-999']));
    assert.ok(errors.some((e) => e.includes('does not match any known plan id')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('outcome: PII in metrics/business_signals context is rejected', () => {
  const ajv = ajvInstance();
  const validate = ajv.compile(outcomeSchema);
  const dir = mkdtempSync(path.join(tmpdir(), 'outcome-test-'));
  try {
    const withPii = VALID_OUTCOME + '\n# lead: joao@example.com\n';
    const file = writeYaml(dir, 'bad.yml', withPii);
    const { errors } = validateOutcomeFile(file, validate, new Set(['POST-PLAN-2026-001']));
    assert.ok(errors.some((e) => e.includes('PII')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('outcome: fabricated publication_id with no matching receipt fails (codex CLI review finding)', () => {
  // Before this fix, publication_id being "required" only checked its
  // regex shape - a made-up PUB-2026-999 with no real receipt would pass.
  const ajv = ajvInstance();
  const validate = ajv.compile(outcomeSchema);
  const dir = mkdtempSync(path.join(tmpdir(), 'outcome-test-'));
  try {
    const file = writeYaml(dir, 'OUTCOME-2026-001.yml', VALID_OUTCOME);
    const receiptsById = new Map(); // no real receipts known
    const { errors } = validateOutcomeFile(file, validate, new Set(['POST-PLAN-2026-001']), receiptsById);
    assert.ok(errors.some((e) => e.includes('does not match any known Publication Receipt')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('outcome: receipt exists but for a different plan fails', () => {
  const ajv = ajvInstance();
  const validate = ajv.compile(outcomeSchema);
  const dir = mkdtempSync(path.join(tmpdir(), 'outcome-test-'));
  try {
    const file = writeYaml(dir, 'OUTCOME-2026-001.yml', VALID_OUTCOME);
    const receiptsById = new Map([['PUB-2026-001', { editorial_plan_id: 'POST-PLAN-2026-999' }]]);
    const { errors } = validateOutcomeFile(file, validate, new Set(['POST-PLAN-2026-001', 'POST-PLAN-2026-999']), receiptsById);
    assert.ok(errors.some((e) => e.includes('belongs to a receipt for plan')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('outcome: measurement_period.to before .from fails', () => {
  const ajv = ajvInstance();
  const validate = ajv.compile(outcomeSchema);
  const dir = mkdtempSync(path.join(tmpdir(), 'outcome-test-'));
  try {
    const bad = VALID_OUTCOME.replace('from: 2026-08-14\n  to: 2026-09-14', 'from: 2026-09-14\n  to: 2026-08-14');
    const file = writeYaml(dir, 'bad.yml', bad);
    const receiptsById = new Map([['PUB-2026-001', { editorial_plan_id: 'POST-PLAN-2026-001' }]]);
    const { errors } = validateOutcomeFile(file, validate, new Set(['POST-PLAN-2026-001']), receiptsById);
    assert.ok(errors.some((e) => e.includes('before measurement_period.from')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('receipt: reference to unknown plan id fails', () => {
  const ajv = ajvInstance();
  const validate = ajv.compile(receiptSchema);
  const dir = mkdtempSync(path.join(tmpdir(), 'receipt-test-'));
  try {
    const file = writeYaml(dir, 'PUB-2026-001.yml', VALID_RECEIPT);
    const { errors } = validateReceiptFile(file, validate, new Set(['POST-PLAN-2026-999']));
    assert.ok(errors.some((e) => e.includes('does not match any known plan id')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('outcome: plan and outcome stay separate artifacts (directory check)', () => {
  const ajv = ajvInstance();
  const validate = ajv.compile(outcomeSchema);
  const plansDir = path.join(REPO_ROOT, 'editorial', 'plans');
  const fakeFileInPlansDir = path.join(plansDir, '__temp-outcome-test.yml');
  writeFileSync(fakeFileInPlansDir, VALID_OUTCOME);
  try {
    const { errors } = validateOutcomeFile(fakeFileInPlansDir, validate, new Set(['POST-PLAN-2026-001']));
    assert.ok(errors.some((e) => e.includes('separate artifacts')));
  } finally {
    rmSync(fakeFileInPlansDir, { force: true });
  }
});
