import { test, expect } from '@playwright/test';

test.describe('página /sobre', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sobre', { waitUntil: 'networkidle' });
  });

  test('hero existe com título e ação principal', async ({ page }) => {
    await expect(page.locator('.sobre-hero h1')).toBeVisible();
    await expect(page.locator('.sobre-hero h1')).toContainText('Transformo complexidade técnica');

    const ctaAssessoria = page.locator('.sobre-btn-clay');
    await expect(ctaAssessoria).toHaveAttribute('href', '#assessoria');
  });

  test('hero exibe 4 indicadores', async ({ page }) => {
    await expect(page.locator('.sobre-hstat')).toHaveCount(4);
  });

  test('trajetória exibe quote com autor', async ({ page }) => {
    const quote = page.locator('.sobre-traj-quote');
    await expect(quote).toBeVisible();
    await expect(quote.locator('.sobre-tq-author .n')).toContainText('Marcelo Gonçalves');
  });

  test('seção empresas exibe 4 logos', async ({ page }) => {
    await expect(page.locator('.sobre-tc-item')).toHaveCount(4);
  });

  test('áreas em que atuo exibe 6 cards, primeiro é destaque', async ({ page }) => {
    const cards = page.locator('.sobre-area-card');
    await expect(cards).toHaveCount(6);
    await expect(cards.first()).toHaveClass(/sobre-feat/);
    await expect(cards.first()).toContainText('Transformação Digital');
  });

  test('diferencial exibe 3 idiomas', async ({ page }) => {
    await expect(page.locator('.sobre-dif-lang')).toHaveCount(3);
  });

  test('certificações exibe 5 credenciais + card "sempre estudando"', async ({ page }) => {
    await expect(page.locator('.sobre-cert-card')).toHaveCount(6);
    await expect(page.locator('.sobre-cert-card--soon')).toContainText('Sempre estudando');
  });

  test('base acadêmica exibe 4 itens com logos de instituição', async ({ page }) => {
    await expect(page.locator('.sobre-acad-item')).toHaveCount(4);
    await expect(page.locator('.sobre-acad-item').first().locator('.sobre-acad-tile img')).toHaveAttribute('alt', 'Estácio');
  });

  test('CTA assessoria linka para /servicos', async ({ page }) => {
    const btn = page.locator('.cta-adv-btn');
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('href', '/servicos');
  });

  test('navegar para #assessoria via "Trabalhe comigo"', async ({ page }) => {
    await page.locator('.sobre-btn-clay').click();
    await expect(page).toHaveURL(/#assessoria$/);
    await expect(page.locator('#assessoria')).toBeInViewport();
  });
});
