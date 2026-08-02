import { test, expect } from '@playwright/test';

const SLUG = 'cloud-computing';

test.describe('página /categoria/:slug', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/categoria/${SLUG}`, { waitUntil: 'networkidle' });
  });

  test('hero existe e exibe título', async ({ page }) => {
    await expect(page.locator('.page-hero')).toBeVisible();
    await expect(page.locator('.page-hero h1')).toBeVisible();
  });

  test('grid de posts ou estado vazio renderiza', async ({ page }) => {
    const hasCards = (await page.locator('.post-card').count()) > 0;
    const hasEmpty = (await page.locator('[class*="categoriaEmpty"], [class*="categoria-empty"]').count()) > 0;
    expect(hasCards || hasEmpty).toBe(true);
  });

  test('paginação aparece quando há mais de uma página', async ({ page }) => {
    const pagination = page.locator('.op-pagination');
    if ((await pagination.count()) > 0) {
      await expect(pagination).toBeVisible();
    }
  });

  test('newsletter CTA no rodapé', async ({ page }) => {
    await expect(page.locator('[data-audit="newsletter-cta"]')).toBeVisible();
  });

  // The desktop nav breakpoint is 1300px (Header.module.css); below it the
  // link collapses into the hamburger menu. Playwright's default viewport
  // (1280px) falls under that threshold, so a wider viewport is set here.
  test('link de navegação para /artigos acessível (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const link = page.locator('a[href="/artigos"]').first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/artigos/);
  });

  test('clicar em post card navega para /post/', async ({ page }) => {
    const firstCard = page.locator('.post-card').first();
    const count = await firstCard.count();
    if (count > 0) {
      await firstCard.click();
      await expect(page).toHaveURL(/\/post\/.+/);
    }
  });
});

// Made-up slug: no real post has this category, so getPostsByCategory always
// returns posts=[] — covers the empty-state branch without depending on a
// real slug that could gain posts later and silently stop testing this.
test.describe('página /categoria/:slug — categoria sem posts', () => {
  test('mostra estado vazio com link de volta para /todos-artigos', async ({ page }) => {
    await page.goto('/categoria/categoria-inventada-sem-posts-xyz', { waitUntil: 'networkidle' });
    await expect(page.locator('.categoria-empty')).toBeVisible();
    const backLink = page.locator('.categoria-empty a[href="/todos-artigos"]');
    await expect(backLink).toBeVisible();
  });

  test('título da categoria cai no fallback derivado do slug', async ({ page }) => {
    await page.goto('/categoria/categoria-inventada-sem-posts-xyz', { waitUntil: 'networkidle' });
    await expect(page.locator('.page-hero h1')).toContainText('Categoria Inventada Sem Posts Xyz');
  });

  test('paginação não renderiza quando não há posts nem página anterior', async ({ page }) => {
    await page.goto('/categoria/categoria-inventada-sem-posts-xyz', { waitUntil: 'networkidle' });
    await expect(page.locator('.op-pagination')).toHaveCount(0);
  });
});
