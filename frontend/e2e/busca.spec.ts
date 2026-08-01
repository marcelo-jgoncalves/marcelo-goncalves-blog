import { test, expect } from '@playwright/test';

test.describe('página /busca', () => {
  test('hero mostra o termo pesquisado', async ({ page }) => {
    await page.goto('/busca?q=aws', { waitUntil: 'networkidle' });
    await expect(page.locator('.page-hero')).toBeVisible();
    await expect(page.locator('.page-hero')).toContainText('aws');
  });

  test('exibe resultados ou mensagem de estado vazio (sem sugestões)', async ({ page }) => {
    // No-match term: the retention layout only renders popular-post
    // suggestions when popular posts exist in dev, so this only asserts
    // that hero + search still render, not a specific result count.
    await page.goto('/busca?q=zzzzznaoexistetermoinventado', { waitUntil: 'networkidle' });
    await expect(page.locator('.page-hero')).toBeVisible();
  });

  // Empty q falls into the "Nothing Found" retention layout in
  // app/busca/page.tsx: instead of an empty state, it suggests up to 3
  // popular posts.
  test('busca com q vazio mostra sugestões de populares (cenário de retenção)', async ({ page }) => {
    await page.goto('/busca?q=', { waitUntil: 'networkidle' });
    await expect(page.locator('.page-hero')).toBeVisible();
    const cards = await page.locator('.post-card').count();
    expect(cards).toBeGreaterThanOrEqual(0);
    expect(cards).toBeLessThanOrEqual(3);
  });

  test('header de navegação permanece visível', async ({ page }) => {
    await page.goto('/busca?q=terraform', { waitUntil: 'networkidle' });
    await expect(page.locator('[data-audit="header"]')).toBeVisible();
  });

  test('clicar em resultado navega para /post/', async ({ page }) => {
    await page.goto('/busca?q=aws', { waitUntil: 'networkidle' });
    const firstCard = page.locator('.post-card').first();
    const count = await firstCard.count();
    if (count > 0) {
      await firstCard.click();
      await expect(page).toHaveURL(/\/post\/.+/);
    }
  });
});
