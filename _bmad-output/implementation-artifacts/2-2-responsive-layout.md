---
story_key: 2-2-responsive-layout
title: Story 2.2 — Implement Responsive Layout with Desktop/Mobile Variations
epic: Epic 2 — Frontend Foundation & Layout
status: review
date_created: 2026-04-07
date_updated: 2026-04-07
---

# Story 2.2: Implement Responsive Layout with Desktop/Mobile Variations

## Story

As a user,
I want the app to display correctly on desktop (two-column: 60% tasks / 40% completed) and mobile (single column),
So that the experience is optimized for any device.

---

## Acceptance Criteria

**Given** the React app is running,
**When** I view on desktop (≥768px viewport),
**Then** layout shows two-column structure: input field at top, Tasks section (60%) left, Completed section (40%) right

**And** when I view on mobile (<768px viewport),
**Then** layout shows single column: Tasks section full width, Completed section below, input field at bottom (sticky or floating)

**And** spacing adapts: 24px padding desktop, 16px padding mobile

**And** no horizontal scrolling occurs on mobile

**And** transition between layouts is smooth when resizing

---

## Tasks / Subtasks

### Task 1: Restructure `App.tsx` for correct desktop vs mobile regions
- [x] Implement **desktop (md+):** full-width `TaskInput` row, then a single row with Tasks (60%) and Completed (40%) using Tailwind `md:` breakpoint (768px)
- [x] Implement **mobile:** column order Tasks → Completed → `TaskInput` at bottom using `order-*` utilities
- [x] Apply **max-width 1200px** centered container per UX spec (`mx-auto max-w-[1200px]`)
- [x] Use **`min-w-0`** on flex children where needed to avoid overflow-driven horizontal scroll

### Task 2: Page padding and smooth resize
- [x] **16px** page padding mobile (`p-4`), **24px** desktop (`md:p-6`)
- [x] Add subtle **transition** on layout containers for resize (`transition-all duration-200 ease-out` on main shell)

### Task 3: Prevent horizontal overflow
- [x] Ensure root layout does not exceed viewport width on small screens (`overflow-x-hidden` on shell + `html`)

### Task 4: Automated verification (E2E)
- [x] Confirm existing Playwright coverage `apps/frontend/e2e/story-2-2.spec.ts` matches AC
- [x] Run `pnpm run test:e2e -- e2e/story-2-2.spec.ts` — **24 passed** (Chromium, Firefox, WebKit, Mobile Chrome)

### Task 5: Manual spot-check
- [x] Layout matches UX diagram: desktop input above 60/40 columns; mobile tasks → completed → input
- [x] Type-check: `pnpm run type-check` passes

---

## Dev Notes

### UX source of truth

See `_bmad-output/planning-artifacts/ux-design-specification.md` — **Spacing & Layout Foundation** (Page Padding 16px mobile / 24px desktop; desktop diagram with input full width above 60/40 columns; mobile with input at bottom).

### Architecture / stack

- **Tailwind CSS v4** — `md:` = 768px, aligned with epic
- **Components** — `TaskInput`, `TasksSection`, `CompletedSection` unchanged; shell-only update in `App.tsx`

### Testing

- E2E: `story-2-2.spec.ts` validates bounding boxes and column ratio ~60/40

### Previous intelligence

- Story 2.3 doc referenced 2.2 layout; this change aligns `App.tsx` with the UX spec (input was previously in one row with sections on desktop, which broke the intended two-column region).

---

## Dev Agent Record

### Implementation Plan

1. Replace single `md:flex-row` across three siblings with a **stacked shell**: input row (full width on desktop), then a **second row** that is `flex-col` on mobile and `md:flex-row` on desktop for Tasks + Completed only.
2. Keep mobile **visual order** via `order-1` / `order-3` (tasks block first, input last).
3. Add `max-w-[1200px]`, `overflow-x-hidden`, and `html { overflow-x: hidden }` to satisfy no horizontal scroll AC.
4. Run full Playwright matrix after `playwright install`.

### Completion Notes

- **Fixed desktop structure** to match epics + UX: full-width task input on top, then **60% / 40%** row (`md:w-3/5` / `md:w-2/5`) for Tasks and Completed only.
- **Mobile:** Tasks and Completed stack first; input last in the column.
- **E2E:** All 24 Story 2.2 tests pass across configured projects (requires `pnpm exec playwright install` for CI/local parity).

### Testing Summary

- `pnpm run type-check` — pass  
- `pnpm run test:e2e -- e2e/story-2-2.spec.ts` — 24 passed  

---

## File List

- `apps/frontend/src/App.tsx` — responsive shell layout
- `apps/frontend/src/index.css` — `html { overflow-x: hidden }`
- `_bmad-output/implementation-artifacts/2-2-responsive-layout.md` — this story

---

## Change Log

- **2026-04-07:** Story file created; `App.tsx` + `index.css` updated; E2E verified; status → review.

---

## Status

**Current:** review  
**Ready for Code Review:** Yes  

---

## Epic 2 note

Stories **2.1**, **2.2**, and **2.3** in `epics.md` are now all addressed in code and artifacts. Next work moves to **Epic 3** (task completion UX) unless you add follow-up items under Epic 2.
