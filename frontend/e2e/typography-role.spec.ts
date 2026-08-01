import { test, expect } from '@playwright/test';

/**
 * Camada 4 da estratégia de tokens (CLAUDE.md §5, "Papel → token mínimo").
 * O Stylelint (camada 2) só garante que ALGUM token válido da escala foi
 * usado — nunca que seja o token certo pro papel do elemento (texto de
 * leitura, link/CTA, título de card). Este teste verifica o resultado
 * final (computed font-size em mobile), não qual token CSS foi usado pra
 * chegar lá — assim ele continua válido mesmo se um seletor trocar de
 * token no futuro, desde que o valor renderizado respeite o piso do papel.
 *
 * Se um teste aqui falhar: não é bug de token errado, é uma regressão de
 * hierarquia — ver CLAUDE.md §5 antes de simplesmente subir o número.
 */

const MOBILE_VIEWPORT = { width: 375, height: 812 };

interface RoleCheck {
  role: 'texto de leitura' | 'link/CTA interativo' | 'título de card';
  selector: string;
  minPx: number;
}

// Piso por papel, espelhando a tabela de CLAUDE.md §5:
// leitura >= 16px (--type-body-sm), link/CTA >= 14px (--type-label),
// título de card >= 20px (--type-lead).
const HOME_CHECKS: RoleCheck[] = [
  { role: 'texto de leitura', selector: '.pillar-card > p', minPx: 16 },
  { role: 'texto de leitura', selector: '.ih-case-text p', minPx: 16 },
  { role: 'texto de leitura', selector: '.ih-mc-text', minPx: 16 },
  { role: 'link/CTA interativo', selector: '.pillar-more', minPx: 14 },
  { role: 'link/CTA interativo', selector: '.foot-col ul li a', minPx: 14 },
  { role: 'link/CTA interativo', selector: '.foot-col-lead', minPx: 14 },
  { role: 'título de card', selector: '.pillar-card h3', minPx: 20 },
  { role: 'título de card', selector: '.ih-case-text h3', minPx: 20 },
];

// Depende de posts recentes existirem (seção condicional em page.tsx) —
// só roda se a API/backend estiver disponível, como os demais testes de
// PostCard nesta suíte (ver home-layout.spec.ts).
const HOME_BLOG_CHECKS: RoleCheck[] = [
  { role: 'texto de leitura', selector: '.post-card .pc-excerpt', minPx: 16 },
  { role: 'link/CTA interativo', selector: '.post-card .pc-foot .read-article', minPx: 14 },
];

test.describe('Tokens de tipografia por papel (mobile, 375px) — CLAUDE.md §5', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto('/');
  });

  for (const check of HOME_CHECKS) {
    test(`${check.role}: "${check.selector}" >= ${check.minPx}px`, async ({ page }) => {
      const locator = page.locator(check.selector).first();
      await expect(locator).toBeVisible();
      const fontSize = await locator.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(fontSize).toBeGreaterThanOrEqual(check.minPx);
    });
  }

  for (const check of HOME_BLOG_CHECKS) {
    test(`${check.role}: "${check.selector}" >= ${check.minPx}px (requer posts reais)`, async ({ page }) => {
      const locator = page.locator(check.selector).first();
      const count = await locator.count();
      test.skip(count === 0, 'Nenhum post recente disponível — API/backend fora do ar nesta execução.');
      await expect(locator).toBeVisible();
      const fontSize = await locator.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(fontSize).toBeGreaterThanOrEqual(check.minPx);
    });
  }
});
