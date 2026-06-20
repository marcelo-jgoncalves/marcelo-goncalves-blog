import { test, expect } from '@playwright/test';

test.describe('página /o-projeto', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/o-projeto', { waitUntil: 'networkidle' });
  });

  test('hero existe com título e status', async ({ page }) => {
    await expect(page.locator('.op-hero')).toBeVisible();
    await expect(page.locator('.op-hero h1')).toContainText('Mais que um blog');
    await expect(page.locator('.op-status-badge')).toContainText('Em produção');
  });

  test('hero exibe 2 indicadores e stats strip com 4 itens', async ({ page }) => {
    await expect(page.locator('.op-hstat-item')).toHaveCount(2);
    await expect(page.locator('.op-stat-item')).toHaveCount(4);
  });

  test('seção "Sobre o projeto" exibe 4 princípios numerados', async ({ page }) => {
    const principles = page.locator('.op-principle');
    await expect(principles).toHaveCount(4);
    await expect(principles.first().locator('.op-tile')).toHaveText('01');
  });

  test('seção timeline existe com contagem de posts', async ({ page }) => {
    await expect(page.locator('#timeline .op-sec-header')).toBeVisible();
    await expect(page.locator('#timeline .op-count')).toContainText('posts publicados');
  });

  test('timeline exibe cards ou estado vazio', async ({ page }) => {
    const cards = page.locator('.op-tl-card');
    const cardCount = await cards.count();

    if (cardCount > 0) {
      await expect(cards.first().locator('h3')).toBeVisible();
      const readLink = cards.first().locator('.op-read');
      await expect(readLink).toHaveAttribute('href', /\/post\/.+/);
    } else {
      await expect(page.locator('.op-empty-state')).toBeVisible();
    }
  });

  test('seção "Próximas etapas" exibe 6 cards de roadmap', async ({ page }) => {
    const cards = page.locator('.op-rm-card');
    await expect(cards).toHaveCount(6);
    await expect(cards.first()).toHaveClass(/op-doing/);
  });

  test('CTA assessoria linka para /servicos', async ({ page }) => {
    await expect(page.locator('.op-cta-adv')).toBeVisible();
    await expect(page.locator('.op-btn-adv')).toHaveAttribute('href', '/servicos');
  });

  test('clicar em "Ler artigo" navega para /post/ quando há posts', async ({ page }) => {
    const readLink = page.locator('.op-tl-card .op-read').first();
    if (await readLink.count() > 0) {
      await readLink.click();
      await expect(page).toHaveURL(/\/post\/.+/);
    }
  });
});
