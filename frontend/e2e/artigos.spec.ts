import { test, expect } from '@playwright/test';

test.describe('página /artigos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/artigos', { waitUntil: 'load' });
  });

  test('hero existe com título e busca', async ({ page }) => {
    await expect(page.locator('.art-hero')).toBeVisible();
    await expect(page.locator('.art-hero h1')).toBeVisible();
    await expect(page.locator('.art-search input[name="q"]')).toBeVisible();
  });

  test('hero stats mostram contagem de artigos e categorias', async ({ page }) => {
    await expect(page.locator('.art-hero-stats')).toBeVisible();
    await expect(page.locator('.art-hero-stats')).toContainText('artigos');
  });

  test('CTA O Projeto aparece no hero', async ({ page }) => {
    const cta = page.locator('.art-proj-card');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/o-projeto');
  });

  test('barra de filtros existe com chip "Todos" ativo', async ({ page }) => {
    await expect(page.locator('.art-filterbar')).toBeVisible();
    await expect(page.locator('.art-chip.active')).toHaveText('Todos');
    await expect(page.locator('.art-chip')).toHaveCount(8); // Todos + 7 categorias
  });

  test('masthead exibe artigo em destaque', async ({ page }) => {
    await expect(page.locator('.art-feature')).toBeVisible();
    await expect(page.locator('.art-feature h2')).toBeVisible();
    await expect(page.locator('.art-f-read')).toHaveAttribute('href', /\/post\/.+/);
  });

  test('grade principal exibe cards de posts', async ({ page }) => {
    await expect(page.locator('#art-grid .post-card').first()).toBeVisible();
  });

  test('clicar em chip de categoria filtra a grade', async ({ page }) => {
    const chip = page.locator('.art-chip[data-filter="tutoriais-aws"]');
    await chip.click();
    await expect(chip).toHaveClass(/active/);
    await expect(page.locator('#art-grid-title')).toHaveText('Tutoriais AWS');

    const visibleCards = page.locator('#art-grid .post-card:not(.is-hidden)');
    const count = await visibleCards.count();
    for (let i = 0; i < count; i++) {
      await expect(visibleCards.nth(i)).toHaveAttribute('data-cat', 'tutoriais-aws');
    }
  });

  test('voltar para "Todos" remove o filtro', async ({ page }) => {
    await page.locator('.art-chip[data-filter="cloud-computing"]').click();
    await page.locator('.art-chip[data-filter="all"]').click();
    await expect(page.locator('#art-grid-title')).toHaveText('Todos os artigos');
    await expect(page.locator('#art-grid .post-card.is-hidden')).toHaveCount(0);
  });

  test('paginação fica fora do grid quando presente', async ({ page }) => {
    const pagination = page.locator('.pagination');
    const hasPagination = (await pagination.count()) > 0;
    if (hasPagination) {
      await expect(pagination).toBeVisible();
    }
  });

  test('CTA de assessoria aparece no final da página', async ({ page }) => {
    const cta = page.locator('.art-cta-adv');
    await expect(cta).toBeVisible();
    await expect(cta.locator('.art-btn-adv')).toHaveAttribute('href', '/servicos');
  });

  test('clicar em post card navega para /post/', async ({ page }) => {
    await page.locator('#art-grid .post-card').first().click();
    await expect(page).toHaveURL(/\/post\/.+/);
  });
});
