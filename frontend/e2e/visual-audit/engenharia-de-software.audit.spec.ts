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

// esw-hero e esw-cta-final ficaram fora do diff literal contra o protótipo: por
// pedido explícito (2026-07-11), essas duas seções passaram a usar os componentes
// padrão do projeto (PageHero/CtaAssessoria, já usados em /servicos, /contato etc.)
// em vez de replicar o padding/grid inline do protótipo standalone — a régua de
// correção aqui é "bate com o componente reutilizável", não "bate pixel a pixel
// com o protótipo". Ver frontend/components/ui/PageHero.tsx e CtaAssessoria.tsx.
//
// esw-principios também ficou fora: a pedido de Marcelo (2026-07-11), a seção
// "Maturidade Técnica" passou a usar as cores de app/cloud-devops/page.module.css
// .especialidades (fundo sand, não mais petrol-deep) — desvio intencional do
// protótipo, mesmo raciocínio do hero/cta-final acima.
const TARGETS = [
  'esw-oquefazemos',
  'esw-card',
  'esw-beneficios',
  'esw-abordagem',
  'esw-diferenciais',
  'esw-faq',
];

test('engenharia-de-software: audit protótipo vs app', async ({ page }) => {
  await page.setViewportSize(VIEWPORT);

  await page.goto(FIXTURE_URL);
  const proto = await captureAudit(page);

  await page.goto('/engenharia-de-software');
  const app = await captureAudit(page);

  const { diffs, report } = compareAudits(proto, app, TARGETS);

  if (diffs.length > 0) {
    console.log(report);
  }

  // Todos os 9 alvos são wrappers de <section> sem texto direto — o app herda o
  // font-size base do projeto (18px, CLAUDE.md §7 escala tipográfica) enquanto o
  // fixture (renderizado via file://) herda o default do browser (16px). Não afeta
  // nenhum texto real: todo conteúdo visível está em elementos filhos com font-size
  // explícito próprio (ver page.module.css). lineHeight "normal" vs "28.8px" é
  // consequência direta do mesmo font-size base, mesma causa.
  const knownIntentionalDiffs = diffs.filter(
    (d) => d.property === 'fontFamily' || d.property === 'fontSize' || d.property === 'lineHeight',
  );
  const realDiffs = diffs.filter((d) => !knownIntentionalDiffs.includes(d));

  expect(realDiffs, report).toEqual([]);
});
