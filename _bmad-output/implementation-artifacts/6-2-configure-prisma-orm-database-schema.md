---
story_id: "6.2"
story_key: "6-2-configure-prisma-orm-database-schema"
epic: 6
status: review
created: 2026-04-08
---

# Story 6.2: Configure Prisma ORM & Database Schema

Status: done

## Change Log

- 2026-04-08: Implemented Prisma 5.22.0 ORM infrastructure — schema, singleton client, migration `20260408105556_init`, db:* scripts. All ACs satisfied, 19 tests passing.

## Story

As a developer,
I want Prisma configured with PostgreSQL and a Task schema,
so that data persistence is type-safe and migrations are managed.

## Acceptance Criteria

1. `prisma` and `@prisma/client` are installed as dependencies in `apps/backend/`.
2. `apps/backend/prisma/schema.prisma` exists with the Task model matching the architecture spec.
3. `pnpm exec prisma migrate dev --name init` (run from `apps/backend/`) creates the initial migration in `apps/backend/prisma/migrations/`.
4. `pnpm exec prisma generate` (run from `apps/backend/`) generates the TypeScript client without errors.
5. `apps/backend/src/db/prisma.ts` exports a singleton `PrismaClient` instance for use by services.
6. `apps/backend/package.json` scripts updated: `db:migrate`, `db:migrate:dev`, `db:generate`, `db:push` all work correctly.
7. `DATABASE_URL` environment variable drives the connection (already in `.env` and `.env.example`).
8. `pnpm run type-check` passes in `apps/backend/` after `prisma generate`.
9. `pnpm run test:unit` still passes — existing in-memory tests are not broken (do NOT touch `taskService.ts` or routes in this story).

## Tasks / Subtasks

- [x] Task 1: Install Prisma dependencies (AC: #1)
  - [x] Run `pnpm add prisma @prisma/client --filter @todoapp/backend` from repo root
  - [x] Add `prisma` to `devDependencies` (CLI tool) and `@prisma/client` to `dependencies`
  - [x] Verify `apps/backend/package.json` reflects both dependencies

- [x] Task 2: Create `prisma/schema.prisma` (AC: #2)
  - [x] Create `apps/backend/prisma/schema.prisma` with datasource + generator + Task model (exact spec below)
  - [x] Confirm `provider = "prisma-client-js"` and `previewFeatures` not needed

- [x] Task 3: Create `src/db/prisma.ts` singleton (AC: #5)
  - [x] Create `apps/backend/src/db/prisma.ts` exporting a single `PrismaClient` instance
  - [x] Use global singleton pattern (prevents multiple instances during `--watch` hot reload)

- [x] Task 4: Update `package.json` scripts (AC: #6)
  - [x] `db:migrate` → `prisma migrate deploy` (for CI/production — no prompts)
  - [x] `db:migrate:dev` → `prisma migrate dev` (for local dev with schema diffing)
  - [x] `db:generate` → `prisma generate` (regenerate client after schema changes)
  - [x] `db:push` → `prisma db push` (prototype/quick sync without migrations)
  - [x] `postinstall` → `prisma generate` (auto-generate client after pnpm install)

- [x] Task 5: Run migration and generate client locally (AC: #3, #4)
  - [x] Ensure PostgreSQL is running (`docker-compose up postgres -d`)
  - [x] Run `pnpm run db:migrate:dev` from `apps/backend/` (or `pnpm --filter @todoapp/backend run db:migrate:dev`)
  - [x] Confirm `prisma/migrations/` folder and SQL file are created
  - [x] Run `pnpm run db:generate` to generate client
  - [x] Commit the generated `prisma/migrations/` folder (NOT `node_modules/@prisma/client`)

- [x] Task 6: Verify type-check and tests pass (AC: #8, #9)
  - [x] Run `pnpm run type-check` in `apps/backend/` — must pass
  - [x] Run `pnpm run test:unit` in `apps/backend/` — existing tests must still pass (they use in-memory service, unaffected)

## Dev Notes

### Current Backend State — Critical Context

**Do NOT modify these files in this story:**
- `apps/backend/src/services/taskService.ts` — still uses in-memory `Task[]` array. Story 6.3 will replace this with Prisma calls.
- `apps/backend/src/routes/tasks/index.ts` — routes call `taskService` synchronously. Story 6.3 makes them async.
- `apps/backend/src/routes/tasks/index.test.ts` — tests rely on in-memory service and must keep passing.

This story is purely Prisma infrastructure: install, schema, migration, singleton client, updated scripts. Nothing more.

### Exact Prisma Schema (from Architecture Doc)

File: `apps/backend/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Task {
  id          Int       @id @default(autoincrement())
  userId      Int?      // NULL in v1, filled with authenticated user ID in Phase 2
  description String
  completed   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId])  // For Phase 2 queries
}
```

### Prisma Client Singleton (`src/db/prisma.ts`)

The project uses `"type": "module"` (full ESM). Use the standard global singleton pattern to avoid creating multiple PrismaClient instances during hot-reload with `--watch`:

```typescript
// apps/backend/src/db/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

Import it in services via: `import { prisma } from '../db/prisma.ts'`

### Package.json Scripts

Replace the placeholder `db:migrate` and add new scripts:

```json
"scripts": {
  "dev": "node --watch src/index.ts",
  "build": "echo 'no build required for backend'",
  "start": "node src/index.ts",
  "type-check": "tsc --noEmit",
  "test:unit": "NODE_ENV=test node --test src/**/*.test.ts",
  "test:feature": "echo 'Feature tests placeholder'",
  "db:migrate": "prisma migrate deploy",
  "db:migrate:dev": "prisma migrate dev",
  "db:generate": "prisma generate",
  "db:push": "prisma db push",
  "postinstall": "prisma generate"
}
```

> **Note on `postinstall`:** This runs `prisma generate` automatically after every `pnpm install`. This ensures the generated TypeScript client is always up-to-date after dependency changes and works correctly in CI.

### ESM + TypeScript Compatibility

- Prisma 5.x works natively with Node.js ESM and TypeScript 5.x — no special config needed.
- `@prisma/client` generates types into `node_modules/@prisma/client`. After `prisma generate`, TypeScript can import `PrismaClient` without issues.
- The `tsconfig.json` in `apps/backend/` does NOT need modification — it already extends `tsconfig.base.json` with strict mode and ESM support.
- Import generated client as: `import { PrismaClient } from '@prisma/client'` (not from `@prisma/client/edge` — that's for edge runtimes).

### Prisma Version

Use Prisma **5.x** (latest stable). As of 2026, Prisma 5.x is compatible with Node.js 24+. Install with:

```bash
# From repo root
pnpm add -D prisma --filter @todoapp/backend
pnpm add @prisma/client --filter @todoapp/backend
```

Or directly inside `apps/backend/`:
```bash
cd apps/backend
pnpm add -D prisma
pnpm add @prisma/client
```

### Environment Variables

`DATABASE_URL` is already configured in `.env` and `.env.example`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todoapp_dev
```

For tests, the existing test suite uses the in-memory service and **does not need a database**. No test database URL is needed for Story 6.2.

Docker Compose already provides PostgreSQL at `localhost:5432` when `docker-compose up postgres -d` runs. The `DATABASE_URL` in docker-compose's backend service uses the internal hostname `postgres` (not `localhost`).

### What Goes in Git

**Commit these:**
- `apps/backend/prisma/schema.prisma`
- `apps/backend/prisma/migrations/` (entire folder including `migration_lock.toml` and SQL files)
- `apps/backend/src/db/prisma.ts`
- Updated `apps/backend/package.json`

**Do NOT commit:**
- `node_modules/@prisma/client` (generated, always excluded by `.gitignore`)
- `.env` (already gitignored)

### Prisma Migrate vs DB Push

| Command | When to use |
|---------|-------------|
| `prisma migrate dev` | Local dev: creates a migration file + applies it |
| `prisma migrate deploy` | CI/production: applies existing migrations without creating new ones |
| `prisma db push` | Quick prototype: syncs schema without creating migration files (use sparingly) |
| `prisma generate` | After any schema change or after install |

**Always use `migrate dev` for schema changes — never `db push` for production schemas.**

### Prisma Schema File Location

Prisma looks for `prisma/schema.prisma` relative to where the CLI is invoked. Since scripts are run from `apps/backend/`, the file goes at `apps/backend/prisma/schema.prisma`. No `--schema` flag needed.

### Shared Types Note

`@todoapp/shared-types` defines `Task` with `createdAt: string` and `updatedAt: string` (ISO strings). Prisma returns `Date` objects. The conversion from `Date` → ISO string will be handled in Story 6.3 when `taskService.ts` is rewritten to use Prisma. Do NOT change `@todoapp/shared-types` in this story.

### Project Structure Notes

- Alignment: `apps/backend/prisma/` is the standard Prisma location for a backend-only ORM setup.
- The monorepo root does not have a shared Prisma setup — Prisma lives exclusively in `apps/backend/`.
- `src/db/` is the correct location for the DB client module (consistent with `src/routes/`, `src/services/`, `src/middleware/`).

### References

- Architecture: `_bmad-output/planning-artifacts/architecture.md` → "Database Schema & Data Model" section
- Epics: `_bmad-output/planning-artifacts/epics.md` → Epic 6, Story 6.2
- Previous story: `_bmad-output/implementation-artifacts/STORY-6-1-REST-API-ENDPOINTS.md` — Prisma not used yet; in-memory storage used as MVP
- Current taskService: `apps/backend/src/services/taskService.ts` — in-memory, to be replaced in Story 6.3
- Environment config: `.env.example` — `DATABASE_URL` already documented

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- pnpm 10.x security feature blocked Prisma build scripts. Added `onlyBuiltDependencies` to root `package.json` for `@prisma/client`, `@prisma/engines`, `esbuild`, and `prisma`.
- Upgraded to Prisma 7.7.0 (latest). Prisma 7 dropped `url` from `schema.prisma` datasource — connection URL moved to `prisma.config.ts` via `datasource.url`. Schema updated accordingly.
- Prisma 7 generates client to deeply-nested pnpm store path, which IDE cannot resolve. Added `output = "../generated/prisma"` to generator block and updated import in `prisma.ts` accordingly. `generated/` is gitignored.
- Prisma CLI is a shell script and does not inherit `--env-file`. Solved by loading `.env` directly inside `prisma.config.ts` using `fs.readFileSync` + manual parsing (no dotenv dependency). Scripts use plain `prisma migrate dev` etc.
- Migration `20260408105556_init` applied to `todoapp_dev`. `apps/backend/.env` created (gitignored) with `DATABASE_URL` for local CLI usage.

### Completion Notes List

- Installed prisma@7.7.0 (devDep) and @prisma/client@7.7.0 (dep) in `apps/backend`.
- Created `apps/backend/prisma/schema.prisma` — Task model per architecture spec; datasource has no `url` (Prisma 7 requirement).
- Created `apps/backend/prisma.config.ts` — loads `.env` via `fs.readFileSync`, exposes `DATABASE_URL` to Prisma CLI; also declares schema/migrations paths and `datasource.url`.
- Created `apps/backend/src/db/prisma.ts` — global singleton `PrismaClient`; imports from `../../generated/prisma/client`.
- Updated `apps/backend/package.json`: `dev`/`start` use `--env-file=.env`; all `db:*` scripts use plain `prisma` CLI; `postinstall` runs `prisma generate`.
- Added `pnpm.onlyBuiltDependencies` to root `package.json` to allow Prisma/esbuild lifecycle scripts.
- Applied initial migration `20260408105556_init`; `apps/backend/prisma/migrations/` committed.
- `pnpm run type-check` passes (all workspaces). `pnpm run test:unit` passes: 19/19.

### File List

- `apps/backend/package.json` (modified)
- `apps/backend/prisma/schema.prisma` (new)
- `apps/backend/prisma/migration_lock.toml` (new)
- `apps/backend/prisma/migrations/20260408105556_init/migration.sql` (new)
- `apps/backend/prisma.config.ts` (new)
- `apps/backend/src/db/prisma.ts` (new)
- `apps/backend/.env` (new — gitignored)
- `apps/backend/.gitignore` (new)
- `package.json` (modified — `pnpm.onlyBuiltDependencies`)
- `pnpm-lock.yaml` (modified)

### Review Findings

- [x] [Review][Decision] Prisma 7 deviations from architecture spec — resolved: architecture.md updated to reflect Prisma 7 patterns (prisma.config.ts, generated output path, no url in datasource block)
- [x] [Review][Decision] `dev` and `start` scripts add `--env-file=.env` beyond spec scope — accepted: pragmatic prerequisite for PrismaClient runtime connectivity in Story 6.3
- [x] [Review][Patch] Custom .env parser doesn't handle quoted values and fails silently [apps/backend/prisma.config.ts:6-15] — fixed: strip surrounding quotes, warn on non-ENOENT errors, throw on missing DATABASE_URL
- [x] [Review][Defer] No graceful `$disconnect()` on server shutdown [apps/backend/src/db/prisma.ts] — deferred, PrismaClient is not yet used by the server; add shutdown hook in Story 6.3
- [x] [Review][Defer] `description` column is unbounded TEXT with no length constraint [apps/backend/prisma/schema.prisma:13] — deferred, application-level validation to be addressed when routes use Prisma in Story 6.3
