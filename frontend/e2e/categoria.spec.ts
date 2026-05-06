import { test, expect } from '@playwright/test';

const SLUG = 'cloud-computing';

test.describe('página /categoria/:slug', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/categoria/${SLUG}`, { waitUntil: 'networkidle' });
  });

  test('hero existe e exibe título', async ({ page }) => {
    await expect(page.locator('.page-hero')).toBeVisible();
    await expect(page.locator('.hero-title')).toBeVisible();
  });

  test('sidebar existe com ServiceCallout', async ({ page }) => {
    await expect(page.locator('.blog-sidebar')).toBeVisible();
    await expect(page.locator('.op-service-callout')).toBeVisible();
  });

  test('grid de posts ou estado vazio renderiza', async ({ page }) => {
    const hasCards = (await page.locator('.post-card').count()) > 0;
    const hasEmpty = (await page.locator('[class*="empty"]').count()) > 0;
    expect(hasCards || hasEmpty).toBe(true);
  });

  test('paginação fora do grid quando presente', async ({ page }) => {
    const pagination = page.locator('.pagination');
    if ((await pagination.count()) > 0) {
      await expect(pagination).toBeVisible();
    }
  });

  test('newsletter CTA no rodapé', async ({ page }) => {
    await expect(page.locator('.cta')).toBeVisible();
  });

  test('link de navegação para /artigos acessível', async ({ page }) => {
    const link = page.locator('a[href="/artigos"]').first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/artigos/);
  });

  test('clicar em post card navega para /post/', async ({ page }) => {
    const firstCard = page.locator('.post-card__title-link').first();
    const count = await firstCard.count();
    if (count > 0) {
      await firstCard.click();
      await expect(page).toHaveURL(/\/post\/.+/);
    }
  });
});
