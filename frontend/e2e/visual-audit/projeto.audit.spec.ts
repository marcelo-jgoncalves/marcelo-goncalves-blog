/**
 * projeto.audit.spec.ts
 * Audit visual O Projeto: compara computed styles do protótipo (fixtures/projeto.html)
 * com o app renderizado em "/o-projeto". Referência: specs/VALIDATION-STRATEGY.md
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { captureAudit, VIEWPORT } from './audit-script';
import { compareAudits } from './compare';

const FIXTURE_URL = `file://${path.resolve(__dirname, 'fixtures/projeto.html').replace(/\\/g, '/')}`;

// The page has a different structure than this prototype (new "Por que
// construir"/"Estado atual"/"Arquitetura"/"Princípios de engenharia"/"Fluxo
// editorial" sections, roadmap grouped by period instead of status cards,
// its own final CTA instead of reusing AdvisoryCta) — most fixture sections
// have no direct structural counterpart left in the app, so comparing
// differently-shaped content wouldn't be meaningful. op-hero and op-tl-card
// are the only two points where prototype and app still represent exactly
// the same thing.
const TARGETS = [
  'op-hero',
  'op-tl-card',
];

test('o-projeto: audit protótipo vs app', async ({ page }) => {
  await page.setViewportSize(VIEWPORT);

  await page.goto(FIXTURE_URL);
  const proto = await captureAudit(page);

  await page.goto('/o-projeto');
  const app = await captureAudit(page);

  const { diffs, report } = compareAudits(proto, app, TARGETS);

  if (diffs.length > 0) {
    console.log(report);
  }

  expect(diffs, report).toEqual([]);
});
