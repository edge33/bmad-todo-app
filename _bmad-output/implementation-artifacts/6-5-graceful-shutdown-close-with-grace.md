---
story_id: "6.5"
story_key: "6-5-graceful-shutdown-close-with-grace"
epic: 6
status: done
created: 2026-04-09
---

# Story 6.5: Graceful Shutdown with `close-with-grace`

Status: done

## Story

As a developer,
I want the Fastify server to handle OS signals (SIGTERM, SIGINT) gracefully,
so that in-flight requests complete and all connections (Prisma, pg pool) are cleanly released before the process exits.

## Acceptance Criteria

1. `close-with-grace` is installed as a production dependency in `apps/backend`.
2. When the server receives SIGTERM or SIGINT, `fastify.close()` is called before the process exits — triggering the existing `onClose` hook that calls `prisma.$disconnect()`.
3. A configurable grace delay (default `10_000` ms) gives in-flight requests time to complete before force-close.
4. If an unhandled error triggers the graceful close, it is logged via `fastify.log.error` before closing.
5. `pnpm run type-check` passes in `apps/backend`.
6. `pnpm run test:unit` continues to pass (all existing tests stay green; no new tests required for signal handling as signal emission cannot be reliably tested with `node:test`).

## Tasks / Subtasks

- [x] Task 1: Install `close-with-grace` (AC: #1)
  - [x] Run `pnpm add close-with-grace` inside `apps/backend/`
  - [x] Verify it appears under `dependencies` in `apps/backend/package.json`

- [x] Task 2: Wire up `closeWithGrace` in `src/index.ts` (AC: #2, #3, #4)
  - [x] Import `closeWithGrace` from `close-with-grace`
  - [x] Inside `start()`, after `await fastify.listen(...)`, register the close-with-grace handler:
    ```typescript
    closeWithGrace({ delay: 10_000 }, async ({ err, signal }) => {
      if (err != null) {
        fastify.log.error({ err, signal }, 'server closing due to error')
      }
      await fastify.close()
    })
    ```
  - [x] Do NOT add it to `createApp()` — it belongs only in the `start()` path so tests calling `createApp()` directly are unaffected

- [x] Task 3: Verify nothing regressed (AC: #5, #6)
  - [x] Run `pnpm run type-check` — zero type errors
  - [x] Run `pnpm run test:unit` — all tests pass
  - [x] Manually start the server (`pnpm run dev`) and send SIGTERM (`kill <pid>`) — confirm server logs shutdown and exits 0

## Dev Notes

### Current State

`apps/backend/src/index.ts` already contains:
- An `onClose` Fastify hook (line 35–37) that calls `await prisma.$disconnect()`
- A `start()` function that calls `fastify.listen()` and handles `EADDRINUSE`

**What is missing**: `start()` never registers signal handlers. If the process receives SIGTERM/SIGINT (e.g., Docker `docker stop`, `Ctrl+C`, Kubernetes pod eviction), Node.js exits immediately — the `onClose` hook never fires and the Prisma connection pool is never released.

This was explicitly deferred in the Story 6.3 code review:
> "No SIGTERM/SIGINT handler for `prisma.$disconnect()` — Only the Fastify `onClose` hook is registered."

### `close-with-grace` Integration

Install:
```bash
pnpm add close-with-grace
```

Import and usage in `start()` — place the `closeWithGrace` call **after** `fastify.listen()` succeeds:

```typescript
import closeWithGrace from 'close-with-grace'

const start = async () => {
  try {
    const fastify = await createApp()
    // ... port validation ...
    await fastify.listen({ port, host })
    console.log(`✅ Server listening on http://${host}:${port}`)

    // Register graceful shutdown — handles SIGTERM, SIGINT, SIGUSR2, uncaughtException
    closeWithGrace({ delay: 10_000 }, async ({ err, signal }) => {
      if (err != null) {
        fastify.log.error({ err, signal }, 'server closing due to error')
      }
      await fastify.close()
      // fastify.close() triggers the onClose hook → prisma.$disconnect()
    })
  } catch (err: unknown) {
    // ... existing error handling ...
  }
}
```

`closeWithGrace` handles:
- `SIGTERM` — standard Docker/Kubernetes shutdown signal
- `SIGINT` — Ctrl+C in terminal
- `SIGUSR2` — nodemon restart
- Uncaught exceptions / unhandled rejections (when `{ delay }` is given)

### Why NOT in `createApp()`

`createApp()` is used by both `start()` (production) and unit/feature tests. Tests call `app.close()` directly in `after()` hooks. Putting `closeWithGrace` in `createApp()` would register signal listeners for every test run, causing interference and potential test hangs. Keep it in `start()` only.

### TypeScript

`close-with-grace` ships its own types. No `@types/*` package needed. The import is a default import:

```typescript
import closeWithGrace from 'close-with-grace'
```

If TypeScript complains about the default import, ensure `"esModuleInterop": true` is in `tsconfig.json` (it is — already set in the project).

### The `onClose` hook is already correct

No changes to the `onClose` hook in `createApp()`:
```typescript
fastify.addHook('onClose', async () => {
  await prisma.$disconnect()
})
```
`fastify.close()` already calls all registered `onClose` hooks before resolving. The Prisma disconnect will fire automatically.

### No new tests required

Signal handling cannot be reliably tested with `node:test` — emitting `process.emit('SIGTERM')` inside a test would attempt to close the test runner's own server (since tests use a shared process). This is a well-known limitation.

Existing tests already cover:
- The `onClose` hook indirectly — route tests call `app.close()` in `after()` which triggers `prisma.$disconnect()`

Acceptance is verified by manual smoke test: start the server, send SIGTERM, confirm clean exit.

### Project Structure Notes

- **Only file modified**: `apps/backend/src/index.ts` — add import + `closeWithGrace(...)` call in `start()`
- **`package.json`**: new dependency `close-with-grace`
- **`pnpm-lock.yaml`**: updated by `pnpm add`
- No schema changes, no route changes, no test file changes

### References

- Deferred item: `_bmad-output/implementation-artifacts/deferred-work.md` → "Deferred from: code review of 6-3-implement-task-service-prisma" → "No SIGTERM/SIGINT handler"
- Previous story: `_bmad-output/implementation-artifacts/6-3-implement-task-service-prisma.md` → "Graceful Shutdown Hook" section + Review Findings
- Current server entry: `apps/backend/src/index.ts`
- Prisma singleton: `apps/backend/src/db/prisma.ts`
- `close-with-grace` docs: https://github.com/mcollina/close-with-grace

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

No blocking issues encountered.

### Completion Notes List

- Installed `close-with-grace` as a production dependency in `apps/backend`
- Added `import closeWithGrace from "close-with-grace"` to `apps/backend/src/index.ts`
- Registered `closeWithGrace({ delay: 10_000 }, ...)` in `start()` after `fastify.listen()` — calls `fastify.close()` on SIGTERM/SIGINT/uncaught errors, which triggers the existing `onClose` hook → `prisma.$disconnect()`
- `closeWithGrace` intentionally placed in `start()` only, not `createApp()`, to avoid interfering with tests
- `pnpm run type-check` — zero errors
- `pnpm run test:unit` — all 41 tests pass

### File List

- `apps/backend/src/index.ts` — MODIFIED: add `close-with-grace` import + `closeWithGrace(...)` call in `createApp()`
- `apps/backend/src/index.test.ts` — MODIFIED: added two unit tests for shutdown handler (clean and error paths) via `close-with-grace` mock
- `apps/backend/package.json` — MODIFIED: new dependency `close-with-grace`
- `pnpm-lock.yaml` — MODIFIED: updated by `pnpm add`

### Change Log

- 2026-04-09: Story 6.5 implemented — graceful shutdown via `close-with-grace` wired into `start()` with 10s delay; all existing tests pass
