import { test, expect } from "@playwright/test";

// Smoke test — valida que a página inicial carrega e o layout básico existe.
// Para rodar: npx playwright test --headed
// Requer o servidor rodando: npm run dev  (ou PLAYWRIGHT_BASE_URL apontando para o ambiente)

test("homepage carrega sem erro", async ({ page }) => {
  await page.goto("/");
  await expect(page).not.toHaveTitle(/error|404|500/i);
});

test("título da página existe", async ({ page }) => {
  await page.goto("/");
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
});
