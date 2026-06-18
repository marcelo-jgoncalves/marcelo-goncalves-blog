import { test, expect } from '@playwright/test';

test.describe('página /servicos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/servicos', { waitUntil: 'networkidle' });
  });

  test('hero existe com título e ações principais', async ({ page }) => {
    await expect(page.locator('.svc-hero h1')).toBeVisible();
    await expect(page.locator('.svc-hero h1')).toContainText('Assessoria em AWS');

    const ctaContato = page.locator('.svc-btn-clay-hero');
    await expect(ctaContato).toHaveAttribute('href', '#contato');

    const ctaServicos = page.locator('.svc-btn-ghost');
    await expect(ctaServicos).toHaveAttribute('href', '#servicos');
  });

  test('hero panel mostra disponibilidade', async ({ page }) => {
    const panel = page.locator('.svc-hero-panel');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Disponível para novos projetos');
    await expect(panel.locator('.svc-hp-row')).toHaveCount(3);
  });

  test('stats strip mostra 4 indicadores', async ({ page }) => {
    await expect(page.locator('.svc-stat-item')).toHaveCount(4);
  });

  test('grade de serviços exibe 12 cards', async ({ page }) => {
    await expect(page.locator('.svc-grid .svc-card')).toHaveCount(12);
  });

  test('card 01 (Transformação Digital) é o destaque petrol wide com lista', async ({ page }) => {
    const card = page.locator('.svc-card.svc-wide.svc-alt');
    await expect(card).toContainText('Transformação Digital');
    await expect(card.locator('.svc-wide-list li')).toHaveCount(3);
  });

  test('card 05 (IA Aplicada) é o destaque wide clay com tags', async ({ page }) => {
    const card = page.locator('.svc-card.svc-wide:not(.svc-alt):not(.svc-moss)');
    await expect(card).toContainText('IA Aplicada & Automação Inteligente');
    await expect(card.locator('.svc-wide-tags span')).toHaveCount(3);
  });

  test('card 09 (Backup & DR) é o destaque wide moss com lista', async ({ page }) => {
    const card = page.locator('.svc-card.svc-wide.svc-moss');
    await expect(card).toContainText('Backup & Disaster Recovery');
    await expect(card.locator('.svc-wide-list li')).toHaveCount(3);
  });

  test('seção making-of linka para /o-projeto', async ({ page }) => {
    const cta = page.locator('.svc-mo-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/o-projeto');
  });

  test('CTA final tem botão de contato por e-mail', async ({ page }) => {
    const btn = page.locator('.svc-btn-clay-final');
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('href', /^mailto:/);
  });

  test('navegar para #servicos via "Ver serviços"', async ({ page }) => {
    await page.locator('.svc-btn-ghost').click();
    await expect(page).toHaveURL(/#servicos$/);
    await expect(page.locator('#servicos')).toBeInViewport();
  });
});
