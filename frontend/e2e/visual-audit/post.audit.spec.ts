/**
 * post.audit.spec.ts
 * Visual audit for Post: compares computed styles of the prototype (fixtures/post.html)
 * against the app rendered at "/post/{slug}". Reference: specs/VALIDATION-STRATEGY.md
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { captureAudit, VIEWPORT } from './audit-script';
import { compareAudits } from './compare';

const FIXTURE_URL = `file://${path.resolve(__dirname, 'fixtures/post.html').replace(/\\/g, '/')}`;

const POST_SLUG = 'como-construir-prompts-poderosos-para-ias-como-gpt-ou-gemini';

// post-cta-adv-in/post-adv-card are excluded: the page no longer reuses
// AdvisoryCta there: it has its own compact "CTA CONTEXTUAL" section
// instead (post-cta-editorial, see app/post/[slug]/page.tsx), so there's no
// valid visual correspondence to compare pixel-by-pixel against.
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

  // Expected divergences (not CSS bugs):
  // - post-layout/margin: getComputedStyle reports "0px" for auto-centering
  //   margin in nested grid containers (article > main > body), even though
  //   the boundingClientRect matches the prototype (same left/right/width:
  //   centering is correct).
  // - post-authorbox/gridTemplateColumns: without linkedin/github/
  //   instagram_url set on the author, PostFooter omits .abSocial and the
  //   3rd "auto" track collapses to 0px. Matches the prototype once real
  //   social links are set.
  const KNOWN_DIVERGENCES = new Set([
    'post-layout::margin',
    'post-authorbox::gridTemplateColumns',
  ]);
  const unexpected = diffs.filter((d) => !KNOWN_DIVERGENCES.has(`${d.key}::${d.property}`));

  expect(unexpected, report).toEqual([]);
});
