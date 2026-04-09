---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments:
  - /Users/francesco/dev/hub/todoapp/_bmad-output/planning-artifacts/prd.md
  - /Users/francesco/dev/hub/todoapp/_bmad-output/planning-artifacts/architecture.md
  - /Users/francisco/dev/hub/todoapp/_bmad-output/planning-artifacts/ux-design-specification.md
workflowType: 'epics-and-stories'
project_name: 'todoapp'
user_name: 'Fran'
date: '2026-04-02'
validationDate: '2026-04-03'
epicsCount: 10
storiesCount: 14
frCoveragePercentage: 100
nfrCoveragePercentage: 100
uxdrCoveragePercentage: 100
status: 'complete_ready_for_development'
---

# todoapp - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for todoapp, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Users can create a new task by entering text description
FR2: Users can submit a new task and have it immediately appear in the task list
FR3: The system assigns a created timestamp to each new task
FR4: Users can clear the input field after creating a task
FR5: Users can add multiple tasks in sequence without page reload
FR6: Users can view a complete list of all their tasks on the home screen
FR7: The system displays tasks in a clear, scannable list format
FR8: Users can view the created timestamp for each task
FR9: The system displays pre-populated example tasks on first app opening (2-3 examples)
FR10: Users can see an empty state message when they have no tasks
FR11: Users can toggle a task's completion status by clicking/tapping on the task
FR12: Completed tasks display with a visual checkmark indicator
FR13: Completed tasks display with a distinct background color
FR14: The visual status change (checkmark + color) occurs instantly without page reload
FR15: Active tasks display in a clean, unmarked visual state
FR16: Completed and active tasks are clearly distinguishable at a glance
FR17: Users can delete a task by selecting a delete action
FR18: Deleted tasks are immediately removed from the list
FR19: The system provides an undo option for task deletion
FR20: The system persists all task data to a backend database
FR21: Tasks remain available after the user closes and reopens the app
FR22: Tasks remain available after the user refreshes the page
FR23: Task creation, completion, and deletion are all persisted to the backend
FR24: The system synchronizes task state between frontend and backend
FR25: On first app opening, the system displays pre-populated example tasks
FR26: Example tasks demonstrate both active and completed states
FR27: At least one example task is pre-marked complete to show visual distinction
FR28: Users can delete example tasks to clear them
FR29: The "Add Task" prompt is prominently displayed and discoverable
FR30: All task actions (create, complete, delete) provide immediate visual feedback
FR31: The UI updates instantly (within 100ms) when users perform actions
FR32: The app loads its initial state in under 1 second
FR33: The system displays an error message if a task action fails
FR34: The system displays a loading indicator during backend operations
FR35: The app gracefully handles network errors without crashing
FR36: Failed operations allow users to retry or recover
FR37: The app functions correctly on desktop browsers
FR38: The app functions correctly on mobile browsers
FR39: The task list layout adapts to different screen sizes
FR40: All interactive elements are appropriately sized for mobile touch

### NonFunctional Requirements

NFR1: Initial page load completes in under 1 second (including HTML, CSS, JavaScript, and initial data fetch)
NFR2: Task action UI updates (create, complete, delete) occur within 100ms of user interaction
NFR3: Backend API responses for task operations complete in under 50ms under normal load
NFR4: Application bundle size remains under 100KB (gzipped) for fast initial download
NFR5: The application maintains consistent performance with up to 100 tasks in a user's list
NFR6: All core interactions (add task, toggle complete, delete) are operable via keyboard (Tab, Enter, Delete keys)
NFR7: Task status is conveyed through multiple signals: checkmark icon + background color change (not color alone)
NFR8: Form labels and interactive elements include semantic HTML and ARIA labels for screen reader compatibility
NFR9: Color contrast between active and completed task states meets WCAG AA standard (minimum 4.5:1 for text, 3:1 for graphics)
NFR10: The application functions without JavaScript errors in modern browsers (Chrome, Firefox, Safari, Edge — current and previous versions)

### Additional Requirements (Architecture & Technical)

- Starter Template: pnpm monorepo with Vite + React frontend, Fastify backend, PostgreSQL database, Docker containerization
- Tech Stack: React 19+, Vite 8.0+, Fastify 4+, Prisma ORM, PostgreSQL, TypeScript 5.9+, Node.js 24+
- Frontend State Management: TanStack Query v5 for server state with optimistic updates
- API Design: Standard REST API with endpoints: GET /api/tasks, POST /api/tasks, PATCH /api/tasks/:id, DELETE /api/tasks/:id
- Frontend Framework: React with TypeScript, Tailwind CSS for styling
- Database: PostgreSQL with Prisma ORM, Task schema with userId (prepared for Phase 2 auth)
- API Response Format: Direct data responses on success, error structure with code and message
- Error Handling: Optimistic updates with automatic rollback on failure
- Caching: TanStack Query default caching with 5-minute stale time
- Build: Vite with automatic tree-shaking, minification, bundle target <100KB gzipped
- Monorepo Structure: apps/frontend, apps/backend, packages/shared-types, packages/shared-utils
- Shared Types: API types and domain models defined in @shared-types, imported by both frontend and backend
- Code Organization: Components, hooks, services (frontend); routes, services, db (backend)
- Naming Conventions: Database PascalCase, API kebab-case, code camelCase
- Containerization: Docker Compose with PostgreSQL, multi-stage builds for production

### UX Design Requirements

UX-DR1: Implement warm color palette (soft lavender #F5F3FF for active, soft green #E8F5E9 for completed, warm indigo #6366F1 for accents) with dark mode support (deep slate, deep teal, bright indigo)

UX-DR2: Create satisfying completion animation: bounce scale 99%→104%→101% over 300-400ms with cubic-bezier easing on task completion

UX-DR3: Implement smooth color transition from lavender to green over 300ms when marking task complete

UX-DR4: Create checkmark appearance animation (fade in + scale) over 300ms synchronized with color change

UX-DR5: Implement task movement animation: smooth slide from "Tasks" section to "Completed" section over 350ms

UX-DR6: Design visual layout with two sections: "Tasks" (active tasks, top/left) and "Completed" (completed tasks, bottom/right)

UX-DR7: Implement responsive layout: single column on mobile (<768px), two-column (60%/40%) on desktop (≥768px)

UX-DR8: Create input field component with always-visible placement (top on desktop, bottom/sticky on mobile), dashed border styling, emoji support

UX-DR9: Design task card components for active state (soft lavender background, 16px padding, rounded corners) and completed state (white background, 4px green left border, 75-80% opacity)

UX-DR10: Implement touch targets minimum 44x44px for mobile accessibility

UX-DR11: Create focus states and keyboard navigation support (Tab navigation, Enter to submit/complete, Delete to remove)

UX-DR12: Implement loading spinner component for backend operation feedback

UX-DR13: Create error message component for displaying API and validation errors

UX-DR14: Design empty state component with messaging when no tasks exist

UX-DR15: Implement toast notification component for undo actions (3-5 seconds) and error messages

UX-DR16: Use Inter or system font (Segoe UI) as primary typeface with web-safe fallback stack

UX-DR17: Define typography system: H2 20px/600 for section headers, Body 16px/400 for content, Small 14px/400 for timestamps, Input 16px/400

UX-DR18: Create spacing system based on 8px multiples: 4px (micro), 8px (small), 16px (standard), 24px (generous), 32px (breathing room)

UX-DR19: Implement task card padding 16px all sides, gap between tasks 12px, section gap 32px, page padding 16px mobile/24px desktop

UX-DR20: Design dark mode with system preference default, manual toggle persistence in localStorage, warm color palette in dark mode

UX-DR21: Configure Tailwind CSS with custom design tokens: colors, spacing, border-radius, animations via tailwind.config.js

UX-DR22: Create custom component classes using Tailwind @layer for .task-card, .task-active, .task-complete, .task-input variants

UX-DR23: Implement reduced-motion support: disable animations for users with prefers-reduced-motion

UX-DR24: Design example tasks component showing 2-3 pre-populated tasks (1 active, 1+ completed) to teach interface on first open

UX-DR25: Create undo toast component with 3-5 second visibility for accidental deletion recovery

### FR Coverage Map

| FR | Epic | Story |
|----|------|-------|
| FR1-5 | Epic 1: Monorepo & Infrastructure Setup | 1.1: Initialize pnpm Monorepo & Workspace Structure |
| FR6-10, FR37-39 | Epic 2: Frontend Foundation & Layout | 2.1: Create React + Vite Frontend with Tailwind CSS Setup |
| FR11-16, FR30-32 | Epic 3: Task Completion Experience | 3.1: Implement Task Completion with Optimistic Updates & Animations |
| FR1-2, FR4-5 | Epic 4: Task Creation Flow | 4.1: Build Task Input & Creation with Frontend State Management |
| FR17-19 | Epic 5: Task Deletion & Recovery | 5.1: Implement Task Deletion with Undo Toast Notification |
| FR20-24 | Epic 6: Backend API & Persistence | 6.1: Build REST API Endpoints (GET, POST, PATCH, DELETE) |
| FR33-36 | Epic 7: Error Handling & Resilience | 7.1: Implement Error Handling, Retry Logic & User Feedback |
| FR25-29 | Epic 8: First-Time Experience | 8.1: Create Example Tasks & Empty State Components |
| FR40, NFR6-9 | Epic 9: Accessibility & Polish | 9.1: Implement Keyboard Navigation, ARIA Labels, Dark Mode |
| UX-DR1-25 | Epic 10: Visual Design System | 10.1: Build Tailwind Design Tokens & Component Library |

## Epic List

1. **Epic 1: Monorepo & Infrastructure Setup** — Establish the pnpm monorepo, workspace structure, tooling configuration, and Docker environment
2. **Epic 2: Frontend Foundation & Layout** — Create React + Vite application with responsive layout, component structure, and TanStack Query setup
3. **Epic 3: Task Completion Experience** — Implement satisfying task completion with animations, optimistic updates, and visual feedback
4. **Epic 4: Task Creation Flow** — Build task input component and creation workflow with instant validation and UI updates
5. **Epic 5: Task Deletion & Recovery** — Implement task deletion with undo functionality and toast notifications
6. **Epic 6: Backend API & Persistence** — Build Fastify REST API endpoints, Prisma ORM, and PostgreSQL persistence layer
7. **Epic 7: Error Handling & Resilience** — Implement comprehensive error handling, retry logic, and user-friendly error messages
8. **Epic 8: First-Time Experience** — Create pre-populated example tasks and empty state components for onboarding
9. **Epic 9: Accessibility & Polish** — Implement keyboard navigation, ARIA labels, dark mode, and WCAG AA compliance
10. **Epic 10: Visual Design System** — Build Tailwind CSS design tokens, component variants, and animation system

---

## Epic 1: Monorepo & Infrastructure Setup

Goal: Establish the foundation project structure using pnpm workspaces with frontend, backend, and shared packages organized. Configure TypeScript, Vite, Fastify, and Docker containerization. Set up code quality (Biome) and commit standards (Conventional Commits). Configure GitHub Actions CI/CD to automate testing, linting, and type checking.

### Story 1.1: Initialize pnpm Monorepo & Workspace Structure

As a developer,
I want to set up the project monorepo structure with pnpm workspaces,
So that frontend, backend, and shared code are cleanly organized and dependencies are managed efficiently.

**Acceptance Criteria:**

**Given** a clean project directory,
**When** I follow the monorepo initialization steps,
**Then** the following structure exists:
- Root `pnpm-workspace.yaml` defining apps/* and packages/*
- Root `package.json` with workspace configuration
- Root `tsconfig.base.json` with shared TypeScript configuration
- `apps/frontend/` with package.json ready for React + Vite
- `apps/backend/` with package.json ready for Fastify
- `packages/shared-types/` for API type definitions
- `packages/shared-utils/` for shared utilities
- Root `.gitignore` and `README.md`

**And** `pnpm install` runs successfully at root and installs dependencies for all workspace members

**And** each workspace member has a clean tsconfig.json extending tsconfig.base.json

**And** `pnpm -r` commands can target all workspaces or specific scopes

### Story 1.2: Configure Node.js, TypeScript, and Development Tools

As a developer,
I want TypeScript strict mode and modern ES modules configured across the monorepo,
So that code is type-safe, consistent, and uses latest JavaScript features.

**Acceptance Criteria:**

**Given** the monorepo structure exists,
**When** I run TypeScript compilation,
**Then** strict mode is enabled globally (no implicit any, no unused variables)

**And** ESM (ECMAScript modules) is configured throughout

**And** root `.browserlist` or `tsconfig.base.json` targets modern browsers (Chrome, Firefox, Safari, Edge current + previous versions)

**And** Node.js 24+ is specified in `.nvmrc` and package.json engines

**And** dev dependencies include tsx for backend hot reload

### Story 1.3: Set Up Docker & PostgreSQL Infrastructure

As a developer,
I want Docker Compose to orchestrate PostgreSQL and local services,
So that I can develop with a realistic database environment and prepare for containerized production.

**Acceptance Criteria:**

**Given** Docker is installed locally,
**When** I run `docker-compose up`,
**Then** PostgreSQL 16 starts on localhost:5432

**And** database credentials are configurable via .env file (DATABASE_URL, POSTGRES_PASSWORD)

**And** volume mounts enable code changes to sync without container restart

**And** `docker-compose.yml` includes services for postgres, backend, and frontend placeholders

**And** `.env.example` documents all required environment variables

### Story 1.4: Configure Biome Code Quality & Conventional Commits

As a developer,
I want Biome configured for linting/formatting and Conventional Commits enforced,
So that code quality is consistent, commit history is structured, and automation can parse changes.

**Acceptance Criteria:**

**Given** the monorepo structure and tooling exist,
**When** I set up code quality and commit configuration,
**Then** Biome is installed and configured with:
  - `biome.json` in root with recommended rules
  - TypeScript and React support native (no plugins)
  - Linting rules: noUnusedVariables, noUnusedImports, noExplicitAny, noBannedTypes
  - Formatting: 2-space indentation, single quotes, no semicolons, 100-char line width
  - Ignore patterns for node_modules, dist, coverage, build, .next, etc.

**And** Biome npm scripts work:
  - `pnpm run check` - Check and auto-fix all issues
  - `pnpm run lint` - Lint only
  - `pnpm run format` - Format only
  - `pnpm run format:check` - Check formatting without changes

**And** VS Code integration configured:
  - `.vscode/settings.json` sets Biome as default formatter
  - Format-on-save enabled for TypeScript, JavaScript, JSON, Markdown
  - Code actions on save: fix all issues, organize imports

**And** git hooks set up with Husky & lint-staged:
  - `.husky/pre-commit` runs `biome check --apply` on staged files
  - Auto-fixes applied and files re-staged
  - Commit fails if unfixable issues found

**And** Conventional Commits enforced:
  - `commitlint.config.js` created with conventional commit rules
  - `.husky/commit-msg` hook validates commit format
  - Valid types: feat, fix, refactor, perf, docs, style, test, ci, chore
  - Subject: lowercase, imperative mood, no period, <50 chars
  - Invalid commits rejected with clear error messages

**And** Commitizen (optional) installed for interactive commits:
  - `pnpm run commit` triggers interactive commit prompt
  - Guides developers through conventional commit format

**And** CI/CD validation added:
  - GitHub Actions runs `pnpm run check` to validate code quality
  - Commits validated against conventional commit rules
  - Build fails if either check fails

**And** pre-commit quality check verified:
  - Create test file with intentional violations
  - Verify Biome catches and fixes issues automatically
  - Verify commitlint catches invalid commit message

**And** documentation complete:
  - `CONTRIBUTING.md` or similar documents commit conventions
  - Team guidelines for commit messages documented

### Story 1.5: Configure GitHub Actions CI/CD Pipeline

As a developer,
I want GitHub Actions configured to run tests, linting, and type checking on every pull request,
So that code quality is validated automatically and issues are caught before merge.

**Acceptance Criteria:**

**Given** the repository is pushed to GitHub,
**When** I open a pull request,
**Then** GitHub Actions automatically runs with four jobs in parallel:

**Job 1: Unit Tests (Mocked Dependencies)**
- Node.js 24.x environment (no database needed)
- Dependencies installed with `pnpm install --frozen-lockfile`
- Backend unit tests run against mocked dependencies: `pnpm run test:unit`
- Mocked Prisma client, mocked external services (no real DB)
- Tests verify business logic in isolation without database
- Coverage reports uploaded to Codecov
- Job fails if tests fail or coverage below target

**Job 2: Feature Tests (Bruno API Testing)**
- Node.js 24.x environment with PostgreSQL 16 service
- Dependencies installed with `pnpm install --frozen-lockfile`
- Database migrations run with `prisma migrate deploy`
- Backend server starts on localhost:3000
- Bruno API tests run against live server: `pnpm run test:feature` (or Bruno CLI)
- Tests verify endpoints work with real database and integrate correctly
- Bruno collection stored in `bruno/tasks/` directory
- Tests validate request/response contracts, error handling, data persistence
- Job fails if tests fail

**Job 3: E2E Tests (Playwright)**
- Node.js 24.x environment with PostgreSQL 16 service
- Dependencies installed with `pnpm install --frozen-lockfile`
- Database migrations run
- Backend server starts on localhost:3000
- Frontend dev server starts on localhost:5173 (or production build)
- Playwright browsers installed: `playwright install --with-deps`
- E2E tests run in headless mode: `pnpm run test:e2e`
- Tests verify full user workflows across frontend and backend
- Tests validate UI interactions, state management, animations
- Playwright HTML reports and traces uploaded as artifacts on failure
- Artifacts retained for 30 days
- Job fails if tests fail

**Job 4: Lint & Type Check**
- Node.js 24.x environment (no database needed)
- Dependencies installed with `pnpm install --frozen-lockfile`
- TypeScript type check: `pnpm run type-check`
- Biome linting check: `pnpm run check`
- Job fails if type errors or lint violations found

**And** workflow file structure:
  - Path: `.github/workflows/test.yml`
  - Triggers on: push to main/develop, pull requests to main/develop
  - Uses pnpm caching for faster builds
  - All four jobs run in parallel for speed

**And** GitHub Actions configuration optimized:
  - pnpm store cached between runs
  - Node modules cached between runs
  - Playwright cache configured
  - Artifacts stored for debugging failed tests
  - All environment variables in workflow or .env.example

**And** PR status checks configured:
  - All four jobs must pass to merge
  - PR shows individual job status (Unit → Feature → E2E → Lint)
  - Failed job details visible in PR checks
  - Passing checks allow merge (if no other blocks)

**And** branch protection rules (optional but recommended):
  - main branch requires all status checks to pass
  - main branch requires PRs (no direct pushes)
  - main branch requires 1 approval (or team preference)
  - Allows admins to bypass (for emergency fixes)

**And** environment variables documented:
  - `.env.example` updated with test database URL
  - CI-specific env vars (NODE_ENV=test, DATABASE_URL for test DB)
  - GitHub Secrets documented if needed

**And** workflow tested:
  - Create test PR with passing code
  - Verify all four jobs pass
  - Create test PR with failing unit test
  - Verify unit test job fails as expected
  - Create test PR with failing feature test (Bruno)
  - Verify feature test job fails as expected
  - Create test PR with failing e2e test
  - Verify e2e test job fails as expected
  - Create test PR with lint violation
  - Verify lint job fails as expected

**And** documentation complete:
  - README.md mentions CI/CD in setup section
  - CONTRIBUTING.md documents the testing pyramid: Unit (mocked) → Feature (Bruno) → E2E (Playwright) → Lint
  - Developers understand different test purposes and when to add each type
  - Bruno test collection documented with instructions for running locally

---

## Epic 2: Frontend Foundation & Layout

Goal: Create the React + Vite application with responsive layout, component structure, and TanStack Query configuration. Establish the foundation for all feature development.

### Story 2.1: Create React + Vite Frontend with Tailwind CSS Setup

As a developer,
I want a working React + Vite application with Tailwind CSS and responsive layout,
So that I can build UI components on a solid foundation.

**Acceptance Criteria:**

**Given** apps/frontend/ workspace exists,
**When** I run `pnpm run dev` from root or apps/frontend/,
**Then** Vite dev server starts on localhost:5173

**And** Hot Module Replacement (HMR) works: CSS changes reflect instantly

**And** React renders at root component (App.tsx)

**And** Tailwind CSS is configured and available (colors, spacing, utilities)

**And** `vite.config.ts` includes:
  - React plugin
  - Path alias @ → src/
  - Build target ES2020
  - Optimization for <100KB bundle

**And** `tailwind.config.js` extends with design tokens (colors, spacing, border-radius, animations)

**And** TypeScript strict mode enabled

**And** `pnpm run build` produces optimized production build in dist/

**And** bundle size report shows <100KB gzipped

**And** Playwright e2e test setup complete:
  - `playwright.config.ts` configured
  - Test projects set up for Chrome, Firefox, Safari, Mobile Chrome
  - Baseurl set to localhost:5173
  - Screenshots and traces on failure configured

**And** test scripts added to package.json:
  - `test:e2e` (headless mode for CI)
  - `test:e2e:headed` (for local debugging)
  - `test:e2e:debug` (inspector mode)

**And** basic smoke test written: app loads and renders main component

**And** Playwright tests passing: `pnpm run test:e2e`

### Story 2.2: Implement Responsive Layout with Desktop/Mobile Variations

As a user,
I want the app to display correctly on desktop (two-column: 60% tasks / 40% completed) and mobile (single column),
So that the experience is optimized for any device.

**Acceptance Criteria:**

**Given** the React app is running,
**When** I view on desktop (≥768px viewport),
**Then** layout shows two-column structure: input field at top, Tasks section (60%) left, Completed section (40%) right

**And** when I view on mobile (<768px viewport),
**Then** layout shows single column: Tasks section full width, Completed section below, input field at bottom (sticky or floating)

**And** spacing adapts: 24px padding desktop, 16px padding mobile

**And** no horizontal scrolling occurs on mobile

**And** transition between layouts is smooth when resizing

### Story 2.3: Set Up TanStack Query for Server State Management

As a developer,
I want TanStack Query configured with sensible defaults and query key factory,
So that API calls, caching, and synchronization are handled elegantly.

**Acceptance Criteria:**

**Given** TanStack Query v5 is installed,
**When** I create a QueryClient,
**Then** configuration includes:
  - 5-minute stale time
  - 10-minute cache time (gcTime)
  - Automatic retry on transient failures
  - Exponential backoff: 1s → 2s → 4s (max 3 attempts)

**And** query key factory (taskKeys) provides type-safe keys for list, detail, etc. queries

**And** mutations are configured with onMutate, onError, onSuccess callbacks

**And** optimistic update pattern is documented and examples provided

**And** QueryClientProvider wraps the React app at root

---

## Epic 3: Task Completion Experience

Goal: Implement the core completion interaction with smooth animations, optimistic updates, and instant visual feedback. This is the defining moment of the user experience.

### Story 3.1: Implement Task Completion with Optimistic Updates & Animations

As a user,
I want to tap a task and see it transform immediately (color change, checkmark, bounce animation) then move to the Completed section,
So that the completion action feels rewarding and satisfying.

**Acceptance Criteria:**

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

### Story 3.2: Create TaskCard Component with Interactive States

As a developer,
I want a reusable TaskCard component that renders active and completed states with proper styling,
So that task display logic is centralized and consistent.

**Acceptance Criteria:**

**Given** a Task object with id, description, completed status, and createdAt,
**When** TaskCard renders,
**Then** it displays:
  - Task description text
  - Created timestamp formatted as "2 hours ago" or date
  - Appropriate background (lavender if active, white with green border if completed)
  - Rounded corners (12px)
  - 16px padding
  - Checkmark icon visible only if completed

**And** component receives onClick handler to toggle completion

**And** component receives onDelete handler to remove task

**And** entire task surface is clickable for completion (except delete button area)

**And** on mobile: touch target is minimum 44x44px

**And** on desktop: hover state shows subtle shadow increase and delete button becomes more visible

**And** Playwright e2e tests written covering:
  - TaskCard renders with task data
  - Click toggles completion state visually
  - Delete button reveals on hover/focus
  - Checkmark visible when completed
  - Timestamp displays correctly
  - Touch target size adequate (44x44px minimum on mobile)
  - Responsive behavior (desktop vs mobile)

**And** tests validate component behavior across Chrome, Firefox, Safari

**And** Playwright tests passing: `pnpm run test:e2e`

---

## Epic 4: Task Creation Flow

Goal: Implement task input component and creation workflow with instant validation, optimistic UI updates, and seamless list integration.

### Story 4.1: Build Task Input & Creation with Frontend State Management

As a user,
I want to type a task description into a visible input field and press Enter to create it,
So that adding tasks is frictionless and effortless.

**Acceptance Criteria:**

**Given** the app loads,
**When** I view the input field,
**Then** it is always visible (never hidden behind navigation or requires scrolling)

**And** placeholder text says "Add a task..." or similar

**And** input has dashed border styling and rounded corners (12px)

**And** I can type task description

**And** pressing Enter submits the task

**And** tab and shift+tab navigate focus correctly

**And** field clears after successful submission

**And** the new task immediately appears at the top of the Tasks list (optimistic update)

**And** if submission fails, task remains in input field for retry

**And** minimum 1 character, maximum 500 characters allowed (trim whitespace)

**And** on mobile: input is accessible at bottom with soft keyboard support

**And** on desktop: input accepts keyboard shortcuts (Enter to submit, Escape to clear)

**And** Playwright e2e tests written covering:
  - Input field is visible on both desktop and mobile
  - User can type task description
  - Pressing Enter submits task
  - Input field clears after submission
  - New task appears immediately in task list
  - Empty input rejection (minimum 1 char)
  - Whitespace trimming validation
  - Focus management (Tab key)
  - Escape key clears input

**And** tests validate on multiple devices (desktop, tablet, mobile)

**And** Playwright tests passing: `pnpm run test:e2e`

### Story 4.2: Implement useCreateTask Hook with Optimistic Updates

As a developer,
I want a custom hook that handles task creation with optimistic updates and error recovery,
So that the frontend feels instant while ensuring backend synchronization.

**Acceptance Criteria:**

**Given** the useCreateTask hook is called with description and callbacks,
**When** user submits,
**Then** task is optimistically added to cache immediately

**And** POST /api/tasks is called asynchronously

**And** if success:
  - Cache is invalidated
  - Task is refreshed from backend with real ID and timestamp
  - User sees no disruption

**And** if failure:
  - Previous state is restored
  - Error message is shown
  - Task disappears from list (was optimistic only)
  - Retry button is available in error toast

**And** loading state (isPending) is exposed for UI feedback

**And** error state includes user-friendly message

---

## Epic 5: Task Deletion & Recovery

Goal: Implement task deletion with undo functionality and toast notifications to prevent accidental data loss and provide recovery.

### Story 5.1: Implement Task Deletion with Undo Toast Notification

As a user,
I want to delete a task, see an undo button in a toast notification for 3-5 seconds, and recover if I change my mind,
So that I can delete tasks confidently without fear of permanent loss.

**Acceptance Criteria:**

**Given** I have a task and hover/press to reveal delete action,
**When** I click or tap delete,
**Then** task is immediately removed from the list (optimistic update)

**And** DELETE /api/tasks/:id is called to backend

**And** toast notification appears showing "Task deleted" with "Undo" button (3-5 seconds)

**And** if I click "Undo" within the window:
  - Task is restored to Tasks list
  - Animation reverses if applicable
  - API call is cancelled or reverted

**And** if toast expires without undo:
  - Deletion is confirmed as permanent
  - Toast dismisses

**And** if deletion fails:
  - Task is restored to list
  - Error toast shows "Failed to delete. Retry?"
  - Delete action remains available

**And** multiple tasks can be deleted in sequence; each has independent undo window

**And** Playwright e2e tests written covering:
  - Task deletion removes task from list
  - Undo toast appears with correct message
  - Undo button restores task
  - Toast auto-dismisses after timeout
  - Multiple deletions handled independently
  - Error state when deletion fails
  - Undo button not clickable after timeout

**And** tests validate undo timeout behavior (3-5 second window)

**And** Playwright tests passing: `pnpm run test:e2e`

### Story 5.2: Create Delete Button UI & Interaction Model

As a developer,
I want a delete button that appears on hover (desktop) or press (mobile) without cluttering the interface,
So that deletion is discoverable but not visually distracting.

**Acceptance Criteria:**

**Given** TaskCard component renders,
**When** I hover over it (desktop),
**Then** delete button becomes more visible (opacity increase or slide in from right)

**And** when I press/long-press (mobile),
**Then** delete button appears or becomes interactive

**And** delete button is styled as trash icon or "Delete" label

**And** delete button is minimum 44x44px touch target

**And** delete action does not require confirmation modal (toast undo is recovery)

**And** Playwright e2e tests written covering:
  - Delete button hidden by default
  - Delete button visible on hover (desktop)
  - Delete button visible on focus/tap (mobile)
  - Delete button touch target meets 44x44px minimum
  - Clicking delete removes task (with undo toast)
  - Responsive behavior across devices

**And** tests validate interaction on Chrome, Firefox, Safari

**And** Playwright tests passing: `pnpm run test:e2e`

---

## Epic 6: Backend API & Persistence

Goal: Build Fastify REST API endpoints with Prisma ORM and PostgreSQL database to persist all task data reliably.

### Story 6.1: Build REST API Endpoints (GET, POST, PATCH, DELETE)

As a developer,
I want REST API endpoints for all task operations with consistent response format,
So that frontend can reliably communicate with backend.

**Acceptance Criteria:**

**Given** Fastify server is running,
**When** I call endpoints,
**Then** GET /api/tasks returns array of all tasks with 200 status
```json
[
  { "id": 1, "description": "Buy milk", "completed": false, "createdAt": "2026-04-02T10:30:00Z", "updatedAt": "2026-04-02T10:30:00Z" }
]
```

**And** POST /api/tasks with { description: string } creates new task with 201 status, returns created task

**And** PATCH /api/tasks/:id with { completed?: boolean, description?: string } updates task with 200 status

**And** DELETE /api/tasks/:id removes task with 200 status, returns deleted task

**And** all responses follow consistent format (direct data on success, error object on failure)

**And** error responses include status code (400, 404, 500) and error structure: { error: { code: string, message: string } }

**And** all endpoints validate input (non-empty description, valid ID, etc.)

**And** CORS is configured to allow frontend requests

**And** Fastify @autoload plugin auto-registers routes from routes/ directory

**And** endpoints use shared types from @shared-types for type safety

**And** unit tests written for all endpoints with `node:test` framework covering:
  - Happy path for GET, POST, PATCH, DELETE
  - Validation errors (400 responses)
  - Not found errors (404 responses)
  - Error response structure

**And** Bruno API test collection created in `bruno/tasks/` with requests for all endpoints

**And** unit tests passing locally: `pnpm run test:unit`

**And** unit tests passing in CI pipeline

### Story 6.2: Configure Prisma ORM & Database Schema

As a developer,
I want Prisma configured with PostgreSQL and Task schema,
So that data persistence is type-safe and migrations are managed.

**Acceptance Criteria:**

**Given** Prisma is installed in backend,
**When** prisma/schema.prisma is defined,
**Then** it includes Task model with:
  - id (Int, autoincrement primary key)
  - userId (Int, nullable for Phase 2)
  - description (String, required)
  - completed (Boolean, default false)
  - createdAt (DateTime, default now())
  - updatedAt (DateTime, auto-updated)
  - Index on userId for Phase 2 queries

**And** `pnpm exec prisma migrate dev --name init` creates initial migration

**And** `pnpm exec prisma generate` generates Prisma client

**And** `pnpm exec prisma db push` syncs schema to PostgreSQL

**And** prisma/migrations/ contains all migration files

**And** DATABASE_URL environment variable is used for connection string

**And** Prisma client is initialized in src/db/prisma.ts and exported for services

### Story 6.3: Implement Task Service Layer with Business Logic

As a developer,
I want task business logic centralized in a service layer,
So that routes remain thin and logic is testable and reusable.

**Acceptance Criteria:**

**Given** backend routes receive requests,
**When** TaskService.getTasks(), .createTask(), .updateTask(), .deleteTask() are called,
**Then** each method handles database queries via Prisma

**And** getTasks() returns all tasks sorted by createdAt descending

**And** createTask() validates description, creates task, returns with timestamp

**And** updateTask() validates task exists, updates fields, returns updated task

**And** deleteTask() validates task exists, deletes, returns deleted task

**And** all methods are error-aware: throw ValidationError, NotFoundError, or generic Error

**And** service is injectable/testable (accepts Prisma client, can be mocked)

**And** service methods are async and return promises

**And** unit tests written for TaskService with `node:test` framework covering:
  - Happy path for all CRUD operations
  - Validation errors (empty description, invalid ID)
  - NotFoundError for missing tasks
  - Business logic edge cases (boundary values, null handling)

**And** tests use `--experimental-detect-module-mocks` for mocking Prisma calls

**And** test coverage meets 70-80% target for service code

**And** tests include error response mapping validation

**And** unit tests passing locally: `pnpm run test:unit`

**And** unit tests passing in CI pipeline

### Story 6.5: Graceful Shutdown with `@fastify/close-with-grace`

As a developer,
I want the Fastify server to handle OS signals (SIGTERM, SIGINT) gracefully,
so that in-flight requests complete and all connections (Prisma, pg pool) are cleanly released before the process exits.

**Acceptance Criteria:**

**Given** the backend server is running,
**When** SIGTERM or SIGINT is received (e.g., `docker stop`, Ctrl+C, Kubernetes pod eviction),
**Then** `fastify.close()` is called, triggering the `onClose` hook which calls `prisma.$disconnect()` before process exit

**And** a 10-second grace period allows in-flight requests to complete before force-close

**And** any error that triggers shutdown is logged via `fastify.log.error` before closing

**And** `pnpm run type-check` passes with zero errors

**And** all existing unit tests (`pnpm run test:unit`) continue to pass

---

## Epic 7: Error Handling & Resilience

Goal: Implement comprehensive error handling, retry logic, and user-friendly error messages across frontend and backend.

### Story 7.1: Implement Error Handling, Retry Logic & User Feedback

As a user,
I want clear error messages when operations fail, with option to retry,
So that I can recover from failures and trust the application.

**Acceptance Criteria:**

**Given** a task operation fails (network, validation, server error),
**When** failure occurs,
**Then** frontend displays user-friendly error message:
  - "Please check your input and try again" (for validation errors)
  - "This task no longer exists" (for 404)
  - "Something went wrong. Please try again." (for server errors)

**And** toast notification appears with "Retry" button for transient failures

**And** automatic retry happens with exponential backoff (1s → 2s → 4s, max 3 attempts)

**And** user can manually click "Retry" button at any time

**And** failed UI changes are rolled back (optimistic updates reverted)

**And** backend returns consistent error structure: { error: { code, message } }

**And** error codes map to HTTP status codes:
  - VALIDATION_ERROR → 400
  - NOT_FOUND → 404
  - INTERNAL_ERROR → 500

**And** backend logs errors with context (taskId, action, error message)

**And** frontend logs errors only in development mode (not production)

**And** unit tests written for error handling covering:
  - Validation error responses (400)
  - Not found error responses (404)
  - Server error responses (500)
  - Error code → message mapping
  - Retry logic and exponential backoff

**And** Bruno API tests include error case validation for each endpoint

**And** unit tests passing: `pnpm run test:unit`

---

## Epic 8: First-Time Experience

Goal: Create pre-populated example tasks and empty state components to teach the interface on first open.

### Story 8.1: Create Example Tasks & Empty State Components

As a new user,
I want to see 2-3 pre-populated example tasks (one active, one completed) when I first open the app,
So that I instantly understand how to use the interface without reading instructions.

**Acceptance Criteria:**

**Given** the app loads for the first time (no existing tasks),
**When** I view the Tasks section,
**Then** it displays 2-3 example tasks:
  - "Learn how to use this app" (active, lavender background)
  - "Check out the UI" (completed, green checkmark + border, lighter opacity)
  - Optional: "Add your first task" (active, lavender background)

**And** example tasks are visually identical to real tasks (no "Example" label or watermark)

**And** I can interact with examples: toggle completion, delete them, etc.

**And** example tasks are deleted when user creates their first real task (optional: delete all examples at once)

**And** example tasks disappear from Completed section too (visual teachability remains)

**And** EmptyState component displays when user has deleted all tasks:
  - Message: "No tasks yet. Add one to get started."
  - Optional: encouragement message or visual asset

**And** example tasks are stored client-side or seeded in backend (configurable)

**And** Playwright e2e tests written covering:
  - Example tasks visible on first app load
  - Example tasks display correct states (active and completed)
  - User can interact with example tasks (complete, delete)
  - Empty state displays when no tasks exist
  - Empty state message is clear and actionable

**And** tests validate example tasks don't appear for returning users (localStorage/app state)

**And** Playwright tests passing: `pnpm run test:e2e`

---

## Epic 9: Accessibility & Polish

Goal: Implement keyboard navigation, ARIA labels, dark mode, and WCAG AA compliance for inclusive user experience.

### Story 9.1: Implement Keyboard Navigation, ARIA Labels, Dark Mode

As a user with accessibility needs,
I want full keyboard navigation, screen reader support, and dark mode option,
So that I can use the app comfortably regardless of device or preference.

**Acceptance Criteria:**

**Given** the app is loaded,
**When** I use keyboard only (no mouse),
**Then** Tab key navigates through: input field → task 1 → task 2 → ... → completed tasks

**And** Shift+Tab navigates backward

**And** Enter submits new task or toggles completion on focused task

**And** Delete key deletes focused task (with undo toast)

**And** Escape clears input field

**And** all interactive elements have visible focus indicator (outline, highlight, or ring)

**And** logical tab order is maintained (input → tasks → completed)

**And** all elements include semantic HTML and ARIA labels:
  - Buttons: <button aria-label="Delete task: Buy milk">
  - Form: <label htmlFor="task-input">Add Task</label>
  - Status: <span role="status" aria-live="polite">Task completed</span>

**And** dark mode is available:
  - Default: respects system preference (prefers-color-scheme)
  - Manual toggle in UI (checkbox or button)
  - Preference persists in localStorage
  - Colors: deep slate, deep teal, bright indigo, off-white

**And** color contrast meets WCAG AA: ≥4.5:1 for text (light and dark modes)

**And** reduced-motion is respected: animations disabled for users with prefers-reduced-motion

**And** minimum text size is 16px (no auto-zoom needed on iOS)

**And** Playwright e2e tests written covering:
  - Keyboard navigation (Tab, Shift+Tab through all elements)
  - Keyboard shortcuts (Enter, Delete, Escape)
  - Focus indicators visible on all interactive elements
  - Dark mode toggle functional
  - Dark mode preference persists after page refresh
  - Color contrast meets WCAG AA in both light and dark modes
  - Reduced-motion respected (animations disabled)
  - Semantic HTML and ARIA labels present
  - Screen reader-friendly navigation

**And** tests validate accessibility across Chrome, Firefox, Safari

**And** Playwright tests passing: `pnpm run test:e2e`

---

## Epic 10: Visual Design System

Goal: Build Tailwind CSS design tokens, component variants, and animation system for consistent, delightful UI.

### Story 10.1: Build Tailwind Design Tokens & Component Library

As a developer,
I want Tailwind configured with design tokens (colors, spacing, typography, animations),
So that component styling is consistent, maintainable, and fast to build.

**Acceptance Criteria:**

**Given** tailwind.config.js is configured,
**When** I build components with Tailwind utilities,
**Then** custom colors are available:
  - task-active-light: #F5F3FF (lavender)
  - task-complete-light: #E8F5E9 (green)
  - task-accent-light: #6366F1 (indigo)
  - Dark mode variants

**And** spacing tokens available: 4px, 8px, 16px (task-gap), 24px, 32px

**And** border-radius: 12px (task)

**And** animation: task-complete 300-400ms ease-out

**And** typography configured: 28px H1 (700), 20px H2 (600), 16px Body (400), 14px Small (400)

**And** all design tokens are used consistently across components

**And** custom component classes defined in CSS using @layer:
  - .task-card: rounded padding, shadow, transition
  - .task-active: lavender background, hover:shadow
  - .task-complete: white background, green border, opacity
  - .task-input: border, focus ring, placeholder

**And** dark mode variants auto-generated via Tailwind dark: prefix

**And** Tailwind production build is <100KB gzipped

**And** all unused CSS is tree-shaken from build

---

This epic breakdown transforms requirements into implementable, testable stories. Each story is specific enough for development while maintaining alignment with product goals.
