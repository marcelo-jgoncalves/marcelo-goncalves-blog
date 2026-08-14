import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';

const REPO_ROOT = path.resolve(import.meta.dirname, '..', '..');
const schema = JSON.parse(
  readFileSync(path.join(REPO_ROOT, 'editorial', 'schema', 'capital-agent-signal.schema.json'), 'utf8')
);

function ajvInstance() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  ajv.addFormat('date-time', { validate: (v) => !Number.isNaN(new Date(v).getTime()) });
  return ajv;
}

const BASE = {
  signal_id: 'SIGNAL-2026-001',
  editorial_plan_id: 'POST-PLAN-2026-001',
  generated_at: '2026-08-14T12:00:00Z',
  schema_version: '1.0',
};

test('publication_receipt signal requires publication_id', () => {
  const validate = ajvInstance().compile(schema);
  const missing = { ...BASE, signal_type: 'publication_receipt' };
  assert.equal(validate(missing), false);

  const withId = { ...missing, publication_id: 'PUB-2026-001' };
  assert.equal(validate(withId), true, JSON.stringify(validate.errors));
});

test('sanitized_outcome signal requires outcome_id and aggregate_metrics', () => {
  const validate = ajvInstance().compile(schema);
  const missingBoth = { ...BASE, signal_type: 'sanitized_outcome' };
  assert.equal(validate(missingBoth), false);

  const missingMetrics = { ...missingBoth, outcome_id: 'OUTCOME-2026-001' };
  assert.equal(validate(missingMetrics), false);

  const complete = { ...missingMetrics, aggregate_metrics: { pageviews: 1200 } };
  assert.equal(validate(complete), true, JSON.stringify(validate.errors));
});

test('attribution_summary signal does not require publication_id or outcome_id', () => {
  const validate = ajvInstance().compile(schema);
  const valid = { ...BASE, signal_type: 'attribution_summary', attribution_tags: ['organic-search'] };
  assert.equal(validate(valid), true, JSON.stringify(validate.errors));
});

test('closed contract: unknown field is rejected', () => {
  const validate = ajvInstance().compile(schema);
  const withExtra = { ...BASE, signal_type: 'attribution_summary', lead_email: 'someone@example.com' };
  assert.equal(validate(withExtra), false);
});

test('unknown signal_type is rejected by the enum', () => {
  const validate = ajvInstance().compile(schema);
  const bad = { ...BASE, signal_type: 'raw_lead_export' };
  assert.equal(validate(bad), false);
});
