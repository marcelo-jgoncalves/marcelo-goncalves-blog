import { test, expect } from '@playwright/test';

// /sobre foi reescrita (redesign 2026) — o hero, a estrutura de seções e
// o conteúdo mudaram por completo em relação à versão testada antes.
// Seções descritas em versões anteriores (indicadores no hero, quote de
// trajetória, logos de empresas, cards de área, diferencial de idiomas,
// cards de certificação, logos de instituição acadêmica) nunca chegaram a
// ser implementadas nesta versão — ver CLAUDE.md §10 item #40 (assets já
// otimizados, seção deliberadamente adiada por decisão de Marcelo).
// Este spec valida a estrutura real de hoje.

test.describe('página /sobre', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sobre', { waitUntil: 'networkidle' });
  });

  test('hero existe com título e ação principal', async ({ page }) => {
    await expect(page.locator('[data-audit="sobre-hero"] h1')).toBeVisible();
    await expect(page.locator('[data-audit="sobre-hero"] h1')).toContainText('Engenharia próxima da operação');

    const ctaServicos = page.locator('.sobre-btn-clay');
    await expect(ctaServicos).toHaveAttribute('href', '/#servicos');
  });

  test('seção "Nossa visão" exibe os 3 resultados', async ({ page }) => {
    const list = page.locator('[data-audit="sobre-visao-list"]');
    await expect(list).toBeVisible();
    await expect(list.locator('> span')).toHaveCount(3);
  });

  test('seção "Origem e propósito" exibe texto e missão', async ({ page }) => {
    await expect(page.locator('[data-audit="sobre-origem-grid"]')).toBeVisible();
    await expect(page.locator('[data-audit="sobre-origem-mission"]')).toBeVisible();
  });

  test('seção "Princípios de engenharia" exibe as 5 linhas + manifesto', async ({ page }) => {
    const list = page.locator('[data-audit="sobre-principles-list"]');
    await expect(list).toBeVisible();
    await expect(list.locator('> div')).toHaveCount(5);
    await expect(page.locator('[data-audit="sobre-manifesto"]')).toBeVisible();
  });

  test('seção "Como tomamos decisões" exibe os 5 módulos com ícone', async ({ page }) => {
    await expect(page.locator('[data-audit="sobre-abordagem-head"]')).toBeVisible();
    const modules = page.locator('[data-audit="sobre-modules-grid"] > div');
    await expect(modules).toHaveCount(5);
  });

  test('bloco de liderança exibe bio e 3 tags de atuação', async ({ page }) => {
    await expect(page.locator('[data-audit="sobre-behind-card"]')).toBeVisible();
    await expect(page.locator('[data-audit="sobre-behind-card"]')).toContainText('Marcelo Gonçalves');
    const tags = page.locator('[data-audit="sobre-behind-tags"] > span');
    await expect(tags).toHaveCount(3);
    await expect(page.locator('[data-audit="sobre-boutique"]')).toBeVisible();
  });

  test('bloco de experiência/certificações exibe os 4 cards de autoridade', async ({ page }) => {
    const grid = page.locator('[data-audit="sobre-evidence-grid"]');
    await expect(grid).toBeVisible();
    // FeatureCard não expõe data-audit próprio aqui — conta pelo componente pai.
    const cards = grid.locator('> *');
    await expect(cards).toHaveCount(4);
  });

  test('CTA final ("Vamos conversar") existe e linka para /contato', async ({ page }) => {
    const btn = page.locator('.cta-adv-btn');
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('href', '/contato');
  });

  test('navegar para #servicos via "Conhecer os serviços"', async ({ page }) => {
    await page.locator('.sobre-btn-clay').click();
    await expect(page).toHaveURL(/\/#servicos$/);
  });
});
