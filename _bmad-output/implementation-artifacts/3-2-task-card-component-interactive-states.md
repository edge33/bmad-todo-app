---
story_key: 3-2-task-card-component-interactive-states
title: Story 3.2 — TaskCard Component with Interactive States
epic: Epic 3 — Task Completion Experience
sprint: 1
status: review
date_created: 2026-04-07
date_updated: 2026-04-07
---

# Story 3.2: Create TaskCard Component with Interactive States

## Story

As a developer,
I want a reusable TaskCard component that renders active and completed states with timestamp, delete button, and proper keyboard support,
So that task display logic is centralized, accessible, and feature-complete.

---

## Acceptance Criteria

**Given** a Task object with id, description, completed status, and createdAt,
**When** `ActiveTaskCard` renders,
**Then** it displays:
- Task description text
- Created timestamp formatted as "X hours ago" or a date string
- Lavender background (`#F5F3FF`), rounded corners (12px), 16px padding
- No checkmark icon

**And** when `CompletedTaskCard` renders, it displays:
- Task description text
- Timestamp (createdAt formatted)
- White background, 4px green left border, dark green text (`#2d5a3d`), ~78% opacity
- Checkmark icon visible

**And** entire active task surface is clickable for completion (except delete button area)

**And** a delete button is present on both active and completed cards:
- On desktop: hidden by default, revealed on card hover or keyboard focus
- On mobile: always visible (no hover state on touch)
- Delete button has `aria-label="Delete task: {description}"` and `data-testid="delete-task-{id}"`

**And** clicking the delete button calls `onDelete(taskId)` with optimistic removal and error rollback

**And** keyboard support works correctly:
- Tab reaches the task card and the delete button as separate focusable elements
- Enter or Space on the active task card triggers completion
- Delete key pressed while the task card (not delete button) is focused removes the task

**And** on mobile: touch target is minimum 44×44px for both the card and delete button

**And** on desktop: hover state shows subtle box-shadow increase (`shadow-md`) and makes the delete button visible

**And** Playwright e2e tests pass covering:
- Timestamp is visible on both active and completed cards
- Delete button reveals on hover (desktop) and is always visible on mobile
- Clicking delete removes the task from the list (optimistic, then confirmed)
- If delete API fails, task reappears and error toast shows
- Checkmark visible when task is completed
- Touch target size adequate on mobile (44×44px)
- Keyboard: Delete key removes task; Enter completes it
- Tests run across Chrome, Firefox, Safari

---

## Tasks / Subtasks

### Task 1: Add `deleteTask` to `taskService.ts` and create `useDeleteTask` hook
- [x] Add `deleteTask(id: number): Promise<void>` to `apps/frontend/src/services/taskService.ts`:
  - `DELETE /api/tasks/:id`
  - Throw `ApiError` on non-ok response (same pattern as `updateTask`)
- [x] Create `apps/frontend/src/hooks/useDeleteTask.ts`:
  - Follow exact same pattern as `useUpdateTask.ts` (optimistic update, rollback, error toast)
  - `onMutate`: cancel queries, snapshot list, remove task from `taskKeys.lists()` cache optimistically
  - `onError`: restore snapshot, call `notifyErrorToast` with message
  - `onSuccess`: invalidate `taskKeys.lists()`
  - **No** undo toast on delete here — undo toast is Epic 5's Story 5.1 scope; just error recovery for now
- [x] Create `apps/frontend/src/hooks/useDeleteTask.test.ts`:
  - Static shape test (same structure as `useUpdateTask.test.ts` and `useCreateTask.test.ts`)
  - Verify hook returns `{ mutate, isPending }` with correct types

### Task 2: Add timestamp utility
- [x] Create `apps/frontend/src/lib/formatDate.ts`:
  - Export `formatRelativeTime(isoString: string): string`
  - Returns "X minutes ago", "X hours ago", "X days ago", or a formatted date string for older dates
  - Use `Intl.RelativeTimeFormat` (built-in, no extra library) — no additional dependencies
  - Example output: "2 hours ago", "just now", "3 days ago", "Apr 5"
  - Handle edge cases: future dates → "just now", invalid strings → empty string

### Task 3: Enhance `ActiveTaskCard` with timestamp + delete + keyboard
- [x] Update `apps/frontend/src/components/TaskCard.tsx` — `ActiveTaskCard`:
  - Add `onDelete: (id: number) => void` prop
  - Render timestamp using `formatRelativeTime(task.createdAt)` below description in `<time>` element with `dateTime={task.createdAt}`; style: `text-sm text-gray-400`
  - Add delete button inside the card (absolutely positioned or flexbox end), initially `opacity-0` on desktop, `opacity-100` on mobile (`@media (hover: none)`)
  - Delete button: `aria-label={`Delete task: ${task.description}`}`, `data-testid={`delete-task-${task.id}`}`, calls `onDelete(task.id)`, stops click propagation (so it doesn't trigger completion)
  - Add `group` class to card wrapper; use `group-hover:opacity-100` and `focus-within:opacity-100` for delete button reveal on desktop
  - Add `onKeyDown` handler to the card: if `event.key === 'Delete'` and the card itself (not delete button) is focused → call `onDelete(task.id)`
  - Wrap card in a `<div>` container so delete button and task button coexist in tab order: `[task-button] [delete-button]`
  - Desktop hover: add `hover:shadow-md transition-shadow` to card

### Task 4: Enhance `CompletedTaskCard` with timestamp + delete
- [x] Update `apps/frontend/src/components/TaskCard.tsx` — `CompletedTaskCard`:
  - Add `onDelete: (id: number) => void` prop
  - Render timestamp using `formatRelativeTime(task.createdAt)` in `<time dateTime={task.createdAt}>`; style: `text-sm text-[#5a8a6d]` (subtle green-toned for completed state)
  - Add delete button with same `group-hover:opacity-100 / focus-within:opacity-100` reveal pattern
  - `data-testid={`delete-task-${task.id}`}`, `aria-label={`Delete task: ${task.description}`}`
  - Wrap outer element in `group` class for hover reveal
  - Desktop hover: `hover:shadow-md transition-shadow`

### Task 5: Wire `useDeleteTask` into `TasksSection` and `CompletedSection`
- [x] Update `apps/frontend/src/components/TasksSection.tsx`:
  - Call `useDeleteTask()` → pass `mutate` as `onDelete` to `ActiveTaskCard`
- [x] Update `apps/frontend/src/components/CompletedSection.tsx`:
  - Call `useDeleteTask()` → pass `mutate` as `onDelete` to `CompletedTaskCard`

### Task 6: Playwright e2e tests
- [x] Create `apps/frontend/e2e/story-3-2.spec.ts`:
  - Helper to create a task (reuse pattern from `story-3-1.spec.ts`)
  - **Test: timestamp visible on active card** — create task, assert `time` element visible with non-empty text
  - **Test: timestamp visible on completed card** — create, complete, assert `time` on completed card
  - **Test: delete button reveal on desktop hover** — create task, hover card, assert delete button becomes visible (`data-testid="delete-task-*"`)
  - **Test: delete removes active task** — create task, hover, click delete, assert task gone from active list
  - **Test: delete removes completed task** — create, complete, hover completed card, click delete, assert gone
  - **Test: delete failure shows error toast** — intercept DELETE to return 500, assert task reappears and error toast visible
  - **Test: keyboard Delete key removes task** — create task, focus active card, press Delete, assert task gone
  - **Test: keyboard Enter completes task** — create task, focus active card, press Enter, assert moves to completed section
  - **Test: mobile — delete button always visible** — emulate mobile viewport (375px), create task, assert delete button visible without hover
  - **Test: touch target size** — verify delete button bounding box ≥ 44×44px on mobile viewport

---

## Dev Notes

### What Already Exists (DO NOT reinvent)

- **`ActiveTaskCard` and `CompletedTaskCard`** in `apps/frontend/src/components/TaskCard.tsx` — enhance these, do NOT replace from scratch
- **`useUpdateTask`** in `apps/frontend/src/hooks/useUpdateTask.ts` — use as the exact pattern template for `useDeleteTask`
- **`notifyErrorToast`** in `apps/frontend/src/lib/toastBridge.ts` — call this on delete error
- **`taskKeys`** in `apps/frontend/src/hooks/queryKeys.ts` — use `taskKeys.lists()` for cache operations
- **`ApiError`** class in `apps/frontend/src/services/taskService.ts` — use for delete error wrapping
- **`@todoapp/shared-types`** Task type with: `id: number`, `description: string`, `completed: boolean`, `createdAt: string`, `updatedAt: string`

### Delete Hook — Exact Pattern to Follow

```typescript
// apps/frontend/src/hooks/useDeleteTask.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "@todoapp/shared-types";
import { notifyErrorToast } from "../lib/toastBridge.ts";
import { deleteTask } from "../services/taskService.ts";
import { taskKeys } from "./queryKeys.ts";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousData = queryClient.getQueryData<Task[]>(taskKeys.lists());
      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) =>
        old ? old.filter((t) => t.id !== id) : [],
      );
      return { previousData };
    },
    onError: (error, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(taskKeys.lists(), context.previousData);
      }
      const message =
        error instanceof Error ? error.message : "Failed to delete task.";
      notifyErrorToast(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};
```

### Delete Service Function — Exact Pattern to Follow

```typescript
// Add to apps/frontend/src/services/taskService.ts
export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${TASKS_PATH}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw await parseResponseError(res);
  }
}
```

### Timestamp Utility — Implementation Guide

```typescript
// apps/frontend/src/lib/formatDate.ts
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  const diff = (Date.now() - date.getTime()) / 1000; // seconds
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}
```

### TaskCard Delete Button Pattern — CSS

Use Tailwind `group` + `group-hover` for desktop hover reveal. Use `@media (hover: none)` via Tailwind's `[@media(hover:none)]:opacity-100` to always show on mobile:

```tsx
// Outer wrapper — add `group` class
<div className="group relative ...">
  {/* task content */}
  <button
    className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity"
    aria-label={`Delete task: ${task.description}`}
    data-testid={`delete-task-${task.id}`}
    onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
  >
    {/* trash icon or × */}
  </button>
</div>
```

### Keyboard Support Notes

- `ActiveTaskCard` is a `<button>` — it already receives focus; add `onKeyDown` for the Delete key
- `CompletedTaskCard` is a `<div>` — add `tabIndex={0}` + `role="article"` (or `role="listitem"`) + `onKeyDown`
- Both cards: `event.key === 'Delete'` → call `onDelete(task.id)`; `event.key === 'Enter'` or `' '` (space) on active → call completion handler
- Stop propagation on delete button click to prevent triggering card's completion handler

### Existing data-testid Pattern (Continue Using)

- Active task card: `data-testid={`active-task-${task.id}`}`
- Completed task card: `data-testid={`completed-task-${task.id}`}`
- Delete button: `data-testid={`delete-task-${task.id}`}` (new, add in this story)

### E2e Test Infrastructure (DO NOT reconfigure)

- Playwright config: `apps/frontend/playwright.config.ts` — already wired with backend + Vite webServer
- Existing helper in `story-3-1.spec.ts` creates tasks via UI input — reuse the same pattern
- E2e tests live in `apps/frontend/e2e/` directory
- Run with: `pnpm run test:e2e` from `apps/frontend/` or root

### Biome Code Style (enforced by pre-commit hook)

- No semicolons, single quotes, 2-space indent, 100-char line width
- No unused imports/variables (`noUnusedImports`, `noUnusedVariables`)
- No explicit `any` — use proper types
- Run `pnpm run check` before marking tasks complete

### Architecture Constraints

- **No new libraries** — use only what's already installed (Tailwind, React, TanStack Query)
- `Intl.RelativeTimeFormat` and `Intl.DateTimeFormat` are browser built-ins — no date library needed
- Delete scope for Story 3.2: frontend component + hook + service only — Epic 5 owns the undo-on-delete toast flow

---

## Dev Agent Record

### Debug Log

- Biome lint `noNoninteractiveTabindex` and `noStaticElementInteractions` prevented adding keyboard Delete support directly to `CompletedTaskCard` container. Solution: Delete key is handled on the `<button>` element of `ActiveTaskCard` (which is already interactive). The delete button on `CompletedTaskCard` is keyboard-accessible via Tab+Enter. The `<article>` element replaced `<div role="article">` per Biome's `useSemanticElements` rule.
- Biome auto-fixed formatting (semicolons, quotes) across all new files on `pnpm run check --write`.

### Completion Notes

- **Task 1**: Added `deleteTask(id)` to `taskService.ts` following the `updateTask` pattern. Created `useDeleteTask.ts` with full optimistic removal, rollback, and error toast. Created static shape test `useDeleteTask.test.ts`.
- **Task 2**: Created `formatDate.ts` with `formatRelativeTime` using `Intl.DateTimeFormat` — no external dependencies. Handles edge cases: invalid date → `""`, near-future → `"just now"`, ranges up to week then falls back to short date.
- **Task 3**: Enhanced `ActiveTaskCard` — timestamp (`<time>` element), absolutely-positioned delete button with `group-hover`/`[@media(hover:none)]` visibility pattern, Delete key handler on the button itself. `min-h-[44px]` and `min-w-[44px]` on delete button ensure 44×44 touch target.
- **Task 4**: Enhanced `CompletedTaskCard` — timestamp with `text-[#5a8a6d]` tint, same delete button pattern. Used `<article>` semantic element instead of `<div role="article">`.
- **Task 5**: Wired `useDeleteTask().mutate` as `onDelete` prop in both `TasksSection` and `CompletedSection`.
- **Task 6**: Created 10 Playwright e2e tests covering all ACs: timestamp visibility, checkmark, hover reveal, delete (active + completed), delete failure with rollback, keyboard Delete/Enter, mobile visibility, touch target size.

### Implementation Plan

Implemented in task order per story file. All files follow existing patterns (Biome style, TanStack Query optimistic updates, Tailwind utility classes). No new dependencies introduced.

---

## File List

- `apps/frontend/src/services/taskService.ts` — added `deleteTask` function
- `apps/frontend/src/hooks/useDeleteTask.ts` — new hook
- `apps/frontend/src/hooks/useDeleteTask.test.ts` — new unit test
- `apps/frontend/src/lib/formatDate.ts` — new utility
- `apps/frontend/src/components/TaskCard.tsx` — enhanced both card components
- `apps/frontend/src/components/TasksSection.tsx` — wired `useDeleteTask`
- `apps/frontend/src/components/CompletedSection.tsx` — wired `useDeleteTask`
- `apps/frontend/e2e/story-3-2.spec.ts` — new e2e tests

---

## Change Log

| Date | Change |
|------|--------|
| 2026-04-07 | Story created; status ready-for-dev |
| 2026-04-07 | Implementation complete; status updated to review |

---

## Status

review
