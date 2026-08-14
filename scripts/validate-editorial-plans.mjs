#!/usr/bin/env node
// Deterministic validator for editorial plans (editorial/plans/**/*.md).
// No LLM involved on purpose (prompt-evolucao-subsistema-editorial.md §10):
// front matter shape, lifecycle invariants and ID uniqueness are all
// mechanically checkable, so an LLM call would only add latency and
// nondeterminism to a CI gate.
//
// Usage:
//   node scripts/validate-editorial-plans.mjs               # validate all plans
//   node scripts/validate-editorial-plans.mjs --changed-only # validate only files
//                                                             # changed vs origin/develop
//
// --changed-only exists because the 26 pre-existing plans (migrated before
// this validator existed) don't carry schema_version yet (Fase G migration,
// not done in this pass) — running full strict validation in CI today would
// fail the pipeline for files nobody touched. Scoping CI to changed files
// lets new/edited plans be enforced immediately while migration happens
// incrementally, without blocking unrelated work.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import Ajv from 'ajv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const PLANS_DIR = path.join(REPO_ROOT, 'editorial', 'plans');
const SCHEMA_PATH = path.join(REPO_ROOT, 'editorial', 'schema', 'editorial-plan.schema.json');

const VALID_STATUSES = [
  'idea',
  'researching',
  'planned',
  'drafting',
  'ready',
  'scheduled',
  'published',
  'cancelled',
  'archived',
];

const SENSITIVE_GATED_STATUSES = new Set(['ready', 'scheduled', 'published']);

const PII_PATTERNS = [
  { name: 'email', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ },
  // Loose BR/international phone shape; auxiliary signal only, not the sole
  // defense (prompt §12: "Não use regex como única defesa" — Gitleaks in
  // security.yml covers secrets/credentials separately).
  { name: 'phone', regex: /\(?\d{2,3}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}/ },
];

export function ajvInstance() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  // No ajv-formats dependency in this repo; only the two formats the
  // schema actually uses are needed, so define them inline rather than
  // adding a new dependency for two regexes.
  // A regex alone accepts calendar-impossible dates like 2026-99-99 (flagged
  // in codex CLI review); parse and round-trip through Date to catch those
  // too, without pulling in a date library for one check.
  ajv.addFormat('date', {
    validate: (value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      const d = new Date(`${value}T00:00:00Z`);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
    },
  });
  return ajv;
}

export function loadSchema() {
  return JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'));
}

function listPlanFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === 'templates') continue; // template is not a plan instance
      results.push(...listPlanFiles(full));
    } else if (entry.endsWith('.md') && entry !== 'README.md') {
      results.push(full);
    }
  }
  return results;
}

// On a pull_request run, GITHUB_BASE_REF is the target branch (e.g.
// "develop") and origin/<base> vs HEAD is the right diff. On a push run
// (cd.yml, triggered after merge to develop), HEAD *is* origin/develop by
// the time this runs — diffing against it would always return empty and
// silently skip validation. HEAD~1 approximates "what this push changed"
// for the common single-commit-per-push flow (squash-merge PRs).
function resolveDiffRange() {
  if (process.env.GITHUB_BASE_REF) {
    return { base: `origin/${process.env.GITHUB_BASE_REF}`, useMergeBase: true };
  }
  return { base: 'HEAD~1', useMergeBase: false };
}

function getChangedPlanFiles() {
  try {
    const { base, useMergeBase } = resolveDiffRange();
    const range = useMergeBase
      ? execSync(`git merge-base HEAD ${base}`, { cwd: REPO_ROOT }).toString().trim()
      : base;
    const diff = execSync(`git diff --name-only --diff-filter=ACM ${range} HEAD`, {
      cwd: REPO_ROOT,
    })
      .toString()
      .split('\n')
      .filter(Boolean);
    return diff
      .filter((f) => f.startsWith('editorial/plans/') && f.endsWith('.md') && !f.endsWith('README.md'))
      .filter((f) => !f.includes('/templates/'))
      .map((f) => path.join(REPO_ROOT, f));
  } catch (err) {
    console.error('warning: could not compute changed files against origin/develop, falling back to full scan:', err.message);
    return listPlanFiles(PLANS_DIR);
  }
}

export function parseFrontMatter(raw, filePath) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { error: 'missing front matter block (expected leading --- ... ---)' };
  }
  try {
    // JSON_SCHEMA (not js-yaml's default) has no YAML 1.1 timestamp type,
    // so unquoted YYYY-MM-DD scalars stay plain strings instead of being
    // parsed into JS Date objects. That parsing was tried first and
    // reverted: Date's own overflow semantics silently "fix" an invalid
    // calendar date like 2026-99-99 into a valid one (2034-06-07) before
    // the schema's format check ever sees it — worse than rejecting it.
    const data = yaml.load(match[1], { schema: yaml.JSON_SCHEMA }) ?? {};
    return { data };
  } catch (err) {
    return { error: `invalid YAML: ${err.message}` };
  }
}

function expectedDateFromPath(filePath) {
  // editorial/plans/YYYY/MM/YYYY-MM-DD-slug.md
  const rel = path.relative(PLANS_DIR, filePath).split(path.sep);
  const [year, month, filename] = rel;
  const dateMatch = filename && filename.match(/^(\d{4})-(\d{2})-(\d{2})-/);
  if (!year || !month || !dateMatch) return null;
  return { year, month, fileDate: `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` };
}

function scanForPii(bodyText) {
  const hits = [];
  for (const { name, regex } of PII_PATTERNS) {
    if (regex.test(bodyText)) hits.push(name);
  }
  return hits;
}

export function validateFile(filePath, validateSchema, seenIds) {
  const errors = [];
  const warnings = [];
  const raw = readFileSync(filePath, 'utf8');
  const relPath = path.relative(REPO_ROOT, filePath);

  const { data, error } = parseFrontMatter(raw, filePath);
  if (error) {
    errors.push(error);
    return { errors, warnings };
  }

  const schemaValid = validateSchema(data);
  if (!schemaValid) {
    for (const e of validateSchema.errors) {
      errors.push(`schema: ${e.instancePath || '(root)'} ${e.message}`);
    }
  }

  // ID uniqueness and format (format already checked by schema pattern;
  // uniqueness needs cross-file state, so it lives here).
  if (data.id) {
    if (seenIds.has(data.id)) {
      errors.push(`duplicate id "${data.id}", already used by ${seenIds.get(data.id)}`);
    } else {
      seenIds.set(data.id, relPath);
    }
  }

  // Path vs created_at consistency.
  const pathInfo = expectedDateFromPath(filePath);
  if (pathInfo && data.created_at) {
    const createdYear = String(data.created_at).slice(0, 4);
    const createdMonth = String(data.created_at).slice(5, 7);
    if (createdYear !== pathInfo.year || createdMonth !== pathInfo.month) {
      errors.push(
        `created_at (${data.created_at}) does not match path year/month (${pathInfo.year}/${pathInfo.month})`
      );
    }
    if (pathInfo.fileDate !== String(data.created_at)) {
      warnings.push(
        `filename date (${pathInfo.fileDate}) differs from created_at (${data.created_at}) — allowed if the plan was renamed, but confirm intentional`
      );
    }
  }

  // Status enum (defense in depth even though schema also enforces it).
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`invalid status "${data.status}", expected one of: ${VALID_STATUSES.join(', ')}`);
  }

  // Lifecycle invariants (editorial/LIFECYCLE.md).
  if (data.status === 'scheduled' && !data.planned_publication) {
    errors.push('status "scheduled" requires planned_publication');
  }
  if (data.status === 'published') {
    if (!data.published_at) errors.push('status "published" requires published_at');
    if (!data.canonical_content) errors.push('status "published" requires canonical_content');
    if (!data.publication_receipt) {
      warnings.push(
        'status "published" without publication_receipt — acceptable while Fase E (Publication Receipt) is not implemented, will become an error once it ships'
      );
    }
  }
  if (data.contains_sensitive_content === true && SENSITIVE_GATED_STATUSES.has(data.status)) {
    if (data.human_review_required !== true) {
      errors.push(
        `contains_sensitive_content: true blocks status "${data.status}" without human_review_required: true`
      );
    }
  }

  // schema_version presence is already required by the schema; this is a
  // clearer, standalone message for the most common actionable gap.
  if (!data.schema_version) {
    errors.push('missing schema_version (see editorial/schema/editorial-plan.schema.json)');
  }

  // Lightweight PII signal on the body text, auxiliary only.
  const piiHits = scanForPii(raw);
  if (piiHits.length > 0 && data.contains_sensitive_content !== true) {
    warnings.push(
      `possible PII pattern(s) detected (${piiHits.join(', ')}) but contains_sensitive_content is not true — review manually`
    );
  }

  return { errors, warnings };
}

export function main() {
  const changedOnly = process.argv.includes('--changed-only');
  const schema = loadSchema();
  const ajv = ajvInstance();
  const validateSchema = ajv.compile(schema);

  const files = changedOnly ? getChangedPlanFiles() : listPlanFiles(PLANS_DIR);

  if (files.length === 0) {
    console.log(changedOnly ? 'No editorial plan files changed, nothing to validate.' : 'No editorial plan files found.');
    process.exit(0);
  }

  // Seed the ID index from every plan in the repo not part of this diff —
  // otherwise --changed-only mode can't catch a new plan reusing an id
  // already used by an untouched historical plan (duplicate id is a
  // whole-repo property, not a per-diff one). Excluding the changed files
  // themselves avoids a false "duplicate of itself" positive.
  const seenIds = new Map();
  if (changedOnly) {
    const changedSet = new Set(files.map((f) => path.resolve(f)));
    for (const file of listPlanFiles(PLANS_DIR)) {
      if (changedSet.has(path.resolve(file))) continue;
      const { data } = parseFrontMatter(readFileSync(file, 'utf8'));
      if (data && data.id && !seenIds.has(data.id)) {
        seenIds.set(data.id, path.relative(REPO_ROOT, file));
      }
    }
  }
  let hadErrors = false;

  for (const file of files.sort()) {
    const relPath = path.relative(REPO_ROOT, file);
    const { errors, warnings } = validateFile(file, validateSchema, seenIds);
    if (errors.length > 0) {
      hadErrors = true;
      console.error(`\nFAIL ${relPath}`);
      for (const e of errors) console.error(`  - ${e}`);
    }
    if (warnings.length > 0) {
      console.warn(`\nWARN ${relPath}`);
      for (const w of warnings) console.warn(`  - ${w}`);
    }
  }

  console.log(`\nValidated ${files.length} plan file(s)${changedOnly ? ' (changed-only mode)' : ''}.`);
  if (hadErrors) {
    console.error('Validation failed.');
    process.exit(1);
  }
  console.log('All plans valid.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
