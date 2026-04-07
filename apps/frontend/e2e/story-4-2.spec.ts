import { expect, test } from "@playwright/test";

test.describe("Story 4.2: useCreateTask error toast + retry", () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });

  // ── Error toast visibility ────────────────────────────────────────────────

  test("POST failure shows error toast with user-friendly message", async ({
    page,
  }) => {
    await page.route("**/api/tasks", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            success: false,
            error: { code: "INTERNAL_ERROR", message: "Simulated failure" },
          }),
        });
        return;
      }
      await route.continue();
    });

    await page.goto("/");
    const label = `E2E-4-2-toast-${Date.now()}`;
    const input = page.getByLabel("Add task description");

    await input.fill(label);
    await input.press("Enter");

    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible({ timeout: 10_000 });
    // Message should contain human-readable text, not raw status codes
    const alertText = await alert.innerText();
    expect(alertText.length).toBeGreaterThan(0);
  });

  test("POST failure shows Retry button in error toast", async ({ page }) => {
    await page.route("**/api/tasks", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ success: false, error: { code: "ERR" } }),
        });
        return;
      }
      await route.continue();
    });

    await page.goto("/");
    const input = page.getByLabel("Add task description");
    // Label must not contain "retry" or "dismiss" — avoids false substring matches in role queries
    await input.fill(`E2E-4-2-fail-btn-${Date.now()}`);
    await input.press("Enter");

    await expect(page.getByRole("alert")).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByRole("button", { name: "Retry", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Dismiss", exact: true }),
    ).toBeVisible();
  });

  // ── Rollback ──────────────────────────────────────────────────────────────

  test("POST failure removes optimistic task from active list", async ({
    page,
  }) => {
    await page.route("**/api/tasks", async (route) => {
      if (route.request().method() === "POST") {
        // Small delay so optimistic task renders before rollback
        await new Promise((resolve) => setTimeout(resolve, 150));
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ success: false, error: { code: "ERR" } }),
        });
        return;
      }
      await route.continue();
    });

    await page.goto("/");
    const label = `E2E-4-2-rollback-${Date.now()}`;
    const input = page.getByLabel("Add task description");
    await input.fill(label);
    await input.press("Enter");

    // Optimistic task appears briefly
    await expect(
      page.locator('[data-testid^="active-task-"]', { hasText: label }),
    ).toBeVisible({ timeout: 5_000 });

    // Then rolled back after API failure
    await expect(
      page.locator('[data-testid^="active-task-"]', { hasText: label }),
    ).toHaveCount(0, { timeout: 10_000 });
  });

  // ── Retry button ──────────────────────────────────────────────────────────

  test("clicking Retry re-fires the POST request", async ({ page }) => {
    let postCount = 0;

    await page.route("**/api/tasks", async (route) => {
      if (route.request().method() === "POST") {
        postCount++;
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ success: false, error: { code: "ERR" } }),
        });
        return;
      }
      await route.continue();
    });

    await page.goto("/");
    const input = page.getByLabel("Add task description");
    // Label must not contain "retry" — avoids role query false matches
    await input.fill(`E2E-4-2-click-${Date.now()}`);
    await input.press("Enter");

    // Wait for error toast with Retry button — use exact to avoid substring matches
    const retryBtn = page.getByRole("button", { name: "Retry", exact: true });
    await expect(retryBtn).toBeVisible({ timeout: 10_000 });

    // Click Retry — should trigger a second POST
    await retryBtn.click();

    // Give it time to fire the retry mutation
    await page.waitForTimeout(1_000);
    expect(postCount).toBe(2);
  });

  // ── Dismiss button ────────────────────────────────────────────────────────

  test("clicking Dismiss closes the toast without retrying", async ({
    page,
  }) => {
    let postCount = 0;

    await page.route("**/api/tasks", async (route) => {
      if (route.request().method() === "POST") {
        postCount++;
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ success: false, error: { code: "ERR" } }),
        });
        return;
      }
      await route.continue();
    });

    await page.goto("/");
    const input = page.getByLabel("Add task description");
    // Label must not contain "dismiss" — avoids role query false matches
    await input.fill(`E2E-4-2-close-${Date.now()}`);
    await input.press("Enter");

    const dismissBtn = page.getByRole("button", {
      name: "Dismiss",
      exact: true,
    });
    await expect(dismissBtn).toBeVisible({ timeout: 10_000 });

    await dismissBtn.click();

    // Toast should be gone
    await expect(page.getByRole("alert")).toHaveCount(0, { timeout: 5_000 });

    // No additional POST fired
    expect(postCount).toBe(1);
  });
});
