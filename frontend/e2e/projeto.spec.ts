import { test, expect } from '@playwright/test';

// /o-projeto foi reescrita (redesign 2026): o hero perdeu a stats strip,
// o roadmap deixou de ser 6 cards com status individual e virou 3 grupos
// por período (Agora/Depois/Exploração), e a página passou a ter sua
// própria seção de CTA final em vez de reusar o componente AdvisoryCta
// (.cta-adv não existe mais aqui). Este spec valida a estrutura real de
// hoje.

test.describe('página /o-projeto', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/o-projeto', { waitUntil: 'networkidle' });
  });

  test('hero existe com título', async ({ page }) => {
    await expect(page.locator('[data-audit="op-hero"]')).toBeVisible();
    await expect(page.locator('[data-audit="op-hero"] h1')).toContainText('plataforma editorial');
  });

  test('seção "Por que construir" e "Estado atual" existem', async ({ page }) => {
    await expect(page.locator('[data-audit="op-why"]')).toBeVisible();
    await expect(page.locator('[data-audit="op-status"]')).toBeVisible();
    await expect(page.locator('[data-audit="op-cap-grid"]')).toBeVisible();
  });

  test('seção "Arquitetura" exibe as 5 camadas', async ({ page }) => {
    await expect(page.locator('[data-audit="op-arquitetura"]')).toBeVisible();
    const layers = page.locator('[data-audit="op-layers"] > div');
    await expect(layers).toHaveCount(5);
  });

  test('seção "Princípios de engenharia" exibe os 6 princípios com ícone', async ({ page }) => {
    await expect(page.locator('[data-audit="op-principles"]')).toBeVisible();
    const principles = page.locator('[data-audit="op-principles-grid"] > div');
    await expect(principles).toHaveCount(6);
    await expect(principles.first().locator('svg')).toBeVisible();
  });

  test('seção "Fluxo editorial" exibe as 5 etapas', async ({ page }) => {
    await expect(page.locator('[data-audit="op-flow"]')).toBeVisible();
    const steps = page.locator('[data-audit="op-flow-list"] > li');
    await expect(steps).toHaveCount(5);
  });

  test('seção "Evolução" exibe os 3 grupos do roadmap', async ({ page }) => {
    await expect(page.locator('[data-audit="op-evolution"]')).toBeVisible();
    const groups = page.locator('[data-audit="op-roadmap-groups"] > div');
    await expect(groups).toHaveCount(3);
  });

  test('bastidores exibe cards de timeline ou estado vazio', async ({ page }) => {
    await expect(page.locator('[data-audit="op-backstage"]')).toBeVisible();
    const cards = page.locator('.op-tl-card');
    const cardCount = await cards.count();

    if (cardCount > 0) {
      await expect(cards.first().locator('h3')).toBeVisible();
      await expect(cards.first()).toHaveAttribute('href', /\/post\/.+/);
    } else {
      await expect(page.locator('.op-empty-state')).toBeVisible();
    }
  });

  test('CTA final existe e linka para /contato', async ({ page }) => {
    await expect(page.locator('[data-audit="op-cta-editorial"]')).toBeVisible();
    const link = page.locator('[data-audit="op-cta-editorial"] a[href="/contato"]');
    await expect(link).toBeVisible();
  });

  test('clicar em card de timeline navega para /post/', async ({ page }) => {
    const card = page.locator('.op-tl-card').first();
    if (await card.count() > 0) {
      await card.click();
      await expect(page).toHaveURL(/\/post\/.+/);
    }
  });
});
