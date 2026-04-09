---
story_id: "8.1"
story_key: "8-1-example-tasks-empty-state"
epic: 8
status: review
created: 2026-04-09
---

# Story 8.1: Seed Example Tasks into Database

Status: review

## Story

As a developer demoing the app,
I want 2-3 example tasks pre-loaded in the database,
so that the app looks populated and useful on first open without any manual setup.

## Acceptance Criteria

1. Running `pnpm run seed` from `apps/backend` inserts 2-3 example tasks into the database.

2. Example tasks:
   - "Learn how to use this app" (active)
   - "Check out the UI" (completed)
   - "Add your first task" (active)

3. Seed is idempotent: re-running it does not create duplicates (uses `upsert` or checks for existing rows).

4. Seed script is wired into `package.json` under the `prisma.seed` config so `prisma db seed` also works.

## Tasks / Subtasks

- [x] Task 1: Add `@unique` constraint on `description` + migrate (AC: #3)
  - [x] Add `description String @unique` to `Task` model in `apps/backend/prisma/schema.prisma`
  - [x] Run `pnpm --filter backend prisma migrate dev --name add-description-unique`
  - [x] Confirm migration file generated under `apps/backend/prisma/migrations/`

- [x] Task 2: Create `apps/backend/prisma/seed.ts` (AC: #1, #2, #3)
  - [x] Import `PrismaClient` from `@prisma/client`
  - [x] Define the 3 example tasks with `upsert` (match on `description`)
  - [x] Disconnect client in `finally` block

- [x] Task 3: Wire seed into `package.json` (AC: #1, #4)
  - [x] Add `"seed": "tsx prisma/seed.ts"` to `scripts` in `apps/backend/package.json`
  - [x] Add `"prisma": { "seed": "tsx prisma/seed.ts" }` top-level key to `apps/backend/package.json`

- [x] Task 4: Verify seed runs without errors (AC: #1, #3)
  - [x] Run `pnpm run seed` from `apps/backend` — confirm 3 tasks inserted
  - [x] Run it again — confirm no duplicates

## Dev Notes

### Seed Script

```ts
// apps/backend/prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const examples = [
  { description: "Learn how to use this app", completed: false },
  { description: "Check out the UI", completed: true },
  { description: "Add your first task", completed: false },
];

async function main() {
  for (const task of examples) {
    await prisma.task.upsert({
      where: { description: task.description } as never,
      update: {},
      create: task,
    });
  }
  console.log("Seeded example tasks.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
```

> **Note:** `description` has no `@unique` constraint yet. Before running the seed, apply the migration below.

### `tsx` availability

`tsx` is already used in the backend scripts (check `package.json` devDependencies). If not present, use `ts-node` or `npx tsx`.

### References

- [Source: apps/backend/prisma/schema.prisma] — Task model
- [Source: apps/backend/package.json] — scripts and prisma config location

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- `migrate dev` requires interactive TTY; manually created migration file and applied with `migrate deploy`.
- Project uses `@prisma/adapter-pg` driver adapter — seed script must pass adapter to `PrismaClient`.
- `tsx` not installed; used Node 24 native TS support (`--experimental-strip-types`) instead.
- Prisma client needed regeneration (`prisma generate`) after schema change before `upsert` on `description` worked.

### Completion Notes List

- Added `@unique` to `Task.description` in schema.prisma.
- Created migration `20260409000000_add_description_unique` and applied via `prisma migrate deploy`.
- Created `prisma/seed.ts` using `@prisma/adapter-pg` + upsert on `description` for idempotency.
- Wired `seed` script and `prisma.seed` config into `apps/backend/package.json` using Node 24 native TS (`--experimental-strip-types`).
- Verified seed runs cleanly twice with no duplicates. All 52 unit tests pass (0 regressions).

### File List

- apps/backend/prisma/schema.prisma
- apps/backend/prisma/migrations/20260409000000_add_description_unique/migration.sql
- apps/backend/prisma/seed.ts
- apps/backend/package.json

### Change Log

- 2026-04-09: Implemented Story 8.1 — seed script with 3 example tasks, @unique migration, package.json wiring.
