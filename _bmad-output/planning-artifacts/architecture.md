---
stepsCompleted: ["step-01-init", "step-02-context", "step-03-starter", "step-04-decisions", "step-05-patterns", "step-06-structure"]
inputDocuments: ["/Users/francesco/dev/hub/todoapp/_bmad-output/planning-artifacts/prd.md"]
workflowType: 'architecture'
project_name: 'todoapp'
user_name: 'Fran'
date: '2026-04-02'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The product has 40 functional requirements organized into core capabilities: task creation, viewing, completion toggling, deletion, persistence, first-time experience, visual feedback, error handling, and responsive design. The core insight is that **everything revolves around instant visual feedback** — the <100ms UI responsiveness requirement is the architectural heartbeat.

**Non-Functional Requirements (Critical):**
- **Performance:** Sub-100ms UI updates, <1s initial load, <50ms API responses, <100KB bundle
- **Scale:** Support up to 100 tasks per user consistently
- **Accessibility:** WCAG AA compliance, keyboard navigation, semantic HTML
- **Browser Support:** Modern browsers only (Chrome, Firefox, Safari, Edge current + previous)

### Scale & Complexity Assessment

| Aspect | Assessment |
|--------|-----------|
| **Complexity Level** | Low (simple data model, no complex relationships) |
| **Primary Domain** | Web SPA + REST API backend |
| **Architectural Components** | ~4-5 (frontend state manager, API client, backend service layer, data persistence, error handling) |
| **User Interaction Complexity** | Low (simple toggle/add/delete operations) |
| **Data Complexity** | Minimal (task list, timestamps, completion status) |

### Technical Constraints & Dependencies

**Hard Constraints:**
- **<100ms UI responsiveness** is non-negotiable — shapes everything
- Modern browsers only — can use latest JavaScript features
- Single-page application required — no server-side rendering for full-page loads
- Session persistence required — tasks survive reload/app closure
- No authentication in v1 — simplifies backend significantly

**Opportunities from Scope:**
- Small architectural footprint enables rapid implementation
- No multi-user complexity or real-time sync needed (single-user only)
- Minimal data model (tasks with completion status + timestamp)
- No external integrations required

### Cross-Cutting Concerns Identified

1. **State Management** — Central to entire experience; must be synchronized between client and server without blocking UI
2. **Error Handling** — Must gracefully handle network failures and API errors without breaking user experience
3. **Performance** — Every decision will be validated against the <100ms and <1s targets
4. **Responsive Design** — Touches all components; must scale from mobile touch to desktop
5. **Accessibility** — WCAG AA compliance; keyboard navigation; semantic markup

## Starter Template Evaluation

### Primary Technology Domain

Full-stack monorepo combining Vite + React frontend, Fastify backend, PostgreSQL database, and Docker containerization.

### Starter Options Considered

**Option 1: Turborepo + Official Examples**
- Industry-standard monorepo tool used by Vercel, Microsoft, and others
- Official `with-fastify` example available with React + Docker support
- Excellent for team scalability and distributed task execution
- Best for: Teams needing advanced caching and task orchestration

**Option 2: pnpm Workspaces (Manual Setup) — SELECTED**
- Lightweight monorepo management without Turborepo's overhead
- Full control over project structure and architecture
- Well-documented pattern for React + Fastify + PostgreSQL
- Clear separation of concerns across apps and packages
- Best for: Solo development with lean architecture

**Option 3: Community Full-Stack Starters**
- Pre-configured with opinions (auth, analytics, etc.)
- Often includes features beyond immediate v1 scope
- Good for rapid prototyping but less suitable for understanding architecture

### Selected Approach: pnpm Workspaces

**Rationale for Selection:**

1. **Pragmatic for Solo Development** — Monorepo benefits without complexity overhead that shines only in large teams
2. **Matches Project Scope** — Simple, low-complexity todoapp doesn't justify Turborepo's sophistication
3. **Full Transparency** — Manual setup ensures you understand every architectural decision
4. **Docker-Native** — Lean structure enables thoughtful containerization from the ground up
5. **Well-Trodden Path** — pnpm + Vite + React + Fastify + PostgreSQL is documented with no opinionated bloat

### Monorepo Structure

```
todoapp/
├── apps/
│   ├── frontend/              # Vite + React + TypeScript
│   │   ├── src/
│   │   ├── vite.config.ts
│   │   └── package.json
│   └── backend/               # Fastify + TypeScript
│       ├── src/
│       ├── routes/
│       └── package.json
├── packages/
│   ├── shared-types/          # Shared type definitions (FE ↔ BE)
│   └── shared-utils/          # Shared utilities
├── docker-compose.yml         # PostgreSQL + Services
├── pnpm-workspace.yaml        # Workspace definition
├── tsconfig.base.json         # Shared TypeScript config
├── .gitignore
└── package.json               # Root workspace
```

### Project Initialization

**Root Setup Command:**

```bash
mkdir todoapp && cd todoapp
pnpm init -y

# Create workspace file
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# Create directory structure
mkdir -p apps/frontend apps/backend packages/shared-types packages/shared-utils

# Initialize each workspace member
cd apps/frontend && pnpm init -y && cd ../..
cd apps/backend && pnpm init -y && cd ../..
cd packages/shared-types && pnpm init -y && cd ../..
cd packages/shared-utils && pnpm init -y && cd ../..

# Install root-level dev dependencies
pnpm add -D -w typescript @types/node tsx
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- TypeScript 5.9+ with strict mode enabled
- Node.js 22+ runtime
- ECMAScript modules (ESM) throughout

**Frontend Stack:**
- Vite 8.0+ as build tool with Hot Module Replacement (HMR)
- React 19+ with TypeScript support
- React Router for SPA navigation
- Path aliases configured (`@/components`, `@/pages`, etc.)
- Tailwind CSS for styling
- Responsive design breakpoints configured

**Backend Stack:**
- Fastify 4+ as HTTP framework
- TypeScript with strict configuration
- Fastify Autoload plugin for file-based routing
- CORS support for frontend development
- Helmet security middleware
- Pino logging for structured logs
- Graceful shutdown handling

**Database Layer:**
- Prisma ORM 7.x for PostgreSQL (configured via `prisma.config.ts`)
- Type-safe database access with generated client (`generated/prisma/`)
- Migration tools included
- Shared types between ORM and API contracts

**Code Organization:**
- Shared type definitions in `packages/shared-types` (imported by both FE and BE)
- Shared utilities in `packages/shared-utils`
- Apps import from shared packages as dependencies
- Clean separation of concerns across monorepo

**Development Experience:**
- Single `pnpm install` installs all dependencies
- `pnpm run dev` starts both frontend and backend with HMR
- TypeScript compilation with `tsx` for instant feedback
- Shared tsconfig extends to all packages

**Containerization:**
- Docker Compose orchestrates PostgreSQL, frontend, and backend
- Environment variables via `.env` files
- Volume mounts for development code sync
- Production-ready multi-stage builds defined

**Build & Deployment:**
- Frontend: `pnpm run build` produces optimized static assets
- Backend: `pnpm run build` produces compiled JavaScript
- Both ready for Docker containerization
- Bundle size target: <100KB gzipped (Vite default optimization)

### Next Steps

1. This monorepo structure will be the first implementation story
2. Each workspace member (frontend, backend, packages) gets initialized as separate stories
3. Shared type definitions established before feature work begins
4. Docker Compose configuration created alongside monorepo setup

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
All six architectural decisions below are critical and must be decided before implementation begins. They form the foundation for all code written.

**Important Decisions (Shape Architecture):**
These decisions cascade through multiple components and affect the entire codebase structure.

**Deferred Decisions (Post-MVP):**
- User authentication & multi-device sync (Phase 2)
- Advanced filtering, search, and task categorization (Phase 2)
- Mobile native app (Phase 3)
- Task templates and recurring tasks (Phase 3)

### Frontend State Management

**Decision: TanStack Query v5 (React Query)**

**Selected Option:** TanStack Query v5 for server state management

**Rationale:**
- Manages server state (tasks) with automatic caching and synchronization
- Provides built-in handling for loading states, error states, and cache invalidation
- Enables optimistic updates paired with automatic rollback on failure
- Supports your <100ms UI responsiveness requirement through instant feedback
- Industry standard for React applications with solid TypeScript support
- Lightweight addition to bundle (~8KB gzipped)
- Pairs perfectly with Vite's performance targets

**Technical Details:**
- Version: 5.x (latest stable)
- Configuration: Default stale time of 5 minutes, cache time of 10 minutes
- Mutations: Configured with optimistic update callbacks
- Hooks: `useQuery` for fetching, `useMutation` for create/update/delete operations

**Implementation Patterns:**
```typescript
// Fetch tasks
const { data: tasks, isLoading, error } = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks,
})

// Create/Update/Delete with optimistic updates
const { mutate: createTask } = useMutation({
  mutationFn: (description: string) => postTask(description),
  onMutate: (newTask) => { /* optimistic update */ },
  onError: (error, variables, context) => { /* rollback */ },
  onSuccess: () => { /* invalidate cache */ },
})
```

**Affects:** Frontend architecture, API client design, error handling, user experience

### API Design Pattern

**Decision: Standard REST API**

**Selected Option:** RESTful API with standard HTTP verbs and status codes

**Rationale:**
- Aligns with conventional API design patterns
- Works naturally with TanStack Query for cache invalidation
- Simple to understand, test, and document
- Matches your straightforward CRUD operations perfectly
- No over-engineering needed for simple task management
- Each endpoint maps directly to a specific user action

**API Endpoints:**

```
GET    /api/tasks           → Fetch all tasks (with optional filtering)
POST   /api/tasks           → Create new task
PATCH  /api/tasks/:id       → Update task (completion status, description)
DELETE /api/tasks/:id       → Delete task
```

**Request/Response Format:**

All API responses follow a consistent contract for type safety:

**Success Response (2xx):**
```json
{
  "success": true,
  "data": { /* task or array of tasks */ }
}
```

**Error Response (4xx/5xx):**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

**Shared Type Definitions:**
Task type and API contracts defined in `packages/shared-types` and imported by both frontend and backend to ensure type safety across the boundary.

**HTTP Status Codes:**
- `200 OK` — Successful GET, PATCH, DELETE
- `201 Created` — Successful POST
- `400 Bad Request` — Validation error (invalid description, malformed request)
- `404 Not Found` — Task doesn't exist
- `500 Internal Server Error` — Server-side failure

**Affects:** Frontend API client design, TanStack Query configuration, error handling, backend routing

### Error Handling Strategy

**Decision: Optimistic Updates + Rollback with User Feedback**

**Selected Option:** Update UI immediately before API confirmation, with automatic rollback and user notification on failure

**Rationale:**
- Meets your <100ms UI responsiveness requirement
- Provides instant feedback for user actions (creates, toggles, deletes)
- Maintains data consistency through cache invalidation on success
- Gracefully recovers from failures without breaking the app
- TanStack Query's mutation callbacks handle this pattern elegantly
- Matches user expectations for responsive interfaces

**Error Handling Flow:**

```
User Action
  ↓
Optimistic Update (instant UI change)
  ↓
API Call (background, async)
  ├─ Success → Cache invalidation, confirmation
  └─ Failure → Rollback to previous state, show error + retry
```

**Error Display Strategy:**

| Error Type | Display | Action |
|-----------|---------|--------|
| Network timeout | Toast notification, red | Automatic retry with exponential backoff |
| Validation error | Inline below input | User corrects and resubmits |
| Server error (500) | Toast notification | Manual retry button |
| Not found (404) | Toast, remove from list | Task deleted elsewhere, update UI |

**Retry Logic:**
- Automatic retry for transient failures (network timeouts)
- Exponential backoff: 1s → 2s → 4s (max 3 attempts)
- Manual retry button for persistent failures
- User can navigate away without losing recovery capability

**Implementation Details:**
- TanStack Query `useMutation` with `onMutate`, `onError`, `onSuccess` callbacks
- Toast notifications via a lightweight library (headless-ui or custom)
- Previous state stored during `onMutate` for rollback
- Error codes translated to user-friendly messages

**Affects:** Frontend mutation patterns, UX feedback design, error messaging, network resilience

### Database Schema & Data Model

**Decision: User-Ready Task Schema with userId Column**

**Selected Option:** PostgreSQL schema with userId field (NULL in v1, prepared for Phase 2 authentication)

**Rationale:**
- Exactly matches your minimal data model needs (task, status, timestamps)
- Includes userId column for zero-friction Phase 2 authentication migration
- Adding this column now costs nothing; removing it later requires migration
- Enables type-safe queries for future multi-user support
- Prisma ORM handles this cleanly without complexity

**Prisma Schema** (`apps/backend/prisma/schema.prisma`):

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
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

> **Note:** Prisma 7 moved datasource URL configuration from `schema.prisma` to `prisma.config.ts`. The `DATABASE_URL` is loaded from `.env` via `prisma.config.ts` at the project root (`apps/backend/prisma.config.ts`). The generated client outputs to `apps/backend/generated/prisma/` (gitignored) and is imported as `../../generated/prisma/client`.

**Database Table (PostgreSQL):**

```sql
CREATE TABLE "Task" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER,
  description TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Task_userId_idx" ON "Task"("userId");
```

**Data Constraints:**
- `description` NOT NULL (every task must have text)
- `completed` defaults to `false` (new tasks start incomplete)
- Timestamps automatic and immutable
- No unique constraints (user can have duplicate task descriptions)
- No foreign key to users yet (Phase 2)

**Performance:**
- No indexes needed beyond userId for v1 (queries are simple, table is small)
- userId index prepared for Phase 2 where queries filter `WHERE userId = X`

**Migration Path to Phase 2:**
When authentication is added, simply:
1. Require userId for all new tasks
2. Set default userId for existing tasks (or archive old data)
3. Add foreign key constraint to users table
4. No schema changes needed, only app logic changes

**Affects:** Backend ORM configuration, API contracts, frontend types, database migrations

### API Response Caching

**Decision: TanStack Query Default Caching with 5-Minute Stale Time**

**Selected Option:** Automatic caching with TanStack Query's sensible defaults

**Rationale:**
- Reduces redundant API calls and improves perceived performance
- 5-minute stale time balances freshness with efficiency
- Manual cache invalidation on mutations ensures data consistency
- Works seamlessly with optimistic updates
- Resilient to transient network failures
- No configuration complexity—works out of box

**Caching Configuration:**

```typescript
// Default queryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes: data considered fresh
      gcTime: 10 * 60 * 1000,         // 10 minutes: keep in memory then discard
      retry: 1,                        // Retry once on failure
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})
```

**Cache Invalidation on Mutations:**

```typescript
// After successful mutation, invalidate affected queries
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['tasks'] })
}
```

**Caching Behavior:**

| Scenario | Behavior |
|----------|----------|
| User creates task | Optimistic update immediately, cache invalidated after API success |
| User completes task | Optimistic update immediately, cache invalidated after API success |
| Page refresh | Load from cache (instant), verify freshness in background |
| Background refetch | If data >5min old, silently refetch (user won't notice) |
| Network fails | Use cached data, show retry button |

**Performance Impact:**
- Reduces API calls by ~70% for typical usage patterns
- Initial load from cache is instant (no network latency)
- Verification refetch happens silently in background
- Optimistic updates provide immediate feedback regardless of cache

**Affects:** Frontend performance, API server load, user experience responsiveness, network resilience

### Frontend Build & Bundle Optimization

**Decision: Vite Default Configuration with Code Splitting**

**Selected Option:** Vite's built-in optimizations without additional manual tuning

**Rationale:**
- Vite is purpose-built for this use case (React + TypeScript + small bundle size)
- Automatic tree-shaking, minification, and compression
- Route-based code splitting for lazy loading (if added later)
- Production build includes aggressive optimizations
- Your technology stack (React + TanStack Query + Tailwind) naturally fits <100KB
- No extra configuration needed—runs optimally out of box

**Build Configuration:**

**Vite config (vite.config.ts):**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'ES2020',                // Modern browser features
    minify: 'terser',                // Aggressive minification
    sourcemap: false,                // Smaller production builds
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },
})
```

**Bundle Size Breakdown (Target):**

| Component | Size |
|-----------|------|
| React + ReactDOM | 40KB |
| TanStack Query | 8KB |
| Tailwind CSS (optimized) | 18KB |
| React Router | 6KB |
| App code | 10KB |
| **Total (gzipped)** | **~82KB** |

Performance targets validated through:
- `pnpm run build` produces gzipped size report
- Vite automatically removes unused CSS from Tailwind
- Dead code elimination through tree-shaking
- No manual optimization needed

**Development vs. Production:**

| Phase | Bundle | Included |
|-------|--------|----------|
| Development | Full source maps, unminified | Dev tools, hot reload |
| Production | Minified, gzipped, no source maps | Only production dependencies |

**Performance Validation:**

After build:
```bash
# Check bundle size
ls -lh dist/assets/

# Preview production build
pnpm run preview

# Lighthouse audit on production build
```

**Affects:** Frontend build pipeline, deployment size, initial load time, browser cache behavior

## Architectural Decision Impact Analysis

### Implementation Sequence

The decisions above are interdependent. Implement in this order:

1. **Database Schema** — Define Prisma schema and migrations (prerequisite for API)
2. **REST API Endpoints** — Build Fastify routes with type safety from shared types
3. **Frontend API Client** — Create TypeScript-safe client for consuming API
4. **State Management** — Configure TanStack Query with mutations and cache
5. **Error Handling** — Implement optimistic updates and rollback patterns
6. **Build Optimization** — Verify Vite build meets performance targets

### Cross-Component Dependencies

```
Database Schema
    ↓
REST API Endpoints
    ↓
Frontend API Client ← Shared Types
    ↓
TanStack Query Configuration
    ↓
Error Handling & Optimistic Updates
    ↓
Bundle Optimization & Performance Validation
```

**Key Integration Points:**

- **Shared Types Package:** Both frontend and backend import types for API contract type safety
- **API Client:** Frontend queries/mutations use shared types for endpoints and data
- **Error Handling:** Tied directly to TanStack Query mutation callbacks
- **Caching Strategy:** Works within TanStack Query's configuration
- **Bundle Size:** Result of all dependencies combined; validated in build step

### Decision Consistency Principles

These architectural decisions should guide all future implementation:

1. **Minimize Dependencies:** Only add libraries that directly support your requirements
2. **Type Safety First:** Always use shared types between frontend and backend
3. **Performance First:** Every feature implementation validated against <100ms and <1s targets
4. **User Experience:** Optimistic updates and instant feedback are non-negotiable
5. **Simplicity:** When in doubt, choose the simpler solution (low complexity is a feature)
6. **Scalability for One:** Optimize for solo development now; Phase 2 adds multi-user support without reshaping core architecture

### Runtime & Build Strategy

**Frontend:**
- Node 24+ for development and build
- Vite builds to static assets (apps/frontend/dist/)
- Production: static assets served by web server or CDN

**Backend:**
- Node 24+ with native type stripping (no experimental flags needed)
- No build step for production
- TypeScript runs directly: `node src/server.ts`
- Development: `tsx watch src/server.ts` for hot reload

**Key Benefit:** Simplified deployment pipeline, no build artifacts to manage for backend.

## Implementation Patterns & Consistency Rules

These patterns ensure consistency across the codebase and prevent AI agents from making conflicting architectural choices.

### Naming Conventions

**Database Naming:**
- Table names: Singular, PascalCase (`Task`, not `tasks` or `TASK`)
- Column names: camelCase (`userId`, `createdAt`, `completedAt`)
- Foreign keys: Column name only, no `fk_` prefix (`userId`, not `fk_user_id`)
- Indexes: Prisma auto-naming (`Task_userId_idx`)

**API Naming:**
- Endpoints: Plural, kebab-case, slash-prefixed (`/api/tasks`, not `/api/task` or `/API/TASKS`)
- Route parameters: Colon-prefixed lowercase (`:id`, not `{id}` or `:taskId`)
- Query parameters: camelCase (`?sortBy=createdAt`, not `?sort_by`)
- HTTP headers: Standard HTTP naming (no custom X- prefixes unless necessary)

**Code Naming:**
- Components: PascalCase files and exports (`TaskList.tsx`, `TaskCard.tsx`)
- Hooks: camelCase with `use` prefix (`useTasks()`, `useTaskMutation()`)
- Services/Utilities: camelCase (`taskService.ts`, `formatDate()`)
- Constants: UPPER_SNAKE_CASE (`DEFAULT_STALE_TIME`, `MAX_TASKS`)
- Variables/Functions: camelCase (`taskList`, `handleTaskCreate()`)

### API Response Format

**Direct Response Pattern (Recommended):**

Success responses return data directly:
```json
[
  { "id": 1, "description": "Buy milk", "completed": false, "createdAt": "2026-04-02T10:30:00Z", "updatedAt": "2026-04-02T10:30:00Z" }
]
```

Error responses include error details:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Task description cannot be empty"
  }
}
```

**HTTP Status Codes:**
- `200 OK` — Successful GET, PATCH, DELETE
- `201 Created` — Successful POST
- `400 Bad Request` — Validation error (invalid input)
- `404 Not Found` — Resource doesn't exist
- `500 Internal Server Error` — Server-side failure

**Standard Error Codes:**
- `VALIDATION_ERROR` — Input validation failed (400)
- `NOT_FOUND` — Resource doesn't exist (404)
- `INTERNAL_ERROR` — Server error (500)
- `CONFLICT` — State conflict, reserved for Phase 2 (409)

### File Organization

**Frontend Structure (apps/frontend/src/):**
```
components/       # Reusable React components (TaskList.tsx, TaskCard.tsx, TaskForm.tsx)
pages/           # Page-level components (HomePage.tsx, NotFoundPage.tsx)
hooks/           # Custom React hooks (useTasks.ts, useTaskMutation.ts)
services/        # API client and external services (taskService.ts)
types/           # TypeScript types (imported from @shared-types)
utils/           # Helper functions (formatDate.ts, validation.ts)
App.tsx          # Root component with routing
main.tsx         # Vite entry point
index.css        # Global styles (Tailwind)
```

**Backend Structure (apps/backend/src/):**
```
routes/          # API endpoints, auto-loaded by Fastify (tasks.ts for /tasks endpoints)
services/        # Business logic (taskService.ts)
db/              # Database setup (prisma.ts)
middleware/      # Custom Fastify middleware (errorHandler.ts)
types/           # TypeScript types (imported from @shared-types)
utils/           # Helpers (logger.ts, validation.ts)
server.ts        # Fastify setup and startup
```

**Shared Types Structure (packages/shared-types/src/):**
```
api.ts           # API request/response types
models.ts        # Domain models (Task, User models)
errors.ts        # Error type definitions
index.ts         # Re-exports all types
```

**Tests:** Co-located with code using `.test.ts` suffix
```
components/TaskCard.tsx
components/TaskCard.test.tsx
services/taskService.ts
services/taskService.test.tsx
```

### State Management Patterns (TanStack Query)

**Query Key Factory Pattern:**

Define query keys in a factory for consistency and refactoring safety:

```typescript
// hooks/queryKeys.ts
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters?: FilterParams) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: number) => [...taskKeys.details(), id] as const,
}
```

**Mutation Naming Convention:**

Use consistent names for all mutations:
```typescript
const { mutate: createTask, isPending: isCreating } = useMutation(...)
const { mutate: updateTask, isPending: isUpdating } = useMutation(...)
const { mutate: deleteTask, isPending: isDeleting } = useMutation(...)
```

**Loading State Naming:**

Use TanStack Query's standard naming:
```typescript
const { data: tasks, isLoading, isPending, error } = useQuery(...)
const { mutate, isPending: isCreating, isError } = useMutation(...)
```

**Cache Invalidation Pattern:**

Always invalidate on success to ensure fresh data:
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: taskKeys.all })
}
```

**Optimistic Update Pattern:**

Three-phase approach: snapshot → update → rollback on error:
```typescript
onMutate: async (newData) => {
  await queryClient.cancelQueries({ queryKey: taskKeys.all })
  const previousData = queryClient.getQueryData(taskKeys.all)
  queryClient.setQueryData(taskKeys.all, (old: Task[]) => /* update cache */)
  return { previousData }
},
onError: (err, newData, context) => {
  if (context?.previousData) {
    queryClient.setQueryData(taskKeys.all, context.previousData)
  }
},
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: taskKeys.all })
}
```

### Error Handling Patterns

**Backend Error Structure:**

Define typed error classes for consistency:
```typescript
class ValidationError extends Error {
  constructor(message: string) { super(message); this.name = 'ValidationError' }
}

class NotFoundError extends Error {
  constructor(resource: string, id: number) { 
    super(`${resource} with ID ${id} not found`)
    this.name = 'NotFoundError'
  }
}
```

**Error Response Mapping:**

Consistent mapping from error types to HTTP responses:
```typescript
export const errorHandler = (error: Error) => {
  if (error instanceof ValidationError) {
    return { status: 400, body: { error: { code: 'VALIDATION_ERROR', message: error.message } } }
  }
  if (error instanceof NotFoundError) {
    return { status: 404, body: { error: { code: 'NOT_FOUND', message: error.message } } }
  }
  return { status: 500, body: { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } } }
}
```

**Frontend Error Display:**

Map error codes to user-friendly messages:
```typescript
const displayError = (error: unknown): string => {
  const code = (error as any)?.response?.data?.error?.code
  
  switch (code) {
    case 'VALIDATION_ERROR':
      return 'Please check your input and try again'
    case 'NOT_FOUND':
      return 'This task no longer exists'
    default:
      return 'Something went wrong. Please try again.'
  }
}

// Use in mutation error handler
useMutation({
  mutationFn: createTask,
  onError: (error) => {
    toast.error(displayError(error))
  },
})
```

**Logging Convention:**

Backend logs structured with context, frontend logs only in development:
```typescript
// Backend (Pino)
logger.info({ taskId: 1, action: 'complete' }, 'Task completed')
logger.error({ error: e.message, taskId: 1 }, 'Failed to complete task')

// Frontend (dev only)
if (process.env.NODE_ENV === 'development') {
  console.error('[API Error]', code, message)
}
```

**Retry Logic:**

TanStack Query automatic retry with exponential backoff:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry validation errors
        if (error?.response?.status === 400) return false
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})
```

### Enforcement Guidelines

**All AI Agents MUST:**

1. Follow naming conventions exactly (database PascalCase, API kebab-case, code camelCase)
2. Use shared types from `@shared-types` for all data structures
3. Implement optimistic updates for mutations
4. Map backend errors to frontend user messages
5. Use TanStack Query factory for query keys
6. Place tests co-located with code files
7. Log errors on backend with context; show friendly messages on frontend
8. Import from packages and apps correctly (no circular dependencies)

**Pattern Consistency Validation:**

- Code review checks naming against conventions above
- Type safety validated at build time (TypeScript strict mode)
- API response format validated by shared types
- Test coverage validated before merge
- Bundle size validated in build process (must stay <100KB)

## Code Quality & Formatting Strategy

### Biome Configuration

**Setup & Rationale:**

Todoapp uses **Biome**, a fast, unified linter and formatter written in Rust. Biome replaces ESLint + Prettier with a single, performant tool that handles both linting and formatting.

**Why Biome:**
- ✅ Single tool instead of two (ESLint + Prettier)
- ✅ Rust-based, extremely fast (~100x faster than Node.js tools)
- ✅ Native TypeScript and React support (no plugins needed)
- ✅ Perfect for monorepos with parallel processing
- ✅ One configuration file (`biome.json`) instead of multiple
- ✅ Zero configuration needed for most projects

**Root-Level Biome Config (biome.json):**
```json
{
  "$schema": "https://biomejs.dev/schemas/1.7.1/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "useAsConstAssertion": "error",
        "useBlockStatements": "warn"
      },
      "complexity": {
        "noBannedTypes": "error",
        "noExcessiveCognitiveComplexity": {
          "level": "warn",
          "options": {
            "threshold": 15
          }
        }
      },
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedImports": "error",
        "useIsNan": "error"
      },
      "suspicious": {
        "noExplicitAny": "warn"
      },
      "performance": {
        "noDelete": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf",
    "ignore": [
      "node_modules",
      "dist",
      "build",
      "coverage",
      ".next",
      "pnpm-lock.yaml",
      "package-lock.json",
      "**/*.min.js"
    ]
  },
  "javascript": {
    "formatter": {
      "arrowParentheses": "always",
      "bracketSpacing": true,
      "jsxQuoteStyle": "double",
      "quoteProperties": "asNeeded",
      "semicolons": "asNeeded",
      "singleQuotes": true,
      "trailingComma": "es5",
      "trailingCommas": "es5"
    },
    "parser": {
      "unsafeParameterDecoratorsEnabled": true
    }
  },
  "json": {
    "formatter": {
      "trailingCommas": "none"
    }
  }
}
```

**Biome Linting Rules Enforced:**
- ✅ `noUnusedVariables`: Flag unused variables (except `_` prefixed)
- ✅ `noUnusedImports`: Remove unused imports automatically
- ✅ `noExplicitAny`: Warn on TypeScript `any` types
- ✅ `useIsNan`: Use `Number.isNaN()` instead of `isNaN()`
- ✅ `noBannedTypes`: No empty object types `{}`
- ✅ `useAsConstAssertion`: Use `as const` instead of `as number | string`
- ✅ `useBlockStatements`: Use block statements for consistency
- ✅ `noExcessiveCognitiveComplexity`: Max complexity of 15

**Biome Formatting Rules:**
- ✅ 2-space indentation
- ✅ Single quotes for JavaScript strings
- ✅ No semicolons (ASI-safe)
- ✅ Trailing commas in ES5 (objects, arrays)
- ✅ 100-character line width
- ✅ Always use arrow parens: `(x) => x`
- ✅ Bracket spacing: `{ foo: bar }`
- ✅ LF line endings (Unix standard)

**Running Biome:**
```bash
# Check linting and formatting (no changes)
pnpm run check

# Fix all auto-fixable issues
pnpm run lint:fix

# Format all code in-place
pnpm run format

# Lint only
pnpm run lint

# Format only
pnpm run biome format

# Check specific file
pnpm run check -- apps/backend/src/index.ts
```

### Git Hooks with Husky & lint-staged

**Setup for Pre-Commit Checks:**

Prevent committing code that violates Biome rules.

**Husky Configuration (.husky/pre-commit):**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

**lint-staged Configuration (package.json):**
```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx,json,md}": [
      "biome check --apply"
    ]
  }
}
```

**Git Hooks Workflow:**
1. Developer commits code: `git commit -m "message"`
2. Husky runs pre-commit hook automatically
3. lint-staged runs `biome check --apply` on staged files
4. Biome auto-fixes all issues and re-stages files
5. If unfixable issues found, commit fails with error details
6. Developer fixes manually and commits again
7. Commit succeeds once all checks pass

**Installation:**
```bash
# Install Husky
pnpm add -D husky
pnpm exec husky install

# Install lint-staged
pnpm add -D lint-staged

# Install Biome (if not already in package.json)
pnpm add -D @biomejs/biome

# Husky will auto-run on commit
```

### CI/CD Linting & Formatting Validation

**GitHub Actions Lint Job:**

Already configured in the CI/CD workflow (see Testing & QA section):

```yaml
lint-and-type-check:
  runs-on: ubuntu-latest
  steps:
    - name: Run TypeScript type check
      run: pnpm run type-check
    
    - name: Run Biome check
      run: pnpm run check
```

**Failure Conditions:**
- ❌ Biome linting violations
- ❌ Biome formatting violations
- ❌ TypeScript type errors

**CI Enforcement:**
- Must pass Biome check to merge PR
- Build will fail if code quality violations found
- Extremely fast (Rust-based, parallel processing)

### Root Package.json Scripts

**Quality Check Commands:**
```json
{
  "scripts": {
    "check": "biome check --apply",
    "lint": "biome lint .",
    "lint:fix": "biome lint . --apply",
    "format": "biome format .",
    "format:check": "biome format . --check",
    "type-check": "pnpm -r exec tsc --noEmit",
    "quality": "pnpm run type-check && pnpm run check"
  }
}
```

**Running Quality Checks Before Committing:**
```bash
# Comprehensive quality check (recommended before committing)
pnpm run quality

# Auto-fix everything with Biome
pnpm run check
```

### IDE Integration

**VS Code Configuration (.vscode/settings.json):**
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript react]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[markdown]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

**Recommended VS Code Extension:**
- Biome: `biomejs.biome`

**Developer Experience:**
- ✅ Format-on-save: Files auto-format when saving
- ✅ Real-time error detection: Linting errors shown as you type
- ✅ Quick fixes: Use CMD/CTRL+. to apply Biome fixes
- ✅ Organize imports: Auto-sort and remove unused imports
- ✅ Consistent formatting: Single unified tool across entire codebase
- ✅ Lightning fast: Instant feedback (Rust performance)

### Code Quality Summary

| Tool | Purpose | Trigger | Auto-Fix | Speed |
|------|---------|---------|----------|-------|
| **Biome** | Lint + Format combined | On commit (pre-hook), CI, IDE | Yes (all) | ⚡⚡⚡ Very Fast |
| **TypeScript** | Type safety & compilation | On save (IDE), CI | Partial | ⚡⚡ Fast |
| **Husky** | Run hooks on git events | Pre-commit | N/A | N/A |
| **lint-staged** | Run checks on staged files | Pre-commit via Husky | Yes | ⚡⚡ Fast |

### Development Workflow

**Local Development:**
1. Developer codes with IDE auto-save enabled
2. Biome detects issues in real-time (red squiggles)
3. Developer uses CMD+. (VS Code) to apply Biome fixes
4. Biome auto-formats on save
5. Before commit, Husky runs pre-commit hook
6. lint-staged runs Biome on staged files
7. All issues auto-fixed and re-staged
8. Commit succeeds with formatted, clean code

**CI/CD Pipeline:**
1. Push to GitHub
2. GitHub Actions runs quality check
3. Biome validates linting and formatting (very fast)
4. TypeScript validates types
5. If checks fail: PR shows failed check with details
6. Developer fixes locally and pushes again
7. Once all checks pass: PR ready to merge

### Performance Benefits

Biome's Rust implementation provides significant performance improvements:

| Operation | ESLint + Prettier | Biome |
|-----------|-------------------|-------|
| Check 1000 files | ~30-45 seconds | ~1-2 seconds |
| Pre-commit hook | ~5-10 seconds | ~0.5 seconds |
| CI pipeline check | ~20-30 seconds | ~2-3 seconds |
| IDE real-time | Noticeable delay | Instant |

### Setup Commands

**Initial Setup:**
```bash
# Install root dependencies (includes Biome, Husky, lint-staged)
pnpm install

# Initialize Husky
pnpm exec husky install

# Run initial check to clean up any existing code
pnpm run check

# Verify setup works
pnpm run quality
```

**For Developers Joining Project:**
```bash
# After cloning repo
pnpm install
pnpm exec husky install

# Install VS Code extension: Biome
# Restart VS Code to enable IDE integration

# Verify Biome works
pnpm run check

# Ready to code!
```

### Migration Note

If transitioning from ESLint + Prettier to Biome:
1. Uninstall old tools: `pnpm remove eslint prettier @typescript-eslint/*`
2. Install Biome: `pnpm add -D @biomejs/biome`
3. Create `biome.json` in root
4. Update npm scripts
5. Update `.vscode/settings.json`
6. Run `pnpm run check` to auto-fix all code
7. Commit the formatted code

## Conventional Commits Strategy

### Overview

Todoapp uses **Conventional Commits** specification for commit messages. This provides:
- ✅ Structured commit history that's machine-readable
- ✅ Automatic changelog generation from commit history
- ✅ Semantic versioning triggers (major/minor/patch)
- ✅ Clear communication of what changed and why
- ✅ Better code review context

### Commit Message Format

**Standard Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Minimal Format (for small changes):**
```
<type>(<scope>): <subject>
```

### Type

Specifies the kind of change:

| Type | Use When | Example |
|------|----------|---------|
| `feat` | Adding a new feature | `feat(tasks): add task completion animation` |
| `fix` | Fixing a bug | `fix(api): handle null description in validation` |
| `refactor` | Refactoring without feature/bug changes | `refactor(services): simplify task service logic` |
| `perf` | Performance improvements | `perf(frontend): optimize task list re-renders with memo` |
| `docs` | Documentation only | `docs: update setup instructions in README` |
| `style` | Code style changes (formatting, etc) | `style: run biome formatter on codebase` |
| `test` | Adding or updating tests | `test(backend): add unit tests for task deletion` |
| `ci` | CI/CD configuration changes | `ci: add GitHub Actions workflow for tests` |
| `chore` | Dependency updates, tool config | `chore: update TypeScript to 5.9` |

### Scope

Optional but recommended. Specifies which component changed:

**Backend Scopes:**
- `api` - REST API endpoints
- `services` - Business logic services
- `db` - Database/Prisma changes
- `middleware` - Fastify middleware
- `validation` - Input validation logic
- `error-handling` - Error handling patterns

**Frontend Scopes:**
- `components` - React components
- `hooks` - Custom React hooks
- `pages` - Page-level components
- `services` - API client services
- `state` - TanStack Query setup
- `styling` - CSS/Tailwind changes
- `accessibility` - A11y improvements

**Shared Scopes:**
- `types` - Shared type definitions
- `types-backend` - Backend-specific types
- `types-frontend` - Frontend-specific types
- `utils` - Utility functions
- `config` - Configuration files
- `deps` - Dependency management

### Subject

Clear, concise description of what changed:

**Rules:**
- ✅ Use imperative mood: "add" not "added" or "adds"
- ✅ Don't capitalize first letter
- ✅ No period (.) at end
- ✅ Maximum 50 characters
- ✅ Specific and descriptive

**Good Examples:**
```
feat(tasks): add task completion with bounce animation
fix(api): return 404 for non-existent task
refactor(hooks): extract useTaskMutation hook
perf(frontend): memoize TaskCard component
docs: add contribution guidelines
test(services): add TaskService error handling tests
```

**Bad Examples:**
```
✗ Fixed stuff                  (vague, not imperative)
✗ Add new features             (too generic)
✗ tasks feature                (missing type and verb)
✗ feat: task completion.       (period at end)
✗ feat(tasks): Add Task Completion With Bounce Animation  (capitalized, too long)
```

### Body (Optional)

Detailed explanation of the change. Use when needed for context.

**Rules:**
- ✅ Wrapped at 100 characters
- ✅ Explain WHAT and WHY, not HOW
- ✅ Separated from subject by blank line
- ✅ Use bullet points for multiple changes

**Example:**
```
feat(tasks): add task completion with bounce animation

The task completion interaction now includes:
- Bounce animation (scale 99% → 104% → 101%) over 300-400ms
- Smooth color transition (lavender → green) over 300ms
- Checkmark fade-in synchronized with color change
- Task slides to Completed section over 350ms

This provides satisfying visual feedback to users when completing tasks,
improving the overall user experience and engagement.

Implements UX-DR2 through UX-DR5 from UX Design Specification.
```

### Footer (Optional)

Reference issues, breaking changes, or migration notes.

**Breaking Changes:**
```
BREAKING CHANGE: Task API response format changed

Old format:
  { task: { id, description, completed, createdAt } }

New format:
  { id, description, completed, createdAt }

Migration: Update all API client code to use new response structure.
```

**Issue References:**
```
Fixes #123
Closes #456
Related to #789
```

**Example with Footer:**
```
feat(api): add bulk task operations endpoint

Adds PATCH /api/tasks/bulk endpoint for updating multiple tasks
in a single request. Reduces network calls for batch operations.

Fixes #42
Related to performance optimization task
```

### Commit Examples

**Feature Commit (with body):**
```
feat(components): create TaskCard component with interactive states

- Renders task with description and timestamp
- Click toggles completion status with animation
- Hover/press reveals delete button
- Touch target minimum 44x44px for mobile accessibility
- Responsive styling for desktop and mobile

Implements Story 3.2 acceptance criteria.
```

**Bug Fix (minimal):**
```
fix(validation): require minimum 1 character for task description
```

**Refactor (with scope):**
```
refactor(hooks): extract useCreateTask mutation logic into custom hook

Centralizes task creation state management for reusability.
Reduces component complexity in TaskForm.

Related to code organization improvement.
```

**Performance (with details):**
```
perf(frontend): memoize TaskCard to prevent unnecessary re-renders

Uses React.memo to prevent TaskCard re-renders when props unchanged.
Significantly improves performance with large task lists (50+ tasks).

Benchmarks:
- Before: 250ms render time for 100 tasks
- After: 45ms render time for 100 tasks
```

**Chore (dependency update):**
```
chore(deps): update React to 19.0.1 and TypeScript to 5.9
```

### Commitizen Setup (Optional but Recommended)

**Interactive Commit Message Helper:**

Commitizen guides developers through creating valid conventional commits.

**Installation:**
```bash
pnpm add -D commitizen cz-conventional-changelog
```

**Configuration (package.json):**
```json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

**Usage:**
```bash
# Instead of: git commit -m "feat(tasks): add feature"
pnpm run commit

# Follow interactive prompts to create conventional commit
```

### Commit Lint (Validate Format)

**Enforce Conventional Commits in CI/CD:**

Commitlint validates commit messages against conventional commits specification.

**Installation:**
```bash
pnpm add -D @commitlint/config-conventional @commitlint/cli
```

**Configuration (commitlint.config.js):**
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'perf',
        'docs',
        'style',
        'test',
        'ci',
        'chore',
      ],
    ],
    'type-case': [2, 'always', 'lowercase'],
    'type-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lowercase'],
    'subject-empty': [2, 'never'],
    'subject-period': [2, 'never'],
    'subject-full-stop': [2, 'never'],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  ],
}
```

**Husky Integration (.husky/commit-msg):**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
```

**Usage:**
```bash
# Commit with invalid format
git commit -m "added new feature"

# Error from commitlint:
# ✖ type must be lowercase [type-case]
# ✖ type must be one of [type-enum]
#
# Use proper format: feat(scope): description
```

### Conventional Commits Workflow

**Local Development:**
1. Make code changes in feature branch
2. Prepare commit: `git add .`
3. Create commit with: `pnpm run commit` (interactive) or `git commit -m "type(scope): message"`
4. Husky pre-commit hook runs (Biome check)
5. Husky commit-msg hook validates format
6. Commit succeeds if all checks pass

**GitHub Actions Validation:**
```yaml
validate-commits:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0
    
    - name: Validate commits with commitlint
      run: |
        pnpm add -D @commitlint/cli @commitlint/config-conventional
        npx commitlint --from ${{ github.event.pull_request.base.sha }} --to HEAD
```

### Changelog Generation

**Automatic Changelog from Commits:**

Tools like `standard-version` or `release-please` generate changelogs from conventional commits.

**Example Generated Changelog:**
```markdown
## [1.0.0] - 2026-04-15

### Features
- feat(tasks): add task completion with bounce animation
- feat(components): create TaskCard component
- feat(api): add bulk task operations endpoint

### Bug Fixes
- fix(validation): require minimum 1 character for task description
- fix(api): handle null description in validation

### Performance Improvements
- perf(frontend): memoize TaskCard to prevent re-renders
- perf(hooks): optimize TanStack Query cache invalidation

### Documentation
- docs: add contribution guidelines
- docs: update setup instructions

### Refactoring
- refactor(services): simplify task service logic
- refactor(hooks): extract useCreateTask mutation hook
```

### Best Practices

**DO:**
- ✅ Write commits frequently (logical, atomic changes)
- ✅ Use types and scopes consistently
- ✅ Write clear, descriptive subjects
- ✅ Reference related issues in footer
- ✅ Explain WHY in body, not WHAT (code shows WHAT)
- ✅ Use present tense: "add feature" not "added feature"

**DON'T:**
- ❌ Mix unrelated changes in one commit
- ❌ Use vague subjects like "fix", "update", "stuff"
- ❌ Ignore scope (context helps reviewers)
- ❌ Write commit messages in past tense
- ❌ Forget to reference related issues
- ❌ Capitalize first letter of subject

### Branch Naming Convention

**Align branch names with commit types:**

```
feature/task-completion-animation
fix/validation-error-message
refactor/task-service-cleanup
docs/update-readme
```

**Pattern:**
```
<type>/<kebab-case-description>
```

**Examples:**
```
feature/add-task-completion
fix/handle-null-description
refactor/extract-hooks
docs/setup-guide
chore/update-dependencies
```

### Team Guidelines

**Commit Message Quality Checklist:**

Before committing, ask:
- ✅ Does the type accurately describe the change?
- ✅ Is the scope clear and specific?
- ✅ Is the subject under 50 characters?
- ✅ Does it use imperative mood?
- ✅ Is it lowercase and without period?
- ✅ Does the body explain WHY if needed?
- ✅ Are related issues referenced?

**Code Review Focus:**

Reviewers should check:
- ✅ Commit message follows conventional commits
- ✅ Changes match the stated type and scope
- ✅ No unrelated changes mixed in
- ✅ Body provides adequate context if complex

## Project Structure & Boundaries

### Complete Project Directory Structure

```
todoapp/
├── README.md                          # Project overview and setup instructions
├── package.json                       # Root workspace configuration
├── pnpm-workspace.yaml                # pnpm monorepo definition
├── pnpm-lock.yaml                     # Locked dependencies (git committed)
├── tsconfig.base.json                 # Shared TypeScript configuration
├── .gitignore                         # Git ignore patterns
├── docker-compose.yml                 # PostgreSQL + services orchestration
├── .env.example                       # Environment variables template
│
├── apps/
│   ├── frontend/                      # React + Vite SPA (Node 24)
│   │   ├── package.json               # Frontend dependencies
│   │   ├── tsconfig.json              # Extends tsconfig.base.json
│   │   ├── vite.config.ts             # Vite build configuration
│   │   ├── index.html                 # HTML entry point
│   │   ├── Dockerfile                 # Production: Node 24 + nginx
│   │   ├── .dockerignore
│   │   ├── .env.example               # Frontend env vars (VITE_API_URL, etc.)
│   │   │
│   │   └── src/
│   │       ├── main.tsx               # Vite entry point
│   │       ├── App.tsx                # Root component, routing setup
│   │       ├── index.css              # Global styles (Tailwind imports)
│   │       │
│   │       ├── components/            # Reusable React components
│   │       │   ├── TaskList.tsx       # Main task list (maps over tasks)
│   │       │   ├── TaskList.test.tsx
│   │       │   ├── TaskCard.tsx       # Individual task item (complete/delete)
│   │       │   ├── TaskCard.test.tsx
│   │       │   ├── TaskForm.tsx       # Create new task input
│   │       │   ├── TaskForm.test.tsx
│   │       │   ├── LoadingSpinner.tsx
│   │       │   ├── ErrorMessage.tsx
│   │       │   └── EmptyState.tsx
│   │       │
│   │       ├── pages/
│   │       │   └── HomePage.tsx
│   │       │
│   │       ├── hooks/                 # Custom React hooks
│   │       │   ├── useTasks.ts        # useQuery for fetch tasks
│   │       │   ├── useTasks.test.ts
│   │       │   ├── useCreateTask.ts   # useMutation for create
│   │       │   ├── useUpdateTask.ts   # useMutation for toggle complete
│   │       │   ├── useDeleteTask.ts   # useMutation for delete
│   │       │   └── queryKeys.ts       # TanStack Query key factory
│   │       │
│   │       ├── services/
│   │       │   ├── taskService.ts     # API calls to /api/tasks
│   │       │   └── taskService.test.ts
│   │       │
│   │       ├── types/
│   │       │   └── index.ts           # Re-exports from @shared-types
│   │       │
│   │       ├── utils/
│   │       │   ├── errorHandler.ts    # Error codes → user messages
│   │       │   ├── formatDate.ts
│   │       │   └── validation.ts
│   │       │
│   │       └── config/
│   │           └── queryClient.ts     # TanStack Query setup
│   │
│   └── backend/                       # Fastify + TypeScript API (Node 24)
│       ├── package.json
│       ├── tsconfig.json              # Extends tsconfig.base.json
│       ├── prisma.config.ts           # Prisma 7 config (loads .env, sets datasource URL)
│       ├── Dockerfile                 # Production: Node 24 native type stripping
│       ├── .dockerignore
│       ├── .env.example
│       ├── generated/                 # Prisma generated client (gitignored)
│       ├── prisma/
│       │   ├── schema.prisma          # Prisma schema (Task model)
│       │   └── migrations/            # SQL migration files (committed)
│       │
│       └── src/
│           ├── server.ts              # Entry point (runs: node src/server.ts)
│           ├── app.ts                 # Fastify setup
│           │
│           ├── routes/                # API endpoints (@fastify/autoload)
│           │   ├── tasks.ts           # GET, POST, PATCH, DELETE /tasks
│           │   ├── tasks.test.ts
│           │   └── health.ts          # GET /health
│           │
│           ├── services/              # Business logic
│           │   ├── taskService.ts
│           │   └── taskService.test.ts
│           │
│           ├── db/
│           │   └── prisma.ts          # Prisma client init
│           │
│           ├── middleware/
│           │   ├── errorHandler.ts    # Global error handling
│           │   └── requestLogger.ts
│           │
│           ├── types/
│           │   └── index.ts           # Re-exports from @shared-types
│           │
│           └── utils/
│               ├── logger.ts          # Pino logger config
│               ├── validation.ts
│               └── formatters.ts
│
├── packages/
│   ├── shared-types/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   │
│   │   └── src/
│   │       ├── api.ts                 # API types (Task, requests)
│   │       ├── models.ts              # Domain models
│   │       ├── errors.ts              # Error types
│   │       ├── constants.ts           # Shared constants
│   │       └── index.ts
│   │
│   └── shared-utils/
│       ├── package.json
│       ├── tsconfig.json
│       │
│       └── src/
│           ├── formatting.ts
│           ├── validation.ts
│           └── index.ts
│
├── prisma/
│   ├── schema.prisma                  # Database schema (Task model)
│   └── migrations/                    # Auto-created by Prisma
│
├── docs/
│   ├── API.md                         # API documentation
│   └── DEVELOPMENT.md
│
└── .github/                           # GitHub workflows
    └── workflows/
        └── ci.yml
```

### Architectural Boundaries

**Frontend Boundaries:**
- Components in `src/components/` render data, don't call APIs
- Hooks in `src/hooks/` manage TanStack Query state
- Service in `src/services/taskService.ts` is single API call point
- All types from `@shared-types`

**Backend Boundaries:**
- Routes in `src/routes/` handle HTTP only
- Services in `src/services/` contain business logic
- Prisma in `src/db/` is single database access point
- All types from `@shared-types`

**Data Flow:**
```
User Action → Component → Hook → Service → Backend Route → Service → Prisma → PostgreSQL
Response flows backward through same chain
```

### Requirements to Structure Mapping

**Task Management (FR1-19):**
- Create: TaskForm → useCreateTask → taskService → POST /tasks
- View: TaskList → useTasks → taskService → GET /tasks
- Complete: TaskCard → useUpdateTask → taskService → PATCH /tasks/:id
- Delete: TaskCard → useDeleteTask → taskService → DELETE /tasks/:id

**Data Persistence (FR20-24):**
- All data flows through Prisma → PostgreSQL
- Schema in `prisma/schema.prisma`
- Migrations in `prisma/migrations/`

**Visual Feedback (FR30-32):**
- TanStack Query optimistic updates in hooks
- LoadingSpinner, ErrorMessage components
- Vite build optimization in `vite.config.ts`

**Error Handling (FR33-36):**
- Backend: `middleware/errorHandler.ts`
- Frontend: `utils/errorHandler.ts`
- Shared types: `@shared-types/errors.ts`

### Integration Points

**Frontend ↔ Backend:**
- Endpoints: `/api/tasks`, `/api/tasks/:id`
- Response format: Direct data or error with code
- Types: All shared via `@shared-types`

**Internal Communication:**
- Frontend: Components → Hooks → Service → API
- Backend: Routes → Services → Prisma
- All using shared types

### Development Workflow

**Setup:**
```bash
pnpm install              # Install monorepo dependencies
pnpm run dev:db:setup    # Start PostgreSQL, run migrations
```

**Development:**
```bash
pnpm run dev              # Frontend (Vite HMR) + Backend (tsx watch)
```

**Testing:**
```bash
pnpm run test            # Run all tests
```

## Testing & Quality Assurance Strategy

### Testing Pyramid & Coverage

Todoapp uses a structured testing approach with target coverage of **70-80%** for implementation code:

```
         E2E Tests (Playwright)
        /                    \
       /  Integration Tests   \
      /   (Bruno API Tests)    \
     /________________________\
            Unit Tests
        (Node:test Framework)
```

**Coverage Targets:**
- Unit Tests: 70-80% code coverage minimum
- Integration Tests: Critical API paths fully covered
- E2E Tests: Core user workflows validated
- Frontend Components: Key interactions tested

### Backend Testing Strategy

#### Unit Tests (Node:test + TestContext Assertions)

**Technology Stack:**
- Framework: Node.js built-in `node:test` module
- Assertions: Node.js `assert` module via TestContext (scoped, not imported globally)
- Mocking: `--experimental-detect-module-mocks` flag
- Test Files: Co-located with source files using `.test.ts` suffix

**File Structure:**
```
apps/backend/src/
├── routes/
│   ├── tasks.ts
│   └── tasks.test.ts           # Unit tests for task routes
├── services/
│   ├── taskService.ts
│   └── taskService.test.ts     # Unit tests for business logic
└── db/
    ├── prisma.ts
    └── prisma.test.ts          # Unit tests for database layer
```

**Test Pattern (Using TestContext):**

TestContext provides scoped assert methods, eliminating global imports:

```typescript
import { test } from 'node:test'
import { TaskService } from './taskService.js'

test('TaskService.createTask creates task with timestamp', async (t) => {
  const task = await taskService.createTask('Buy milk')
  t.assert.strictEqual(task.description, 'Buy milk')
  t.assert.ok(task.createdAt instanceof Date)
})

test('TaskService.deleteTask throws NotFoundError for missing task', async (t) => {
  await t.assert.rejects(
    () => taskService.deleteTask(99999),
    (err) => err instanceof NotFoundError
  )
})

test('TaskService.updateTask', async (t) => {
  await t.test('updates completed status', async (t) => {
    const task = await taskService.updateTask(1, { completed: true })
    t.assert.strictEqual(task.completed, true)
  })

  await t.test('preserves description when not provided', async (t) => {
    const original = await taskService.getTask(1)
    const updated = await taskService.updateTask(1, { completed: false })
    t.assert.strictEqual(updated.description, original.description)
  })
})
```

**Benefits of TestContext Approach:**
- Scoped assertions prevent naming conflicts
- Cleaner test organization with nested test suites
- Better IDE autocomplete (context-aware)
- More readable test structure
- No global imports cluttering namespace
- Easier to organize related tests hierarchically

**Coverage Requirements:**
- All business logic paths tested using TestContext assertions (happy path + error cases)
- Edge cases: empty input, invalid IDs, boundary conditions
- Error handling: validation errors, not found, server errors
- Nested test organization using TestContext for related test groups
- Target: 70-80% overall coverage

**Running Tests:**
```bash
# Run all unit tests
pnpm run test:unit

# Run specific test file
pnpm run test:unit -- apps/backend/src/services/taskService.test.ts

# Watch mode during development
pnpm run test:unit:watch

# With coverage report
pnpm run test:unit:coverage
```

#### Bruno API E2E Tests

**Technology Stack:**
- Tool: Bruno REST API client (Postman alternative)
- Collections: Organized by endpoint groups
- Environment: Development-focused initially, expandable to test/staging/prod
- Format: JSON-based, version control friendly

**File Structure:**
```
bruno/
├── todoapp.json                # Collection metadata
├── environments/
│   └── dev.json                # Development environment (localhost:3000)
└── tasks/
    ├── 01_get_all_tasks.bru
    ├── 02_create_task.bru
    ├── 03_complete_task.bru
    ├── 04_update_task.bru
    └── 05_delete_task.bru
```

**Test Coverage:**
- All CRUD operations: GET, POST, PATCH, DELETE
- Happy path: successful operations return correct data
- Error cases: 400/404/500 responses with error structure
- Data validation: empty descriptions rejected, invalid IDs handled
- State consistency: operations persist and synchronize

**Bruno Request Example:**
```
POST http://localhost:3000/api/tasks
Content-Type: application/json

{
  "description": "Test task"
}

✓ Status: 201
✓ Response has id, description, completed, createdAt, updatedAt
✓ Description matches input
✓ completed defaults to false
```

**Running Bruno Tests:**
```bash
# Interactive testing
# Open Bruno, load todoapp collection, select dev environment, run requests

# CLI execution (future expansion)
# bruno run todoapp --env dev
```

**Future Expansion:**
- Bruno CLI integration for CI/CD pipelines
- Test/staging environment collections
- Load testing scenarios
- Response time assertions

### Frontend Testing Strategy

#### Playwright E2E Tests

**Technology Stack:**
- Framework: Playwright for browser automation
- Browsers: Chrome for CI, Chrome + Firefox + Safari for local testing
- Headed Mode: Available for debugging and development
- CI Mode: Headless with screenshots on failure

**File Structure:**
```
apps/frontend/e2e/
├── playwright.config.ts        # Global configuration
├── fixtures/
│   └── test.ts                 # Custom fixtures and helpers
├── auth.setup.ts               # Global setup (login, etc)
└── specs/
    ├── task-creation.spec.ts
    ├── task-completion.spec.ts
    ├── task-deletion.spec.ts
    ├── empty-state.spec.ts
    ├── example-tasks.spec.ts
    ├── error-handling.spec.ts
    ├── responsive-layout.spec.ts
    └── accessibility.spec.ts
```

**Test Coverage:**
- **Task Creation**: Input field, Enter submission, instant UI update, multiple tasks
- **Task Completion**: Click to complete, animation visible, checkmark appears, section move
- **Task Deletion**: Delete button reveal, undo toast visible, recovery action
- **Empty State**: Message displays when no tasks, input remains accessible
- **Example Tasks**: Visible on first load, can be interacted with, can be deleted
- **Error Handling**: Network errors show user message, retry button functional
- **Responsive Layout**: Mobile single-column, desktop two-column, no horizontal scroll
- **Accessibility**: Keyboard navigation (Tab, Enter, Delete), focus indicators visible

**Playwright Configuration:**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
})
```

**Test Pattern (Page Object Model):**
```typescript
import { test, expect } from '@playwright/test'

class TaskPage {
  constructor(private page: Page) {}

  async navigateTo() {
    await this.page.goto('/')
  }

  async addTask(description: string) {
    await this.page.fill('input[placeholder="Add a task..."]', description)
    await this.page.press('input[placeholder="Add a task..."]', 'Enter')
  }

  async completeTask(index: number) {
    await this.page.click(`[data-testid="task-${index}"]`)
  }

  async getTaskCount() {
    return await this.page.locator('[data-testid^="task-"]').count()
  }

  async getCompletedCount() {
    return await this.page.locator('[data-testid^="task-"][data-completed="true"]').count()
  }
}

test('user can create and complete tasks', async ({ page }) => {
  const taskPage = new TaskPage(page)
  
  await taskPage.navigateTo()
  await taskPage.addTask('Buy milk')
  await expect(page.locator('text=Buy milk')).toBeVisible()
  
  await taskPage.completeTask(0)
  await expect(page.locator('[data-testid="task-0"] .checkmark')).toBeVisible()
  
  const completedCount = await taskPage.getCompletedCount()
  expect(completedCount).toBe(1)
})
```

**Running Playwright Tests:**
```bash
# Run all tests in headless mode (CI mode)
pnpm run test:e2e

# Run with headed browser (for debugging)
pnpm run test:e2e:headed

# Run specific test file
pnpm run test:e2e -- task-creation.spec.ts

# Debug mode with inspector
pnpm run test:e2e:debug

# Generate HTML report
pnpm run test:e2e:report
```

### CI/CD Integration (GitHub Actions)

#### Test Automation Pipeline

**GitHub Actions Workflow:**

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [ 24.x ]

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: todoapp_test
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Setup test database
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/todoapp_test
        run: |
          cd apps/backend
          pnpm exec prisma migrate deploy

      - name: Run backend unit tests
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/todoapp_test
          NODE_OPTIONS: --experimental-detect-module-mocks
        run: pnpm run test:unit

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          fail_ci_if_error: false

  e2e-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [ 24.x ]

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: todoapp_test
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Setup test database
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/todoapp_test
        run: |
          cd apps/backend
          pnpm exec prisma migrate deploy

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Run e2e tests
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/todoapp_test
        run: pnpm run test:e2e

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: apps/frontend/playwright-report/
          retention-days: 30

  lint-and-type-check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24.x

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run TypeScript type check
        run: pnpm run type-check

      - name: Run linter
        run: pnpm run lint
```

#### Test Scripts in package.json

**Root-level test commands:**
```json
{
  "scripts": {
    "test": "pnpm run test:unit && pnpm run test:e2e",
    "test:unit": "pnpm -r --filter './apps/backend' run test:unit",
    "test:unit:watch": "pnpm -r --filter './apps/backend' run test:unit:watch",
    "test:unit:coverage": "pnpm -r --filter './apps/backend' run test:unit:coverage",
    "test:e2e": "pnpm -r --filter './apps/frontend' run test:e2e",
    "test:e2e:headed": "pnpm -r --filter './apps/frontend' run test:e2e:headed",
    "test:e2e:debug": "pnpm -r --filter './apps/frontend' run test:e2e:debug",
    "test:e2e:report": "pnpm -r --filter './apps/frontend' run test:e2e:report",
    "type-check": "pnpm -r exec tsc --noEmit",
    "lint": "eslint ."
  }
}
```

#### Test Failure & Debugging

**On Test Failure in CI:**
1. GitHub Actions uploads Playwright HTML reports
2. Failed test screenshots available as artifacts
3. Trace files available for debugging
4. Coverage reports show regression areas

**Local Debugging:**
```bash
# Run test in headed mode to see browser
pnpm run test:e2e:headed

# Run specific test with debug inspector
pnpm run test:e2e:debug -- task-creation.spec.ts

# View HTML report locally
pnpm run test:e2e:report
```

### Test Requirements for Stories

**Backend Implementation Stories (6.1, 6.3, 7.1):**

Acceptance criteria must include:
- ✅ Unit tests written covering happy path + error cases
- ✅ Minimum 70-80% code coverage for implemented functions
- ✅ Tests passing locally with `pnpm run test:unit`
- ✅ Tests passing in CI pipeline
- ✅ Error handling tested (validation, not found, server errors)
- ✅ Bruno API tests created for all new endpoints

**Frontend Feature Stories (2.1, 3.1-3.2, 4.1-4.2, 5.1-5.2, 8.1, 9.1):**

Acceptance criteria must include:
- ✅ Playwright e2e tests for user workflows
- ✅ Tests passing in headless mode (CI)
- ✅ Tests passing with headed browser (local debugging)
- ✅ Responsive layout tested (desktop + mobile viewport)
- ✅ Accessibility features tested (keyboard navigation, focus, ARIA)
- ✅ Error states and edge cases covered

### Future Test Expansion (Post-MVP)

**Phase 2 Enhancements:**
- Load testing with k6 or Artillery
- Performance benchmarking
- Visual regression testing (Percy, Chromatic)
- Mobile device farm testing (BrowserStack)
- Security scanning (OWASP ZAP)
- Accessibility scanning (Axe, WAVE)

**Production Monitoring:**
- Error tracking (Sentry)
- Performance monitoring (Web Vitals)
- User analytics (PostHog, Plausible)

**Production:**

Backend (Node 24 native type stripping - no build needed):
```bash
node src/server.ts       # Runs directly
```

Frontend:
```bash
pnpm run build           # Creates apps/frontend/dist/ (static assets)
```

### Deployment with Docker

**Backend Dockerfile:**
```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod
COPY src/ ./src/
COPY tsconfig.json .
EXPOSE 3000
CMD ["node", "src/server.ts"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:24-alpine as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose:**
```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: todoapp
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./apps/backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/todoapp
      NODE_ENV: production
    depends_on:
      - postgres

  frontend:
    build: ./apps/frontend
    ports:
      - "80:80"

volumes:
  postgres_data:
```