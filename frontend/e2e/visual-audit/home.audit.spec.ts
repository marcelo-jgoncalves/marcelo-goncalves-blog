/**
 * home.audit.spec.ts
 * Audit visual da curadoria de artigos: compara computed styles do
 * protótipo (fixtures/home.html) com o app renderizado em "/artigos".
 *
 * O fixture "home.html" corresponde ao design da antiga Home (blog
 * curado) — desde o pivô institucional da sessão 42 (ver CLAUDE.md §10
 * item #44), esse papel passou para a rota /artigos, e a raiz "/" virou
 * a Home institucional. O nome do arquivo ficou como estava por não
 * termos renomeado o fixture na mudança de rota.
 *
 * TARGETS restrito às chaves que o fixture e a implementação real de
 * /artigos (frontend/app/artigos/page.tsx) têm em comum — algumas
 * seções do protótipo original (stats strip no hero, faixa de CTA
 * própria do bloco "O Projeto") foram simplificadas na implementação e
 * não têm data-audit correspondente hoje.
 *
 * Referência: specs/VALIDATION-STRATEGY.md
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { captureAudit, VIEWPORT } from './audit-script';
import { compareAudits } from './compare';

const FIXTURE_URL = `file://${path.resolve(__dirname, 'fixtures/home.html').replace(/\\/g, '/')}`;

const TARGETS = [
  'home-hero',
  'home-ml-grid',
  'home-ml-card',
  'home-ml-list',
  'home-posts-grid',
  'home-post-card',
  'home-ia-grid',
  'home-ia-big',
  'home-ia-small',
  'home-projeto-grid',
];

test('artigos (curadoria): audit protótipo vs app', async ({ page }) => {
  await page.setViewportSize(VIEWPORT);

  await page.goto(FIXTURE_URL);
  const proto = await captureAudit(page);

  await page.goto('/artigos');
  const app = await captureAudit(page);

  const { diffs, report } = compareAudits(proto, app, TARGETS);

  if (diffs.length > 0) {
    console.log(report);
  }

  expect(diffs, report).toEqual([]);
});
