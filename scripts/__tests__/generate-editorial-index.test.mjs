import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEntries, toJson, toMarkdown } from '../generate-editorial-index.mjs';

test('buildEntries: returns a deterministic, id-sorted list', () => {
  const first = buildEntries();
  const second = buildEntries();
  assert.deepEqual(first, second);
  for (let i = 1; i < first.length; i++) {
    assert.ok(first[i - 1].id.localeCompare(first[i].id) <= 0, `entries out of order at index ${i}`);
  }
});

test('buildEntries: every entry has a unique id (index assumes this)', () => {
  const entries = buildEntries();
  const ids = entries.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('toJson: stable output for the same input, valid JSON', () => {
  const entries = buildEntries();
  const json = toJson(entries);
  const parsed = JSON.parse(json);
  assert.equal(parsed.count, entries.length);
  assert.deepEqual(parsed.plans.map((p) => p.id), entries.map((e) => e.id));
});

test('toMarkdown: one table row per entry, header present', () => {
  const entries = buildEntries().slice(0, 3);
  const md = toMarkdown(entries);
  assert.ok(md.includes('| ID | Title | Status |'));
  for (const e of entries) {
    assert.ok(md.includes(e.id), `missing row for ${e.id}`);
  }
});

test('toMarkdown: null/unknown fields render as em dash, not "null" or "undefined"', () => {
  const md = toMarkdown([
    {
      id: 'POST-PLAN-2026-999',
      title: 'x',
      status: 'idea',
      content_pillar: null,
      series: null,
      priority: null,
      created_at: '2026-01-01',
      planned_publication: null,
      published_at: null,
    },
  ]);
  assert.ok(!md.includes('null'));
  assert.ok(!md.includes('undefined'));
  assert.ok(md.includes('—'));
});
