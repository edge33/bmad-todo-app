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

## Notes

- Most deferred items are pre-existing architectural concerns or out-of-scope for story 2.1.
- The **HMR** item is acceptable as "manual verification" and should not block story completion.
- **API proxy** and **security headers** are dependencies on later stories (backend, deployment).
- **Playwright install** should be validated in GitHub Actions CI/CD workflow (Story 1.5 / Epic 1).
