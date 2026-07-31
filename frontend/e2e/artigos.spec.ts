import { test, expect } from '@playwright/test';

test.describe('página /artigos (curadoria)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/artigos', { waitUntil: 'networkidle' });
  });

  test('hero existe com título e painel "O Projeto"', async ({ page }) => {
    await expect(page.locator('.home-hero')).toBeVisible();
    await expect(page.locator('.home-hero h1')).toBeVisible();
    const projPanel = page.locator('.home-proj-panel');
    await expect(projPanel).toBeVisible();
    await expect(projPanel).toHaveAttribute('href', '/o-projeto');
  });

  test('seção "Mais lidos" ou grade de recentes exibe posts', async ({ page }) => {
    const hasMaisLidos = (await page.locator('#mais-lidos .home-ml-card, #mais-lidos .home-ml-item').count()) > 0;
    const hasRecentes = (await page.locator('#recentes .post-card').count()) > 0;
    expect(hasMaisLidos || hasRecentes).toBe(true);
  });

  test('CTA "Todos os artigos" aponta para /todos-artigos', async ({ page }) => {
    const cta = page.locator('a[href="/todos-artigos"]').first();
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/todos-artigos/);
  });

  test('seção de IA, quando presente, exibe destaque e stack', async ({ page }) => {
    const section = page.locator('#ia');
    if ((await section.count()) > 0) {
      await expect(section.locator('.home-ia-big')).toBeVisible();
    }
  });

  test('seção "O Projeto", quando presente, aponta para /o-projeto', async ({ page }) => {
    const section = page.locator('#projeto');
    if ((await section.count()) > 0) {
      const cta = section.locator('a[href="/o-projeto"]').last();
      await expect(cta).toBeVisible();
    }
  });

  test('CTA de assessoria aparece no final da página', async ({ page }) => {
    const cta = page.locator('.cta-adv');
    await expect(cta).toBeVisible();
  });

  test('clicar em post card navega para /post/', async ({ page }) => {
    const firstCard = page.locator('#recentes .post-card').first();
    const count = await firstCard.count();
    if (count > 0) {
      await firstCard.click();
      await expect(page).toHaveURL(/\/post\/.+/);
    }
  });
});
