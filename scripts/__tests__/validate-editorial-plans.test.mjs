import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  ajvInstance,
  loadSchema,
  parseFrontMatter,
  validateFile,
} from '../validate-editorial-plans.mjs';

function compileSchema() {
  const schema = loadSchema();
  const ajv = ajvInstance();
  return ajv.compile(schema);
}

function writePlan(dir, relPath, frontMatter) {
  const full = path.join(dir, relPath);
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, `---\n${frontMatter}\n---\n\n# body\n`);
  return full;
}

const VALID_FM = `id: POST-PLAN-2026-900
title: Test plan
created_at: 2026-06-27
updated_at: 2026-06-27
status: idea
schema_version: "1.0"
source_skill: post-planning
contains_sensitive_content: false`;

test('schema: valid plan passes', () => {
  const validate = compileSchema();
  const { data } = parseFrontMatter(`---\n${VALID_FM}\n---\n`);
  assert.equal(validate(data), true, JSON.stringify(validate.errors));
});

test('schema: missing required field fails', () => {
  const validate = compileSchema();
  const fmMissingStatus = VALID_FM.split('\n').filter((l) => !l.startsWith('status:')).join('\n');
  const { data } = parseFrontMatter(`---\n${fmMissingStatus}\n---\n`);
  assert.equal(validate(data), false);
});

test('schema: invalid enum value fails', () => {
  const validate = compileSchema();
  const fmBadStatus = VALID_FM.replace('status: idea', 'status: not-a-real-status');
  const { data } = parseFrontMatter(`---\n${fmBadStatus}\n---\n`);
  assert.equal(validate(data), false);
});

test('schema: unknown additional property fails (closed contract)', () => {
  const validate = compileSchema();
  const { data } = parseFrontMatter(`---\n${VALID_FM}\nmystery_field: surprise\n---\n`);
  assert.equal(validate(data), false);
});

test('parseFrontMatter: missing front matter block is reported as error, not thrown', () => {
  const result = parseFrontMatter('# no front matter here\n');
  assert.equal(result.error, 'missing front matter block (expected leading --- ... ---)');
});

test('parseFrontMatter: invalid YAML is reported as error, not thrown', () => {
  const result = parseFrontMatter('---\nid: [unterminated\n---\n');
  assert.ok(result.error && result.error.startsWith('invalid YAML'));
});

test('parseFrontMatter: unquoted YYYY-MM-DD dates normalize to ISO strings', () => {
  const { data } = parseFrontMatter(`---\n${VALID_FM}\n---\n`);
  assert.equal(typeof data.created_at, 'string');
  assert.equal(data.created_at, '2026-06-27');
});

test('validateFile: rejects duplicate id across two files', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'editorial-test-'));
  try {
    const validate = compileSchema();
    const seenIds = new Map();
    const fileA = writePlan(dir, 'a.md', VALID_FM);
    const fileB = writePlan(dir, 'b.md', VALID_FM); // same id on purpose

    const resultA = validateFile(fileA, validate, seenIds);
    assert.equal(resultA.errors.length, 0, JSON.stringify(resultA.errors));

    const resultB = validateFile(fileB, validate, seenIds);
    assert.ok(resultB.errors.some((e) => e.includes('duplicate id')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('lifecycle: scheduled without planned_publication fails', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'editorial-test-'));
  try {
    const validate = compileSchema();
    const fm = VALID_FM.replace('status: idea', 'status: scheduled');
    const file = writePlan(dir, 'x.md', fm);
    const { errors } = validateFile(file, validate, new Map());
    assert.ok(errors.some((e) => e.includes('requires planned_publication')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('lifecycle: published without published_at and canonical_content fails', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'editorial-test-'));
  try {
    const validate = compileSchema();
    const fm = VALID_FM.replace('status: idea', 'status: published');
    const file = writePlan(dir, 'x.md', fm);
    const { errors } = validateFile(file, validate, new Map());
    assert.ok(errors.some((e) => e.includes('requires published_at')));
    assert.ok(errors.some((e) => e.includes('requires canonical_content')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('lifecycle: published with all required fields but no receipt only warns', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'editorial-test-'));
  try {
    const validate = compileSchema();
    const fm =
      VALID_FM.replace('status: idea', 'status: published') +
      '\npublished_at: 2026-07-01\ncanonical_content: https://example.com/post';
    const file = writePlan(dir, 'x.md', fm);
    const { errors, warnings } = validateFile(file, validate, new Map());
    assert.equal(errors.length, 0, JSON.stringify(errors));
    assert.ok(warnings.some((w) => w.includes('publication_receipt')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('security: sensitive content blocks ready/scheduled/published without human review', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'editorial-test-'));
  try {
    const validate = compileSchema();
    const fm =
      VALID_FM.replace('status: idea', 'status: ready').replace(
        'contains_sensitive_content: false',
        'contains_sensitive_content: true'
      );
    const file = writePlan(dir, 'x.md', fm);
    const { errors } = validateFile(file, validate, new Map());
    assert.ok(errors.some((e) => e.includes('human_review_required')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('security: sensitive content with human_review_required passes the gate', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'editorial-test-'));
  try {
    const validate = compileSchema();
    const fm =
      VALID_FM.replace('status: idea', 'status: ready')
        .replace('contains_sensitive_content: false', 'contains_sensitive_content: true') +
      '\nhuman_review_required: true';
    const file = writePlan(dir, 'x.md', fm);
    const { errors } = validateFile(file, validate, new Map());
    assert.ok(!errors.some((e) => e.includes('human_review_required')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('ids: format validated by schema pattern', () => {
  const validate = compileSchema();
  const fmBadId = VALID_FM.replace('id: POST-PLAN-2026-900', 'id: not-the-right-format');
  const { data } = parseFrontMatter(`---\n${fmBadId}\n---\n`);
  assert.equal(validate(data), false);
});

test('missing schema_version is reported as an actionable error', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'editorial-test-'));
  try {
    const validate = compileSchema();
    const fm = VALID_FM.split('\n').filter((l) => !l.startsWith('schema_version:')).join('\n');
    const file = writePlan(dir, 'x.md', fm);
    const { errors } = validateFile(file, validate, new Map());
    assert.ok(errors.some((e) => e.includes('missing schema_version')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
