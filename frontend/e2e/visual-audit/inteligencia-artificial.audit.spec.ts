/**
 * inteligencia-artificial.audit.spec.ts
 * Visual audit for Inteligência Artificial: compares computed styles of the prototype
 * (fixtures/inteligencia-artificial.html, final DOM extracted from the
 * "new-prots/Inteligência Artificial - standalone.html" bundle via Playwright) against the
 * app rendered at "/inteligencia-artificial". Reference: specs/VALIDATION-STRATEGY.md
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { captureAudit, VIEWPORT } from './audit-script';
import { compareAudits } from './compare';

const FIXTURE_URL = `file://${path.resolve(__dirname, 'fixtures/inteligencia-artificial.html').replace(/\\/g, '/')}`;

// ai-hero and ai-cta-final are excluded from the literal diff: both use the
// project's shared components (PageHero/AdvisoryCta) instead of the
// prototype's inline padding/grid, same as the other 3 pillar landings.
const TARGETS = [
  'ai-solucoes',
  'ai-card',
  'ai-aplicacoes',
  'ai-caso-item',
  'ai-beneficios',
  'ai-abordagem',
  'ai-faq',
];

test('inteligencia-artificial: audit protótipo vs app', async ({ page }) => {
  await page.setViewportSize(VIEWPORT);

  await page.goto(FIXTURE_URL);
  const proto = await captureAudit(page);

  await page.goto('/inteligencia-artificial');
  const app = await captureAudit(page);

  const { diffs, report } = compareAudits(proto, app, TARGETS);

  if (diffs.length > 0) {
    console.log(report);
  }

  // All targets are <section>/<div> wrappers with no direct text: the app
  // inherits the project's base font-size (18px) while the fixture (file://,
  // no font CDN) inherits the browser default (16px) and falls back to a
  // system font.
  const knownIntentionalDiffs = diffs.filter(
    (d) => d.property === 'fontFamily' || d.property === 'fontSize' || d.property === 'lineHeight',
  );
  const realDiffs = diffs.filter((d) => !knownIntentionalDiffs.includes(d));

  expect(realDiffs, report).toEqual([]);
});
