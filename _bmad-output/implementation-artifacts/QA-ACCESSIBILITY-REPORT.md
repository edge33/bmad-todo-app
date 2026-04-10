---
title: "QA Report: Accessibility Audit (WCAG AA)"
date: "2026-04-10"
status: "complete"
remediation_pr: "https://github.com/edge33/bmad-todo-app/pull/31"
---

# QA Report: Accessibility Audit (WCAG AA)

## Objective

Ensure WCAG AA compliance. Run accessibility audit and document findings.

## Findings & Remediations

All findings below have been addressed in PR #31.

| # | Finding | WCAG | Severity | File | Status |
|---|---------|------|----------|------|--------|
| 1 | No `<h1>` or `<main>` landmark | 1.3.1 Info & Relationships | High | `App.tsx` | **FIXED** — Added `<main>` wrapper and sr-only `<h1>` |
| 2 | Empty-state text `text-gray-400` on white (~2.7:1 contrast) | 1.4.3 Contrast Minimum | High | `TasksSection.tsx`, `CompletedSection.tsx` | **FIXED** — Changed to `text-gray-500` (~4.6:1) |
| 3 | Toast auto-dismiss with no pause/extend | 2.2.1 Timing Adjustable | Medium | `ToastContext.tsx` | **FIXED** — Timer pauses on hover/focus, resumes on leave |
| 4 | No live region for task list mutations | 4.1.3 Status Messages | Medium | `TasksSection.tsx`, `CompletedSection.tsx` | **FIXED** — Added sr-only `aria-live="polite"` regions announcing task counts |
| 5 | Redundant `aria-label` overrides visible `<label>` | 4.1.2 Name, Role, Value | Low | `TaskInput.tsx` | **FIXED** — Removed redundant `aria-label`; `<label htmlFor>` is sufficient |
| 6 | ErrorBoundary buttons lack focus styles | 2.4.7 Focus Visible | Low | `ErrorBoundary.tsx` | **FIXED** — Added `focus-visible:outline` classes |
| 7 | ErrorBoundary buttons lack min touch target | 2.5.8 Target Size | Low | `ErrorBoundary.tsx` | **FIXED** — Added `min-h-[44px] min-w-[44px]` |

## Existing Good Practices

The app already implemented several a11y best practices:
- Semantic `<section>`, `<ul>`/`<li>` for task lists
- `aria-label` on interactive icon buttons
- `role="alert"` on error messages
- `role="status"` on loading spinners
- `focus-visible` outlines on most interactive elements
- 44px minimum touch targets on task action buttons
- `aria-busy="true"` on loading sections
- `<label htmlFor>` association on the task input

## Not Addressed (Acceptable for POC)

- `aria-disabled` without native `disabled` on TaskInput — uses `onChange` guard instead. Functionally equivalent for sighted users; minor AT gap.
- No dedicated a11y testing setup (`axe-core`, `jest-axe`) — could be added for ongoing regression prevention.

## Verdict

**PASS** — All high and medium severity WCAG AA issues have been remediated in PR #31. The app demonstrates strong baseline accessibility practices.
