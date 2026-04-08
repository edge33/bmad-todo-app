import { expect, test } from "@playwright/test";

const MOCK_TASKS = [
  {
    id: 1,
    description: "Buy milk",
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    description: "Walk the dog",
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function setupRoutes(page: import("@playwright/test").Page) {
  let deleted = false;
  await page.route("**/api/tasks", async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      const tasks = deleted ? MOCK_TASKS.filter((t) => t.id !== 1) : MOCK_TASKS;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(tasks),
      });
    } else if (method === "POST") {
      deleted = false;
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(MOCK_TASKS[0]),
      });
    } else {
      await route.continue();
    }
  });
  await page.route("**/api/tasks/*", async (route) => {
    if (route.request().method() === "DELETE") {
      deleted = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_TASKS[0]),
      });
    } else {
      await route.continue();
    }
  });
}

test.describe("Story 5.2: Delete Button UI & Interaction Model", () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });

  test("delete button is hidden by default on desktop (opacity 0 before hover)", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "Mobile Chrome",
      "Mobile always shows delete button",
    );
    await setupRoutes(page);
    await page.goto("/");
    await page.waitForSelector('[data-testid="active-task-1"]');
    const deleteBtn = page.locator('[data-testid="delete-task-1"]');
    const opacity = await deleteBtn.evaluate(
      (el) => window.getComputedStyle(el).opacity,
    );
    expect(parseFloat(opacity)).toBeLessThan(0.05);
  });

  test("delete button is visible after hovering the card (desktop)", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "Mobile Chrome",
      "Mobile always shows delete button",
    );
    await setupRoutes(page);
    await page.goto("/");
    await page.waitForSelector('[data-testid="active-task-1"]');
    const card = page.locator('[data-testid="active-task-1"]');
    await card.hover();
    // Wait for CSS transition-opacity (150ms) to settle before reading computed style
    await page.waitForFunction(() => {
      const btn = document.querySelector('[data-testid="delete-task-1"]');
      if (!btn) return false;
      return parseFloat(window.getComputedStyle(btn).opacity) > 0;
    });
    const deleteBtn = page.locator('[data-testid="delete-task-1"]');
    const opacity = await deleteBtn.evaluate(
      (el) => window.getComputedStyle(el).opacity,
    );
    expect(parseFloat(opacity)).toBeGreaterThan(0);
  });

  test("delete button is always visible on mobile (no hover needed)", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "Mobile Chrome",
      "Desktop uses hover reveal — tested separately",
    );
    await setupRoutes(page);
    await page.goto("/");
    await page.waitForSelector('[data-testid="active-task-1"]');
    const deleteBtn = page.locator('[data-testid="delete-task-1"]');
    const opacity = await deleteBtn.evaluate(
      (el) => window.getComputedStyle(el).opacity,
    );
    expect(parseFloat(opacity)).toBe(1);
  });

  test("delete button touch target is at least 44x44px", async ({
    page,
  }, testInfo) => {
    await setupRoutes(page);
    await page.goto("/");
    await page.waitForSelector('[data-testid="active-task-1"]');
    if (testInfo.project.name !== "Mobile Chrome") {
      await page.locator('[data-testid="active-task-1"]').hover();
    }
    const deleteBtn = page.locator('[data-testid="delete-task-1"]');
    const size = await deleteBtn.evaluate((el) => ({
      width: (el as HTMLElement).offsetWidth,
      height: (el as HTMLElement).offsetHeight,
    }));
    expect(size.width).toBeGreaterThanOrEqual(44);
    expect(size.height).toBeGreaterThanOrEqual(44);
  });

  test("clicking delete removes the task and shows undo toast", async ({
    page,
  }, testInfo) => {
    await setupRoutes(page);
    await page.goto("/");
    await page.waitForSelector('[data-testid="active-task-1"]');
    if (testInfo.project.name !== "Mobile Chrome") {
      await page.locator('[data-testid="active-task-1"]').hover();
    }
    const deleteBtn = page.locator('[data-testid="delete-task-1"]');
    await deleteBtn.click();
    await expect(page.getByText("Task deleted")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Undo", exact: true }),
    ).toBeVisible();
    await expect(page.locator('[data-testid="active-task-1"]')).toHaveCount(0);
  });

  test("delete button is visible after hovering a completed task card (desktop)", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "Mobile Chrome",
      "Mobile always shows delete button",
    );
    await setupRoutes(page);
    await page.goto("/");
    await page.waitForSelector('[data-testid="completed-task-2"]');
    const completedCard = page.locator('[data-testid="completed-task-2"]');
    await completedCard.hover();
    // Wait for CSS transition-opacity (150ms) to settle before reading computed style
    await page.waitForFunction(() => {
      const btn = document.querySelector('[data-testid="delete-task-2"]');
      if (!btn) return false;
      return parseFloat(window.getComputedStyle(btn).opacity) > 0;
    });
    const deleteBtn = page.locator('[data-testid="delete-task-2"]');
    const opacity = await deleteBtn.evaluate(
      (el) => window.getComputedStyle(el).opacity,
    );
    expect(parseFloat(opacity)).toBeGreaterThan(0);
  });
});
