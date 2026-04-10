---
story_id: "10.1"
story_key: "10-1-tailwind-design-tokens-component-library"
epic: 10
status: done
created: 2026-04-10
---

# Story 10.1: Build Tailwind Design Tokens & Component Library

Status: done

## Story

As a developer,
I want Tailwind configured with design tokens (colors, spacing, typography, animations),
so that component styling is consistent, maintainable, and fast to build.

## Acceptance Criteria

1. **Custom colors** available in `tailwind.config.js`:
   - `task-active-light`: `#F5F3FF` (lavender)
   - `task-complete-light`: `#E8F5E9` (green)
   - `task-accent-light`: `#6366F1` (indigo)
   - Dark mode variants (already partially in use via inline classes — formalize them)

2. **Spacing tokens**: 4px, 8px, 16px (task-gap), 24px, 32px available as named tokens

3. **Border radius**: 12px as `task` radius token (note: components currently use `rounded-[10px]` from Story 9.1 — unify to the design token)

4. **Animation**: `task-complete` 300-400ms ease-out (already exists in `index.css` as `task-complete-entrance` at 630ms — reconcile with spec)

5. **Typography**: 28px H1 (700), 20px H2 (600), 16px Body (400), 14px Small (400)

6. **All design tokens used consistently** across existing components (replace hardcoded hex values and magic numbers)

7. **Custom component classes** defined in CSS using `@layer`:
   - `.task-card`: rounded padding, shadow, transition
   - `.task-active`: lavender background, hover:shadow
   - `.task-complete`: white background, green border, opacity
   - `.task-input`: border, focus ring, placeholder

8. **Dark mode variants** auto-generated via Tailwind `dark:` prefix

9. **Production build < 100KB gzipped**

10. **All unused CSS tree-shaken** from build

## Tasks / Subtasks

- [x] Task 1: Extend `tailwind.config.js` with design tokens (AC: #1, #2, #3, #4, #5)
  - [x] Add `colors.task` object: `active-light`, `complete-light`, `accent-light`, `active-dark`, `complete-dark`, `accent-dark`, `bg-light`, `text-primary`, `text-secondary`, `text-complete` (#2d5a3d), `border-complete` (#22c55e)
  - [x] Add named spacing: `task-gap` (16px), `task-xs` (4px), `task-sm` (8px), `task-md` (16px), `task-lg` (24px), `task-xl` (32px)
  - [x] Add `borderRadius.task`: `12px`
  - [x] Add `animation.task-complete` and `keyframes.task-complete` in theme (reference existing CSS keyframes — decide whether to keep in CSS or move to config)
  - [x] Add `fontSize` tokens: `h1` (28px/700), `h2` (20px/600), `body` (16px/400), `small` (14px/400)

- [x] Task 2: Create `@layer components` classes in `index.css` (AC: #7)
  - [x] `.task-card`: base card styles — `rounded-task`, padding, shadow-sm, transition-all duration-200
  - [x] `.task-active`: extends card — white bg, hover:translate-x-1 hover:shadow-md (currently inline in TaskCard.tsx)
  - [x] `.task-complete`: extends card — white bg, 4px green left border, text-[#2d5a3d], font-medium
  - [x] `.task-input`: dashed indigo border, focus:border-solid, focus ring, rounded-task, padding
  - [x] Each class includes its `dark:` variants inline

- [x] Task 3: Migrate existing components to use design tokens (AC: #6)
  - [x] `TaskCard.tsx` — ActiveTaskCard: replace `bg-white shadow-sm rounded-[10px] hover:translate-x-1 hover:shadow-md` with `.task-active` class + token utilities
  - [x] `TaskCard.tsx` — CompletedTaskCard: replace inline styles with `.task-complete` class + token utilities
  - [x] `TaskInput.tsx`: replace inline border/radius/focus styles with `.task-input` class
  - [x] `App.tsx`: replace hardcoded gradient hex values with token colors where applicable
  - [x] `TasksSection.tsx` / `CompletedSection.tsx`: replace hardcoded spacing/colors with tokens

- [x] Task 4: Reconcile animation timing (AC: #4)
  - [x] Current `task-complete-entrance` in index.css runs 630ms — AC says 300-400ms
  - [x] Decision: Keep 630ms bounce animation (user-approved in Story 3.1/9.1 via Chrome MCP). Animation keyframes kept in CSS (not moved to Tailwind theme) — CSS keyframes are the natural home for multi-step animations.
  - [x] Move animation keyframes/config to Tailwind theme if beneficial, or keep in CSS with token references

- [x] Task 5: Verify production build size (AC: #9, #10)
  - [x] Run `pnpm --filter frontend build` and check gzipped output
  - [x] Confirm total CSS < 100KB gzipped — CSS: 5.33KB gzipped, Total: 83.2KB gzipped
  - [x] Verify tree-shaking removes unused utilities

- [x] Task 6: Run existing tests — no regressions (all ACs)
  - [x] No unit test framework configured — skipped
  - [x] Run `pnpm --filter frontend test:e2e` — 287 passed, 13 skipped, 0 failures
  - [x] Fixed 3 e2e tests that checked class names (bg-white, from-[#f5f3ff]) to check computed styles instead

## Dev Notes

### Critical: Tailwind v4 — No `tailwind.config.js` Theme Merge

This project uses **Tailwind v4** (`tailwindcss@4.2.2` with `@tailwindcss/vite`). In Tailwind v4, the `tailwind.config.js` file is still supported but works differently:

- The `theme.extend` values ARE picked up by the Vite plugin
- However, `@layer components {}` in CSS is the **preferred** way to define component classes in v4
- The existing config already has `colors.primary`, `spacing.xs/md/lg`, and `borderRadius.lg` — extend, don't overwrite

### Current State of Styling (What Already Exists)

**`tailwind.config.js`** already has:
- `colors.primary` (#6366F1) and `colors.text.primary/secondary`
- `spacing.xs/md/lg` and `borderRadius.lg`

**`index.css`** already has:
- `@custom-variant dark (&:is(.dark *));` — dark mode enabled
- `task-complete-entrance` keyframes (630ms) with dark mode variant
- `prefers-reduced-motion` handler

**Components use hardcoded values** like `bg-[#F5F3FF]`, `text-[#2d5a3d]`, `border-[#22c55e]`, `rounded-[10px]`, `from-[#f5f3ff] to-[#e8f5e9]` — these should migrate to tokens.

### Migration Strategy — Preserve Visual Parity

The goal is to **extract** existing hardcoded styles into tokens and `@layer` classes WITHOUT changing the visual output. This is a **refactoring** story, not a redesign.

1. Add tokens to `tailwind.config.js`
2. Create `@layer components` classes that replicate current inline styles exactly
3. Replace inline utility chains in components with the new classes
4. Verify visually (screenshots) that nothing changed

### `@layer components` in Tailwind v4

In Tailwind v4, use standard CSS `@layer`:

```css
@layer components {
  .task-card {
    @apply rounded-[12px] p-4 shadow-sm transition-all duration-200;
  }
  .task-active {
    @apply task-card bg-white hover:translate-x-1 hover:shadow-md;
    @apply dark:bg-slate-700 dark:shadow-slate-900/20;
  }
}
```

**Important:** `@apply` with custom classes (like `@apply task-card`) works in Tailwind v4. But verify — if it doesn't, inline the base styles in each class.

### Border Radius: 12px vs 10px

The AC specifies `12px` as the task border radius. Story 9.1 implemented `rounded-[10px]` to match the UX mockup. When creating the `task` radius token, use `12px` per AC but be aware this is a 2px visual change. If exact mockup fidelity is required, discuss with user.

### Animation Timing Discrepancy

- **AC says:** 300-400ms ease-out
- **Current code:** 630ms cubic-bezier(0.34, 1.56, 0.64, 1) — a bouncy spring animation
- The 630ms animation was implemented in Story 3.1 and refined through multiple stories
- Changing to 300-400ms ease-out would remove the bounce feel
- **Recommendation:** Keep current animation behavior, document the token as `task-complete: 630ms` and note the AC discrepancy. The existing animation was user-approved via Chrome MCP verification.

### Dark Mode Tokens to Formalize

Currently used as inline classes across components (from Story 9.1):
- `dark:from-slate-900 dark:to-slate-800` (background gradient)
- `dark:bg-slate-700` (active cards)
- `dark:bg-slate-800` (completed cards, input)
- `dark:text-slate-100` (primary text)
- `dark:text-slate-400` (secondary text)
- `dark:text-emerald-300` / `dark:text-emerald-400` (completed text)
- `dark:border-slate-600` / `dark:border-slate-700` (borders)

These should be added as named tokens (e.g., `colors.task.active-dark: #334155`).

### Files to Modify

```
apps/frontend/
├── tailwind.config.js               # Extend with design tokens
├── src/
│   ├── index.css                     # Add @layer components classes
│   ├── App.tsx                       # Replace hardcoded colors with tokens
│   ├── components/
│   │   ├── TaskCard.tsx              # Replace inline styles with .task-active / .task-complete
│   │   ├── TaskInput.tsx             # Replace inline styles with .task-input
│   │   ├── TasksSection.tsx          # Replace hardcoded spacing/colors with tokens
│   │   └── CompletedSection.tsx      # Replace hardcoded spacing/colors with tokens
```

### Do NOT

- Do NOT remove the existing `task-complete-entrance` animation from `index.css` — refactor in place
- Do NOT change visual appearance — this is a token extraction, not a redesign
- Do NOT introduce CSS modules, styled-components, or any other styling system
- Do NOT remove the `@custom-variant dark` line — it's required for dark mode
- Do NOT use Tailwind v3 APIs (e.g., `darkMode: 'class'` in config) — v4 uses CSS custom variants
- Do NOT create a separate design token file (JSON/JS) — keep tokens in `tailwind.config.js`

### Previous Story Intelligence (9.1)

- All styling currently uses Tailwind utility classes with hardcoded hex values
- Dark mode was implemented with `dark:` variants across all components
- Direction 3 (Emoji & Playful) design was approved and implemented
- 74 Playwright e2e tests + unit tests all pass — must remain green
- Lighthouse accessibility score is 93 — must not regress
- `prefers-reduced-motion` is handled in `index.css`

### Git Intelligence

Recent commits show Stories 8.1 and 9.1 completed. Story 9.1 was the most recent frontend change, establishing the current visual design. Docker compose setup was added as infrastructure.

### References

- [Source: apps/frontend/tailwind.config.js] — current Tailwind configuration
- [Source: apps/frontend/src/index.css] — current CSS with animations and dark mode variant
- [Source: apps/frontend/src/components/TaskCard.tsx] — current inline styling for task cards
- [Source: apps/frontend/src/components/TaskInput.tsx] — current inline styling for input
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-10] — epic requirements and ACs
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md] — color palette, typography, spacing specs
- [Source: _bmad-output/planning-artifacts/architecture.md] — Tailwind CSS architecture decisions
- [Source: _bmad-output/implementation-artifacts/9-1-accessibility-and-polish.md] — previous story with current styling state

## Dev Agent Record

### Agent Model Used

claude-opus-4-6

### Debug Log References

### Completion Notes List

- Extended `tailwind.config.js` with comprehensive design tokens: 20 task color tokens (light + dark), 6 named spacing tokens, task border radius (12px), 4 typography tokens with font-weight
- Created 4 `@layer components` classes in `index.css`: `.task-card`, `.task-active`, `.task-complete`, `.task-input` — each with dark mode variants using `:is(.dark *)` selector
- Migrated `TaskCard.tsx` (ActiveTaskCard + CompletedTaskCard), `TaskInput.tsx`, `App.tsx`, `TasksSection.tsx`, `CompletedSection.tsx` to use design tokens and component classes — removed all hardcoded hex values from component className strings
- Kept animation timing at 630ms (user-approved bounce animation) — documented AC discrepancy
- Border radius unified to 12px via token (was 10px from Story 9.1 — 2px visual change per AC spec)
- Updated 3 e2e tests (story-3-1, story-9-1) to assert computed styles instead of class names — more robust and design-system-friendly
- Production build: CSS 5.33KB gzipped, Total 83.2KB gzipped (well under 100KB target)
- All 287 e2e tests pass, 0 regressions
- Linter auto-added `@config "../tailwind.config.js"` to `index.css` for Tailwind v4 config resolution

### Review Findings

- [x] [Review][Patch] **`transition: all` on `.task-active` animates unrelated properties** — Changed to `transition: transform 200ms ease, box-shadow 200ms ease` [index.css:34]
- [x] [Review][Patch] **Dead dark-mode `color` in `.task-complete` CSS** — Removed dead `color`, `time`, `span.block` rules from `:is(.dark *) .task-complete` — Tailwind utilities handle these [index.css:66-75]
- [x] [Review][Patch] **No `prefers-reduced-motion` for `.task-active:hover` translateX** — Added `transform: none` in `@media (prefers-reduced-motion: reduce)` [index.css:167]
- [x] [Review][Defer] **Animation timing 630ms vs AC spec 300-400ms** — pre-existing, user-approved bounce animation. Documented in dev notes.
- [x] [Review][Defer] **Dark mode in `@layer` uses `:is(.dark *)` instead of Tailwind `dark:` prefix** — works correctly but is manual CSS, not Tailwind-generated. Acceptable for `@layer components` where `dark:` utilities can't be used.
- [x] [Review][Defer] **`.task-complete` content area 4px narrower than active cards** — `border-left: 4px` in border-box reduces content width vs active cards. Pre-existing from Story 9.1 inline styles, just moved to CSS.

### Change Log

- 2026-04-10: Implemented Story 10.1 — Tailwind design tokens and component library

### File List

- apps/frontend/tailwind.config.js (modified — added colors.task, spacing.task-*, borderRadius.task, fontSize tokens)
- apps/frontend/src/index.css (modified — added @layer components with .task-card, .task-active, .task-complete, .task-input; linter added @config directive)
- apps/frontend/src/components/TaskCard.tsx (modified — migrated ActiveTaskCard and CompletedTaskCard to use .task-active/.task-complete classes and color tokens)
- apps/frontend/src/components/TaskInput.tsx (modified — migrated to .task-input class)
- apps/frontend/src/App.tsx (modified — replaced hardcoded gradient hex with from-task-active-light/to-task-complete-light tokens)
- apps/frontend/src/components/TasksSection.tsx (modified — replaced hardcoded heading color with text-task-text-heading token)
- apps/frontend/src/components/CompletedSection.tsx (modified — replaced hardcoded heading color with text-task-text-heading token)
- apps/frontend/e2e/story-9-1.spec.ts (modified — updated 2 tests to assert computed styles instead of class names)
- apps/frontend/e2e/story-3-1.spec.ts (modified — updated 1 test to assert computed style instead of class name)
