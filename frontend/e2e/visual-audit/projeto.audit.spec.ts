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

// A página foi reescrita por completo depois deste protótipo (novas
// seções "Por que construir"/"Estado atual"/"Arquitetura"/"Princípios de
// engenharia"/"Fluxo editorial", roadmap agrupado por período em vez de
// cards com status, CTA final própria em vez de reusar AdvisoryCta) — a
// maioria das seções do fixture não tem mais correspondente estrutural
// direto no app, e comparar conteúdos com formas diferentes não faz
// sentido. op-hero e op-tl-card são os únicos dois pontos onde protótipo
// e app ainda representam exatamente a mesma coisa.
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
