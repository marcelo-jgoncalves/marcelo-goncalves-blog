/**
 * post.audit.spec.ts
 * Audit visual Post: compara computed styles do protótipo (fixtures/post.html)
 * com o app renderizado em "/post/{slug}". Referência: specs/VALIDATION-STRATEGY.md
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { captureAudit, VIEWPORT } from './audit-script';
import { compareAudits } from './compare';

const FIXTURE_URL = `file://${path.resolve(__dirname, 'fixtures/post.html').replace(/\\/g, '/')}`;

const POST_SLUG = 'como-construir-prompts-poderosos-para-ias-como-gpt-ou-gemini';

// post-cta-adv-in/post-adv-card ficaram de fora: a página deixou de reusar
// AdvisoryCta nessa posição e passou a ter sua própria seção compacta
// "CTA CONTEXTUAL" (post-cta-editorial, ver app/post/[slug]/page.tsx) —
// mesma mudança de design já feita em /o-projeto. Não há correspondência
// visual válida entre o card do AdvisoryCta (protótipo) e a seção atual,
// então a comparação pixel a pixel deixou de fazer sentido para essa seção.
const TARGETS = [
  'post-hero',
  'post-hero-in',
  'post-cover-frame',
  'post-layout',
  'post-toc',
  'post-share',
  'post-authorbox',
  'post-related',
  'post-r-head',
  'post-r-grid',
];

test('post: audit protótipo vs app', async ({ page }) => {
  await page.setViewportSize(VIEWPORT);

  await page.goto(FIXTURE_URL);
  const proto = await captureAudit(page);

  await page.goto(`/post/${POST_SLUG}`);
  const app = await captureAudit(page);

  const { diffs, report } = compareAudits(proto, app, TARGETS);

  if (diffs.length > 0) {
    console.log(report);
  }

  // Divergências esperadas (não são bugs de CSS):
  // - post-layout/margin: getComputedStyle reporta "0px" para margin auto-centering
  //   em grid containers aninhados (article > main > body), embora o boundingClientRect
  //   seja idêntico ao protótipo (left/right/width iguais — centralização correta).
  // - post-authorbox/gridTemplateColumns: autor sem linkedin/github/instagram_url
  //   cadastrados (backlog #1, aguarda Marcelo) — PostFooter omite .abSocial e a
  //   3ª track "auto" colapsa para 0px. Volta a bater com o protótipo quando as
  //   redes sociais reais forem cadastradas.
  const KNOWN_DIVERGENCES = new Set([
    'post-layout::margin',
    'post-authorbox::gridTemplateColumns',
  ]);
  const unexpected = diffs.filter((d) => !KNOWN_DIVERGENCES.has(`${d.key}::${d.property}`));

  expect(unexpected, report).toEqual([]);
});
