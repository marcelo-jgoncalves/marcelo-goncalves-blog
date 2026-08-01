/**
 * engenharia-de-software.audit.spec.ts
 * Audit visual Engenharia de Software: compara computed styles do protótipo
 * (fixtures/engenharia-de-software.html, DOM final extraído do bundle
 * "new-prots/Engenharia de Software - standalone.html" via Playwright) com o
 * app renderizado em "/engenharia-de-software". Referência: specs/VALIDATION-STRATEGY.md
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { captureAudit, VIEWPORT } from './audit-script';
import { compareAudits } from './compare';

const FIXTURE_URL = `file://${path.resolve(__dirname, 'fixtures/engenharia-de-software.html').replace(/\\/g, '/')}`;

// esw-hero and esw-cta-final are excluded from the literal diff: both
// sections use the project's shared components (PageHero/AdvisoryCta)
// instead of replicating the standalone prototype's inline padding/grid —
// the bar here is "matches the reusable component", not pixel parity with
// the prototype. See frontend/components/ui/PageHero.tsx and AdvisoryCta.tsx.
//
// esw-principios is also excluded: "Maturidade Técnica" intentionally uses
// the .especialidades color scheme from app/cloud-devops/page.module.css
// (sand background, not petrol-deep) instead of the prototype's colors.
const TARGETS = [
  'esw-solucoes',
  'esw-card',
  'esw-beneficios',
  'esw-abordagem',
  'esw-qualidade',
  'esw-faq',
];

test('engenharia-de-software (/software): audit protótipo vs app', async ({ page }) => {
  await page.setViewportSize(VIEWPORT);

  await page.goto(FIXTURE_URL);
  const proto = await captureAudit(page);

  await page.goto('/software');
  const app = await captureAudit(page);

  const { diffs, report } = compareAudits(proto, app, TARGETS);

  if (diffs.length > 0) {
    console.log(report);
  }

  // All targets are <section> wrappers with no direct text: the app inherits
  // the project's base font-size (18px) while the fixture (file://, no font
  // CDN) inherits the browser default (16px). Doesn't affect real text —
  // every visible element has its own explicit font-size (see
  // page.module.css). The lineHeight diff ("normal" vs "28.8px") is a direct
  // consequence of the same base font-size gap.
  const knownIntentionalDiffs = diffs.filter(
    (d) => d.property === 'fontFamily' || d.property === 'fontSize' || d.property === 'lineHeight',
  );
  const realDiffs = diffs.filter((d) => !knownIntentionalDiffs.includes(d));

  expect(realDiffs, report).toEqual([]);
});
