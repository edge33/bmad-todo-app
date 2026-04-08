# Mutation Patterns — Optimistic Updates

## Overview

All mutations in this app follow a **three-phase pattern** using TanStack Query v5: snapshot, update, rollback. This ensures instant UI feedback while guaranteeing consistency if the server request fails.

## The Three Phases

### Phase 1 — Snapshot (onMutate)

Before the mutation fires, cancel any in-flight queries that would overwrite the optimistic update, then snapshot the current cache state for rollback.

```ts
onMutate: async (variables) => {
  await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
  const previousData = queryClient.getQueryData<Task[]>(taskKeys.lists());
  queryClient.setQueryData<Task[]>(taskKeys.lists(), (old = []) => [
    ...old,
    { ...variables, id: Date.now(), completed: false },
  ]);
  return { previousData };
},
```

### Phase 2 — Rollback (onError)

If the server returns an error, restore the snapshot captured in Phase 1.

```ts
onError: (_error, _variables, context) => {
  if (context?.previousData !== undefined) {
    queryClient.setQueryData(taskKeys.lists(), context.previousData);
  }
},
```

### Phase 3 — Confirmation (onSuccess / onSettled)

After a successful server response, invalidate the query so TanStack Query refetches the authoritative list from the server.

```ts
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
},
```

## Key Principles

- **Always cancel queries** before applying an optimistic update (`cancelQueries`) — prevents a stale background refetch from overwriting the optimistic state.
- **Always snapshot** before mutating the cache — without this, `onError` has nothing to roll back to.
- **Use `taskKeys` factory** for all cache operations — mismatched keys silently write to the wrong cache entry.
- **Temporary IDs** for optimistic records should be clearly distinguishable (e.g. negative numbers or a `__optimistic` flag) so they can be replaced when the server returns the real ID.
- **Invalidate on success**, not on settle — invalidating on settle means refetching even when the mutation failed, which can confuse users.

## Testing Mutations

When testing hooks that follow this pattern:

1. Assert that `cancelQueries` is called with the correct key before the mutation fires.
2. Assert that `setQueryData` writes the expected optimistic value.
3. Trigger `onError` with a mock context and assert `setQueryData` restores the snapshot.
4. Trigger `onSuccess` and assert `invalidateQueries` is called with the correct key.

See `useCreateTask.test.ts` for a complete example.
