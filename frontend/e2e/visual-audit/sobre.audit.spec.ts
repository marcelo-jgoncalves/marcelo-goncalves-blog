/**
 * sobre.audit.spec.ts
 * Audit visual Sobre: compara computed styles do protótipo (fixtures/sobre.html)
 * com o app renderizado em "/sobre". Referência: specs/VALIDATION-STRATEGY.md
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { captureAudit, VIEWPORT } from './audit-script';
import { compareAudits } from './compare';

const FIXTURE_URL = `file://${path.resolve(__dirname, 'fixtures/sobre.html').replace(/\\/g, '/')}`;

const TARGETS = [
  'sobre-hero',
  'sobre-hero-in',
  'sobre-photo-frame',
  'sobre-hero-stats',
  'sobre-traj-grid',
  'sobre-traj-quote',
  'sobre-traj-companies',
  'sobre-areas-grid',
  'sobre-area-feat',
  'sobre-dif-wrap',
  'sobre-certs-grid',
  'sobre-acad-card',
  'sobre-cta-adv-in',
  'sobre-adv-card',
];

test('sobre: audit protótipo vs app', async ({ page }) => {
  await page.setViewportSize(VIEWPORT);

  await page.goto(FIXTURE_URL);
  const proto = await captureAudit(page);

  await page.goto('/sobre');
  const app = await captureAudit(page);

  const { diffs, report } = compareAudits(proto, app, TARGETS);

  if (diffs.length > 0) {
    console.log(report);
  }

  expect(diffs, report).toEqual([]);
});
