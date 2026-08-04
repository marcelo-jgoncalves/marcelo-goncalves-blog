import { test, expect } from '@playwright/test';

/**
 * Layer 4 for the spacing axis (CLAUDE.md §5, "Role -> minimum token").
 * Same approach as e2e/typography-role.spec.ts: .sec-desc, .ih-center-desc
 * and .ih-results-desc implement the same role ("eyebrow/title to section
 * description") with 3 different tokens/values (24px/14px/16px), none of
 * them the semantically documented token (--title-gap). They were converged
 * to --sp-4 (16px, a design decision, not "the objectively correct value",
 * see comment in globals.css/home.css). This test checks the RENDERED
 * value from computed style, not which CSS token produced it, so it stays
 * valid even if the source token is renamed, as long as the combined visual
 * result is preserved.
 *
 * If a test here fails: don't assume the old value was correct, confirm
 * whether the divergence is a regression (someone reintroduced the wrong
 * role token) or an intentional new design decision. Only in the second
 * case should the expected number below change.
 */

const MOBILE_VIEWPORT = { width: 375, height: 812 };
const EXPECTED_MARGIN_TOP = '16px';

// Every page that uses .sec-desc (globals.css): the shared base for the
// "eyebrow/title to description" role.
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
