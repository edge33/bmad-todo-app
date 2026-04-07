---
story_key: 3-1-task-completion-optimistic-animations
title: Story 3.1 — Task Completion with Optimistic Updates & Animations
epic: Epic 3 — Task Completion Experience
status: review
date_created: 2026-04-07
date_updated: 2026-04-07
---

# Story 3.1: Implement Task Completion with Optimistic Updates & Animations

## Story

As a user,
I want to tap a task and see it transform immediately (color change, checkmark, bounce animation) then move to the Completed section,
So that the completion action feels rewarding and satisfying.

## Acceptance Criteria

**Given** I have an active task in the Tasks list,
**When** I click or tap the task,
**Then** within 50ms the task bounces (scale 99% → 104% → 101%) with cubic-bezier easing

**And** simultaneously, background color transitions smoothly (lavender #F5F3FF → green #E8F5E9) over 300ms

**And** checkmark fades in (0% → 100% opacity) synchronized with color change over 300ms

**And** after bounce completes, task slides smoothly into the Completed section below (350ms)

**And** completed tasks appear with:
  - White background
  - 4px green left border
  - Dark green text (#2d5a3d)
  - 75-80% opacity to appear "lighter" than active tasks
  - Checkmark icon visible

**And** all animations are instant on frontend (optimistic), then confirmed by API response

**And** if API fails, animation reverses smoothly and task returns to Tasks section with error notification

**And** reduced-motion preference is respected: animations disabled, instant state change shown

**And** Playwright e2e tests written covering:
  - Task completion toggle action
  - Checkmark visibility after completion
  - Color change from lavender to green
  - Task movement to Completed section
  - Animation timing (not too fast, not too slow)
  - Undo functionality with undo toast

**And** tests run in both headless (CI) and headed (local) modes

**And** tests validate animation occurs within acceptable timeframe

**And** Playwright tests passing: `pnpm run test:e2e`

## Tasks / Subtasks

### Task 1: API client and task queries (AC: optimistic + API confirmation)
- [x] Add `apps/frontend/src/services/taskService.ts` with `fetchTasks`, `createTask`, `updateTask` using `/api/tasks` and typed errors
- [x] Add `useTasks` query hook using `taskKeys.lists()`
- [x] Replace simulated delay in `useCreateTask` with real `createTask` API; keep optimistic temp `id: -1` and rollback pattern

### Task 2: Optimistic completion mutation (AC: optimistic, rollback on failure)
- [x] Add `useUpdateTask` with `onMutate` optimistic cache update, `onError` rollback, `onSuccess` invalidate/detail merge
- [x] Wire error notification when PATCH fails

### Task 3: Task UI, sections, and input (AC: lists + interaction)
- [x] Render active vs completed tasks in `TasksSection` / `CompletedSection` from query data
- [x] Add `TaskCard` / task row components with accessible click target (≥44px) and keyboard support
- [x] Wire `TaskInput` to `useCreateTask`

### Task 4: Animations and reduced motion (AC: bounce, color, checkmark, slide, prefers-reduced-motion)
- [x] Add CSS keyframes / classes for bounce, color transition, checkmark fade, slide-into-completed; respect `prefers-reduced-motion`

### Task 5: Undo and error toasts (AC: undo toast, error on failure)
- [x] Toast UI: success path shows undo (revert completion via PATCH); failed completion shows error toast

### Task 6: Dev proxy and e2e infrastructure (AC: `pnpm run test:e2e`)
- [x] Vite dev server proxies `/api` → backend so the SPA can call same-origin `/api/tasks`
- [x] Playwright `webServer` runs backend (`pnpm --filter @todoapp/backend run start`) then Vite (no root `pnpm dev`, to avoid backend `--watch` EMFILE in CI and to match Playwright’s single URL wait)
- [x] Add `e2e/story-3-1.spec.ts` covering AC scenarios (including `page.emulateMedia` for reduced motion where applicable)

### Task 7: Tests and validation
- [x] Add `useUpdateTask.test.ts` (static shape tests consistent with `useCreateTask.test.ts`)
- [x] Run `pnpm run test:unit` (frontend), `pnpm run type-check`, `pnpm run test:e2e`, `pnpm run lint` / biome as applicable

## Dev Notes

### Architecture

- Shared types from `@todoapp/shared-types`; query keys from `taskKeys` (see Story 2.3).
- API base path: `/api/tasks` (Fastify autoload: `GET/POST /api/tasks`, `PATCH/DELETE /api/tasks/:id`).
- Optimistic updates: snapshot list in `onMutate`, apply `setQueryData`, rollback on `onError`, invalidate on `onSuccess`.

### UX / motion

- Active task surface: lavender `#F5F3FF`; completed: white, `border-l-4` green, text `#2d5a3d`, opacity ~75–80%.
- Use CSS transforms/opacity for motion; disable via `@media (prefers-reduced-motion: reduce)`.

## Dev Agent Record

### Agent Model Used

Composer (Cursor Agent)

### Debug Log

- TanStack Query v5 `mutate({ onSuccess })` ran but toast did not appear in e2e; completion toasts and error toasts are wired via `useUpdateTask` hook `onSuccess` / `onError` plus a small `toastBridge` subscriber from `ToastProvider` (avoids provider/mutation callback ordering issues).
- Playwright: root `pnpm dev` hit `EMFILE` from `node --watch` on backend in this environment; switched to `sh -c` backend `start` + Vite `dev` with `cwd` = monorepo root.

### Completion Notes

- Implemented `/api` task client, `useTasks`, real `useCreateTask`, and `useUpdateTask` with optimistic list updates, rollback, cache invalidation, undo toast (`notifyUndoToast` after successful `completed: true` PATCH), and global error toast on mutation failure.
- `TaskCard` splits active vs completed presentation; completion entrance uses `.task-complete-enter` (combined bounce/color/then settle + checkmark fade + slide) with `prefers-reduced-motion` disabling animations.
- Vite proxies `/api` to `127.0.0.1:3000`; Playwright starts backend + frontend for e2e; `e2e/story-3-1.spec.ts` covers completion, styling, timing, reduced motion, undo, and simulated PATCH failure.
- Validation: `pnpm run check`, `pnpm run type-check`, `pnpm --filter @todoapp/frontend run test:unit`, `pnpm run test:e2e` (60/60 green).

### Implementation Plan

1. Services + hooks + Vite proxy
2. UI components + animations + toasts
3. Playwright config + e2e
4. Run full validation suite

## File List

- `_bmad-output/implementation-artifacts/3-1-task-completion-optimistic-animations.md`
- `apps/frontend/vite.config.ts`
- `apps/frontend/playwright.config.ts`
- `apps/frontend/src/services/taskService.ts`
- `apps/frontend/src/lib/toastBridge.ts`
- `apps/frontend/src/hooks/useTasks.ts`
- `apps/frontend/src/hooks/useUpdateTask.ts`
- `apps/frontend/src/hooks/useUpdateTask.test.ts`
- `apps/frontend/src/hooks/useCreateTask.ts`
- `apps/frontend/src/context/ToastContext.tsx`
- `apps/frontend/src/components/TaskCard.tsx`
- `apps/frontend/src/components/TasksSection.tsx`
- `apps/frontend/src/components/CompletedSection.tsx`
- `apps/frontend/src/components/TaskInput.tsx`
- `apps/frontend/src/components/LoadingSpinner.tsx`
- `apps/frontend/src/components/ErrorMessage.tsx`
- `apps/frontend/src/App.tsx`
- `apps/frontend/src/main.tsx`
- `apps/frontend/src/index.css`
- `apps/frontend/e2e/story-3-1.spec.ts`

## Change Log

| Date | Change |
|------|--------|
| 2026-04-07 | Story created; implementation in progress |
| 2026-04-07 | Implemented Story 3.1 (tasks API, optimistic completion, animations, toasts, e2e); status → review |

## Status

review
