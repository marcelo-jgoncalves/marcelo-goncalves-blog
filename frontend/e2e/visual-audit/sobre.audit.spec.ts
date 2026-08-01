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

// A página foi reescrita por completo depois deste protótipo (novo hero,
// seções "Nossa visão"/"Origem e propósito"/"Princípios de
// engenharia"/"Como tomamos decisões"/bloco de liderança). As seções de
// indicadores no hero, trajetória com quote, logos de empresas, cards de
// área, diferencial de idiomas, certificações e logos acadêmicos do
// protótipo nunca foram implementadas nesta versão — ver CLAUDE.md §10
// item #40 (assets já otimizados, seção deliberadamente adiada). O CTA
// final usa o componente AdvisoryCta compartilhado (hooks genéricos
// cta-adv-in/cta-adv-card, não mais os sobre-* específicos do protótipo).
// O fixture só marca o CTA final com os data-audit "sobre-cta-adv-in" /
// "sobre-adv-card" (nunca existiram no app — nem antes nem depois do
// redesign, o AdvisoryCta real usa os hooks genéricos cta-adv-in/
// cta-adv-card, sem prefixo de página). sobre-hero é a única chave com
// correspondência real 1:1 hoje.
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
