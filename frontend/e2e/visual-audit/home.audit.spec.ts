/**
 * home.audit.spec.ts
 * Audit visual Home: compara computed styles do protótipo (fixtures/home.html)
 * com o app renderizado em "/". Referência: specs/VALIDATION-STRATEGY.md
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { captureAudit, VIEWPORT } from './audit-script';
import { compareAudits } from './compare';

const FIXTURE_URL = `file://${path.resolve(__dirname, 'fixtures/home.html').replace(/\\/g, '/')}`;

const TARGETS = [
  'home-hero',
  'home-hero-in',
  'home-hero-feature',
  'home-stats-strip',
  'home-ml-grid',
  'home-ml-card',
  'home-ml-list',
  'home-posts-grid',
  'home-post-card',
  'home-ia-grid',
  'home-ia-big',
  'home-ia-small',
  'home-projeto-grid',
  'home-projeto-cta-strip',
  'home-cta-adv-in',
  'home-adv-card',
];

test('home: audit protótipo vs app', async ({ page }) => {
  await page.setViewportSize(VIEWPORT);

  await page.goto(FIXTURE_URL);
  const proto = await captureAudit(page);

  await page.goto('/');
  const app = await captureAudit(page);

  const { diffs, report } = compareAudits(proto, app, TARGETS);

  if (diffs.length > 0) {
    console.log(report);
  }

  expect(diffs, report).toEqual([]);
});
