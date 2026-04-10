---
title: "AI Integration Documentation"
date: "2026-04-10"
status: "complete"
---

# AI Integration Documentation

## Agent Usage

### Tasks Completed with AI Assistance

The entire todoapp was planned and implemented with AI assistance using the BMad workflow and Claude Code:

- **Planning phase**: Product brief, PRD, UX design specification, architecture design, and epic/story breakdown were all generated through BMad agent conversations (PM, Architect, UX Designer, Scrum Master agents).
- **Implementation**: All 10 epics (14 stories) were implemented via Claude Code, including monorepo setup, frontend components, backend API, database integration, and accessibility polish.
- **QA & review**: Test coverage analysis, accessibility audit (WCAG AA), performance profiling, and security review were conducted with AI assistance.
- **Code review & fixes**: Post-implementation code review identified issues that were resolved in follow-up commits.

### Prompts That Worked Best

- **Story-driven prompts**: Using `bmad-dev-story` with a fully specified story file gave the most consistent, complete results. The story spec provided acceptance criteria, technical notes, and file paths — reducing ambiguity.
- **Targeted fix prompts**: Specific bug descriptions with reproduction steps (e.g., "UI flash on task actions", "input focus lost after creation") produced quick, accurate fixes.
- **QA agent prompts**: Running `bmad-agent-qa` against existing code with clear objectives ("analyze test coverage", "audit accessibility") generated structured, actionable reports.

## MCP Server Usage

### Chrome DevTools MCP

- Used for accessibility auditing — running Lighthouse audits against the live app to verify WCAG AA compliance, contrast ratios, and keyboard navigation.
- Screenshot capture for visual regression verification during UI polish work (Stories 9.1, 10.1).
- Performance profiling to measure Largest Contentful Paint, Cumulative Layout Shift, and bundle sizes.

### GitHub MCP

- Used for PR creation, issue management, and branch operations throughout the sprint.
- Automated PR descriptions with structured summaries and test plans.

## Test Generation

### How AI Assisted

- **Unit tests**: AI generated Vitest test suites for both frontend (React Testing Library) and backend (Fastify inject). The backend achieved 89.73% line coverage; frontend achieved meaningful component-level coverage.
- **API tests**: Bruno collection files for manual/CLI API testing were AI-generated with correct request bodies, assertions, and environment variables.
- **Edge cases**: AI was effective at generating happy-path tests and common error scenarios (404, validation errors, server errors).

### What It Missed or Needed Iteration

- **Flaky test patterns**: Some initial test implementations had timing issues with optimistic updates and toast animations that required manual debugging.
- **Console noise**: Tests initially leaked `console.error` output from expected error scenarios, requiring a dedicated fix (commit `029b95b`) to mute noise properly.

### E2E Tests (Playwright)

AI generated a full Playwright E2E suite with 9 spec files covering stories 2-2, 3-1, 3-2, 4-1, 4-2, 5-1, 5-2, 9-1, plus a smoke test. These test real browser interactions including task creation, completion toggling, deletion with undo, accessibility, and responsive layout.

## Debugging with AI

### Notable Cases

1. **UI flash on task actions (#27)**: Users reported a visible flash when completing/deleting tasks. AI diagnosed the root cause as React Query cache invalidation triggering a re-render before the optimistic update settled. Fix involved adjusting the optimistic update strategy and toast timing.

2. **Input focus regression (#28)**: After adding the task creation form, focus was lost after submission. AI traced the issue through the React component lifecycle and identified that a key prop change was unmounting/remounting the input.

3. **Graceful shutdown race condition (#29)**: The Fastify server had deferred work items (Prisma disconnect, close-with-grace cleanup) that could race during shutdown. AI identified the ordering issue and implemented proper cleanup sequencing.

4. **WCAG AA contrast failures**: Lighthouse audit surfaced insufficient contrast ratios on secondary text and interactive elements. AI proposed and implemented design token adjustments that maintained the visual design while meeting AA thresholds.

## Limitations Encountered

### Where Human Expertise Was Critical

- **Visual design judgment**: AI could implement design specs but couldn't make aesthetic decisions about color palettes, spacing rhythm, or "feel". The UX design phase required human review of AI-generated design directions.
- **Infrastructure decisions**: Choosing between deployment targets (Docker vs. serverless), database hosting, and CI/CD pipeline design required human context about team capabilities and constraints.
- **Priority trade-offs**: When the QA reports surfaced multiple issues, human judgment was needed to decide which were release-blocking vs. nice-to-have (e.g., E2E tests deferred, accessibility fixes prioritized).
- **Complex state management**: Optimistic update edge cases (rapid successive actions, network timeout during undo window) required iterative human-AI collaboration rather than single-shot AI generation.
- **Test infrastructure**: Setting up the test environment (Docker PostgreSQL for integration tests, Vitest workspace configuration, Playwright configuration, coverage tooling) required iterative human-AI collaboration.

### AI Weaknesses Observed

- **Large refactors**: When a change touched many files simultaneously (e.g., design token migration in Story 10.1), AI occasionally missed updating secondary references or introduced inconsistencies that required review.
- **Context window limits**: Long implementation sessions sometimes required re-establishing context about prior decisions, especially across multiple story implementations.
- **Overengineering tendency**: AI occasionally proposed more abstraction than needed (extra utility functions, premature generalization). Feedback to keep things simple was effective once given.
