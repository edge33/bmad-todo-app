---
story_id: "5.2"
story_key: "5-2-delete-button-ui-interaction-model"
epic: 5
status: ready-for-dev
created: 2026-04-08
---

# Story 5.2: Create Delete Button UI & Interaction Model

Status: done

## Story

As a developer,
I want a delete button that appears on hover (desktop) or press (mobile) without cluttering the interface,
so that deletion is discoverable but not visually distracting.

## Acceptance Criteria

1. **Given** TaskCard renders on desktop, **When** I hover over it, **Then** delete button becomes visible (opacity increase).
2. **Given** TaskCard renders on mobile (touch device), **When** the card renders, **Then** delete button is always visible (no hover required).
3. Delete button is styled as a trash icon and has minimum 44×44px touch target.
4. Delete action does not require a confirmation modal (toast undo is recovery).
5. **Playwright e2e tests** in `story-5-2.spec.ts` pass covering:
   - Delete button is hidden by default on desktop (before hover)
   - Delete button is visible on hover (desktop)
   - Delete button is visible on mobile viewport (always-on)
   - Delete button touch target is ≥ 44×44px
   - Clicking delete removes the task (undo toast appears)
   - Tests run on Chromium, Firefox, WebKit, Mobile Chrome

## Tasks / Subtasks

- [x] Task 1: Verify existing `TaskCard.tsx` implementation meets all ACs (AC: 1, 2, 3, 4)
  - [x] 1.1 Confirm `opacity-0` / `group-hover:opacity-100` is present on both `ActiveTaskCard` and `CompletedTaskCard` delete buttons
  - [x] 1.2 Confirm `[@media(hover:none)]:opacity-100` is present (always-visible on touch devices)
  - [x] 1.3 Confirm `min-h-[44px] min-w-[44px]` on delete button
  - [x] 1.4 Confirm `data-testid="delete-task-{id}"` and `aria-label="Delete task: {description}"` on both cards
  - [x] 1.5 If any AC is not met, patch `TaskCard.tsx` accordingly; otherwise no changes needed

- [x] Task 2: Write `apps/frontend/e2e/story-5-2.spec.ts` (AC: 5)
  - [x] 2.1 Self-contained setup: mock GET /api/tasks, DELETE /api/tasks/:id using Playwright route intercepts (no live backend needed)
  - [x] 2.2 Test: delete button opacity is 0 (hidden) before hover on desktop — use `evaluate` to read `window.getComputedStyle(el).opacity`
  - [x] 2.3 Test: delete button is visible after hovering the card (desktop)
  - [x] 2.4 Test: delete button is always visible on mobile viewport (375px wide) — assert `toBeVisible()` without hover
  - [x] 2.5 Test: delete button touch target ≥ 44×44px (use `offsetWidth` / `offsetHeight`)
  - [x] 2.6 Test: clicking delete removes the task from the list and shows undo toast ("Task deleted")

- [x] Task 3: Run full test suite (AC: 5)
  - [x] 3.1 `pnpm run test:e2e` — all tests pass (including story-3-2.spec.ts, story-5-1.spec.ts)
  - [x] 3.2 `pnpm run check` — Biome lint + format clean
  - [x] 3.3 `pnpm run type-check` — zero TypeScript errors

### Review Findings (AI)

- [x] [Review][Patch] Task removal not asserted after delete click — added `expect(locator("active-task-1")).toHaveCount(0)` after toast assertion [story-5-2.spec.ts:155]
- [x] [Review][Patch] No test for completed task delete button hover reveal — added "delete button is visible after hovering a completed task card (desktop)" test [story-5-2.spec.ts:158]
- [x] [Review][Patch] `opacity toBe(0)` is exact — changed to `toBeLessThan(0.05)` for sub-pixel robustness [story-5-2.spec.ts:75]
- [x] [Review][Patch] `waitForFunction` explicit 2000ms timeout is below Playwright default — removed explicit timeout to inherit configured default [story-5-2.spec.ts]
- [x] [Review][Defer] `waitForSelector` is legacy API — prefer `expect().toBeVisible()` for retry-aware assertions [story-5-2.spec.ts] — deferred, pre-existing pattern in codebase
- [x] [Review][Defer] `MOCK_TASKS` uses `new Date()` at parse time — non-deterministic timestamps; use fixed ISO strings for stability [story-5-2.spec.ts:7] — deferred, no timestamp assertions in these tests
- [x] [Review][Defer] POST undo mock hardcoded to return `MOCK_TASKS[0]` — if a future test deletes task 2, undo mock returns wrong data silently [story-5-2.spec.ts:35] — deferred, only task 1 deleted in current tests

## Dev Notes

### CRITICAL: Delete Button Is Already Implemented — DO NOT Re-implement

`apps/frontend/src/components/TaskCard.tsx` exports `ActiveTaskCard` and `CompletedTaskCard`. Both already have a fully-built delete button:

```tsx
<button
  type="button"
  aria-label={`Delete task: ${task.description}`}
  data-testid={`delete-task-${task.id}`}
  onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
  className="absolute right-3 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 opacity-0 transition-opacity hover:text-red-500 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
>
  {trashIcon}
</button>
```

All ACs 1–4 are met by this implementation. **Task 1 is a verification pass only.**

### Story 5.2 = Writing `story-5-2.spec.ts`

The only substantive work is creating the e2e test file. Follow `apps/frontend/e2e/story-5-1.spec.ts` as the pattern for self-contained mocked tests.

### Self-Contained Test Setup Pattern

Mock GET to return a fixed task list before navigating. Mock DELETE to succeed and return the deleted task. This avoids any dependency on the running backend.

```typescript
import { expect, test } from "@playwright/test"

const MOCK_TASKS = [
  { id: 1, description: "Buy milk", completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, description: "Walk the dog", completed: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

function setupRoutes(page: import("@playwright/test").Page) {
  return page.route("**/api/tasks**", async (route) => {
    const method = route.request().method()
    if (method === "GET") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_TASKS) })
    } else if (method === "DELETE") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_TASKS[0]) })
    } else {
      await route.continue()
    }
  })
}
```

### Checking Opacity (Hidden by Default)

Playwright's `toBeVisible()` does NOT check CSS opacity — an `opacity:0` element is still "visible" to Playwright. To assert the button is invisible before hover, check computed opacity:

```typescript
test("delete button is hidden by default on desktop", async ({ page }) => {
  await setupRoutes(page)
  await page.goto("/")
  await page.waitForSelector('[data-testid="delete-task-1"]')
  const deleteBtn = page.locator('[data-testid="delete-task-1"]')
  const opacity = await deleteBtn.evaluate((el) =>
    window.getComputedStyle(el).opacity
  )
  expect(parseFloat(opacity)).toBe(0)
})
```

**Note:** This test is skipped on Mobile Chrome project automatically because `[@media(hover:none)]` makes it `opacity:1` there. Use `test.skip` with project name or run only on Desktop projects:

```typescript
test("delete button is hidden by default on desktop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "Mobile Chrome", "Mobile always shows delete button")
  // ...
})
```

### Mobile Always-Visible Test

On the Mobile Chrome Playwright project, `@media(hover:none)` applies, so opacity is 1 without hovering:

```typescript
test("delete button always visible on mobile viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "Mobile Chrome", "Desktop uses hover reveal — tested separately")
  await setupRoutes(page)
  await page.goto("/")
  const deleteBtn = page.locator('[data-testid="delete-task-1"]')
  await expect(deleteBtn).toBeVisible()
  const opacity = await deleteBtn.evaluate((el) =>
    window.getComputedStyle(el).opacity
  )
  expect(parseFloat(opacity)).toBe(1)
})
```

### Touch Target Size Test

```typescript
test("delete button touch target is at least 44x44px", async ({ page }) => {
  await setupRoutes(page)
  await page.goto("/")
  // On desktop: hover first to make element interactable
  const card = page.locator('[data-testid="active-task-1"]')
  await card.hover()
  const deleteBtn = page.locator('[data-testid="delete-task-1"]')
  const size = await deleteBtn.evaluate((el) => ({
    width: (el as HTMLElement).offsetWidth,
    height: (el as HTMLElement).offsetHeight,
  }))
  expect(size.width).toBeGreaterThanOrEqual(44)
  expect(size.height).toBeGreaterThanOrEqual(44)
})
```

### Clicking Delete Shows Undo Toast

```typescript
test("clicking delete removes task and shows undo toast", async ({ page }) => {
  await setupRoutes(page)
  await page.goto("/")
  const card = page.locator('[data-testid="active-task-1"]')
  await card.hover()
  const deleteBtn = page.locator('[data-testid="delete-task-1"]')
  await deleteBtn.click()
  await expect(page.getByText("Task deleted")).toBeVisible()
  await expect(page.getByRole("button", { name: "Undo", exact: true })).toBeVisible()
})
```

### Key Constraints

- **File name pattern**: `apps/frontend/e2e/story-5-2.spec.ts`
- **Imports**: `import { expect, test } from "@playwright/test"` (no semicolons, single quotes per Biome)
- **Route pattern**: `**/api/tasks**` covers both `/api/tasks` (list) and `/api/tasks/:id` (delete) — split method-based in handler
- **afterEach**: Always call `await page.unrouteAll()` in `test.afterEach`
- **data-testid format**: `delete-task-{id}` where id is number (e.g., `delete-task-1`)
- **active-task-{id}** and **completed-task-{id}** for card test IDs

### What story-3-2.spec.ts Already Covers (Don't Duplicate)

`apps/frontend/e2e/story-3-2.spec.ts` has integration tests (live backend) covering:
- Hover reveals delete button
- Clicking delete removes active and completed tasks
- Keyboard Delete key removes task
- Touch target size
- Delete failure shows error toast

Story 5.2 tests are **self-contained** (mocked routes), complementary to 3.2, not duplicates.

### Playwright Projects Configuration

`apps/frontend/playwright.config.ts` runs 4 projects:
- `chromium` (Desktop Chrome)
- `firefox` (Desktop Firefox)
- `webkit` (Desktop Safari)
- `Mobile Chrome` (Pixel 5, 393×851px, `@media(hover:none)` applies)

The opacity-hidden test must skip Mobile Chrome; the always-visible test targets Mobile Chrome only.

### Biome Rules (must not violate)

- No `any` types — use `import("@playwright/test").Page` for parameter types
- Single quotes, no semicolons, 100-char line width
- Run `pnpm run check --write` after editing

### Test Commands

```bash
pnpm run test:e2e           # run from repo root
pnpm run test:e2e:headed    # headed mode for debugging
pnpm run check              # Biome lint + format
pnpm run type-check         # TypeScript
```

### Project Structure Notes

- E2E tests: `apps/frontend/e2e/` — filename: `story-5-2.spec.ts`
- Component: `apps/frontend/src/components/TaskCard.tsx` (DO NOT modify unless Task 1 finds a gap)
- All imports use `.ts`/`.tsx` extensions (ESM strict)

### References

- [Source: epics.md#Story 5.2] — Acceptance criteria
- [Source: apps/frontend/src/components/TaskCard.tsx] — Delete button implementation (already done)
- [Source: apps/frontend/e2e/story-5-1.spec.ts] — Self-contained mocked test pattern to follow
- [Source: apps/frontend/e2e/story-3-2.spec.ts] — Integration tests already covering hover/delete behavior
- [Source: apps/frontend/playwright.config.ts] — Browser projects configuration
- [Source: _bmad-output/implementation-artifacts/5-1-task-deletion-undo-toast.md] — Undo toast ACs and testids

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- WebKit (Safari) failed the "visible after hover" test initially because `card.hover()` starts the CSS `transition-opacity` (150ms) but the evaluate ran before the transition completed. Fixed by replacing the immediate `evaluate` with `page.waitForFunction` that polls until `opacity > 0` before asserting.

### Completion Notes List

- Task 1: Verified `TaskCard.tsx` — all ACs 1–4 met by existing implementation. No code changes needed to the component.
- Task 2: Created `apps/frontend/e2e/story-5-2.spec.ts` — 5 tests × 4 browsers = 20 total. Self-contained via `setupRoutes` stateful mock (GET returns filtered list after DELETE). Project-conditional skips: desktop-only tests skip Mobile Chrome; mobile-only test skips all desktop projects. 15 passed, 5 correctly skipped.
- Task 3: Full suite — 212 tests, 207 passed, 5 skipped (correct conditional skips), 0 failures. Biome 0 violations, TypeScript 0 errors.

### File List

- `apps/frontend/e2e/story-5-2.spec.ts` — new Playwright e2e tests (5 tests, 4 browsers, fully mocked)
