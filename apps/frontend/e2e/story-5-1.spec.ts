import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const MOCK_TASK = {
  id: 99_999,
  description: "E2E-5-1 mock task to delete",
  completed: false,
  createdAt: "2026-04-07T10:00:00.000Z",
  updatedAt: "2026-04-07T10:00:00.000Z",
  userId: null,
};

/** Sets up GET + DELETE route mocks. After DELETE succeeds, GET returns empty list.
 *  After POST (undo recreate), GET returns the new task. */
async function setupDeleteRoutes(page: Page, deleteStatus = 200) {
  let taskList = [MOCK_TASK];

  await page.route("**/api/tasks", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(taskList),
      });
      return;
    }
    if (route.request().method() === "POST") {
      // Undo recreates the task — return it and restore the GET list
      const body = JSON.stringify({ ...MOCK_TASK, id: 99_998 });
      taskList = [{ ...MOCK_TASK, id: 99_998 }];
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body,
      });
      return;
    }
    await route.continue();
  });

  await page.route("**/api/tasks/**", async (route) => {
    if (route.request().method() === "DELETE") {
      if (deleteStatus !== 200) {
        await route.fulfill({
          status: deleteStatus,
          contentType: "application/json",
          body: JSON.stringify({
            error: { code: "INTERNAL_ERROR", message: "Simulated failure" },
          }),
        });
        return;
      }
      // Success — clear the list so invalidateQueries GET returns empty
      taskList = [];
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "null",
      });
      return;
    }
    await route.continue();
  });
}

test.describe("Story 5.1: Task Deletion with Undo Toast", () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });

  // ── Optimistic delete + toast appearance ──────────────────────────────────

  test("deleting a task removes it immediately and shows undo toast", async ({
    page,
  }) => {
    await setupDeleteRoutes(page);
    await page.goto("/");

    // Wait for mock task to appear
    const taskEl = page.locator('[data-testid^="active-task-"]', {
      hasText: MOCK_TASK.description,
    });
    await expect(taskEl).toBeVisible({ timeout: 10_000 });

    // Hover to reveal delete button (desktop: opacity-0 → opacity-100 on hover)
    await taskEl.hover();
    await page
      .getByRole("button", {
        name: `Delete task: ${MOCK_TASK.description}`,
        exact: true,
      })
      .click();

    // Task removed immediately (optimistic)
    await expect(
      page.locator('[data-testid^="active-task-"]', {
        hasText: MOCK_TASK.description,
      }),
    ).toHaveCount(0, { timeout: 5_000 });

    // "Task deleted" undo toast appears
    await expect(page.getByRole("status")).toBeVisible({ timeout: 5_000 });
    await expect(page.getByText("Task deleted")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Undo", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Dismiss", exact: true }),
    ).toBeVisible();
  });

  // ── Undo restores the task ────────────────────────────────────────────────

  test("clicking Undo restores the deleted task to the list", async ({
    page,
  }) => {
    await setupDeleteRoutes(page);
    await page.goto("/");

    const taskEl = page.locator('[data-testid^="active-task-"]', {
      hasText: MOCK_TASK.description,
    });
    await expect(taskEl).toBeVisible({ timeout: 10_000 });

    await taskEl.hover();
    await page
      .getByRole("button", {
        name: `Delete task: ${MOCK_TASK.description}`,
        exact: true,
      })
      .click();

    // Task gone
    await expect(
      page.locator('[data-testid^="active-task-"]', {
        hasText: MOCK_TASK.description,
      }),
    ).toHaveCount(0, { timeout: 5_000 });

    // Click Undo — triggers POST to recreate task
    const undoBtn = page.getByRole("button", { name: "Undo", exact: true });
    await expect(undoBtn).toBeVisible({ timeout: 5_000 });
    await undoBtn.click();

    // Task is restored (recreated by POST, reappears in active list)
    await expect(
      page.locator('[data-testid^="active-task-"]', {
        hasText: MOCK_TASK.description,
      }),
    ).toBeVisible({ timeout: 10_000 });
  });

  // ── Dismiss closes toast without restoring ────────────────────────────────

  test("clicking Dismiss closes the toast without restoring the task", async ({
    page,
  }) => {
    await setupDeleteRoutes(page);
    await page.goto("/");

    const taskEl = page.locator('[data-testid^="active-task-"]', {
      hasText: MOCK_TASK.description,
    });
    await expect(taskEl).toBeVisible({ timeout: 10_000 });

    await taskEl.hover();
    await page
      .getByRole("button", {
        name: `Delete task: ${MOCK_TASK.description}`,
        exact: true,
      })
      .click();

    const dismissBtn = page.getByRole("button", {
      name: "Dismiss",
      exact: true,
    });
    await expect(dismissBtn).toBeVisible({ timeout: 5_000 });
    await dismissBtn.click();

    // Toast is gone
    await expect(page.getByRole("status")).toHaveCount(0, { timeout: 5_000 });

    // Task stays deleted (no undo was triggered)
    await expect(
      page.locator('[data-testid^="active-task-"]', {
        hasText: MOCK_TASK.description,
      }),
    ).toHaveCount(0);
  });

  // ── Toast auto-dismisses after timeout ────────────────────────────────────

  test("undo toast auto-dismisses after ~6 seconds", async ({ page }) => {
    await setupDeleteRoutes(page);
    await page.goto("/");

    const taskEl = page.locator('[data-testid^="active-task-"]', {
      hasText: MOCK_TASK.description,
    });
    await expect(taskEl).toBeVisible({ timeout: 10_000 });

    await taskEl.hover();
    await page
      .getByRole("button", {
        name: `Delete task: ${MOCK_TASK.description}`,
        exact: true,
      })
      .click();

    // Toast appears
    await expect(page.getByRole("status")).toBeVisible({ timeout: 5_000 });

    // Wait for auto-dismiss (6s timer + buffer)
    await page.waitForTimeout(7_000);
    await expect(page.getByRole("status")).toHaveCount(0);
  });

  // ── DELETE failure shows error toast ──────────────────────────────────────

  test("DELETE failure shows error toast and restores task", async ({
    page,
  }) => {
    await setupDeleteRoutes(page, 500);
    await page.goto("/");

    const taskEl = page.locator('[data-testid^="active-task-"]', {
      hasText: MOCK_TASK.description,
    });
    await expect(taskEl).toBeVisible({ timeout: 10_000 });

    await taskEl.hover();
    await page
      .getByRole("button", {
        name: `Delete task: ${MOCK_TASK.description}`,
        exact: true,
      })
      .click();

    // Error toast appears (not the undo status toast)
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 10_000 });

    // Task is restored (rollback from onError)
    await expect(
      page.locator('[data-testid^="active-task-"]', {
        hasText: MOCK_TASK.description,
      }),
    ).toBeVisible({ timeout: 10_000 });
  });
});
