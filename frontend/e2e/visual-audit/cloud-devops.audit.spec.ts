/**
 * cloud-devops.audit.spec.ts
 * Visual audit for Cloud & DevOps: compares computed styles of the prototype
 * (fixtures/cloud-devops.html, final DOM extracted from the
 * "new-prots/Cloud DevOps - standalone.html" bundle via Playwright) against the
 * app rendered at "/cloud-devops". Reference: specs/VALIDATION-STRATEGY.md
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { captureAudit, VIEWPORT } from './audit-script';
import { compareAudits } from './compare';

const FIXTURE_URL = `file://${path.resolve(__dirname, 'fixtures/cloud-devops.html').replace(/\\/g, '/')}`;

// cd-hero and cd-cta-final are excluded from the literal diff: both sections
// use the project's shared components (PageHero/AdvisoryCta) instead of
// replicating the standalone prototype's inline padding/grid.
const TARGETS = [
  'cd-atuacao',
  'cd-card',
  'cd-beneficios',
  'cd-capacidades',
  'cd-abordagem',
  'cd-faq',
];

test('cloud-devops (/plataforma): audit protótipo vs app', async ({ page }) => {
  await page.setViewportSize(VIEWPORT);

  await page.goto(FIXTURE_URL);
  const proto = await captureAudit(page);

  await page.goto('/plataforma');
  const app = await captureAudit(page);

  const { diffs, report } = compareAudits(proto, app, TARGETS);

  if (diffs.length > 0) {
    console.log(report);
  }

  // All targets are <section> wrappers with no direct text: the app inherits
  // the project's base font-size (18px) while the fixture (file://, no font
  // CDN) inherits the browser default (16px) and falls back to a system
  // font. Neither affects real text: every visible element has its own
  // explicit font-size.
  const knownIntentionalDiffs = diffs.filter(
    (d) => d.property === 'fontFamily' || d.property === 'fontSize' || d.property === 'lineHeight',
  );
  const realDiffs = diffs.filter((d) => !knownIntentionalDiffs.includes(d));

  expect(realDiffs, report).toEqual([]);
});
