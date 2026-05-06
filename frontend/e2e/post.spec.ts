import { test, expect } from '@playwright/test';

// Navega até o primeiro post disponível a partir de /artigos
// e valida a estrutura da página de post individual.

test.describe('post individual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/artigos', { waitUntil: 'networkidle' });
    const firstCard = page.locator('.post-card__title-link').first();
    await firstCard.click();
    await page.waitForLoadState('networkidle');
  });

  test('URL aponta para /post/', async ({ page }) => {
    await expect(page).toHaveURL(/\/post\/.+/);
  });

  test('título do artigo existe e não está vazio', async ({ page }) => {
    const title = page.locator('.article-title');
    await expect(title).toBeVisible();
    const text = await title.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('header tem meta-row com autor, data e tempo de leitura', async ({ page }) => {
    await expect(page.locator('.article-header')).toBeVisible();
    await expect(page.locator('.article-meta')).toBeVisible();
  });

  test('conteúdo do post existe', async ({ page }) => {
    await expect(page.locator('.post-body-wrapper')).toBeVisible();
  });

  test('author box aparece após o conteúdo', async ({ page }) => {
    await expect(page.locator('.author-box')).toBeVisible();
  });

  test('botões de compartilhamento presentes', async ({ page }) => {
    await expect(page.locator('.share-buttons-section')).toBeVisible();
  });

  test('reading progress bar presente apenas em post', async ({ page }) => {
    await expect(page.locator('.reading-progress')).toBeAttached();
  });

  test('reading progress bar ausente na home', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.reading-progress')).not.toBeAttached();
  });

  test('sidebar desktop visível', async ({ page }) => {
    await expect(page.locator('.blog-sidebar')).toBeVisible();
  });

  test('seção de posts populares existe no rodapé do post', async ({ page }) => {
    await expect(page.locator('.popular-articles-section-wrapper')).toBeVisible();
  });
});
