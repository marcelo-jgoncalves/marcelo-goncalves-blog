/**
 * cloud-devops.audit.spec.ts
 * Audit visual Cloud & DevOps: compara computed styles do protótipo
 * (fixtures/cloud-devops.html, DOM final extraído do bundle
 * "new-prots/Cloud DevOps - standalone.html" via Playwright) com o
 * app renderizado em "/cloud-devops". Referência: specs/VALIDATION-STRATEGY.md
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { captureAudit, VIEWPORT } from './audit-script';
import { compareAudits } from './compare';

const FIXTURE_URL = `file://${path.resolve(__dirname, 'fixtures/cloud-devops.html').replace(/\\/g, '/')}`;

// cd-hero e cd-cta-final ficam fora do diff literal contra o protótipo: essas duas
// seções usam os componentes padrão do projeto (PageHero/CtaAssessoria, já usados em
// /servicos, /contato, /engenharia-de-software) em vez de replicar o padding/grid
// inline do protótipo standalone — mesma decisão e mesmo motivo documentados em
// engenharia-de-software.audit.spec.ts.
const TARGETS = [
  'cd-oquefazemos',
  'cd-card',
  'cd-beneficios',
  'cd-especialidades',
  'cd-abordagem',
  'cd-faq',
];

test('cloud-devops: audit protótipo vs app', async ({ page }) => {
  await page.setViewportSize(VIEWPORT);

  await page.goto(FIXTURE_URL);
  const proto = await captureAudit(page);

  await page.goto('/cloud-devops');
  const app = await captureAudit(page);

  const { diffs, report } = compareAudits(proto, app, TARGETS);

  if (diffs.length > 0) {
    console.log(report);
  }

  // Todos os alvos são wrappers de <section> sem texto direto — o app herda o
  // font-size base do projeto (18px, CLAUDE.md §7 escala tipográfica) enquanto o
  // fixture (renderizado via file://) herda o default do browser (16px), e o
  // protótipo cai em fallback de fonte por não ter acesso à CDN via file://.
  // Nenhum dos dois afeta texto real (todo conteúdo visível tem font-size próprio).
  const knownIntentionalDiffs = diffs.filter(
    (d) => d.property === 'fontFamily' || d.property === 'fontSize' || d.property === 'lineHeight',
  );
  const realDiffs = diffs.filter((d) => !knownIntentionalDiffs.includes(d));

  expect(realDiffs, report).toEqual([]);
});
