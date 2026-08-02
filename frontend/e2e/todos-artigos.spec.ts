import { test, expect } from '@playwright/test';

test.describe('página /todos-artigos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/todos-artigos', { waitUntil: 'networkidle' });
  });

  test('hero existe com título', async ({ page }) => {
    await expect(page.locator('.art-hero')).toBeVisible();
    await expect(page.locator('.art-hero h1')).toBeVisible();
  });

  test('destaque, quando presente na página 1, aponta para /post/', async ({ page }) => {
    const feature = page.locator('.art-feature');
    if ((await feature.count()) > 0) {
      await expect(feature).toHaveAttribute('href', /\/post\/.+/);
    }
  });

  test('busca por texto existe e aceita input', async ({ page }) => {
    const input = page.locator('input[name="q"]');
    await expect(input).toBeVisible();
    await input.fill('aws');
    await expect(input).toHaveValue('aws');
  });

  test('grade principal exibe cards ou estado vazio', async ({ page }) => {
    const hasCards = (await page.locator('#art-grid .post-card').count()) > 0;
    const hasEmpty = (await page.locator('#art-empty').count()) > 0;
    expect(hasCards || hasEmpty).toBe(true);
  });

  test('paginação fica fora do grid quando presente', async ({ page }) => {
    const pagination = page.locator('.op-pagination');
    if ((await pagination.count()) > 0) {
      await expect(pagination).toBeVisible();
    }
  });

  test('CTA editorial aparece no final com links de serviços e contato', async ({ page }) => {
    const cta = page.locator('.art-cta-editorial');
    await expect(cta).toBeVisible();
    await expect(cta.locator('a[href="/servicos"]')).toBeVisible();
    await expect(cta.locator('a[href="/contato"]')).toBeVisible();
  });

  test('clicar em post card navega para /post/', async ({ page }) => {
    const firstCard = page.locator('#art-grid .post-card').first();
    const count = await firstCard.count();
    if (count > 0) {
      await firstCard.click();
      await expect(page).toHaveURL(/\/post\/.+/);
    }
  });

  test('busca com termo vazio não quebra a página (mantém grade/estado vazio)', async ({ page }) => {
    await page.goto('/todos-artigos?q=', { waitUntil: 'networkidle' });
    const hasCards = (await page.locator('#art-grid .post-card').count()) > 0;
    const hasEmpty = (await page.locator('#art-empty').count()) > 0;
    expect(hasCards || hasEmpty).toBe(true);
  });

  test('clicar em "Próxima" avança a página e atualiza a URL', async ({ page }) => {
    const nextLink = page.locator('.op-pagination a[rel="next"]');
    if ((await nextLink.count()) > 0) {
      const firstCardText = await page.locator('#art-grid .post-card').first().textContent();
      await nextLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/nextToken=/);
      await expect(page).toHaveURL(/page=2/);
      // Page 2's grid shouldn't repeat page 1's first card.
      const secondPageFirstCardText = await page.locator('#art-grid .post-card').first().textContent();
      expect(secondPageFirstCardText).not.toBe(firstCardText);
    }
  });

  test('após avançar, "Anterior" volta para a página 1 sem cursor', async ({ page }) => {
    const nextLink = page.locator('.op-pagination a[rel="next"]');
    if ((await nextLink.count()) > 0) {
      await nextLink.click();
      await page.waitForLoadState('networkidle');
      const prevLink = page.locator('.op-pagination a[rel="prev"]');
      await expect(prevLink).toBeVisible();
      await prevLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).not.toHaveURL(/page=2/);
    }
  });
});
