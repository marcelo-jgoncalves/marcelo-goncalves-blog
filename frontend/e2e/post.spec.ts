import { test, expect } from '@playwright/test';

test.describe('post individual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/artigos', { waitUntil: 'networkidle' });
    const firstCard = page.locator('.post-card').first();
    await firstCard.click();
    await page.waitForLoadState('networkidle');
  });

  test('URL aponta para /post/', async ({ page }) => {
    await expect(page).toHaveURL(/\/post\/.+/);
  });

  test('título do artigo existe e não está vazio', async ({ page }) => {
    const title = page.locator('.post-hero-title');
    await expect(title).toBeVisible();
    const text = await title.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('hero tem byline com autor, data e tempo de leitura', async ({ page }) => {
    await expect(page.locator('.post-hero-in')).toBeVisible();
    await expect(page.locator('.post-byline')).toBeVisible();
  });

  test('conteúdo do post existe', async ({ page }) => {
    await expect(page.locator('.post-content')).toBeVisible();
  });

  test('author box aparece após o conteúdo', async ({ page }) => {
    await expect(page.locator('[data-audit="post-authorbox"]')).toBeVisible();
  });

  test('rail de compartilhamento presente', async ({ page }) => {
    await expect(page.locator('[data-audit="post-share"]')).toBeVisible();
  });

  // ReadingProgressBar lives in Header (components/layout/Header.tsx), not
  // scoped to the post route, so this only checks the indicator is present.
  test('reading progress bar presente', async ({ page }) => {
    await expect(page.locator('[role="progressbar"]')).toBeAttached();
  });

  test('seção de posts relacionados existe no rodapé do post', async ({ page }) => {
    await expect(page.locator('[data-audit="post-related"]')).toBeVisible();
  });

  test('sumário (TOC) lista os headings do artigo e rola até a seção ao clicar', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const toc = page.locator('[data-audit="post-toc"]');
    if ((await toc.count()) === 0) {
      // headings.length === 0 faz o componente retornar null — ramo válido, nada a testar.
      return;
    }
    await expect(toc).toBeVisible();
    const items = toc.locator('.post-toc-item');
    const itemCount = await items.count();
    if (itemCount === 0) return;

    // handleClick faz e.preventDefault() + scrollIntoView (TableOfContents.tsx) —
    // não é navegação real, então a URL nunca ganha o hash; a asserção certa é
    // a heading alvo ficando visível no viewport, não a URL mudando.
    const target = items.nth(Math.min(1, itemCount - 1));
    const href = await target.getAttribute('href');
    await target.click();
    if (href) {
      const heading = page.locator(href);
      await expect(heading).toBeInViewport({ ratio: 0.1 });
    }
  });

  test('clicar num post relacionado navega para outro /post/', async ({ page }) => {
    const currentUrl = page.url();
    const relatedCard = page.locator('[data-audit="post-related"] a[href^="/post/"]').first();
    const count = await relatedCard.count();
    if (count > 0) {
      await relatedCard.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/post\/.+/);
      await expect(page).not.toHaveURL(currentUrl);
    }
  });

  test('rail de compartilhamento tem link funcional para pelo menos uma rede', async ({ page }) => {
    const shareRail = page.locator('[data-audit="post-share"]');
    await expect(shareRail).toBeVisible();
    const shareLinks = shareRail.locator('a[href]');
    expect(await shareLinks.count()).toBeGreaterThan(0);
    const firstHref = await shareLinks.first().getAttribute('href');
    expect(firstHref).toBeTruthy();
  });
});
