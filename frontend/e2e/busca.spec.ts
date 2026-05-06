import { test, expect } from '@playwright/test';

test.describe('página /busca', () => {
  test('hero mostra o termo pesquisado', async ({ page }) => {
    await page.goto('/busca?q=aws', { waitUntil: 'networkidle' });
    await expect(page.locator('.page-hero')).toBeVisible();
    await expect(page.locator('.page-hero')).toContainText('aws');
  });

  test('exibe resultados ou mensagem de estado vazio', async ({ page }) => {
    await page.goto('/busca?q=aws', { waitUntil: 'networkidle' });
    const hasCards  = (await page.locator('.post-card').count()) > 0;
    const hasEmpty  = (await page.locator('[class*="busca-empty"], [class*="no-result"], [class*="empty-state"]').count()) > 0;
    expect(hasCards || hasEmpty).toBe(true);
  });

  test('busca com q vazio não exibe cards', async ({ page }) => {
    await page.goto('/busca?q=', { waitUntil: 'networkidle' });
    await expect(page.locator('.page-hero')).toBeVisible();
    const cards = await page.locator('.post-card').count();
    expect(cards).toBe(0);
  });

  test('header de navegação permanece visível', async ({ page }) => {
    await page.goto('/busca?q=terraform', { waitUntil: 'networkidle' });
    await expect(page.locator('.op-header')).toBeVisible();
  });

  test('clicar em resultado navega para /post/', async ({ page }) => {
    await page.goto('/busca?q=aws', { waitUntil: 'networkidle' });
    const firstCard = page.locator('.post-card__title-link').first();
    const count = await firstCard.count();
    if (count > 0) {
      await firstCard.click();
      await expect(page).toHaveURL(/\/post\/.+/);
    }
  });
});
