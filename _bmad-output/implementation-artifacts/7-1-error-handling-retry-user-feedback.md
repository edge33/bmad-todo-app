---
story_id: "7.1"
story_key: "7-1-error-handling-retry-user-feedback"
epic: 7
status: done
created: 2026-04-09
---

# Story 7.1: Implement Error Handling, Retry Logic & User Feedback

Status: done

## Story

As a user,
I want clear error messages when operations fail, with option to retry,
So that I can recover from failures and trust the application.

## Acceptance Criteria

1. Frontend displays user-friendly error messages:
   - "Please check your input and try again" for validation errors (400)
   - "This task no longer exists" for 404
   - "Something went wrong. Please try again." for server errors (500)

2. Toast notification appears with "Retry" button for transient failures.

3. Automatic retry with exponential backoff (1s → 2s → 4s, max 3 attempts) for both queries and mutations (5xx only, not 4xx).

4. User can manually click "Retry" button at any time.

5. Failed UI changes are rolled back (optimistic updates reverted).

6. Backend returns consistent error structure: `{ error: { code, message } }`.

7. Error codes map to HTTP status codes:
   - VALIDATION_ERROR → 400
   - NOT_FOUND → 404
   - INTERNAL_ERROR → 500

8. Backend logs errors with context (taskId, action, error message).

9. Frontend logs errors only in development mode (not production).

10. Unit tests covering:
    - Validation error responses (400)
    - Not found error responses (404)
    - Server error responses (500)
    - Error code → message mapping
    - Retry logic and exponential backoff

11. Bruno API tests include error case validation for each endpoint.

12. Unit tests passing: `pnpm run test:unit`

## Tasks / Subtasks

- [x] Task 1: Frontend error message mapping (AC: #1, #9)
  - [x] Add `mapErrorToUserMessage(error)` utility in taskService.ts
  - [x] Update useCreateTask onError to use mapped message + dev-only logging
  - [x] Update useUpdateTask onError to use mapped message + dev-only logging
  - [x] Update useDeleteTask onError to use mapped message + dev-only logging

- [x] Task 2: Mutation retry logic for transient failures (AC: #3)
  - [x] Update queryClient.ts: add retry logic for mutations (3x for 5xx, skip 4xx)
  - [x] Add retryDelay with exponential backoff (1s → 2s → 4s) for mutations

- [x] Task 3: Backend structured error logging (AC: #8)
  - [x] Update errorHandler.ts to accept optional context and log with it
  - [x] Update routes to pass context (action name, taskId where available)

- [x] Task 4: Unit tests — backend (AC: #10)
  - [x] Add 500 INTERNAL_ERROR test to routes test (force service to throw unexpected error)
  - [x] Add errorHandler unit tests (code → status mapping, logging with context)

- [x] Task 5: Unit tests — frontend (AC: #10)
  - [x] Add tests for mapErrorToUserMessage (validation, not found, server error)
  - [x] Add tests for queryClient retry configuration

- [x] Task 6: Bruno error case API tests (AC: #11)
  - [x] Add Bruno test: POST with empty description → 400 VALIDATION_ERROR
  - [x] Add Bruno test: GET /api/tasks/99999 → 404 NOT_FOUND
  - [x] Add Bruno test: PATCH /api/tasks/invalid → 400 VALIDATION_ERROR

- [x] Task 7: Run validation (AC: #12)
  - [x] Run `pnpm run test:unit` — all tests pass (49 backend + 51 frontend = 100 total)
  - [x] Run type-check — no errors

## Dev Notes

### What's Already Implemented

- ✅ Backend error classes: `ValidationError`, `NotFoundError`
- ✅ `errorHandler()` returns `{ error: { code, message } }` with correct HTTP status
- ✅ All routes catch errors and call `errorHandler()`
- ✅ Frontend `ApiError` class with `status` and `code` properties
- ✅ Query-level retry: 3 attempts, exponential backoff, skips 4xx
- ✅ Three-phase optimistic mutations with rollback in all hooks
- ✅ Toast with "Retry" button via `notifyErrorToast(message, retryFn)`
- ✅ Error boundary component
- ✅ 41 existing unit tests passing

### What's Missing (Implementation Targets)

**Frontend:**
- `mapErrorToUserMessage(error)` to translate API error codes to user-facing strings
- Mutation retry logic (currently `retry: 0` for all mutations)
- Dev-only `console.error` in onError handlers

**Backend:**
- Structured logging with context in `errorHandler` (currently bare `console.error(error)`)

**Tests:**
- 500 route test
- Error message mapping unit tests
- Retry config unit tests
- Bruno error case tests

### Error Message Mapping

```ts
export function mapErrorToUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === "VALIDATION_ERROR" || error.status === 400) {
      return "Please check your input and try again";
    }
    if (error.code === "NOT_FOUND" || error.status === 404) {
      return "This task no longer exists";
    }
  }
  return "Something went wrong. Please try again.";
}
```

### Mutation Retry in queryClient.ts

Add to `mutations` defaultOptions:
```ts
mutations: {
  retry: (failureCount, error) => {
    if (error instanceof Error && "status" in error) {
      const status = (error as { status: number }).status;
      if (status >= 400 && status < 500) return false;
    }
    return failureCount < 3;
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
}
```

### Backend Structured Logging

Update errorHandler to log with context:
```ts
export function errorHandler(error: unknown, context?: { action?: string; taskId?: number }): {
  status: number; body: ErrorResponse;
} {
  // ... existing mapping ...
  // For INTERNAL_ERROR, log with context:
  console.error({ error, ...context }, "Internal server error");
  // ...
}
```

### Architecture Notes

- `useCreateTask`, `useUpdateTask`, `useDeleteTask` all import from `../services/taskService.ts` — add mapping function there
- `queryClient.ts` is the single source of truth for retry config
- Existing route tests mock Prisma at module level — add a test that mocks service to throw an unexpected Error

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

(populated during implementation)

### Completion Notes List

- Added `mapErrorToUserMessage(error)` to `taskService.ts`: maps VALIDATION_ERROR/400 → "Please check your input and try again", NOT_FOUND/404 → "This task no longer exists", everything else → "Something went wrong. Please try again."
- Updated `useCreateTask`, `useUpdateTask`, `useDeleteTask` onError handlers to use mapped messages and add `if (import.meta.env.DEV) console.error(...)` dev-only logging
- Updated `queryClient.ts` mutations defaults: added same retry/retryDelay logic as queries (skip 4xx, retry 5xx up to 3 times, exponential backoff 1s→2s→4s)
- Updated `errorHandler.ts`: added optional `ErrorContext` parameter with `action` and `taskId`; INTERNAL_ERROR now logs `{ err, action, taskId }` instead of bare `console.error(error)`
- Updated all 5 route handlers in `tasks/index.ts` to pass action context (and taskId where available) to `errorHandler`
- Added `errorHandler.test.ts`: 7 tests covering all 3 error code mappings, context handling, and response structure
- Added 2 new route tests: 500 INTERNAL_ERROR for GET (DB throws) and POST (DB throws)
- Added `taskService.test.ts` (frontend): 7 tests for `mapErrorToUserMessage` covering all branches
- Added `queryClient.test.ts`: 9 tests covering query and mutation retry/retryDelay config
- Added 3 Bruno error case tests: 07-error-empty-description (400), 08-error-not-found (404), 09-error-invalid-id (400)
- All 49 backend + 51 frontend unit tests pass; zero type errors

### File List

- `apps/frontend/src/services/taskService.ts` — MODIFIED: added `mapErrorToUserMessage()` export
- `apps/frontend/src/services/taskService.test.ts` — NEW: 7 tests for mapErrorToUserMessage
- `apps/frontend/src/hooks/useCreateTask.ts` — MODIFIED: use mapErrorToUserMessage + dev logging
- `apps/frontend/src/hooks/useUpdateTask.ts` — MODIFIED: use mapErrorToUserMessage + dev logging
- `apps/frontend/src/hooks/useDeleteTask.ts` — MODIFIED: use mapErrorToUserMessage + dev logging
- `apps/frontend/src/config/queryClient.ts` — MODIFIED: mutation retry/retryDelay config
- `apps/frontend/src/config/queryClient.test.ts` — NEW: 9 tests for retry configuration
- `apps/backend/src/middleware/errorHandler.ts` — MODIFIED: ErrorContext type + structured logging
- `apps/backend/src/middleware/errorHandler.test.ts` — NEW: 7 tests for errorHandler
- `apps/backend/src/routes/tasks/index.ts` — MODIFIED: pass context to all errorHandler calls
- `apps/backend/src/routes/tasks/index.test.ts` — MODIFIED: 2 new 500 error tests
- `apps/backend/bruno/tasks/07-error-empty-description.bru` — NEW: 400 error Bruno test
- `apps/backend/bruno/tasks/08-error-not-found.bru` — NEW: 404 error Bruno test
- `apps/backend/bruno/tasks/09-error-invalid-id.bru` — NEW: 400 validation Bruno test
- `_bmad-output/implementation-artifacts/7-1-error-handling-retry-user-feedback.md` — NEW: this story file

### Change Log

- 2026-04-09: Story 7.1 implemented — error message mapping, mutation retry, structured backend logging, 16 new tests, 3 Bruno error case tests; all 100 unit tests pass

### Review Findings

- [x] [Review][Decision] Mutation retry risks data duplication on non-idempotent create — Fixed: added `retry: 0` to `useCreateTask` useMutation config.
- [x] [Review][Decision] No UI feedback during mutation retry window — Fixed: mutation result stored in named variable and returned from all three hooks; callers can read `mutation.isPending` to disable UI during retries.
- [x] [Review][Patch] Variable shadowing: `id` re-declared in catch blocks [apps/backend/src/routes/tasks/index.ts] — Fixed: hoisted `id` and `validId` before try/catch in getById, update, delete.
- [x] [Review][Patch] logEntry includes `action: undefined, taskId: undefined` when no context passed [apps/backend/src/middleware/errorHandler.ts:58] — Fixed: guarded with conditional spreads.
- [x] [Review][Patch] Test mock state not reset after 500 tests [apps/backend/src/routes/tasks/index.test.ts] — Fixed: wrapped in describe with afterEach that restores all five mock functions.
- [x] [Review][Patch] Missing 500 test coverage for GET /:id, PATCH /:id, DELETE /:id [apps/backend/src/routes/tasks/index.test.ts] — Fixed: added three tests.
- [x] [Review][Patch] parseInt in catch block truncates float IDs, logs misleading taskId [apps/backend/src/routes/tasks/index.ts] — Fixed: `validId` flag uses `Number.isInteger(Number(...))` so float IDs are correctly excluded from taskId logging.
- [x] [Review][Patch] useDeleteTask and useUpdateTask pass no retry callback to notifyErrorToast [apps/frontend/src/hooks/useDeleteTask.ts, useUpdateTask.ts] — Fixed: retry callbacks added to both hooks.
- [x] [Review][Defer] mapErrorToUserMessage OR condition may produce misleading messages for future error codes [apps/frontend/src/services/taskService.ts:23] — deferred, pre-existing design decision
- [x] [Review][Defer] console.error bypasses Fastify's structured logger [apps/backend/src/middleware/errorHandler.ts] — deferred, pre-existing pattern across codebase
- [x] [Review][Defer] Dev-mode logging absent from service/fetch layer [apps/frontend/src/services/taskService.ts] — deferred, pre-existing
