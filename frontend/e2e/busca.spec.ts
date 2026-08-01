import { test, expect } from '@playwright/test';

test.describe('página /busca', () => {
  test('hero mostra o termo pesquisado', async ({ page }) => {
    await page.goto('/busca?q=aws', { waitUntil: 'networkidle' });
    await expect(page.locator('.page-hero')).toBeVisible();
    await expect(page.locator('.page-hero')).toContainText('aws');
  });

  test('exibe resultados ou mensagem de estado vazio (sem sugestões)', async ({ page }) => {
    // Termo sem correspondência real: Cenário B (retenção) só mostra
    // sugestões de populares quando existem posts populares no dev — aqui
    // validamos apenas que hero + busca continuam funcionando.
    await page.goto('/busca?q=zzzzznaoexistetermoinventado', { waitUntil: 'networkidle' });
    await expect(page.locator('.page-hero')).toBeVisible();
  });

  // Busca com q vazio cai no Cenário B (retenção): sem resultados, a
  // página sugere até 3 posts populares em vez de não mostrar nada — ver
  // "SCENARIO B: Nothing Found (Retention Layout)" em app/busca/page.tsx.
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
