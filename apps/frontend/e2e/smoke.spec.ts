import { expect, test } from "@playwright/test";

test("smoke test: app loads and renders main component", async ({ page }) => {
  await page.goto("/");

  // Check page title
  await expect(page).toHaveTitle("TodoApp");

  // Check root element exists
  const root = page.locator("#root");
  await expect(root).toBeVisible();

  // Check main app content renders
  const appContent = page.locator("div").filter({ hasText: "TodoApp" }).first();
  await expect(appContent).toBeVisible();
});

test("verify responsive design on desktop", async ({ page }) => {
  await page.goto("/");

  // Desktop viewport
  await page.setViewportSize({ width: 1280, height: 720 });

  const root = page.locator("#root");
  await expect(root).toBeVisible();
});

test("verify responsive design on mobile", async ({ page }) => {
  await page.goto("/");

  // Mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });

  const root = page.locator("#root");
  await expect(root).toBeVisible();
});
