---
story_id: "4.2"
story_key: "4-2-use-create-task-hook-optimistic-updates"
epic: 4
status: ready-for-dev
created: 2026-04-07
---

# Story 4.2: Implement useCreateTask Hook with Optimistic Updates

Status: review

## Story

As a developer,
I want the useCreateTask hook to show a user-friendly error toast with a Retry button when task creation fails,
so that users get clear feedback and can recover without losing context.

## Acceptance Criteria

1. When POST /api/tasks succeeds: cache is invalidated and the real task (with server ID and timestamps) replaces the optimistic one — no visible disruption.
2. When POST /api/tasks fails: the optimistic task is removed from the list (rollback) AND an error toast appears with a user-friendly message.
3. The error toast contains a "Retry" button that re-submits the exact same task description.
4. The error toast contains a "Dismiss" button that closes it without retrying.
5. Loading state (`isPending`) is exposed by the hook for UI feedback (already done — do not break).
6. All error messages are user-friendly strings (not raw JS Error messages or status codes).
7. Playwright e2e tests pass (`pnpm run test:e2e`) covering:
   - POST failure → optimistic task disappears from list
   - Error toast appears with user-friendly message
   - "Retry" button in error toast re-triggers the create mutation
   - "Dismiss" button closes the toast without retrying

## Tasks / Subtasks

- [x] Task 1: Extend toastBridge to support optional retry callback (AC: 3, 4)
  - [x] 1.1 In `apps/frontend/src/lib/toastBridge.ts`, add `RetryFn = () => void` export type
  - [x] 1.2 Change `errorListener` type to `(message: string, onRetry?: RetryFn) => void`
  - [x] 1.3 Change `notifyErrorToast` signature to `(message: string, onRetry?: RetryFn): void`
  - [x] 1.4 Change `subscribeErrorToast` listener type to match: `(message: string, onRetry?: RetryFn) => void`

- [x] Task 2: Add Retry button to error toast in ToastContext (AC: 3, 4)
  - [x] 2.1 In `apps/frontend/src/context/ToastContext.tsx`, extend `ToastState` error variant to include `onRetry?: () => void`
  - [x] 2.2 Update `subscribeErrorToast` call-site to capture `onRetry` in toast state: `subscribeErrorToast((message, onRetry) => setToast({ kind: 'error', message, onRetry }))`
  - [x] 2.3 In the error toast JSX: render a "Retry" button (before "Dismiss") only when `toast.onRetry` is defined; clicking it calls `toast.onRetry()` then `dismiss()`
  - [x] 2.4 Style "Retry" button consistently with the existing "Undo" button (`bg-indigo-600`, `text-white`, `min-h-[44px]`, `min-w-[44px]`)

- [x] Task 3: Wire error toast + retry into useCreateTask (AC: 2, 3, 6)
  - [x] 3.1 In `apps/frontend/src/hooks/useCreateTask.ts`, import `notifyErrorToast` from `../lib/toastBridge.ts`
  - [x] 3.2 Store the mutation result in a `const mutation = useMutation(...)` before returning it
  - [x] 3.3 In `onError(error, variables, context)`: after rolling back, call `notifyErrorToast(message, () => mutation.mutate(variables))` — the closure over `mutation` works because `onError` fires after assignment
  - [x] 3.4 User-friendly message: `error instanceof Error ? error.message : 'Failed to create task.'`
  - [x] 3.5 Return `mutation` at the end of the hook (no change to public API)

- [x] Task 4: Update useCreateTask unit tests (AC: 2, 3)
  - [x] 4.1 In `apps/frontend/src/hooks/useCreateTask.test.ts`, add test: `hook's onError includes notifyErrorToast call` — assert `hookCode.includes("notifyErrorToast")`
  - [x] 4.2 Add test: `hook passes retry callback to notifyErrorToast` — assert `hookCode.includes("mutation.mutate")` inside the `onError` block

- [x] Task 5: Write Playwright e2e tests for error + retry flow (AC: 7)
  - [x] 5.1 Create `apps/frontend/e2e/story-4-2.spec.ts`
  - [x] 5.2 Test: POST failure → error toast appears with message text (intercept POST, return 500)
  - [x] 5.3 Test: POST failure → optimistic task disappears from the active task list after rollback
  - [x] 5.4 Test: "Retry" button in error toast clicks → second POST request is fired (intercept + count requests)
  - [x] 5.5 Test: "Dismiss" button closes toast without making another POST request
  - [x] 5.6 Use `page.route('/api/tasks', ...)` to intercept and simulate failure (status 500)

- [x] Task 6: Run full test suite (AC: 7)
  - [x] 6.1 Run `pnpm run test:e2e` — all tests pass (including existing story-3-*, story-4-1 tests)
  - [x] 6.2 Run `pnpm run check` — Biome lint + format clean
  - [x] 6.3 Run `pnpm run type-check` — zero TypeScript errors

## Dev Notes

### Critical: What Already Exists — DO NOT Reinvent

| File | Current state |
|------|--------------|
| `apps/frontend/src/hooks/useCreateTask.ts` | FULLY implemented with optimistic update, rollback, cache invalidation — ONLY add `notifyErrorToast` call in `onError` |
| `apps/frontend/src/lib/toastBridge.ts` | Has `notifyErrorToast(message: string)` — extend signature ONLY |
| `apps/frontend/src/context/ToastContext.tsx` | Error toast renders — add Retry button ONLY when `onRetry` defined |
| `apps/frontend/src/hooks/useCreateTask.test.ts` | 11 existing tests using `hookCode.includes(...)` — DO NOT delete any |
| `apps/frontend/e2e/story-4-1.spec.ts` | Existing e2e tests that must continue to pass |

### useCreateTask.ts — Current Implementation (exact code)

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateTaskRequest, Task } from "@todoapp/shared-types"
import { createTask } from "../services/taskService.ts"
import { taskKeys } from "./queryKeys.ts"

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTaskRequest) =>
      createTask({ description: input.description.trim() }),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() })
      const previousData = queryClient.getQueryData<Task[]>(taskKeys.lists())
      const optimisticTask: Task = {
        id: -1,
        description: newTask.description.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: null,
      }
      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) => [
        ...(old ?? []),
        optimisticTask,
      ])
      return { previousData }
    },
    onError: (_error, _newTask, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(taskKeys.lists(), context.previousData)
      }
      // ← ADD notifyErrorToast call here
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}
```

**Required change:** rename `_error` → `error`, `_newTask` → `variables`; store mutation as `const mutation = useMutation(...)`, add the toast call, return `mutation`.

### toastBridge.ts — Required Change

Current `notifyErrorToast`:
```ts
export function notifyErrorToast(message: string): void {
  errorListener?.(message)
}
```

Target (backward-compatible — existing callers `useDeleteTask`, `useUpdateTask` need zero changes):
```ts
export type RetryFn = () => void

// errorListener type update:
let errorListener: ((message: string, onRetry?: RetryFn) => void) | null = null

export function notifyErrorToast(message: string, onRetry?: RetryFn): void {
  errorListener?.(message, onRetry)
}

export function subscribeErrorToast(
  listener: (message: string, onRetry?: RetryFn) => void,
): () => void {
  errorListener = listener
  return () => { errorListener = null }
}
```

`useDeleteTask` and `useUpdateTask` call `notifyErrorToast(message)` without `onRetry` — this continues to work (optional param).

### ToastContext.tsx — Required Change

Current `ToastState`:
```ts
type ToastState =
  | { kind: 'undo'; taskId: number }
  | { kind: 'error'; message: string }
  | null
```

Target:
```ts
type ToastState =
  | { kind: 'undo'; taskId: number }
  | { kind: 'error'; message: string; onRetry?: () => void }
  | null
```

Update the `subscribeErrorToast` subscription:
```ts
useLayoutEffect(
  () =>
    subscribeErrorToast((message, onRetry) =>
      setToast({ kind: 'error', message, onRetry })
    ),
  [],
)
```

Add Retry button in the error toast JSX (before "Dismiss"):
```tsx
{toast.onRetry && (
  <button
    type="button"
    className="min-h-[44px] min-w-[44px] rounded-md bg-indigo-600 px-3 py-2 font-medium text-white"
    onClick={() => { toast.onRetry?.(); dismiss() }}
  >
    Retry
  </button>
)}
```

### Retry Closure Pattern — Why It Works

```ts
export const useCreateTask = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation({        // ← store in const
    ...
    onError: (error, variables, context) => {
      // rollback...
      const message = error instanceof Error ? error.message : 'Failed to create task.'
      notifyErrorToast(message, () => mutation.mutate(variables))  // ← closure over mutation
    },
  })
  return mutation                        // ← return same const
}
```

`mutation` is defined in the same function scope. `onError` is an async callback that fires *after* `useMutation` has returned and assigned `mutation`. The closure is safe.

### Playwright Test Pattern — Follow story-4-1.spec.ts

```ts
import { expect, test } from "@playwright/test"

test.describe("Story 4.2: useCreateTask error + retry", () => {
  test("error toast appears when POST /api/tasks fails", async ({ page }) => {
    // Intercept POST before navigating (Playwright best practice)
    await page.route("**/api/tasks", (route) => {
      if (route.request().method() === "POST") {
        return route.fulfill({ status: 500, body: JSON.stringify({ error: "Server error" }) })
      }
      return route.continue()
    })

    await page.goto("http://localhost:5173")
    const input = page.getByLabel("Add task description")
    await input.fill("My failing task")
    await input.press("Enter")

    // Error toast should appear
    await expect(page.getByRole("alert")).toBeVisible()
    await expect(page.getByRole("button", { name: "Retry" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Dismiss" })).toBeVisible()
  })
})
```

Use `page.unrouteAll()` in `test.afterEach` for cleanup (as in story-4-1.spec.ts).

For counting POST requests, use `let postCount = 0` and increment inside the `page.route` handler.

### Biome Rules

- No `any` types
- Single quotes, no semicolons, 100-char line width
- Run `pnpm run check --write` to auto-fix formatting after edits

### File Locations

| File | Action |
|------|--------|
| `apps/frontend/src/lib/toastBridge.ts` | MODIFY — extend `notifyErrorToast` + listener type |
| `apps/frontend/src/context/ToastContext.tsx` | MODIFY — add `onRetry` to error toast state + Retry button |
| `apps/frontend/src/hooks/useCreateTask.ts` | MODIFY — add `notifyErrorToast` call in `onError` |
| `apps/frontend/src/hooks/useCreateTask.test.ts` | MODIFY — add 2 new tests (no deletions) |
| `apps/frontend/e2e/story-4-2.spec.ts` | CREATE — Playwright e2e tests |

### Test Commands

```bash
pnpm run test:e2e          # Playwright (requires dev server + backend)
pnpm run test:e2e:headed   # Headed mode for debugging
pnpm run check             # Biome lint + format
pnpm run type-check        # TypeScript
```

### References

- [Source: epics.md#Story 4.2] — Acceptance criteria
- [Source: architecture.md#Error Handling Strategy] — Error display, retry button requirements
- [Source: apps/frontend/src/lib/toastBridge.ts] — toastBridge current implementation
- [Source: apps/frontend/src/context/ToastContext.tsx] — Toast rendering, current error state
- [Source: apps/frontend/src/hooks/useCreateTask.ts] — Hook to extend
- [Source: apps/frontend/src/hooks/useDeleteTask.ts] — Model for `notifyErrorToast` usage pattern
- [Source: apps/frontend/e2e/story-4-1.spec.ts] — Playwright test pattern to follow

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Initial Playwright tests used task labels containing "retry"/"dismiss" — Playwright's `getByRole("button", { name: "Retry" })` does case-insensitive substring matching, causing strict mode violations (matched task card buttons with those words in aria-labels). Fixed by using `exact: true` in all button role queries and renaming label prefixes to neutral strings (`E2E-4-2-fail-`, `E2E-4-2-click-`, `E2E-4-2-close-`).
- TypeScript `exactOptionalPropertyTypes` required conditional spread for `onRetry` in `subscribeErrorToast` call-site: cannot assign `RetryFn | undefined` to strictly optional `() => void`. Fixed with ternary: `onRetry ? { kind: 'error', message, onRetry } : { kind: 'error', message }`.

### Completion Notes List

- Task 1: Extended `toastBridge.ts` — added `RetryFn` export type, updated `ErrorListener` and `notifyErrorToast` signatures to accept optional `onRetry?: RetryFn`. Backward-compatible: existing callers (`useDeleteTask`, `useUpdateTask`) pass no `onRetry` and continue to work.
- Task 2: Updated `ToastContext.tsx` — error toast state includes `onRetry?: () => void`; Retry button rendered (styled as Undo button) only when `onRetry` defined; clicking calls `onRetry()` then `dismiss()`.
- Task 3: Updated `useCreateTask.ts` — stores mutation as `const mutation`, imports and calls `notifyErrorToast` in `onError` with user-friendly message and retry closure `() => mutation.mutate(variables)`.
- Task 4: Added 2 new tests to `useCreateTask.test.ts` (total 13 tests); all existing 11 tests preserved.
- Task 5: Created `story-4-2.spec.ts` with 5 tests × 4 browsers = 20 test cases.
- Task 6: `pnpm run test:e2e` — 172/172 passed. `pnpm run check` — 0 violations (Biome auto-fixed formatting). `pnpm run type-check` — 0 errors.

### File List

- `apps/frontend/src/lib/toastBridge.ts` — added `RetryFn` type, extended `notifyErrorToast` + `subscribeErrorToast` signatures
- `apps/frontend/src/context/ToastContext.tsx` — added `onRetry` to error toast state; Retry button in error toast JSX
- `apps/frontend/src/hooks/useCreateTask.ts` — added `notifyErrorToast` import + call in `onError` with retry closure
- `apps/frontend/src/hooks/useCreateTask.test.ts` — added 2 tests for error toast and retry callback
- `apps/frontend/e2e/story-4-2.spec.ts` — new Playwright e2e tests (5 tests, 4 browsers)
