---
title: "QA Report: Test Coverage Analysis"
date: "2026-04-10"
status: "complete"
---

# QA Report: Test Coverage Analysis

## Objective

Analyze test coverage and identify gaps. Target: minimum 70% meaningful coverage.

## Current Coverage

### Backend (c8 instrumentation)

| File | Line % | Branch % | Funcs % | Uncovered Lines |
|------|--------|----------|---------|-----------------|
| `src/index.ts` | 60.87 | 71.43 | 60.00 | 24-32, 57-80, 87, 89-90 |
| `src/middleware/errorHandler.ts` | 100.00 | 100.00 | 100.00 | — |
| `src/routes/tasks/index.ts` | 98.46 | 93.10 | 100.00 | 116-117 |
| `src/services/taskService.ts` | 96.33 | 97.06 | 100.00 | 36-39 |
| **All backend files** | **89.73** | **94.25** | **90.91** | |

**52 unit tests, 0 failures.**

Backend exceeds the 70% target with strong coverage across all business logic and route handlers. The uncovered lines in `index.ts` are server startup/shutdown paths.

### Frontend

No measured coverage (no c8 instrumentation for frontend). Unit tests exist for:
- `queryKeys`
- `useCreateTask`, `useDeleteTask`, `useUpdateTask` (mutation hooks)
- `services/taskService`
- `config/queryClient`

E2E tests via Playwright cover happy-path flows (create, complete, delete).

## Untested Critical Files

| File | Risk | Notes |
|------|------|-------|
| `components/TaskCard.tsx` | High | Core UI — renders task, handles complete/delete |
| `components/TaskInput.tsx` | High | Primary user input — form validation, submission |
| `components/TasksSection.tsx` | Medium | Orchestrates task list rendering |
| `components/CompletedSection.tsx` | Medium | Completed tasks display |
| `hooks/useTasks.ts` | Medium | Query hook (only mutations are tested) |
| `context/ToastContext.tsx` | Medium | Toast notification state management |
| `lib/formatDate.ts` | Low | Pure function — easiest win |
| `hooks/useDarkMode.ts` | Low | Theme toggle logic |
| `components/ErrorBoundary.tsx` | Low | Error recovery UI |
| `components/ErrorMessage.tsx` | Low | Error display |
| `components/LoadingSpinner.tsx` | Low | Trivial to test |

## Recommendations

1. **Pure function tests** — `formatDate.ts` and `toastBridge.ts` are trivial wins.
2. **Add `useTasks` hook test** — Follow existing mutation hook test patterns.
3. **Component tests** — Add Vitest + `@testing-library/react` with jsdom. Priority: `TaskCard` > `TaskInput` > `TasksSection`/`CompletedSection`.
4. **`useDarkMode` and `ToastContext`** — Test with `renderHook` for state/side-effect coverage.
5. **E2E via Playwright** — Already in place, covers happy paths.

## Verdict

**Backend: PASS** — 89.73% line coverage, well above 70% target.
**Frontend: ACCEPTABLE for POC** — Mutation hooks and services are tested, E2E covers critical flows. Component-level tests are the primary gap.
