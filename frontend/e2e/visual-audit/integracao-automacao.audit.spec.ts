/**
 * integracao-automacao.audit.spec.ts
 * Audit visual Integração & Automação: compara computed styles do protótipo
 * (fixtures/integracao-automacao.html, DOM final extraído do bundle
 * "new-prots/Integração e Automação - standalone.html" via Playwright) com o
 * app renderizado em "/integracao-automacao". Referência: specs/VALIDATION-STRATEGY.md
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { captureAudit, VIEWPORT } from './audit-script';
import { compareAudits } from './compare';

const FIXTURE_URL = `file://${path.resolve(__dirname, 'fixtures/integracao-automacao.html').replace(/\\/g, '/')}`;

// ia2-hero e ia2-cta-final ficam fora do diff literal: usam os componentes padrão do
// projeto (PageHero/CtaAssessoria) em vez do padding/grid inline do protótipo — mesma
// decisão documentada em engenharia-de-software.audit.spec.ts e cloud-devops.audit.spec.ts.
const TARGETS = [
  'ia2-oquefazemos',
  'ia2-card',
  'ia2-beneficios',
  'ia2-especialidades',
  'ia2-abordagem',
  'ia2-faq',
];

test('integracao-automacao: audit protótipo vs app', async ({ page }) => {
  await page.setViewportSize(VIEWPORT);

  await page.goto(FIXTURE_URL);
  const proto = await captureAudit(page);

  await page.goto('/integracao-automacao');
  const app = await captureAudit(page);

  const { diffs, report } = compareAudits(proto, app, TARGETS);

  if (diffs.length > 0) {
    console.log(report);
  }

  // Todos os alvos são wrappers de <section> sem texto direto — o app herda o
  // font-size base do projeto (18px, CLAUDE.md §7) enquanto o fixture (file://,
  // sem CDN de fontes) herda o default do browser (16px) e cai em fallback de fonte.
  // Nenhum dos dois afeta texto real (todo conteúdo visível tem font-size próprio).
  const knownIntentionalDiffs = diffs.filter(
    (d) => d.property === 'fontFamily' || d.property === 'fontSize' || d.property === 'lineHeight',
  );
  const realDiffs = diffs.filter((d) => !knownIntentionalDiffs.includes(d));

  expect(realDiffs, report).toEqual([]);
});
