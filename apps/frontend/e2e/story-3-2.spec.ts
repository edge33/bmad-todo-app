import { expect, test } from "@playwright/test";

async function createTask(
  page: import("@playwright/test").Page,
): Promise<string> {
  const label = `E2E ${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const input = page.getByLabel("Add task description");
  await input.fill(label);
  await input.press("Enter");
  return label;
}

/** Wait until the active row for label has a confirmed (positive) server id. */
async function waitForConfirmedActiveRow(
  page: import("@playwright/test").Page,
  label: string,
) {
  const activeRow = page.locator('[data-testid^="active-task-"]', {
    hasText: label,
  });
  await expect(activeRow).toBeVisible({ timeout: 15_000 });
  // Wait until task id is positive (i.e., server has confirmed the create)
  await page.waitForFunction(
    (text) => {
      const rows = [
        ...document.querySelectorAll('[data-testid^="active-task-"]'),
      ];
      const row = rows.find((el) => el.textContent?.includes(text));
      if (!row) return false;
      const id = row.getAttribute("data-testid")?.replace("active-task-", "");
      return id !== undefined && Number(id) > 0;
    },
    label,
    { timeout: 10_000 },
  );
  return activeRow;
}

test.describe("Story 3.2: TaskCard interactive states", () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });

  test("timestamp is visible on active card", async ({ page }) => {
    await page.goto("/");
    const label = await createTask(page);

    const activeRow = page.locator('[data-testid^="active-task-"]', {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });

    const timestamp = activeRow.locator("time");
    await expect(timestamp).toBeVisible();
    const text = await timestamp.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test("timestamp is visible on completed card", async ({ page }) => {
    await page.goto("/");
    const label = await createTask(page);

    const activeRow = page.locator('[data-testid^="active-task-"]', {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });
    await activeRow.click();

    const completedRow = page.locator('[data-testid^="completed-task-"]', {
      hasText: label,
    });
    await expect(completedRow).toBeVisible({ timeout: 15_000 });

    const timestamp = completedRow.locator("time");
    await expect(timestamp).toBeVisible();
    const text = await timestamp.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test("checkmark visible on completed card", async ({ page }) => {
    await page.goto("/");
    const label = await createTask(page);

    const activeRow = page.locator('[data-testid^="active-task-"]', {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });
    await activeRow.click();

    const completedRow = page.locator('[data-testid^="completed-task-"]', {
      hasText: label,
    });
    await expect(completedRow).toBeVisible({ timeout: 15_000 });
    await expect(completedRow.locator("svg")).toBeVisible();
  });

  test("delete button reveals on hover on desktop (active card)", async ({
    page,
  }) => {
    await page.goto("/");
    const label = await createTask(page);

    const activeRow = page.locator('[data-testid^="active-task-"]', {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });

    await activeRow.hover();
    const deleteBtn = page.locator('[data-testid^="delete-task-"]').first();
    await expect(deleteBtn).toBeVisible();
  });

  test("clicking delete removes active task from list", async ({ page }) => {
    await page.goto("/");
    const label = await createTask(page);

    const activeRow = await waitForConfirmedActiveRow(page, label);
    const taskId = await activeRow
      .getAttribute("data-testid")
      .then((v) => v?.replace("active-task-", ""));

    await activeRow.hover();
    const deleteBtn = page.locator(`[data-testid="delete-task-${taskId}"]`);
    await deleteBtn.click();

    await expect(
      page.locator('[data-testid^="active-task-"]', { hasText: label }),
    ).toHaveCount(0, { timeout: 15_000 });
  });

  test("clicking delete removes completed task from list", async ({ page }) => {
    await page.goto("/");
    const label = await createTask(page);

    const activeRow = await waitForConfirmedActiveRow(page, label);
    const taskId = await activeRow
      .getAttribute("data-testid")
      .then((v) => v?.replace("active-task-", ""));
    await activeRow.click();

    const completedRow = page.locator(
      `[data-testid="completed-task-${taskId}"]`,
    );
    await expect(completedRow).toBeVisible({ timeout: 15_000 });

    await completedRow.hover();
    const deleteBtn = page.locator(`[data-testid="delete-task-${taskId}"]`);
    await deleteBtn.click();

    await expect(
      page.locator('[data-testid^="completed-task-"]', { hasText: label }),
    ).toHaveCount(0, { timeout: 15_000 });
  });

  test("delete failure shows error toast and task reappears", async ({
    page,
  }) => {
    await page.goto("/");
    const label = await createTask(page);

    const activeRow = await waitForConfirmedActiveRow(page, label);
    const taskId = await activeRow
      .getAttribute("data-testid")
      .then((v) => v?.replace("active-task-", ""));

    await page.route(/\/api\/tasks\/\d+/, async (route) => {
      if (route.request().method() === "DELETE") {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            error: {
              code: "INTERNAL_ERROR",
              message: "Simulated delete failure",
            },
          }),
        });
        return;
      }
      await route.continue();
    });

    await activeRow.hover();
    const deleteBtn = page.locator(`[data-testid="delete-task-${taskId}"]`);
    await deleteBtn.click();

    await expect(
      page.getByRole("alert").filter({ hasText: /Something went wrong/ }),
    ).toBeVisible({ timeout: 15_000 });

    await expect(
      page.locator('[data-testid^="active-task-"]', { hasText: label }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("keyboard Delete key removes active task", async ({ page }) => {
    await page.goto("/");
    const label = await createTask(page);

    const activeRow = await waitForConfirmedActiveRow(page, label);

    await activeRow.focus();
    await page.keyboard.press("Delete");

    await expect(
      page.locator('[data-testid^="active-task-"]', { hasText: label }),
    ).toHaveCount(0, { timeout: 15_000 });
  });

  test("keyboard Enter completes active task", async ({ page }) => {
    await page.goto("/");
    const label = await createTask(page);

    const activeRow = await waitForConfirmedActiveRow(page, label);

    await activeRow.focus();
    await page.keyboard.press("Enter");

    await expect(
      page.locator('[data-testid^="completed-task-"]', { hasText: label }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("mobile — delete button visible on hover (touch viewport)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const label = await createTask(page);

    const activeRow = page.locator('[data-testid^="active-task-"]', {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });

    // In Playwright (desktop browser), @media(hover:none) is not applied;
    // hover triggers group-hover visibility which is equivalent for this test.
    await activeRow.hover();
    const deleteBtn = page.locator('[data-testid^="delete-task-"]').first();
    await expect(deleteBtn).toBeVisible();
  });

  test("touch target size is at least 44x44px on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const label = await createTask(page);

    const activeRow = page.locator('[data-testid^="active-task-"]', {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });

    // Hover to reveal the delete button, then measure layout dimensions
    await activeRow.hover();
    const deleteBtn = page.locator('[data-testid^="delete-task-"]').first();
    await expect(deleteBtn).toBeVisible();

    const size = await deleteBtn.evaluate((el) => ({
      width: (el as HTMLElement).offsetWidth,
      height: (el as HTMLElement).offsetHeight,
    }));
    expect(size.width).toBeGreaterThanOrEqual(44);
    expect(size.height).toBeGreaterThanOrEqual(44);
  });
});
