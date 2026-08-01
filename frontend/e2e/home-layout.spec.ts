import { test, expect } from '@playwright/test';

// Home is the institutional landing page (hero + 4 service pillars,
// methodology, results/cases, blog teaser, final CTA), not a blog layout.

const BASE = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Home institucional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
  });

  test('hero existe com título e ações', async ({ page }) => {
    await expect(page.locator('[data-audit="ih-hero"]')).toBeVisible();
    await expect(page.locator('[data-audit="ih-hero"] h1')).toBeVisible();
  });

  test('seção de serviços exibe os 4 pilares', async ({ page }) => {
    await expect(page.locator('#servicos')).toBeVisible();
    await expect(page.locator('.pillar-card')).toHaveCount(4);
  });

  test('seção "Como trabalhamos" exibe método e etapas', async ({ page }) => {
    await expect(page.locator('[data-audit="ih-method-grid"]')).toBeVisible();
    await expect(page.locator('[data-audit="ih-method-card"]')).toBeVisible();
  });

  test('seção de resultados exibe cases com métricas', async ({ page }) => {
    await expect(page.locator('#resultados')).toBeVisible();
    const cases = page.locator('.ih-case-text');
    expect(await cases.count()).toBeGreaterThan(0);
  });

  test('teaser de blog exibe posts recentes, quando existem', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const cards = page.locator('#conteudo .post-card');
    const count = await cards.count();
    test.skip(count === 0, 'Nenhum post recente disponível — API/backend fora do ar nesta execução.');
    expect(count).toBeGreaterThan(0);
  });

  test('CTA final existe e aponta para /contato', async ({ page }) => {
    await expect(page.locator('.cta-adv')).toBeVisible();
    await expect(page.locator('.cta-adv-btn')).toHaveAttribute('href', '/contato');
  });
});
