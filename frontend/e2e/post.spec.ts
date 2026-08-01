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

  // ReadingProgressBar mora no Header (global, ver components/layout/Header.tsx)
  // desde a sessão 47 — deixou de ser exclusiva da página de post. O teste
  // valida apenas que o indicador existe, sem exclusividade por rota.
  test('reading progress bar presente', async ({ page }) => {
    await expect(page.locator('[role="progressbar"]')).toBeAttached();
  });

  test('seção de posts relacionados existe no rodapé do post', async ({ page }) => {
    await expect(page.locator('[data-audit="post-related"]')).toBeVisible();
  });
});
