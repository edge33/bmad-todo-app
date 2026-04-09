import { expect, test } from "@playwright/test";

async function createTaskAndGetLabel(page: import("@playwright/test").Page) {
  const label = `E2E ${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const input = page.getByLabel("Add Task");
  await input.fill(label);
  await input.press("Enter");
  return label;
}

test.describe("Story 9.1: Accessibility & Dark Mode", () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });

  // --- Keyboard Navigation ---
  // WebKit handles Tab focus on buttons differently; skip keyboard tests there.

  test("Tab moves focus: input -> first active task -> delete button", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName === "webkit", "WebKit Tab focus differs for buttons");
    await page.goto("/");
    const label = await createTaskAndGetLabel(page);
    const activeRow = page.locator(`[data-testid^="active-task-"]`, {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });

    // Focus input first
    const input = page.getByLabel("Add Task");
    await input.focus();
    expect(await input.evaluate((el) => el === document.activeElement)).toBe(
      true,
    );

    // Tab to first active task
    await page.keyboard.press("Tab");
    const activeButton = page
      .locator(`button[data-testid^="active-task-"]`)
      .first();
    await expect(activeButton).toBeFocused();

    // Tab to delete button
    await page.keyboard.press("Tab");
    const deleteButton = page
      .locator(`button[aria-label^="Delete task:"]`)
      .first();
    await expect(deleteButton).toBeFocused();
  });

  test("Shift+Tab reverses focus order", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "WebKit Tab focus differs for buttons");
    await page.goto("/");
    const label = await createTaskAndGetLabel(page);
    const activeButton = page.locator(`button[data-testid^="active-task-"]`, {
      hasText: label,
    });
    await expect(activeButton).toBeVisible({ timeout: 15_000 });
    await expect(activeButton).toBeEnabled({ timeout: 10_000 });

    // Tab to active task via keyboard
    const input = page.getByLabel("Add Task");
    await input.focus();
    let focused = false;
    for (let i = 0; i < 10 && !focused; i++) {
      await page.keyboard.press("Tab");
      focused = await activeButton.evaluate(
        (el) => el === document.activeElement,
      );
    }
    expect(focused).toBe(true);
    // Shift+Tab should move backward
    await page.keyboard.press("Shift+Tab");
    await expect(activeButton).not.toBeFocused();
  });

  test("Enter on focused active task card marks it complete", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName === "webkit", "WebKit Tab focus differs for buttons");
    await page.goto("/");
    const label = await createTaskAndGetLabel(page);
    const activeRow = page.locator(`button[data-testid^="active-task-"]`, {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });
    await expect(activeRow).toBeEnabled({ timeout: 10_000 });

    // Tab to the task to ensure focus-visible
    const input = page.getByLabel("Add Task");
    await input.focus();
    // Tab through until active task is focused
    let focused = false;
    for (let i = 0; i < 10 && !focused; i++) {
      await page.keyboard.press("Tab");
      focused = await activeRow.evaluate((el) => el === document.activeElement);
    }
    expect(focused).toBe(true);
    await page.keyboard.press("Enter");

    await expect(
      page.locator(`[data-testid^="completed-task-"]`, { hasText: label }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("Delete key on focused active task triggers deletion with undo toast", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName === "webkit", "WebKit Tab focus differs for buttons");
    await page.goto("/");
    const label = await createTaskAndGetLabel(page);
    const activeRow = page.locator(`button[data-testid^="active-task-"]`, {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });
    await expect(activeRow).toBeEnabled({ timeout: 10_000 });

    // Tab to the task
    const input = page.getByLabel("Add Task");
    await input.focus();
    let focused = false;
    for (let i = 0; i < 10 && !focused; i++) {
      await page.keyboard.press("Tab");
      focused = await activeRow.evaluate((el) => el === document.activeElement);
    }
    expect(focused).toBe(true);
    await page.keyboard.press("Delete");

    await expect(page.getByRole("button", { name: "Undo" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("Escape clears input field", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("Add Task");
    await input.fill("some text");
    await input.press("Escape");
    await expect(input).toHaveValue("");
  });

  // --- Focus Indicators ---

  test("task input shows focus ring on Tab", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "WebKit Tab focus differs for buttons");
    await page.goto("/");
    // Use keyboard Tab to trigger :focus-visible (JS focus() does not)
    await page.keyboard.press("Tab"); // dark mode toggle
    await page.keyboard.press("Tab"); // task input
    const input = page.getByLabel("Add Task");
    await expect(input).toBeFocused();
    const outlineWidth = await input.evaluate(
      (el) => window.getComputedStyle(el).outlineWidth,
    );
    // Focus ring should have a non-zero outline or ring
    expect(parseInt(outlineWidth, 10)).toBeGreaterThan(0);
  });

  test("active task card shows focus ring on Tab", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName === "webkit", "WebKit Tab focus differs for buttons");
    await page.goto("/");
    const label = await createTaskAndGetLabel(page);
    const activeRow = page.locator(`button[data-testid^="active-task-"]`, {
      hasText: label,
    });
    await expect(activeRow).toBeVisible({ timeout: 15_000 });
    // Wait for the task to get a real (positive) ID so the button isn't disabled
    await expect(activeRow).toBeEnabled({ timeout: 10_000 });

    // Tab through the page until the active task button is focused
    // Page order: dark-mode toggle → input → task buttons (with delete buttons in between)
    let focused = false;
    for (let i = 0; i < 50 && !focused; i++) {
      await page.keyboard.press("Tab");
      focused = await activeRow.evaluate((el) => el === document.activeElement);
    }
    expect(focused).toBe(true);
    const outlineStyle = await activeRow.evaluate(
      (el) => window.getComputedStyle(el).outlineStyle,
    );
    expect(outlineStyle).not.toBe("none");
  });

  // --- Dark Mode Toggle ---

  test("dark mode toggle button is present and labeled", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Toggle dark mode" });
    await expect(toggle).toBeVisible();
  });

  test("clicking toggle adds dark class to html", async ({ page }) => {
    await page.goto("/");
    // Ensure we start in light mode
    await page.evaluate(() => {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    });

    const toggle = page.getByRole("button", { name: "Toggle dark mode" });
    await toggle.click();

    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("clicking toggle removes dark class from html", async ({ page }) => {
    await page.goto("/");
    // Start in dark mode
    await page.evaluate(() => {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    });

    const toggle = page.getByRole("button", { name: "Toggle dark mode" });
    await toggle.click();

    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("dark mode preference persists after page reload", async ({ page }) => {
    await page.goto("/");
    // Start light, toggle to dark
    await page.evaluate(() => {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    });

    const toggle = page.getByRole("button", { name: "Toggle dark mode" });
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Reload and verify dark persists
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  // --- System Preference ---

  test("respects prefers-color-scheme: dark on first visit", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    // Clear localStorage before navigating
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("theme"));
    await page.reload();

    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  // --- ARIA Labels ---

  test("active task card button has aria-label 'Mark complete: {description}'", async ({
    page,
  }) => {
    await page.goto("/");
    const label = await createTaskAndGetLabel(page);
    const button = page.getByRole("button", {
      name: `Mark complete: ${label}`,
    });
    await expect(button).toBeVisible({ timeout: 15_000 });
  });

  test("delete button has aria-label 'Delete task: {description}'", async ({
    page,
  }) => {
    await page.goto("/");
    const label = await createTaskAndGetLabel(page);
    await expect(
      page.locator(`[data-testid^="active-task-"]`, { hasText: label }),
    ).toBeVisible({ timeout: 15_000 });

    const button = page.getByRole("button", {
      name: `Delete task: ${label}`,
    });
    await expect(button).toBeAttached();
  });

  test("task input has associated label element", async ({ page }) => {
    await page.goto("/");
    const label = page.locator('label[for="task-input"]');
    await expect(label).toBeAttached();
    const input = page.locator("#task-input");
    await expect(input).toBeAttached();
  });

  // --- Reduced Motion ---

  test("completion animation is disabled for prefers-reduced-motion: reduce", async ({
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

    const animName = await completedRow.evaluate(
      (el) => window.getComputedStyle(el).animationName,
    );
    expect(animName).toBe("none");
  });

  // --- UI Polish — Direction 3 ---

  test("background gradient uses lavender-to-green", async ({ page }) => {
    await page.goto("/");
    const container = page.locator('[data-testid="app-container"]');
    await expect(container).toBeVisible();
    const classes = await container.getAttribute("class");
    expect(classes).toContain("from-[#f5f3ff]");
    expect(classes).toContain("to-[#e8f5e9]");
  });

  test("section headings show emoji prefixes", async ({ page }) => {
    await page.goto("/");
    // Wait for content
    await expect(page.getByText("📝 Your Tasks")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("✨ Completed")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("active task cards have white background", async ({ page }) => {
    await page.goto("/");
    const label = await createTaskAndGetLabel(page);
    const card = page.locator(`button[data-testid^="active-task-"]`, {
      hasText: label,
    });
    await expect(card).toBeVisible({ timeout: 15_000 });

    await expect(card).toHaveClass(/bg-white/);
  });

  test("completed task cards have white bg, green left border, full opacity", async ({
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

    await expect(completedRow).toHaveCSS("border-left-width", "4px");
    await expect(completedRow).toHaveCSS(
      "border-left-color",
      "rgb(34, 197, 94)",
    );

    const opacity = await completedRow.evaluate(
      (el) => window.getComputedStyle(el).opacity,
    );
    expect(opacity).toBe("1");
  });

  test("task input has dashed indigo border", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("Add Task");
    const borderStyle = await input.evaluate(
      (el) => window.getComputedStyle(el).borderStyle,
    );
    expect(borderStyle).toBe("dashed");
  });
});
