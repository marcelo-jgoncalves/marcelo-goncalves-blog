/**
 * artigos.audit.spec.ts
 * Audit visual Artigos: compara computed styles do protótipo (fixtures/artigos.html)
 * com o app renderizado em "/artigos". Referência: specs/VALIDATION-STRATEGY.md
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

test('artigos: audit protótipo vs app', async ({ page }) => {
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
