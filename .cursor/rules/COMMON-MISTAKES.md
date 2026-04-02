# Common Implementation Mistakes to Avoid

This guide highlights frequent mistakes that AI agents (and developers) make when implementing todoapp, and how to prevent them.

## Critical Mistakes

### 1. ❌ Mixing Response Formats

```typescript
// WRONG: Wrapped response
{ success: true, data: { id: 1, description: "...", ... } }

// WRONG: Direct object when array expected
{ id: 1, description: "...", ... }  // Should return array for GET /tasks

// RIGHT: Direct response
[{ id: 1, description: "...", ... }]  // GET /tasks returns array

// RIGHT: Direct object for single item or POST
{ id: 1, description: "...", ... }
```

**Why:** Frontend expects specific format. Mixing formats breaks parsing.

---

### 2. ❌ Inconsistent Error Handling

```typescript
// WRONG: Sometimes throw raw Error, sometimes custom class
throw new Error('Task not found')  // Later: throw new NotFoundError(...)

// WRONG: Error mapping in multiple places
// route1.ts: return { status: 404, message: 'not found' }
// route2.ts: return { status: 404, error: { code: 'NOT_FOUND' } }

// RIGHT: Always use custom error classes
throw new NotFoundError('Task', id)

// RIGHT: Single error handler middleware
errorHandler.ts → maps all errors consistently
```

**Why:** Frontend error mapping depends on consistent error format.

---

### 3. ❌ Using Wrong Database Column Names

```typescript
// WRONG: snake_case
const task = await prisma.task.create({
  data: { user_id: 1, created_at: now, task_description: '...' }
})

// WRONG: Prefixes
const task = await prisma.task.create({
  data: { fk_user_id: 1, id_task: 1 }
})

// RIGHT: camelCase for columns
const task = await prisma.task.create({
  data: { userId: 1, description: '...' }
})
```

**Why:** Schema uses camelCase. Mismatch causes runtime errors.

---

### 4. ❌ API Endpoint Naming Errors

```typescript
// WRONG: Singular
GET /api/task
POST /api/task

// WRONG: Underscored
GET /api/get_tasks
POST /api/create_task

// WRONG: Action-based naming
POST /api/tasks/toggle-complete/:id

// RIGHT: Plural resource, HTTP verbs for actions
GET /api/tasks                    // List all
POST /api/tasks                   // Create new
PATCH /api/tasks/:id              // Update (including toggle complete)
DELETE /api/tasks/:id             // Delete
```

**Why:** REST convention. Frontend routes expect these endpoints.

---

### 5. ❌ Forgetting Cache Invalidation

```typescript
// WRONG: Update data but forget to invalidate
useMutation({
  mutationFn: updateTask,
  onSuccess: (data) => {
    // Data is stale! Not invalidated.
  }
})

// RIGHT: Invalidate cache after mutation
useMutation({
  mutationFn: updateTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: taskKeys.all })
  }
})
```

**Why:** Without invalidation, users see stale data after mutations.

---

### 6. ❌ Breaking Optimistic Updates

```typescript
// WRONG: No rollback on error
onMutate: async (newData) => {
  queryClient.setQueryData(taskKeys.all, updated)
  // If mutation fails, data is wrong and stays wrong
}

// WRONG: Not snapshotting previous data
onMutate: async (newData) => {
  queryClient.setQueryData(taskKeys.all, updated)
  return {} // No context to rollback
}

// RIGHT: Snapshot, update, rollback on error
onMutate: async (newData) => {
  const previousData = queryClient.getQueryData(taskKeys.all)
  queryClient.setQueryData(taskKeys.all, updated)
  return { previousData }
},
onError: (err, newData, context) => {
  if (context?.previousData) {
    queryClient.setQueryData(taskKeys.all, context.previousData)
  }
}
```

**Why:** Optimistic updates must rollback on failure to prevent broken state.

---

### 7. ❌ Importing from Wrong Package

```typescript
// WRONG: Defining local types instead of using shared
interface Task { id: number; description: string }

// WRONG: Mixing types between frontend and backend definitions
// Frontend Task vs Backend Task (different fields)

// RIGHT: Import from @shared-types
import { Task, CreateTaskRequest } from '@shared-types'

// Then use everywhere (frontend and backend)
const task: Task = ...
```

**Why:** Frontend and backend must use same types to prevent misalignment.

---

### 8. ❌ Component Organization Mistakes

```typescript
// WRONG: Random placement
src/
  TaskList.tsx
  TaskItem.tsx
  TaskContainer.tsx
  containers/
    Task.tsx
  utils/
    TaskComponent.tsx

// WRONG: Mixing components with logic
export const TaskList = () => {
  // API calls here
  const response = await fetch(...)
  // Business logic here
  const filtered = tasks.filter(...)
  // Component rendering here
  return <div>...</div>
}

// RIGHT: Clear structure
src/
  components/
    TaskList.tsx
    TaskCard.tsx
    TaskForm.tsx
  hooks/
    useTasks.ts           // Query logic
    useCreateTask.ts      // Mutation logic
  services/
    taskService.ts        // API calls

// RIGHT: Separate concerns
// TaskList.tsx - Just renders component
// useTasks.ts - Handles data fetching
// taskService.ts - Makes API calls
```

**Why:** Clear separation makes code findable and testable.

---

### 9. ❌ Performance Issues

```typescript
// WRONG: Large bundle
import * from '@tanstack/react-query'  // Not tree-shaken
import lodash from 'lodash'             // Full library included

// WRONG: Unnecessary re-renders
const TaskList = () => {
  const tasks = useTasks()
  const getTasks = () => tasks        // Function created every render
  return <TaskCard getTasks={getTasks} />
}

// WRONG: No memoization where needed
export const TaskCard = ({ task }) => {
  // Re-renders even if task hasn't changed
}

// RIGHT: Import only what you need
import { useQuery } from '@tanstack/react-query'
import { filter } from 'lodash-es'

// RIGHT: Memoize expensive components
export const TaskCard = React.memo(({ task }: Props) => {
  // Only re-renders if task changes
})

// RIGHT: Use useCallback for stable function references
const getTasks = useCallback(() => tasks, [tasks])
```

**Why:** Performance is a top-level requirement. Bundle size must stay <100KB.

---

### 10. ❌ Accessibility Mistakes

```typescript
// WRONG: No keyboard support
<div onClick={handleComplete} className="task">...</div>

// WRONG: Color as only indicator
<span style={{ color: completed ? 'green' : 'gray' }}>
  {task.description}
</span>

// WRONG: Missing labels
<input placeholder="Add task" />

// WRONG: Touch target too small
<button style={{ width: '20px', height: '20px' }}>×</button>

// RIGHT: Full keyboard support
<button onClick={handleComplete} onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') handleComplete()
}}>
  {task.description}
</button>

// RIGHT: Color + symbol/text indicator
<span className={completed ? 'completed' : ''}>
  {completed && <CheckIcon />}
  {task.description}
</span>

// RIGHT: Associated label
<label htmlFor="taskInput">Add a task</label>
<input id="taskInput" placeholder="Task description" />

// RIGHT: Touch target minimum 44x44px
<button style={{ minWidth: '44px', minHeight: '44px' }}>×</button>
```

**Why:** WCAG AA compliance is a requirement. Accessibility isn't optional.

---

## Common Pattern Mistakes

### 11. ❌ Wrong Hook Names

```typescript
// WRONG
const getTasks = useFetchTasks()
const task = useTaskData()
const addTask = useAddTask()

// RIGHT (consistent naming)
const { data: tasks } = useTasks()
const { mutate: createTask } = useCreateTask()
const { mutate: updateTask } = useUpdateTask()
const { mutate: deleteTask } = useDeleteTask()
```

**Why:** Consistent naming makes patterns predictable across codebase.

---

### 12. ❌ Type Safety Violations

```typescript
// WRONG: Using `any`
const handleComplete = (task: any) => {
  // Lost type safety
}

// WRONG: Type mismatch
const task: Task = {
  id: 1,
  // Missing required fields
}

// RIGHT: Full type safety
const handleComplete = (task: Task) => {
  // All properties available, type-checked
}

const task: Task = {
  id: 1,
  userId: null,
  description: 'Buy milk',
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}
```

**Why:** Type safety prevents runtime errors and aids IDE support.

---

### 13. ❌ File Naming Issues

```typescript
// WRONG: Inconsistent naming
TaskList.tsx
task-card.tsx
taskForm.TSX
utils.ts
TASK_SERVICE.TS

// WRONG: Non-component files capitalized like components
Components.tsx     // Looks like component, but isn't
Utils.tsx          // Looks like component, but isn't

// RIGHT: Consistent PascalCase for components
TaskList.tsx
TaskCard.tsx
TaskForm.tsx

// RIGHT: camelCase for non-components
taskService.ts
utils.ts
queryKeys.ts
```

**Why:** Naming convention tells you what a file is at a glance.

---

### 14. ❌ Environment Variable Mistakes

```typescript
// WRONG: Hardcoded API URL
const API_URL = 'http://localhost:3000'

// WRONG: VITE_ prefix missing (Vite requirement)
const apiUrl = process.env.API_URL

// RIGHT: Vite convention for frontend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// RIGHT: Standard .env file
VITE_API_URL=http://localhost:3000
```

**Why:** Environment variables enable different configs for dev/prod.

---

### 15. ❌ Testing Placement

```typescript
// WRONG: Separate tests folder
tests/
  components/
    TaskCard.test.tsx

// WRONG: __tests__ subfolder
__tests__/
  taskService.test.tsx

// RIGHT: Co-located with code
components/
  TaskCard.tsx
  TaskCard.test.tsx

services/
  taskService.ts
  taskService.test.ts
```

**Why:** Co-located tests are easier to maintain and update with code changes.

---

## Validation Checklist

Before marking any story complete:

```
Naming & Organization:
  ☐ Database: PascalCase table, camelCase columns
  ☐ API: /api/tasks pattern, kebab-case paths
  ☐ Code: PascalCase components, camelCase functions
  ☐ Files: Organized in proper folders per AGENTS.md

Type Safety:
  ☐ All types from @shared-types
  ☐ No `any` types
  ☐ TypeScript strict mode passes

Error Handling:
  ☐ Custom error classes (ValidationError, NotFoundError)
  ☐ Consistent error mapping in middleware
  ☐ User-friendly error messages on frontend

Performance:
  ☐ No console warnings
  ☐ Bundle size validated (if frontend)
  ☐ API response time acceptable (if backend)

Accessibility (Frontend):
  ☐ Keyboard navigation works
  ☐ Screen reader labels present
  ☐ Color contrast ≥ 4.5:1
  ☐ Touch targets ≥ 44x44px

Testing:
  ☐ Tests co-located with code
  ☐ All tests passing
  ☐ Acceptance criteria covered by tests

State Management (Frontend):
  ☐ Uses TanStack Query patterns
  ☐ Optimistic updates implemented
  ☐ Cache invalidation on success
  ☐ Proper rollback on error
```

---

## Quick Reference

| Category | Rule | Example |
|----------|------|---------|
| **Database** | PascalCase + camelCase | `Task.userId` |
| **API** | Plural + kebab-case + status codes | `GET /api/tasks` → 200 |
| **Code** | Component/Hook/File patterns | `TaskCard.tsx`, `useTasks.ts` |
| **Types** | All from @shared-types | `import { Task } from '@shared-types'` |
| **Errors** | Custom classes + consistent mapping | `throw new NotFoundError(...)` |
| **State** | TanStack Query patterns | `useQuery`, `useMutation` |
| **Performance** | <100KB, <100ms, <1s | Validate in build/tests |
| **Accessibility** | WCAG AA compliance | Keyboard nav, labels, contrast |

---

## Need Help?

If you're unsure:

1. Check AGENTS.md (this directory) for the pattern
2. Look at existing code in the same directory
3. Review the architecture.md document
4. Read the epic story's acceptance criteria

**Remember: Simplicity is valued. When in doubt, choose the simpler solution.**