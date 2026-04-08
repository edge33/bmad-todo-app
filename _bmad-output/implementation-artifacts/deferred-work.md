---
date: "2026-04-03"
source: "Code review of STORY-2-1-COMPLETION (Story 2.1)"
---

# Deferred Work Items

## Deferred from: code review of STORY-2-1 (2026-04-03)

- **HMR not explicitly tested** — HMR is a dev-only feature and cannot be tested in E2E; manual verification acceptable. Consider: document that HMR is tested manually or link to Vite docs on default HMR behavior.

- **No API proxy config** — Full-stack local dev setup (API proxy in Vite config) is out of scope for the frontend foundation story. Defer to Backend / Infrastructure epic when API is built.

- **No security headers guidance** — CSP, `X-Frame-Options`, and other headers are deployment-level concerns. Defer to deployment / security hardening epic or README.

- **Playwright install documentation** — Partially addressed in README.md (E2E Testing section added); ensure CI/CD workflow explicitly calls `playwright install --with-deps` in the E2E job.

---

## Deferred from: code review of 5-2-delete-button-ui-interaction-model (2026-04-08)

- **`waitForSelector` legacy API** — All tests use `await page.waitForSelector(...)` instead of the modern `await expect(page.locator(...)).toBeVisible()`. Not a bug, but retry semantics are weaker. Consider modernising in a future test-quality pass.
- **`MOCK_TASKS` non-deterministic timestamps** — `new Date().toISOString()` evaluated at module parse time. No timestamp assertions currently, so harmless, but should use fixed ISO strings if snapshot/date tests are added.
- **POST undo mock hardcoded to MOCK_TASKS[0]** — If a future test deletes task 2, the undo mock returns task 1 silently. Acceptable until tests cover multi-task delete scenarios.

---

## Deferred from: code review of 2-3-tanstack-query-setup (2026-04-08)

- **`useCreateTask.ts` stub mutationFn / `onError` dead code** — intentional example stub; real implementation delivered in Story 4.x
- **`/health` route unreachable try/catch** — pre-existing dead code; catch block can never fire
- **Scope creep — backend REST API in Story 2.3 commit** — informational; backend routes, service, middleware, and shared-types were bundled into this commit despite being out of scope for Story 2.3
- **`useCreateTask` optimistic update cache key mismatch with filters** — `taskKeys.lists()` used instead of `taskKeys.list(filters)`; acceptable until filtered queries are implemented
- **CORS `FRONTEND_URL` no multi-origin / no URL validation** — acceptable for current scope; revisit in deployment/hardening epic

---

## Deferred from: code review of 6-2-configure-prisma-orm-database-schema (2026-04-08)

- **No graceful `$disconnect()` on server shutdown** — PrismaClient singleton has no shutdown hook. Add `prisma.$disconnect()` via Fastify `onClose` hook when PrismaClient is integrated into the server in Story 6.3.
- **`description` column is unbounded TEXT** — No `CHECK` constraint or `@db.VarChar(N)` limit on `description`. Application-level validation to be addressed when routes use Prisma in Story 6.3.

---

## Notes

- Most deferred items are pre-existing architectural concerns or out-of-scope for story 2.1.
- The **HMR** item is acceptable as "manual verification" and should not block story completion.
- **API proxy** and **security headers** are dependencies on later stories (backend, deployment).
- **Playwright install** should be validated in GitHub Actions CI/CD workflow (Story 1.5 / Epic 1).
