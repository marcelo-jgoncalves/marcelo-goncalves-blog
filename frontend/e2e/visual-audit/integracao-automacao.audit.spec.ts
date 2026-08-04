/**
 * integracao-automacao.audit.spec.ts
 * Visual audit for Integração & Automação: compares computed styles of the prototype
 * (fixtures/integracao-automacao.html, final DOM extracted from the
 * "new-prots/Integração e Automação - standalone.html" bundle via Playwright) against the
 * app rendered at "/integracao-automacao". Reference: specs/VALIDATION-STRATEGY.md
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { captureAudit, VIEWPORT } from './audit-script';
import { compareAudits } from './compare';

const FIXTURE_URL = `file://${path.resolve(__dirname, 'fixtures/integracao-automacao.html').replace(/\\/g, '/')}`;

// ia2-hero and ia2-cta-final are excluded from the literal diff: both use
// the project's shared components (PageHero/AdvisoryCta) instead of the
// prototype's inline padding/grid.
const TARGETS = [
  'ia2-entregas',
  'ia2-card',
  'ia2-beneficios',
  'ia2-capacidades',
  'ia2-abordagem',
  'ia2-faq',
];

test('integracao-automacao (/automacao): audit protótipo vs app', async ({ page }) => {
  await page.setViewportSize(VIEWPORT);

  await page.goto(FIXTURE_URL);
  const proto = await captureAudit(page);

  await page.goto('/automacao');
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
