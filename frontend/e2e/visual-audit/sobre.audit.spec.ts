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

// The page has a different structure than this prototype (hero, "Nossa
// visão"/"Origem e propósito"/"Princípios de engenharia"/"Como tomamos
// decisões" sections, leadership block) — several prototype sections (hero
// stat indicators, career quote, company logos, area cards, certification/
// academic logos) were never implemented, see CLAUDE.md §10 item #40. The
// final CTA uses the shared AdvisoryCta component (generic cta-adv-in/
// cta-adv-card hooks, not page-specific sobre-* ones), so sobre-hero is the
// only key with a real 1:1 match today.
const TARGETS = [
  'sobre-hero',
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
