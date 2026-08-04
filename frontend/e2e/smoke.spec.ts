import { test, expect } from "@playwright/test";

// Smoke test: validates that the home page loads and the basic layout exists.
// To run: npx playwright test --headed
// Requires the server running: npm run dev (or PLAYWRIGHT_BASE_URL pointing at the target env)

test("homepage carrega sem erro", async ({ page }) => {
  await page.goto("/");
  await expect(page).not.toHaveTitle(/error|404|500/i);
});

test("título da página existe", async ({ page }) => {
  await page.goto("/");
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
});
