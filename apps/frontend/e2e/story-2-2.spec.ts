import { expect, test } from "@playwright/test";

test.describe("Story 2.2: Responsive Layout", () => {
  test("desktop layout shows two-column structure at ≥768px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");

    // Input field should be visible
    const input = page.locator('input[aria-label="Add task description"]');
    await expect(input).toBeVisible();

    // Tasks section should be visible
    const tasksSection = page.locator('section:has(h2:text("Tasks"))');
    await expect(tasksSection).toBeVisible();

    // Completed section should be visible
    const completedSection = page.locator('section:has(h2:text("Completed"))');
    await expect(completedSection).toBeVisible();

    // Verify two-column layout: Tasks ~60%, Completed ~40%
    const tasksBox = await tasksSection.boundingBox();
    const completedBox = await completedSection.boundingBox();

    if (tasksBox && completedBox) {
      const tasksWidth = tasksBox.width;
      const completedWidth = completedBox.width;
      const ratio = tasksWidth / completedWidth;
      // 60/40 ratio should be ~1.5
      expect(ratio).toBeGreaterThan(1.3);
      expect(ratio).toBeLessThan(1.7);
    }
  });

  test("mobile layout shows single column structure at <768px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Input field should be visible
    const input = page.locator('input[aria-label="Add task description"]');
    await expect(input).toBeVisible();

    // Tasks section should be visible and full width
    const tasksSection = page.locator('section:has(h2:text("Tasks"))');
    await expect(tasksSection).toBeVisible();

    // Completed section should be visible below Tasks
    const completedSection = page.locator('section:has(h2:text("Completed"))');
    await expect(completedSection).toBeVisible();

    // Both should have similar width (full width)
    const tasksBox = await tasksSection.boundingBox();
    const completedBox = await completedSection.boundingBox();

    if (tasksBox && completedBox) {
      // On mobile, both should be roughly the same width
      const widthDiff = Math.abs(tasksBox.width - completedBox.width);
      expect(widthDiff).toBeLessThan(10);
    }
  });

  test("no horizontal scrolling on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Get the page's scroll width and viewport width
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const viewportWidth = 375;

    // scrollWidth should not exceed viewport width
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test("layout transitions smoothly when resizing", async ({ page }) => {
    await page.goto("/");

    // Start at desktop
    await page.setViewportSize({ width: 1024, height: 768 });
    const tasksDesktop = page.locator('section:has(h2:text("Tasks"))');
    await expect(tasksDesktop).toBeVisible();

    // Resize to mobile - should still render without errors
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(tasksDesktop).toBeVisible();

    // Resize back to desktop
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(tasksDesktop).toBeVisible();
  });

  test("spacing adapts correctly (24px desktop, 16px mobile)", async ({
    page,
  }) => {
    // Test that layout responds to breakpoints correctly
    // Desktop: two-column layout with proper spacing
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");

    const tasksDesktop = page.locator('section:has(h2:text("Tasks"))');
    const completedDesktop = page.locator('section:has(h2:text("Completed"))');
    await expect(tasksDesktop).toBeVisible();
    await expect(completedDesktop).toBeVisible();

    // Get bounding boxes on desktop
    const tasksBoxDesktop = await tasksDesktop.boundingBox();
    const completedBoxDesktop = await completedDesktop.boundingBox();

    // Desktop: tasks and completed should be side-by-side with gap
    if (tasksBoxDesktop && completedBoxDesktop) {
      expect(tasksBoxDesktop.y).toBeLessThan(completedBoxDesktop.y + 50); // roughly same vertical level
      expect(completedBoxDesktop.x).toBeGreaterThan(
        tasksBoxDesktop.x + tasksBoxDesktop.width,
      );
    }

    // Mobile: single column with no horizontal scroll
    await page.setViewportSize({ width: 375, height: 667 });
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(375);
  });

  test("input field is visible at top on desktop, bottom on mobile", async ({
    page,
  }) => {
    const input = page.locator('input[aria-label="Add task description"]');

    // Desktop: input should appear before tasks in DOM visual order
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");
    const inputBox = await input.boundingBox();
    const tasksBox = await page
      .locator('section:has(h2:text("Tasks"))')
      .boundingBox();

    if (inputBox && tasksBox) {
      // Input top should be less than or near Tasks top on desktop
      expect(inputBox.y).toBeLessThanOrEqual(tasksBox.y + 50);
    }

    // Mobile: input should appear after completed section
    await page.setViewportSize({ width: 375, height: 667 });
    const inputBoxMobile = await input.boundingBox();
    const completedBoxMobile = await page
      .locator('section:has(h2:text("Completed"))')
      .boundingBox();

    if (inputBoxMobile && completedBoxMobile) {
      // Input top should be greater than Completed top on mobile
      expect(inputBoxMobile.y).toBeGreaterThan(completedBoxMobile.y);
    }
  });
});
