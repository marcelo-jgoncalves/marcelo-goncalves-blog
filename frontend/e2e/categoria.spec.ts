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

  // Breakpoint real do menu desktop é 1300px (Header.module.css) — abaixo
  // disso o link some do nav e vira hambúrguer. O viewport padrão do
  // Playwright (1280px) cai nesse breakpoint, então fixamos um viewport
  // largo aqui para exercitar o link do jeito que é usado na prática.
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
