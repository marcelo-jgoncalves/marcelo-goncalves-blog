import { test, expect } from '@playwright/test';

/**
 * Stylelint only enforces that SOME valid token from the scale is used,
 * never that it's the right token for the element's role (reading text,
 * link/CTA, card title — see CLAUDE.md §5 "Papel -> token mínimo"). This
 * checks the rendered outcome (computed font-size on mobile) instead of
 * which CSS token produced it, so it stays valid even if a selector's
 * token changes later, as long as the rendered value still meets the
 * role's floor.
 */

const MOBILE_VIEWPORT = { width: 375, height: 812 };

interface RoleCheck {
  role: 'texto de leitura' | 'link/CTA interativo' | 'título de card';
  selector: string;
  minPx: number;
}

// Mirrors the role table in CLAUDE.md §5: reading text >= 16px
// (--type-body-sm), link/CTA >= 14px (--type-label), card title >= 20px
// (--type-lead).
const HOME_CHECKS: RoleCheck[] = [
  { role: 'texto de leitura', selector: '.pillar-card > p', minPx: 16 },
  { role: 'texto de leitura', selector: '.ih-case-text p', minPx: 16 },
  { role: 'texto de leitura', selector: '.ih-mc-text', minPx: 16 },
  { role: 'link/CTA interativo', selector: '.pillar-more', minPx: 14 },
  { role: 'link/CTA interativo', selector: '.foot-col ul li a', minPx: 14 },
  { role: 'link/CTA interativo', selector: '.foot-col-lead', minPx: 14 },
  { role: 'título de card', selector: '.pillar-card h3', minPx: 20 },
  { role: 'título de card', selector: '.ih-case-text h3', minPx: 20 },
];

// Depends on recent posts existing (conditional section in page.tsx) — only
// runs when the API/backend is reachable, same as the other PostCard checks
// in this suite (see home-layout.spec.ts).
const HOME_BLOG_CHECKS: RoleCheck[] = [
  { role: 'texto de leitura', selector: '.post-card .pc-excerpt', minPx: 16 },
  { role: 'link/CTA interativo', selector: '.post-card .pc-foot .read-article', minPx: 14 },
];

test.describe('Tokens de tipografia por papel (mobile, 375px)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto('/');
  });

  for (const check of HOME_CHECKS) {
    test(`${check.role}: "${check.selector}" >= ${check.minPx}px`, async ({ page }) => {
      const locator = page.locator(check.selector).first();
      await expect(locator).toBeVisible();
      const fontSize = await locator.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(fontSize).toBeGreaterThanOrEqual(check.minPx);
    });
  }

  for (const check of HOME_BLOG_CHECKS) {
    test(`${check.role}: "${check.selector}" >= ${check.minPx}px (requer posts reais)`, async ({ page }) => {
      const locator = page.locator(check.selector).first();
      const count = await locator.count();
      test.skip(count === 0, 'Nenhum post recente disponível — API/backend fora do ar nesta execução.');
      await expect(locator).toBeVisible();
      const fontSize = await locator.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(fontSize).toBeGreaterThanOrEqual(check.minPx);
    });
  }
});
