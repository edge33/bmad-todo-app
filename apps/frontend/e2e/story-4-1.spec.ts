import { expect, test } from "@playwright/test";

test.describe("Story 4.1: Task Input & Creation", () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });

  // ── Visibility ────────────────────────────────────────────────────────────

  test("input field is visible on desktop", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("Add task description");
    await expect(input).toBeVisible();
  });

  test("input field is visible on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const input = page.getByLabel("Add task description");
    await expect(input).toBeVisible();
  });

  // ── Placeholder & styling ─────────────────────────────────────────────────

  test("placeholder reads 'Add a task...'", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("Add task description");
    await expect(input).toHaveAttribute("placeholder", "Add a task...");
  });

  // ── Successful creation ───────────────────────────────────────────────────

  test("pressing Enter submits task, input clears, task appears in list", async ({
    page,
  }) => {
    await page.goto("/");
    const label = `E2E-create-${Date.now()}`;
    const input = page.getByLabel("Add task description");

    await input.fill(label);
    await input.press("Enter");

    // Input clears after successful submission
    await expect(input).toHaveValue("", { timeout: 10_000 });

    // New task appears in active list
    await expect(
      page.locator('[data-testid^="active-task-"]', { hasText: label }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("optimistic update — new task appears in list before server confirms", async ({
    page,
  }) => {
    await page.goto("/");
    const label = `E2E-optimistic-${Date.now()}`;
    const input = page.getByLabel("Add task description");

    // Delay POST response to create a window to observe the optimistic update
    await page.route("**/api/tasks", async (route) => {
      if (route.request().method() === "POST") {
        await new Promise((resolve) => setTimeout(resolve, 800));
        await route.continue();
        return;
      }
      await route.continue();
    });

    await input.fill(label);
    await input.press("Enter");

    // Task must appear within 2s — well before the 800ms POST resolves
    await expect(
      page.locator('[data-testid^="active-task-"]', { hasText: label }),
    ).toBeVisible({ timeout: 2_000 });
  });

  // ── Validation ────────────────────────────────────────────────────────────

  test("empty input (no text) does not create a task", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("Add task description");

    let postCalled = false;
    await page.route("**/api/tasks", async (route) => {
      if (route.request().method() === "POST") postCalled = true;
      await route.continue();
    });

    await input.press("Enter");

    expect(postCalled).toBe(false);
    await expect(input).toHaveValue("");
  });

  test("whitespace-only input does not create a task", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("Add task description");

    let postCalled = false;
    await page.route("**/api/tasks", async (route) => {
      if (route.request().method() === "POST") postCalled = true;
      await route.continue();
    });

    await input.fill("   ");
    await input.press("Enter");

    expect(postCalled).toBe(false);
  });

  test("exactly 500-char input submits successfully", async ({ page }) => {
    await page.goto("/");
    // Unique prefix so repeated runs don't collide in the DB
    const prefix = `E2E-500-${Date.now()}-`;
    const label = prefix + "A".repeat(500 - prefix.length);
    const input = page.getByLabel("Add task description");

    await input.fill(label);
    await input.press("Enter");

    await expect(input).toHaveValue("", { timeout: 10_000 });
    await expect(
      page
        .locator('[data-testid^="active-task-"]')
        .filter({ hasText: label })
        .first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("input has maxLength=500 attribute", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("Add task description");
    await expect(input).toHaveAttribute("maxlength", "500");
  });

  // ── Keyboard interactions ─────────────────────────────────────────────────

  test("Escape key clears the input field", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("Add task description");

    await input.fill("some text to clear");
    await expect(input).toHaveValue("some text to clear");

    await input.press("Escape");
    await expect(input).toHaveValue("");
  });

  test("Tab key moves focus away from input", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("Add task description");

    await input.click();
    await expect(input).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(input).not.toBeFocused();
  });

  // ── Error retention ───────────────────────────────────────────────────────

  test("on API failure, description remains in input field for retry", async ({
    page,
  }) => {
    await page.goto("/");
    const label = `E2E-retry-${Date.now()}`;
    const input = page.getByLabel("Add task description");

    // Make POST fail — brief delay lets React render the optimistic task before rollback
    await page.route("**/api/tasks", async (route) => {
      if (route.request().method() === "POST") {
        await new Promise((resolve) => setTimeout(resolve, 150));
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            error: { code: "INTERNAL_ERROR", message: "Simulated failure" },
          }),
        });
        return;
      }
      await route.continue();
    });

    await input.fill(label);
    await input.press("Enter");

    // Wait for optimistic task to appear (confirms mutation fired)
    await expect(
      page.locator('[data-testid^="active-task-"]', { hasText: label }),
    ).toBeVisible({ timeout: 5_000 });

    // Then wait for rollback (optimistic task removed after API failure)
    await expect(
      page.locator('[data-testid^="active-task-"]', { hasText: label }),
    ).toHaveCount(0, { timeout: 10_000 });

    // Input value preserved — ready for retry
    await expect(input).toHaveValue(label);
  });
});
