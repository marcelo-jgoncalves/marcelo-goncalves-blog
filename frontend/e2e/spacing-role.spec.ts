import { test, expect } from '@playwright/test';

/**
 * Camada 4 pro eixo de espaçamento (CLAUDE.md §5, "Papel → token mínimo").
 * Mesma lógica de e2e/typography-role.spec.ts, aplicada ao achado real de
 * espaçamento desta sessão (2026-07-23): .sec-desc, .ih-center-desc e
 * .ih-results-desc implementavam o mesmo papel ("eyebrow/título →
 * descrição de seção") com 3 tokens/valores diferentes (24px/14px/16px)
 * — nenhum deles o token semanticamente documentado (--title-gap). Foram
 * convergidos pra --sp-4 (16px, decisão de design, não "o valor certo
 * objetivo" — ver comentário em globals.css/home.css). Este teste verifica
 * o valor RENDERIZADO em computed style, não qual token CSS foi usado —
 * assim ele continua válido mesmo se o token de origem mudar de nome,
 * desde que o resultado visual combinado seja mantido.
 *
 * Se um teste aqui falhar: não assuma que o valor antigo estava certo —
 * confirme se a divergência é uma regressão (alguém reintroduziu um token
 * de papel errado) ou uma decisão de design nova e intencional. Só no
 * segundo caso o número esperado abaixo deve mudar.
 */

const MOBILE_VIEWPORT = { width: 375, height: 812 };
const EXPECTED_MARGIN_TOP = '16px';

// Toda página que usa .sec-desc (globals.css) — base compartilhada do
// papel "eyebrow/título → descrição".
const PAGES_WITH_SEC_DESC = ['/', '/contato', '/o-projeto', '/artigos', '/sobre'];

test.describe('Espaçamento "eyebrow/título → descrição" consistente entre páginas — CLAUDE.md §5', () => {
  for (const url of PAGES_WITH_SEC_DESC) {
    test(`${url}: todo .sec-desc renderiza margin-top = ${EXPECTED_MARGIN_TOP}`, async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto(url, { waitUntil: 'networkidle' });
      const elements = page.locator('.sec-desc');
      const count = await elements.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const marginTop = await elements.nth(i).evaluate((el) => getComputedStyle(el).marginTop);
        expect(marginTop, `.sec-desc #${i} em ${url}`).toBe(EXPECTED_MARGIN_TOP);
      }
    });
  }

  test('Home: .ih-center-desc e .ih-results-desc convergem com .sec-desc', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto('/');
    for (const selector of ['.ih-center-desc', '.ih-results-desc']) {
      const marginTop = await page.locator(selector).first().evaluate((el) => getComputedStyle(el).marginTop);
      expect(marginTop, selector).toBe(EXPECTED_MARGIN_TOP);
    }
  });
});
