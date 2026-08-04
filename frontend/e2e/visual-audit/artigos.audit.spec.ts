/**
 * artigos.audit.spec.ts
 * Visual audit for Artigos: compares computed styles of the prototype (fixtures/artigos.html)
 * against the app rendered at "/artigos". Reference: specs/VALIDATION-STRATEGY.md
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { captureAudit, VIEWPORT } from './audit-script';
import { compareAudits } from './compare';

const FIXTURE_URL = `file://${path.resolve(__dirname, 'fixtures/artigos.html').replace(/\\/g, '/')}`;

const TARGETS = [
  'art-hero',
  'art-hero-in',
  'art-proj-card',
  'art-filterbar',
  'art-masthead',
  'art-feature',
  'art-twoup',
  'art-mini',
  'art-grid',
  'art-readband',
  'art-rb-list',
  'art-grid2',
  'art-cta-adv',
  'art-cta-adv-in',
  'art-adv-card',
];

// Fixture freezes the OLD design of /artigos (before the role swap with
// /todos-artigos). Classes in TARGETS above
// (art-filterbar, art-twoup, art-mini, art-readband, art-cta-adv etc.) no
// longer exist on either real route: the structure changed, not just the
// URL. Recapture the fixture from the current approved prototype before
// re-enabling.
test.skip('artigos: audit protótipo vs app', async ({ page }) => {
  await page.setViewportSize(VIEWPORT);

  await page.goto(FIXTURE_URL);
  const proto = await captureAudit(page);

  await page.goto('/todos-artigos');
  const app = await captureAudit(page);

  const { diffs, report } = compareAudits(proto, app, TARGETS);

  if (diffs.length > 0) {
    console.log(report);
  }

  expect(diffs, report).toEqual([]);
});
