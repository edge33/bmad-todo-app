# AI Agent Implementation Guidelines for todoapp

This document provides comprehensive guidance for AI agents implementing todoapp. Follow these rules to ensure consistency, maintainability, and alignment with the architectural vision.

## Quick Reference: Core Principles

1. **Type Safety First** — All data structures use shared types from `@shared-types`
2. **Simplicity** — When in doubt, choose the simpler solution
3. **Performance-First** — Every decision validated against <100ms, <1s, <100KB targets
4. **Optimistic UX** — User feedback is immediate; API calls happen in background
5. **No Over-Engineering** — Low complexity is intentional and valued

---

## Naming Conventions

### Database (Prisma Schema)

```
✅ DO:
- Table names: Singular, PascalCase (Task, User)
- Column names: camelCase (userId, createdAt, completedAt)
- Foreign keys: Column name only (userId, not fk_user_id)
- Indexes: Prisma auto-naming (Task_userId_idx)

❌ DON'T:
- Table names: Plural (tasks), UPPERCASE (TASK), snake_case (task_item)
- Column names: snake_case (user_id), PascalCase (UserId)
- Foreign keys: With prefix (fk_user_id), abbreviated (uid)
```

### API Endpoints

```
✅ DO:
- Endpoints: Plural, kebab-case, slash-prefixed (/api/tasks, /api/tasks/:id)
- Route parameters: Colon-prefixed lowercase (:id, :taskId)
- Query parameters: camelCase (?sortBy=createdAt, ?limit=10)
- Status codes: 200 (GET/PATCH/DELETE), 201 (POST), 400 (validation), 404 (not found), 500 (error)

❌ DON'T:
- Endpoints: Singular (/api/task), UPPERCASE (/API/TASKS), underscored (/api/get_tasks)
- Route parameters: Curly braces ({id}), PascalCase (:TaskId)
- Query parameters: snake_case (?sort_by, ?max_results)
- Status codes: 202 (use 200), 204 (return data), 400 for server errors
```

### TypeScript/React Code

```
✅ DO:
- Components: PascalCase files (TaskList.tsx, TaskCard.tsx)
- Hooks: camelCase with `use` prefix (useTasks, useTaskMutation, useDeleteTask)
- Services: camelCase (taskService.ts, fetchTasks)
- Constants: UPPER_SNAKE_CASE (DEFAULT_STALE_TIME, MAX_TASKS)
- Variables/Functions: camelCase (taskList, handleTaskCreate, formatDate)
- Private properties: Leading underscore (_internalState)

❌ DON'T:
- Components: kebab-case (task-list.tsx), snake_case (task_list.tsx)
- Hooks: Without `use` prefix (getTasks, taskMutation)
- Services: PascalCase (TaskService.ts)
- Constants: camelCase (defaultStaleTime), without prefix
- Variables: snake_case (task_list), PascalCase (TaskList)
```

---

## API Response Format

### Success Responses

Return data directly (no wrapper):

```typescript
// GET /api/tasks
[
  {
    id: 1,
    description: "Buy milk",
    completed: false,
    createdAt: "2026-04-02T10:30:00Z",
    updatedAt: "2026-04-02T10:30:00Z",
    userId: null
  }
]

// POST /api/tasks
{
  id: 2,
  description: "New task",
  completed: false,
  createdAt: "2026-04-02T10:31:00Z",
  updatedAt: "2026-04-02T10:31:00Z",
  userId: null
}

// PATCH /api/tasks/:id
{
  id: 1,
  description: "Buy milk",
  completed: true,
  createdAt: "2026-04-02T10:30:00Z",
  updatedAt: "2026-04-02T10:31:00Z",
  userId: null
}

// DELETE /api/tasks/:id
(No body, 200 OK)
```

### Error Responses

Include error structure with code and message:

```typescript
// 400 Bad Request
{
  error: {
    code: "VALIDATION_ERROR",
    message: "Task description cannot be empty"
  }
}

// 404 Not Found
{
  error: {
    code: "NOT_FOUND",
    message: "Task with ID 999 not found"
  }
}

// 500 Internal Server Error
{
  error: {
    code: "INTERNAL_ERROR",
    message: "Internal server error"
  }
}
```

### HTTP Status Codes

| Status | When | Example |
|--------|------|---------|
| 200 | Successful GET, PATCH, DELETE | Task updated successfully |
| 201 | Successful POST | Task created |
| 400 | Validation error | Missing description field |
| 404 | Resource not found | Task ID doesn't exist |
| 500 | Server error | Database connection failed |

---

## File Organization

### Frontend: apps/frontend/src/

```
components/              # Reusable React components
├── TaskList.tsx        # Main task list component
├── TaskList.test.tsx
├── TaskCard.tsx        # Individual task card
├── TaskCard.test.tsx
├── TaskForm.tsx        # Task input form
├── TaskForm.test.tsx
├── LoadingSpinner.tsx
├── ErrorMessage.tsx
└── EmptyState.tsx

pages/                  # Page-level components (for routing)
├── HomePage.tsx
└── NotFoundPage.tsx

hooks/                  # Custom React hooks
├── useTasks.ts        # useQuery for fetching tasks
├── useTasks.test.ts
├── useCreateTask.ts   # useMutation for create
├── useUpdateTask.ts   # useMutation for toggle complete
├── useDeleteTask.ts   # useMutation for delete
└── queryKeys.ts       # TanStack Query key factory

services/              # API client
├── taskService.ts    # API calls to /api/tasks
└── taskService.test.ts

types/                 # TypeScript types
└── index.ts          # Re-exports from @shared-types

utils/                 # Helper functions
├── errorHandler.ts   # Map error codes to user messages
├── formatDate.ts     # Format timestamps
├── validation.ts
├── errorHandler.test.ts
└── formatDate.test.ts

config/                # Configuration
└── queryClient.ts    # TanStack Query setup

App.tsx               # Root component with routing
main.tsx              # Vite entry point
index.css             # Global styles (Tailwind)
```

### Backend: apps/backend/src/

```
routes/                # API endpoints (auto-loaded by Fastify)
├── tasks.ts          # GET, POST, PATCH, DELETE /tasks
├── tasks.test.ts
└── health.ts         # GET /health

services/             # Business logic
├── taskService.ts    # Task CRUD logic
└── taskService.test.ts

db/                   # Database layer
└── prisma.ts         # Prisma client initialization

middleware/           # Custom Fastify middleware
├── errorHandler.ts   # Global error handling
└── requestLogger.ts  # Request logging with Pino

types/                # TypeScript types
└── index.ts          # Re-exports from @shared-types

utils/                # Helper functions
├── logger.ts         # Pino logger configuration
├── validation.ts     # Input validation helpers
└── formatters.ts     # Response formatters

app.ts                # Fastify plugin setup (autoload routes)
server.ts             # Entry point (runs: node src/server.ts)
```

### Shared Types: packages/shared-types/src/

```
api.ts                # API request/response types
├── Task (id, userId, description, completed, createdAt, updatedAt)
├── CreateTaskRequest (description)
├── UpdateTaskRequest (description?, completed?)

models.ts             # Domain models
├── Task model (for ORM)
├── User model (for Phase 2)

errors.ts             # Error type definitions
├── ValidationError
├── NotFoundError
├── InternalError

constants.ts          # Shared constants
├── DEFAULT_STALE_TIME = 5 minutes
├── MAX_TASKS = 100
├── Error codes (VALIDATION_ERROR, NOT_FOUND, INTERNAL_ERROR)

index.ts              # Re-exports all types
```

### Tests: Co-located with Code

```
✅ DO:
components/
  ├── TaskCard.tsx
  └── TaskCard.test.tsx      # Same folder, .test.ts suffix

services/
  ├── taskService.ts
  └── taskService.test.ts    # Same folder

❌ DON'T:
__tests__/
  ├── TaskCard.test.tsx      # Separate tests folder
  └── taskService.test.ts

tests/
  └── ...                     # Separate tests directory
```

---

## State Management (TanStack Query v5)

### Query Key Factory

Create a factory for query keys to enable safe refactoring:

```typescript
// hooks/queryKeys.ts
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters?: FilterParams) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: number) => [...taskKeys.details(), id] as const,
}

// Usage in components
const { data: tasks } = useQuery({
  queryKey: taskKeys.all,
  queryFn: fetchTasks,
})
```

### Mutation Naming

Always use consistent naming for mutations:

```typescript
✅ DO:
const { mutate: createTask, isPending: isCreating } = useMutation(...)
const { mutate: updateTask, isPending: isUpdating } = useMutation(...)
const { mutate: deleteTask, isPending: isDeleting } = useMutation(...)

❌ DON'T:
const { mutate: addTask } = useMutation(...)
const { mutate: toggleComplete } = useMutation(...)
const { mutate: remove } = useMutation(...)
```

### Loading State Naming

Use TanStack Query's standard naming for consistency:

```typescript
✅ DO:
const { data: tasks, isLoading, isPending, error } = useQuery(...)
const { mutate, isPending: isCreating, isError } = useMutation(...)

❌ DON'T:
const { data: tasks, isLoading: loading } = useQuery(...)
const { mutate, isLoading: creating } = useMutation(...)
```

### Cache Invalidation

Always invalidate on success to ensure fresh data:

```typescript
✅ DO:
const { mutate } = useMutation({
  mutationFn: createTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: taskKeys.all })
  }
})

❌ DON'T:
// Setting data directly without invalidation
queryClient.setQueryData(taskKeys.all, newData)

// Forgetting to invalidate after mutation
onSuccess: () => { /* nothing */ }
```

### Optimistic Updates

Implement three-phase pattern: snapshot → update → rollback on error:

```typescript
✅ DO:
const { mutate } = useMutation({
  mutationFn: updateTask,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: taskKeys.all })
    const previousData = queryClient.getQueryData(taskKeys.all)
    queryClient.setQueryData(taskKeys.all, (old: Task[]) =>
      old.map(t => t.id === newData.id ? { ...t, ...newData } : t)
    )
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
})

❌ DON'T:
// Forgetting to snapshot previous data
// Not rolling back on error
// Mixing optimistic updates with direct data setting
```

---

## Error Handling

### Backend: Define Error Classes

```typescript
✅ DO:
class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

class NotFoundError extends Error {
  constructor(resource: string, id: number) {
    super(`${resource} with ID ${id} not found`)
    this.name = 'NotFoundError'
  }
}

❌ DON'T:
throw new Error('Validation failed')
throw new Error('Not found')
```

### Backend: Error Mapping

Map error types to HTTP responses consistently:

```typescript
✅ DO:
export const errorHandler = (error: Error) => {
  if (error instanceof ValidationError) {
    return { status: 400, body: { error: { code: 'VALIDATION_ERROR', message: error.message } } }
  }
  if (error instanceof NotFoundError) {
    return { status: 404, body: { error: { code: 'NOT_FOUND', message: error.message } } }
  }
  return { status: 500, body: { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } } }
}

❌ DON'T:
throw new Error(message) without mapping
return { status: 400 } without error body
Mix error code names (task_not_found vs TASK_NOT_FOUND)
```

### Frontend: Error Display

Map error codes to user-friendly messages:

```typescript
✅ DO:
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

// Show toast notification
useMutation({
  mutationFn: createTask,
  onError: (error) => {
    toast.error(displayError(error))
  }
})

❌ DON'T:
Show raw error messages to users
Display backend error codes directly
Mix error handling logic across components
```

### Logging

Backend: Log with context, Frontend: Log only in development

```typescript
✅ Backend (Pino):
logger.info({ taskId: 1, action: 'complete' }, 'Task completed')
logger.error({ error: e.message, taskId: 1 }, 'Failed to complete task')

✅ Frontend (dev only):
if (process.env.NODE_ENV === 'development') {
  console.error('[API Error]', code, message)
}

❌ DON'T:
console.log everything on backend
console.error in production frontend
```

---

## Performance Targets

All implementations must validate against these targets:

| Metric | Target | Validated By |
|--------|--------|--------------|
| Initial page load | <1s | Vite build, network tab |
| UI response (<100ms) | Task actions (create, complete, delete) | Dev tools, manual testing |
| API response | <50ms | Backend load testing |
| Bundle size | <100KB gzipped | Build output report |
| Task limit | 100 tasks | Performance testing |

### Frontend Performance Checklist

- ✅ Vite configured for tree-shaking and minification
- ✅ Tailwind CSS configured for purging unused styles
- ✅ No unnecessary re-renders (React.memo, useMemo where needed)
- ✅ Images optimized (if any)
- ✅ Lazy loading for routes (if applicable in Phase 2)
- ✅ Bundle size checked: `pnpm run build` shows <100KB gzipped

### Backend Performance Checklist

- ✅ Database queries indexed (userId index on Task table)
- ✅ No N+1 queries
- ✅ Response times tested locally
- ✅ Error handling doesn't slow down happy path

---

## Accessibility Requirements (WCAG AA)

All implementations must support:

- ✅ **Keyboard Navigation** — All actions operable via Tab, Enter, Delete keys
- ✅ **Screen Reader Support** — Semantic HTML, ARIA labels on interactive elements
- ✅ **Color Contrast** — Minimum 4.5:1 for text, 3:1 for graphics
- ✅ **Multiple Signal Indicators** — Status changes signaled by both color AND checkmark (not color alone)
- ✅ **Touch Targets** — Minimum 44x44px for mobile interaction areas
- ✅ **Form Labels** — Every input has associated label or aria-label

### Frontend Accessibility Checklist

```typescript
✅ DO:
<button aria-label="Complete task">✓</button>
<input id="taskInput" placeholder="Add a task" aria-label="Task description" />
<label htmlFor="taskInput">Task Description</label>

// Status conveyed by multiple signals
<span className={`task ${completed ? 'completed' : ''}`}>
  {completed && <CheckIcon />}
  {description}
</span>

❌ DON'T:
<div onClick={toggleComplete}>Task</div>
<button>Complete</button>  // No aria-label or label
Color alone to indicate status
```

---

## Type Safety

All data structures must use shared types from `@shared-types`:

```typescript
✅ DO:
// Frontend
import { Task, CreateTaskRequest } from '@shared-types'
const createTask = async (req: CreateTaskRequest): Promise<Task> => {
  const response = await fetch('/api/tasks', { method: 'POST', body: JSON.stringify(req) })
  return response.json()
}

// Backend
import { Task, CreateTaskRequest } from '@shared-types'
export const taskService = {
  create: (req: CreateTaskRequest): Task => { ... }
}

❌ DON'T:
interface LocalTask { ... }  // Duplicate types
type TaskFromAPI = any      // Lose type safety
const response: any = ...   // Lose type safety
```

---

## Development Workflow

### Before Starting

1. Read the epic story's acceptance criteria completely
2. Review the relevant section of architecture.md
3. Check what types are available in @shared-types

### During Implementation

1. Reference this file for naming conventions and patterns
2. Use the provided code examples as templates
3. Validate against acceptance criteria as you code
4. Run tests locally before completing

### After Completing

1. Verify all acceptance criteria met
2. Check naming conventions are followed
3. Validate performance targets (for relevant stories)
4. Confirm accessibility requirements (for frontend)
5. Ensure tests pass

---

## Common Patterns by Story Type

### Backend API Story

Template:

```typescript
// routes/tasks.ts - API endpoints

import { FastifyRequest, FastifyReply } from 'fastify'
import { taskService } from '../services/taskService'
import { CreateTaskRequest, UpdateTaskRequest, Task } from '@shared-types'

export default async function (fastify: any) {
  // GET /tasks
  fastify.get<{ Reply: Task[] }>('/', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const tasks = await taskService.getAll()
      return tasks
    } catch (error) {
      // errorHandler middleware catches this
      throw error
    }
  })

  // POST /tasks
  fastify.post<{ Body: CreateTaskRequest; Reply: Task }>('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const task = await taskService.create(req.body)
    reply.status(201)
    return task
  })

  // PATCH /tasks/:id
  fastify.patch<{ Params: { id: string }; Body: UpdateTaskRequest; Reply: Task }>('/:id', async (req, reply) => {
    const task = await taskService.update(Number(req.params.id), req.body)
    return task
  })

  // DELETE /tasks/:id
  fastify.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    await taskService.delete(Number(req.params.id))
    return reply.status(200)
  })
}
```

### Frontend Component Story

Template:

```typescript
// components/TaskList.tsx

import React from 'react'
import { useTasks } from '../hooks/useTasks'
import { TaskCard } from './TaskCard'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorMessage } from './ErrorMessage'
import { EmptyState } from './EmptyState'

export const TaskList: React.FC = () => {
  const { data: tasks, isLoading, error } = useTasks()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!tasks?.length) return <EmptyState />

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
```

### React Hook Story

Template:

```typescript
// hooks/useCreateTask.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService } from '../services/taskService'
import { taskKeys } from './queryKeys'
import { CreateTaskRequest, Task } from '@shared-types'

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (req: CreateTaskRequest) => taskService.create(req),
    onMutate: async (newTask) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: taskKeys.all })
      const previousData = queryClient.getQueryData<Task[]>(taskKeys.all)

      if (previousData) {
        const optimisticTask: Task = {
          id: -1, // Temporary ID
          ...newTask,
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: null,
        }
        queryClient.setQueryData(taskKeys.all, [...previousData, optimisticTask])
      }

      return { previousData }
    },
    onError: (err, newTask, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(taskKeys.all, context.previousData)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}
```

---

## Quick Checklist for Each Story

Before marking a story complete:

- [ ] All acceptance criteria met and tested
- [ ] Naming conventions followed (database/API/code)
- [ ] Type safety: All types from @shared-types, no `any`
- [ ] Error handling: Proper error classes and mapping
- [ ] Performance: Validated against targets (if applicable)
- [ ] Accessibility: WCAG AA requirements (if frontend)
- [ ] Tests: Unit tests included and passing
- [ ] No console errors or warnings
- [ ] Code follows patterns in this document

---

## Getting Help

If unsure about a pattern:

1. Check this document first (AGENTS.md)
2. Review the architecture.md for design decisions
3. Look at existing code in the same directory for patterns
4. Reference the epic story's acceptance criteria

Remember: **Simplicity is valued. When in doubt, choose the simpler solution.**