import { expect, test } from "@playwright/test";

async function createTaskAndGetLabel(page: import("@playwright/test").Page) {
  const label = `E2E ${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const input = page.getByLabel("Add task description");
  await input.fill(label);
  await input.press("Enter");
  return label;
}

test.describe("Story 3.1: Task completion (optimistic + animations)", () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });
  test("click completes task, checkmark visible, completed styling (white bg)", async ({
    page,
  }) => {
    await page.goto("/");

    const label = await createTaskAndGetLabel(page);

    const activeRow = page.locator(`[data-testid^="active-task-"]`, {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });

    await activeRow.click();

    const completedRow = page.locator(`[data-testid^="completed-task-"]`, {
      hasText: label,
    });
    await expect(completedRow).toBeVisible({ timeout: 15_000 });

    await expect(completedRow.locator("svg")).toBeVisible();

    // Entrance animation interpolates background; assert completed styling instead
    await expect(completedRow).toHaveClass(/bg-white/);
    await expect(completedRow).toHaveCSS("border-left-width", "4px");

    await expect(
      page.getByRole("status", { name: /task completed/i }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();
  });

  test("completion appears within acceptable time window", async ({ page }) => {
    await page.goto("/");
    const label = await createTaskAndGetLabel(page);

    const activeRow = page.locator(`[data-testid^="active-task-"]`, {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });

    const started = Date.now();
    await activeRow.click();
    await expect(
      page.locator(`[data-testid^="completed-task-"]`, { hasText: label }),
    ).toBeVisible({ timeout: 15_000 });
    const elapsed = Date.now() - started;

    expect(elapsed).toBeGreaterThan(30);
    expect(elapsed).toBeLessThan(8000);
  });

  test("animation timing is not instantaneous (entrance class animates)", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const label = await createTaskAndGetLabel(page);

    const activeRow = page.locator(`[data-testid^="active-task-"]`, {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });
    await activeRow.click();

    const completedRow = page.locator(`[data-testid^="completed-task-"]`, {
      hasText: label,
    });
    await expect(completedRow).toBeVisible({ timeout: 15_000 });

    const animDuration = await completedRow.evaluate((el) => {
      return window.getComputedStyle(el).animationDuration;
    });
    expect(parseFloat(animDuration)).toBeGreaterThan(0);
  });

  test("reduced motion disables entrance animation duration", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const label = await createTaskAndGetLabel(page);

    const activeRow = page.locator(`[data-testid^="active-task-"]`, {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });
    await activeRow.click();

    const completedRow = page.locator(`[data-testid^="completed-task-"]`, {
      hasText: label,
    });
    await expect(completedRow).toBeVisible({ timeout: 15_000 });

    const animName = await completedRow.evaluate((el) => {
      return window.getComputedStyle(el).animationName;
    });
    expect(animName).toBe("none");
  });

  test("undo toast reverts task to active list", async ({ page }) => {
    await page.goto("/");
    const label = await createTaskAndGetLabel(page);

    const activeRow = page.locator(`[data-testid^="active-task-"]`, {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });
    await activeRow.click();

    const completedRow = page.locator(`[data-testid^="completed-task-"]`, {
      hasText: label,
    });
    await expect(completedRow).toBeVisible({ timeout: 15_000 });

    await expect(page.getByText("Task completed")).toBeVisible({
      timeout: 15_000,
    });
    await page.getByRole("button", { name: "Undo" }).click();

    await expect(
      page.locator(`[data-testid^="active-task-"]`, { hasText: label }),
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.locator(`[data-testid^="completed-task-"]`, { hasText: label }),
    ).toHaveCount(0);
  });

  test("API failure shows error and keeps task active", async ({ page }) => {
    await page.goto("/");
    const label = await createTaskAndGetLabel(page);

    const activeRow = page.locator(`[data-testid^="active-task-"]`, {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });

    await page.route(/\/api\/tasks\/\d+/, async (route) => {
      const req = route.request();
      if (req.method() === "PATCH") {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            error: {
              code: "INTERNAL_ERROR",
              message: "Simulated failure",
            },
          }),
        });
        return;
      }
      await route.continue();
    });

    await activeRow.click();

    await expect(
      page.getByRole("alert").filter({ hasText: /Simulated failure/ }),
    ).toBeVisible({ timeout: 15_000 });

    await expect(
      page.locator(`[data-testid^="active-task-"]`, { hasText: label }),
    ).toBeVisible();
  });
});
