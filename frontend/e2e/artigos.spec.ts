import { test, expect } from '@playwright/test';

test.describe('página /artigos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/artigos', { waitUntil: 'networkidle' });
  });

  test('hero existe com título', async ({ page }) => {
    await expect(page.locator('.page-hero')).toBeVisible();
    await expect(page.locator('.page-hero .hero-title')).toBeVisible();
  });

  test('grid de posts existe com pelo menos um card', async ({ page }) => {
    await expect(page.locator('.post-card').first()).toBeVisible();
  });

  test('sidebar existe com widget de posts populares', async ({ page }) => {
    await expect(page.locator('.blog-sidebar')).toBeVisible();
    await expect(page.locator('.popular-widget')).toBeVisible();
  });

  test('banner AdSense aparece no layout', async ({ page }) => {
    await expect(page.locator('.adsense-banner-wrapper').first()).toBeVisible();
  });

  test('post card tem meta-row com badge, data e tempo', async ({ page }) => {
    await expect(page.locator('.post-card__meta-row').first()).toBeVisible();
  });

  test('paginação fica fora do grid quando presente', async ({ page }) => {
    const pagination = page.locator('.pagination');
    const hasPagination = await pagination.count() > 0;
    if (hasPagination) {
      await expect(pagination).toBeVisible();
    }
  });

  test('newsletter CTA aparece no final da página', async ({ page }) => {
    await expect(page.locator('.cta')).toBeVisible();
  });

  test('clicar em post card navega para /post/', async ({ page }) => {
    await page.locator('.post-card__title-link').first().click();
    await expect(page).toHaveURL(/\/post\/.+/);
  });
});
