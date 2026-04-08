---
story_id: "6.4"
story_key: "6-4-bruno-api-tests-cli"
epic: 6
status: done
created: 2026-04-08
---

# Story 6.4: Bruno API Tests & CLI Configuration

Status: done

## Story

As a developer,
I want a Bruno API test collection for all main task API paths that runs via CLI, in Bruno Desktop, and in CI pipelines,
so that backend contract correctness is continuously validated at the API level.

## Acceptance Criteria

1. `apps/backend/bruno/bruno.json` exists and is valid — the collection loads in Bruno Desktop without errors.
2. `apps/backend/bruno/environments/local.bru` defines `baseUrl = http://localhost:3000` for local runs.
3. `apps/backend/bruno/environments/ci.bru` defines `baseUrl = http://localhost:3000` for CI runs.
4. Six ordered test files exist under `apps/backend/bruno/tasks/` covering the full task lifecycle:
   - `01-list-tasks.bru` — GET /api/tasks → 200, array response
   - `02-create-task.bru` — POST /api/tasks → 201, captures `taskId` variable for subsequent requests
   - `03-mark-task-complete.bru` — PATCH /api/tasks/{{taskId}} with `{ completed: true }` → 200, task is completed
   - `04-undo-task-complete.bru` — PATCH /api/tasks/{{taskId}} with `{ completed: false }` → 200, task is active again
   - `05-delete-task.bru` — DELETE /api/tasks/{{taskId}} → 200
   - `06-verify-task-deleted.bru` — GET /api/tasks/{{taskId}} → 404 (confirms task is gone after delete)
5. `@usebruno/cli` is installed as a devDependency in `apps/backend/package.json`.
6. `apps/backend/package.json` script `test:feature` runs: `bru run tasks --env local --reporter junit` (replaces the current placeholder echo).
7. Running `pnpm run test:feature` from `apps/backend/` with a live backend executes all 6 requests and reports results.
8. A CI environment script (`bru run tasks --env ci`) works in GitHub Actions with the backend running on `localhost:3000`.
9. All 6 `.bru` files open and run correctly in Bruno Desktop app (macOS/Windows).
10. Existing `.bru` files from Story 6.1 (`get-tasks.bru`, `create-task.bru`, `update-task.bru`, `delete-task.bru`) are replaced by the new sequenced files — no duplicate requests remain.

## Tasks / Subtasks

- [x] Task 1: Create `bruno.json` collection config (AC: #1)
  - [x] Create `apps/backend/bruno/bruno.json` with collection metadata (name, version, ignore)
  - [x] Verify Bruno Desktop opens the collection without errors

- [x] Task 2: Create environment files (AC: #2, #3)
  - [x] Create `apps/backend/bruno/environments/local.bru` with `baseUrl` variable
  - [x] Create `apps/backend/bruno/environments/ci.bru` with `baseUrl` variable
  - [x] Both environments set `baseUrl = http://localhost:3000`

- [x] Task 3: Remove old `.bru` files from Story 6.1 (AC: #10)
  - [x] Delete `apps/backend/bruno/tasks/get-tasks.bru`
  - [x] Delete `apps/backend/bruno/tasks/create-task.bru`
  - [x] Delete `apps/backend/bruno/tasks/update-task.bru`
  - [x] Delete `apps/backend/bruno/tasks/delete-task.bru`

- [x] Task 4: Create sequenced test files (AC: #4)
  - [x] `01-list-tasks.bru` — GET, status 200, array assertion
  - [x] `02-create-task.bru` — POST, status 201, capture `taskId` via `bru.setVar("taskId", res.body.id)`
  - [x] `03-mark-task-complete.bru` — PATCH `{{taskId}}`, `{ completed: true }`, status 200, assert `completed === true`
  - [x] `04-undo-task-complete.bru` — PATCH `{{taskId}}`, `{ completed: false }`, status 200, assert `completed === false`
  - [x] `05-delete-task.bru` — DELETE `{{taskId}}`, status 200
  - [x] `06-verify-task-deleted.bru` — GET `{{taskId}}`, status 404

- [x] Task 5: Install Bruno CLI and update scripts (AC: #5, #6)
  - [x] Run `pnpm add -D @usebruno/cli --filter @todoapp/backend`
  - [x] Update `test:feature` script: `bru run tasks --env local --reporter junit`
  - [x] Verify `pnpm run test:feature` runs from `apps/backend/` with live backend

- [x] Task 6: CI pipeline integration (AC: #8)
  - [x] Verify `.github/workflows/test.yml` feature-test job calls `pnpm run test:feature` (or add it)
  - [x] Ensure backend is started before `test:feature` runs in CI job
  - [x] Confirm `ci` environment is used in CI: `bru run tasks --env ci`

## Dev Notes

### Current State of Bruno Files

Story 6.1 created 4 basic `.bru` files in `apps/backend/bruno/tasks/`:
- `get-tasks.bru` — minimal, no variable capture
- `create-task.bru` — hardcoded body, no variable export
- `update-task.bru` — hardcoded ID `1`, not chained
- `delete-task.bru` — hardcoded ID `1`, minimal tests

**Problems with existing files:**
- No `bruno.json` → collection cannot be opened via CLI or Bruno Desktop
- No environment files → `baseUrl` is hardcoded in every request
- No variable chaining → tests are not sequential/dependent
- `update-task.bru` and `delete-task.bru` use hardcoded ID `1`, which fails if no task with ID 1 exists

All 4 old files must be **deleted** and replaced with the 6 new sequenced files.

### Bruno Collection Structure

```
apps/backend/bruno/
├── bruno.json                    # Collection config (MUST CREATE)
├── environments/
│   ├── local.bru                 # Local dev: localhost:3000
│   └── ci.bru                    # CI: localhost:3000
└── tasks/
    ├── 01-list-tasks.bru
    ├── 02-create-task.bru
    ├── 03-mark-task-complete.bru
    ├── 04-undo-task-complete.bru
    ├── 05-delete-task.bru
    └── 06-verify-task-deleted.bru
```

### Exact File Contents

#### `apps/backend/bruno/bruno.json`

```json
{
  "version": "1",
  "name": "todoapp-backend",
  "type": "collection",
  "ignore": [
    "node_modules",
    ".git"
  ]
}
```

#### `apps/backend/bruno/environments/local.bru`

```bru
vars {
  baseUrl: http://localhost:3000
}
```

#### `apps/backend/bruno/environments/ci.bru`

```bru
vars {
  baseUrl: http://localhost:3000
}
```

#### `apps/backend/bruno/tasks/01-list-tasks.bru`

```bru
meta {
  name: List Tasks
  type: http
  seq: 1
}

get {
  url: {{baseUrl}}/api/tasks
}

tests {
  test("Status is 200", function() {
    expect(res.getStatus()).to.equal(200);
  });

  test("Response is an array", function() {
    const body = res.getBody();
    expect(Array.isArray(body)).to.be.true;
  });
}
```

#### `apps/backend/bruno/tasks/02-create-task.bru`

```bru
meta {
  name: Create Task
  type: http
  seq: 2
}

post {
  url: {{baseUrl}}/api/tasks
}

body:json {
  {
    "description": "Bruno test task"
  }
}

script:post-response {
  const body = res.getBody();
  bru.setVar("taskId", body.id);
}

tests {
  test("Status is 201", function() {
    expect(res.getStatus()).to.equal(201);
  });

  test("Response has id", function() {
    const body = res.getBody();
    expect(body).to.have.property("id");
    expect(body.id).to.be.greaterThan(0);
  });

  test("Description matches", function() {
    const body = res.getBody();
    expect(body.description).to.equal("Bruno test task");
  });

  test("Task starts incomplete", function() {
    const body = res.getBody();
    expect(body.completed).to.equal(false);
  });

  test("Has timestamps", function() {
    const body = res.getBody();
    expect(body).to.have.property("createdAt");
    expect(body).to.have.property("updatedAt");
  });
}
```

#### `apps/backend/bruno/tasks/03-mark-task-complete.bru`

```bru
meta {
  name: Mark Task Complete
  type: http
  seq: 3
}

patch {
  url: {{baseUrl}}/api/tasks/{{taskId}}
}

body:json {
  {
    "completed": true
  }
}

tests {
  test("Status is 200", function() {
    expect(res.getStatus()).to.equal(200);
  });

  test("Task is marked complete", function() {
    const body = res.getBody();
    expect(body.completed).to.equal(true);
  });

  test("Task id matches", function() {
    const body = res.getBody();
    expect(body.id).to.equal(bru.getVar("taskId"));
  });
}
```

#### `apps/backend/bruno/tasks/04-undo-task-complete.bru`

```bru
meta {
  name: Undo Task Complete
  type: http
  seq: 4
}

patch {
  url: {{baseUrl}}/api/tasks/{{taskId}}
}

body:json {
  {
    "completed": false
  }
}

tests {
  test("Status is 200", function() {
    expect(res.getStatus()).to.equal(200);
  });

  test("Task is marked incomplete", function() {
    const body = res.getBody();
    expect(body.completed).to.equal(false);
  });

  test("Task id matches", function() {
    const body = res.getBody();
    expect(body.id).to.equal(bru.getVar("taskId"));
  });
}
```

#### `apps/backend/bruno/tasks/05-delete-task.bru`

```bru
meta {
  name: Delete Task
  type: http
  seq: 5
}

delete {
  url: {{baseUrl}}/api/tasks/{{taskId}}
}

tests {
  test("Status is 200", function() {
    expect(res.getStatus()).to.equal(200);
  });

  test("Response contains deleted task id", function() {
    const body = res.getBody();
    expect(body).to.have.property("id");
    expect(body.id).to.equal(bru.getVar("taskId"));
  });
}
```

#### `apps/backend/bruno/tasks/06-verify-task-deleted.bru`

```bru
meta {
  name: Verify Task Deleted
  type: http
  seq: 6
}

get {
  url: {{baseUrl}}/api/tasks/{{taskId}}
}

tests {
  test("Status is 404 — task no longer exists", function() {
    expect(res.getStatus()).to.equal(404);
  });
}
```

### Bruno CLI Commands

Install:
```bash
pnpm add -D @usebruno/cli --filter @todoapp/backend
```

Run locally (from `apps/backend/`):
```bash
npx bru run tasks --env local
# or after install:
pnpm exec bru run tasks --env local
```

With JUnit reporter for CI:
```bash
pnpm exec bru run tasks --env ci --reporter junit
```

The `test:feature` script in `apps/backend/package.json`:
```json
"test:feature": "bru run tasks --env local --reporter junit"
```

### Variable Chaining in Bruno

Bruno variables are scoped to the collection run. Variables set with `bru.setVar()` in a `script:post-response` block persist for all subsequent requests in the same run.

- `02-create-task.bru` captures `taskId` via `bru.setVar("taskId", body.id)`
- Requests 03–06 reference it as `{{taskId}}` in the URL
- This works both in Bruno Desktop (run collection) and CLI (`bru run`)

**Important:** In Bruno Desktop, running requests individually (not as a full collection run) won't have `taskId` set. Use "Run Collection" to execute the full lifecycle flow.

### "Undo Task Delete" — API vs Frontend Concern

The frontend implements "undo delete" as a delayed API call: when the user clicks "Undo" in the toast, the DELETE request is **cancelled before it's sent** (or reverted if already sent). This is 100% frontend/TanStack Query logic.

At the API level:
- There is **no** "undo delete" endpoint — deleted tasks are permanently gone
- `06-verify-task-deleted.bru` confirms the deletion is permanent (404 after DELETE)
- The "undo" scenario is implicitly verified by the fact that tasks persist until DELETE is called

If you need to test the "undo pressed before DELETE fires" scenario, simply don't run `05-delete-task.bru` and verify the task still exists via `01-list-tasks.bru`. This is covered by the standard GET /api/tasks contract.

### `GET /api/tasks/:id` Endpoint Note

`06-verify-task-deleted.bru` calls `GET /api/tasks/:id`. Confirm this endpoint exists in the backend. If Story 6.1 only implemented `GET /api/tasks` (list all) and not `GET /api/tasks/:id` (single task), you have two options:
1. Add `GET /api/tasks/:id` endpoint in this story (simple addition to `apps/backend/src/routes/tasks/index.ts`)
2. Alternatively, replace `06-verify-task-deleted.bru` with a GET list and assert the task ID is absent from the array

**Option 1 is preferred** — it aligns with REST conventions and makes the test unambiguous. The endpoint: look up task by ID, return 200 + task or 404 + error.

### Backend Must Be Running for Bruno Tests

Bruno tests hit a live HTTP server — they are **not** unit tests. The backend must be running before `pnpm run test:feature` executes:

```bash
# Terminal 1
cd apps/backend && pnpm run dev

# Terminal 2
cd apps/backend && pnpm run test:feature
```

In CI, the GitHub Actions job must start the backend before running Bruno:
```yaml
- name: Start backend
  run: pnpm --filter @todoapp/backend run start &
  
- name: Wait for backend
  run: sleep 3  # or use wait-on

- name: Run feature tests
  run: pnpm --filter @todoapp/backend run test:feature
```

### Bruno Desktop Compatibility

The collection is fully compatible with Bruno Desktop (GUI app). To open:
1. Open Bruno Desktop
2. "Open Collection" → select `apps/backend/bruno/`
3. Select environment: `local`
4. Run individual requests or "Run Collection" for the full flow

### Existing Test State — Do NOT Break

- `pnpm run test:unit` uses `node:test` and is completely independent of Bruno — no changes needed there.
- The in-memory `taskService.ts` is still in use (Story 6.3 will replace it with Prisma). Bruno tests run against whatever the live server returns — they work with both in-memory and Prisma backends.

### References

- Story 6.1 completion: `_bmad-output/implementation-artifacts/STORY-6-1-REST-API-ENDPOINTS.md` — existing `.bru` files created here
- Story 6.2: `_bmad-output/implementation-artifacts/6-2-configure-prisma-orm-database-schema.md` — Prisma setup (no Bruno impact)
- Architecture: `_bmad-output/planning-artifacts/architecture.md` → "API Design Pattern" section — response format
- Existing Bruno files: `apps/backend/bruno/tasks/` — 4 files to be replaced
- Bruno CLI docs: https://docs.usebruno.com/bru-cli/overview
- Bruno `.bru` format: https://docs.usebruno.com/bru-lang/overview

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- No blocking issues encountered during implementation.
- Added `GET /api/tasks/:id` endpoint (Dev Notes Option 1) to support `06-verify-task-deleted.bru` 404 assertion.
- Modified `DELETE /api/tasks/:id` to return the deleted task object, enabling `05-delete-task.bru` body assertions.
- CI workflow updated to use `bru run tasks --env ci` directly instead of `pnpm run test:feature` to use the ci environment.

### Completion Notes List

- Created `bruno.json` collection config with standard metadata
- Created `local.bru` and `ci.bru` environment files, both with `baseUrl: http://localhost:3000`
- Deleted 4 old Story 6.1 `.bru` files (get-tasks, create-task, update-task, delete-task)
- Created 6 sequenced `.bru` test files covering full task lifecycle with variable chaining via `taskId`
- Installed `@usebruno/cli@^3.2.2` as devDependency
- Updated `test:feature` script to run Bruno CLI
- Updated `.github/workflows/test.yml` feature-tests job to use `--env ci`
- Added `taskService.getById()` method and `GET /:id` route for single-task lookup
- Modified `taskService.delete()` to return the deleted `Task` object
- Added 3 unit tests for `GET /api/tasks/:id` (200, 404, 400)
- Updated existing DELETE unit test to verify response body
- All 22 unit tests pass, type-check clean, Biome linting clean

### File List

- `apps/backend/bruno/bruno.json` — NEW: collection config
- `apps/backend/bruno/environments/local.bru` — NEW: local environment
- `apps/backend/bruno/environments/ci.bru` — NEW: CI environment
- `apps/backend/bruno/tasks/01-list-tasks.bru` — NEW: GET /api/tasks test
- `apps/backend/bruno/tasks/02-create-task.bru` — NEW: POST /api/tasks test with taskId capture
- `apps/backend/bruno/tasks/03-mark-task-complete.bru` — NEW: PATCH complete test
- `apps/backend/bruno/tasks/04-undo-task-complete.bru` — NEW: PATCH undo test
- `apps/backend/bruno/tasks/05-delete-task.bru` — NEW: DELETE test
- `apps/backend/bruno/tasks/06-verify-task-deleted.bru` — NEW: GET /:id 404 verification
- `apps/backend/bruno/tasks/get-tasks.bru` — DELETED
- `apps/backend/bruno/tasks/create-task.bru` — DELETED
- `apps/backend/bruno/tasks/update-task.bru` — DELETED
- `apps/backend/bruno/tasks/delete-task.bru` — DELETED
- `apps/backend/package.json` — MODIFIED: added @usebruno/cli, updated test:feature script
- `apps/backend/src/services/taskService.ts` — MODIFIED: added getById(), delete() now returns Task
- `apps/backend/src/routes/tasks/index.ts` — MODIFIED: added GET /:id route, DELETE returns task body
- `apps/backend/src/routes/tasks/index.test.ts` — MODIFIED: added GET /:id tests, updated DELETE test
- `.github/workflows/test.yml` — MODIFIED: feature-tests uses bru with --env ci
- `pnpm-lock.yaml` — MODIFIED: @usebruno/cli dependency added

### Change Log

- 2026-04-08: Story 6.4 implemented — Bruno API test collection with 6 sequenced .bru files, CLI integration, CI pipeline config, and supporting backend changes (GET /:id endpoint, DELETE response body)
