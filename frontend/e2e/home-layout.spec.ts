import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test('home: sidebar existe com os widgets corretos', async ({ page }) => {
  await page.goto(BASE);
  await expect(page.locator('.home-sidebar')).toBeVisible();
  await expect(page.locator('.op-service-callout')).toBeVisible();
  await expect(page.locator('.popular-widget')).toBeVisible();
  await expect(page.locator('.projeto-widget')).toBeVisible();
});

test('home: grid 2 colunas existe no layout', async ({ page }) => {
  await page.goto(BASE);
  await expect(page.locator('.home-layout')).toBeVisible();
  await expect(page.locator('.home-posts-grid').first()).toBeVisible();
});

test('home: PostCard tem meta-row unificada', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await expect(page.locator('.post-card__meta-row').first()).toBeVisible();
});

test('home: categorias aparecem no main', async ({ page }) => {
  await page.goto(BASE);
  await expect(page.locator('.categories-grid')).toBeVisible();
  const cards = page.locator('.category-card');
  await expect(cards).toHaveCount(6);
});

test('home: CTA newsletter no final', async ({ page }) => {
  await page.goto(BASE);
  await expect(page.locator('.cta')).toBeVisible();
  await expect(page.locator('.cta h2')).toContainText('IA');
});
