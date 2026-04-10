---
title: "QA Report: Security Review"
date: "2026-04-10"
status: "complete"
---

# QA Report: Security Review

## Objective

Review code for common security issues (XSS, injection, etc.). Document findings and remediations.

## Findings

### HIGH Severity

| # | Finding | Location | Notes |
|---|---------|----------|-------|
| 1 | No authentication on any route | `apps/backend/src/routes/tasks/index.ts` | All CRUD operations are fully public. Acceptable for POC only. |
| 2 | No HTTP security headers | `apps/backend/src/index.ts` | No `@fastify/helmet` or equivalent. Missing `X-Content-Type-Options`, `Strict-Transport-Security`, `X-Frame-Options`, `Content-Security-Policy`. |
| 3 | 9 dependency vulnerabilities (1 critical) | `pnpm audit` | Critical: axios SSRF. High: lodash code injection, 2 Vite dev server file-read bypasses. 4 moderate, 1 low. |

### MEDIUM Severity

| # | Finding | Location | Notes |
|---|---------|----------|-------|
| 4 | No Fastify request schemas | `apps/backend/src/routes/tasks/index.ts` | Routes rely on service-layer validation only. No schema-level rejection of malformed payloads. Mass-assignment risk is low (only `description`/`completed` destructured). |
| 5 | `.env` in git history | Commits `ee8622f`, `9003bc5` | Contains `DATABASE_URL` with default postgres credentials. For production, rotate credentials and purge with `git filter-repo`. |

### LOW Severity

| # | Finding | Location | Notes |
|---|---------|----------|-------|
| 6 | CORS localhost fallback | `apps/backend/src/index.ts:18` | Origin falls back to `http://localhost:5173` if `FRONTEND_URL` is unset. No wildcard origin (good). |

### No Issues Found

- **XSS**: No `dangerouslySetInnerHTML` usage. React 19 escapes output by default.
- **SQL Injection**: No `$queryRaw` or `$executeRaw` calls. All DB access uses Prisma's parameterized query builder.
- **Secrets in code**: `.env` files are in `.gitignore`. No hardcoded API keys or secrets in source.

## Remediation Recommendations

1. Add `@fastify/helmet` — one-line Fastify plugin registration.
2. Run `pnpm update` to patch dependency vulnerabilities.
3. Add Fastify JSON schemas to route definitions for defense-in-depth.
4. Purge `.env` from git history if this moves beyond POC.
5. Add authentication middleware if this moves beyond POC.

## Verdict

**ACCEPTABLE for POC** — No XSS or injection risks. Auth and security headers are expected gaps for a proof-of-concept. Dependency vulnerabilities should be patched regardless.
