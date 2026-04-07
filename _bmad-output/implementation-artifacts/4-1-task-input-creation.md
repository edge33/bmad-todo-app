---
story_id: "4.1"
story_key: "4-1-task-input-creation"
epic: 4
status: done
created: 2026-04-07
---

# Story 4.1: Build Task Input & Creation with Frontend State Management

Status: review

## Story

As a user,
I want to type a task description into a visible input field and press Enter to create it,
so that adding tasks is frictionless and effortless.

## Acceptance Criteria

1. Input field is always visible (not hidden behind navigation, never requires scrolling)
2. Placeholder text reads "Add a task..."
3. Input has dashed border styling and rounded corners
4. Pressing Enter submits the task
5. Tab / Shift+Tab navigate focus correctly
6. Field clears after successful submission
7. New task immediately appears at top of the active task list (optimistic update)
8. If submission fails, task description remains in input field for retry
9. Minimum 1 character, maximum 500 characters allowed (whitespace trimmed before validation)
10. Escape key clears the input field
11. On desktop: Enter submits, Escape clears
12. On mobile: input accessible with soft keyboard support (bottom positioning)
13. Playwright e2e tests pass (`pnpm run test:e2e`) covering:
    - Input field visible on desktop and mobile viewports
    - User can type task description
    - Enter submits and input clears after success
    - New task appears immediately in the active task list
    - Empty input (0 chars after trim) is rejected — task not submitted
    - Whitespace-only input is rejected
    - 500-char limit: task at exactly 500 chars submits; task at 501 chars is blocked
    - Escape key clears input
    - Tab key moves focus away from input correctly

## Tasks / Subtasks

- [x] Task 1: Add max-500-char validation to TaskInput (AC: 9)
  - [x] 1.1 In `apps/frontend/src/components/TaskInput.tsx`, add a `maxLength={500}` attribute to the `<input>` element (browser-level guard)
  - [x] 1.2 In `handleSubmit`, also enforce `description.length <= 500` programmatically (belt-and-suspenders; trim already applied before check)
  - [x] 1.3 Verify existing min-1-char guard (`if (!description || isPending)`) still works — `!description` is falsy for empty string after trim ✓

- [x] Task 2: Write Playwright e2e tests for Story 4.1 (AC: 13)
  - [x] 2.1 Create `apps/frontend/e2e/story-4-1.spec.ts`
  - [x] 2.2 Test: input field is visible on load (desktop viewport)
  - [x] 2.3 Test: input field is visible on load (mobile viewport — Pixel 5)
  - [x] 2.4 Test: user types description, presses Enter → input clears, task appears in active list
  - [x] 2.5 Test: empty input (just spaces) → Enter does NOT create task, input retains value
  - [x] 2.6 Test: exactly 500-char input submits successfully
  - [x] 2.7 Test: 501-char input is blocked (maxLength prevents it at browser level; verify input value is truncated at 500)
  - [x] 2.8 Test: Escape key clears the input value
  - [x] 2.9 Test: Tab key moves focus from input to next focusable element (or body)
  - [x] 2.10 Test: after a successful create, new task immediately appears (optimistic update visible before server confirms)

- [x] Task 3: Run full test suite and confirm all tests pass (AC: 13)
  - [x] 3.1 Run `pnpm run test:e2e` (Playwright) — all tests pass
  - [x] 3.2 Run `pnpm run check` (Biome lint + format) — no violations
  - [x] 3.3 Run `pnpm run type-check` — no TypeScript errors

## Dev Notes

### Critical: What Already Exists — DO NOT Reinvent

The following are **fully implemented** — read them before writing any code:

| File | What it does |
|------|-------------|
| `apps/frontend/src/components/TaskInput.tsx` | Input field: Enter submit, Escape clear, trim, `onSuccess` clear, dashed border, `aria-label`, disabled when pending |
| `apps/frontend/src/hooks/useCreateTask.ts` | TanStack Query `useMutation`: optimistic append (id:-1), rollback `onError`, `invalidateQueries` `onSuccess` |
| `apps/frontend/src/hooks/useCreateTask.test.ts` | Static shape tests (hook structure assertions) — DO NOT delete |
| `apps/frontend/src/services/taskService.ts` | `createTask(body: CreateTaskRequest): Promise<Task>` — POST `/api/tasks` |
| `apps/frontend/src/App.tsx` | Wires `<TaskInput />` at top (desktop: `order-1`) / bottom (mobile: `order-3`) via Tailwind CSS order |

**Task 1 is the only code change needed:** add `maxLength={500}` to the `<input>` and a defensive length check in `handleSubmit`.

### TaskInput.tsx — Current Implementation (abridged)

```tsx
const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key !== "Enter") return
  e.preventDefault()
  const description = value.trim()
  if (!description || isPending) return   // ← min-1-char guard already here
  createTask({ description }, { onSuccess: () => setValue("") })
}
```

**Only change needed:** add `description.length > 500` check after the existing guard, and add `maxLength={500}` to the `<input>` JSX.

```tsx
if (!description || isPending || description.length > 500) return
// ...
<input maxLength={500} ... />
```

### Error Retention (AC 8) — Already Works

`setValue("")` is called only in `onSuccess`. On error (API failure), value is **not cleared** — task description stays in input for retry. No code change needed here.

### Optimistic Update Pattern — Already Implemented

`useCreateTask` appends a temporary task `{ id: -1, ... }` to the query cache immediately. The active task list renders from the same cache → new task appears before the API responds. Story 3.2 e2e tests already validate server confirmation via `waitForConfirmedActiveRow` (id > 0).

### Playwright Test Pattern — Follow Existing Style

Use `apps/frontend/e2e/story-3-2.spec.ts` as the model. Key helpers already established:

```ts
// Locate input by aria-label (used in story-3-2.spec.ts)
const input = page.getByLabel("Add task description")

// Locate active task rows
page.locator('[data-testid^="active-task-"]', { hasText: label })
```

Test file must use `test.describe("Story 4.1: Task Input & Creation", () => { ... })`.

Use `test.afterEach(async ({ page }) => { await page.unrouteAll() })` for cleanup.

For mobile viewport test, use `test.use({ viewport: { width: 390, height: 844 } })` in a nested describe block.

### Biome Rules to Watch

- No `any` types — use `import("@playwright/test").Page` inline typing (as in story-3-2)
- No unused variables — prefix with `_` if needed
- Single quotes, no semicolons, 100-char line width
- Run `pnpm run check --write` to auto-fix formatting

### File Locations

| File | Action |
|------|--------|
| `apps/frontend/src/components/TaskInput.tsx` | MODIFY — add `maxLength` and length guard |
| `apps/frontend/e2e/story-4-1.spec.ts` | CREATE — Playwright e2e tests |

### Test Commands

```bash
# Run e2e tests (requires dev server + backend)
pnpm run test:e2e

# Run e2e headed (for debugging)
pnpm run test:e2e:headed

# Lint + format check
pnpm run check

# TypeScript check
pnpm run type-check
```

### References

- [Source: epics.md#Story 4.1] — All acceptance criteria
- [Source: architecture.md#Form Handling] — TaskForm/TaskInput pattern, validation inline
- [Source: architecture.md#Frontend Testing Strategy] — Playwright config, Page Object pattern
- [Source: apps/frontend/src/components/TaskInput.tsx] — Existing implementation
- [Source: apps/frontend/src/hooks/useCreateTask.ts] — Existing hook
- [Source: apps/frontend/e2e/story-3-2.spec.ts] — Playwright test pattern to follow

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Initial "empty input does not create a task" test used count comparison — failed in webkit/Mobile Chrome because `countBefore` was captured before query completed (returned 0 vs actual 50). Fixed by using route interception to assert no POST was made instead.
- "exactly 500-char input submits successfully" hit Playwright strict-mode violation — previous test runs had created identical 500×'A' tasks in the shared DB. Fixed by using a unique timestamp prefix padded to 500 chars, and `.first()` on the locator.

### Completion Notes List

- Task 1: Added `maxLength={500}` to `<input>` JSX and `description.length > 500` guard in `handleSubmit` in `apps/frontend/src/components/TaskInput.tsx`. Existing min-1-char and trim logic unchanged.
- Task 2: Created `apps/frontend/e2e/story-4-1.spec.ts` with 11 tests covering all AC scenarios across Chromium, Firefox, WebKit, and Mobile Chrome (152 total tests, all passing).
- Task 3: `pnpm run test:e2e` — 152/152 passed. `pnpm run check` — Biome auto-fixed formatting, 0 violations. `pnpm run type-check` — 0 errors.

### File List

- `apps/frontend/src/components/TaskInput.tsx` — added `maxLength={500}` and `description.length > 500` guard
- `apps/frontend/e2e/story-4-1.spec.ts` — new Playwright e2e tests (11 tests)
