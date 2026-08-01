/**
 * inteligencia-artificial.audit.spec.ts
 * Audit visual Inteligência Artificial: compara computed styles do protótipo
 * (fixtures/inteligencia-artificial.html, DOM final extraído do bundle
 * "new-prots/Inteligência Artificial - standalone.html" via Playwright) com o
 * app renderizado em "/inteligencia-artificial". Referência: specs/VALIDATION-STRATEGY.md
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { captureAudit, VIEWPORT } from './audit-script';
import { compareAudits } from './compare';

const FIXTURE_URL = `file://${path.resolve(__dirname, 'fixtures/inteligencia-artificial.html').replace(/\\/g, '/')}`;

// ai-hero e ai-cta-final ficam fora do diff literal: usam os componentes padrão do
// projeto (PageHero/AdvisoryCta) em vez do padding/grid inline do protótipo — mesma
// decisão documentada nas 3 landings anteriores.
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

  // Todos os alvos são wrappers de <section>/<div> sem texto direto — o app herda o
  // font-size base do projeto (18px, CLAUDE.md §7) enquanto o fixture (file://, sem
  // CDN de fontes) herda o default do browser (16px) e cai em fallback de fonte.
  const knownIntentionalDiffs = diffs.filter(
    (d) => d.property === 'fontFamily' || d.property === 'fontSize' || d.property === 'lineHeight',
  );
  const realDiffs = diffs.filter((d) => !knownIntentionalDiffs.includes(d));

  expect(realDiffs, report).toEqual([]);
});
