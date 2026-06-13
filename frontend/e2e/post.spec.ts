import { test, expect } from '@playwright/test';

// Navega até o primeiro post disponível a partir de /artigos
// e valida a estrutura da página de post individual (Redesign 2026).

test.describe('post individual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/artigos', { waitUntil: 'networkidle' });
    const firstCard = page.locator('.post-card').first();
    await firstCard.click();
    await page.waitForLoadState('networkidle');
  });

  test('URL aponta para /post/', async ({ page }) => {
    await expect(page).toHaveURL(/\/post\/.+/);
  });

  test('título do artigo existe e não está vazio', async ({ page }) => {
    const title = page.locator('.post-hero-title');
    await expect(title).toBeVisible();
    const text = await title.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('hero tem byline com autor, data e tempo de leitura', async ({ page }) => {
    await expect(page.locator('.post-hero-in')).toBeVisible();
    await expect(page.locator('.post-byline')).toBeVisible();
  });

  test('conteúdo do post existe', async ({ page }) => {
    await expect(page.locator('.post-content')).toBeVisible();
  });

  test('author box aparece após o conteúdo', async ({ page }) => {
    await expect(page.locator('[data-audit="post-authorbox"]')).toBeVisible();
  });

  test('rail de compartilhamento presente', async ({ page }) => {
    await expect(page.locator('[data-audit="post-share"]')).toBeVisible();
  });

  test('reading progress bar presente apenas em post', async ({ page }) => {
    await expect(page.locator('.post-progress')).toBeAttached();
  });

  test('reading progress bar ausente na home', async ({ page }) => {
    // Firefox: aguarda prefetches em background (ex.: Link "Home" no header)
    // assentarem antes do goto, evitando NS_BINDING_ABORTED.
    await page.waitForTimeout(500);
    await page.goto('/');
    await expect(page.locator('.post-progress')).not.toBeAttached();
  });

  test('seção de posts relacionados existe no rodapé do post', async ({ page }) => {
    await expect(page.locator('[data-audit="post-related"]')).toBeVisible();
  });
});
