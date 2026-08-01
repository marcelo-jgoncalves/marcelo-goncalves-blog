/**
 * home.audit.spec.ts
 * Audit visual da curadoria de artigos: compara computed styles do
 * protótipo (fixtures/home.html) com o app renderizado em "/artigos".
 *
 * The "home.html" fixture matches the curated-blog design that now lives
 * at /artigos (the root "/" route is the institutional Home instead) —
 * the fixture file wasn't renamed when the route changed.
 *
 * TARGETS is restricted to the keys that both the fixture and the real
 * /artigos implementation (frontend/app/artigos/page.tsx) share — some
 * prototype sections (hero stats strip, "O Projeto" block's own CTA
 * strip) were simplified in the implementation and have no matching
 * data-audit today.
 *
 * Referência: specs/VALIDATION-STRATEGY.md
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { captureAudit, VIEWPORT } from './audit-script';
import { compareAudits } from './compare';

const FIXTURE_URL = `file://${path.resolve(__dirname, 'fixtures/home.html').replace(/\\/g, '/')}`;

const TARGETS = [
  'home-hero',
  'home-ml-grid',
  'home-ml-card',
  'home-ml-list',
  'home-posts-grid',
  'home-post-card',
  'home-ia-grid',
  'home-ia-big',
  'home-ia-small',
  'home-projeto-grid',
];

test('artigos (curadoria): audit protótipo vs app', async ({ page }) => {
  await page.setViewportSize(VIEWPORT);

  await page.goto(FIXTURE_URL);
  const proto = await captureAudit(page);

  await page.goto('/artigos');
  const app = await captureAudit(page);

  const { diffs, report } = compareAudits(proto, app, TARGETS);

  if (diffs.length > 0) {
    console.log(report);
  }

  expect(diffs, report).toEqual([]);
});
