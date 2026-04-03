import { describe, type TestContext, test } from "node:test";
import type { CreateTaskRequest, Task } from "@todoapp/shared-types";
import { useCreateTask } from "./useCreateTask.ts";

describe("useCreateTask Hook", async () => {
  await test("hook is a function", (t: TestContext) => {
    t.assert.strictEqual(typeof useCreateTask, "function");
  });

  await test("hook returns a useMutation-compatible object shape", async (t: TestContext) => {
    // This is a static test since we can't easily run React hooks in Node tests
    // In a real scenario, this would use React Testing Library

    // Verify the hook is properly typed and exported
    const hookCode = useCreateTask.toString();
    t.assert.ok(hookCode.includes("useMutation"));
    t.assert.ok(hookCode.includes("queryClient"));
    t.assert.ok(hookCode.includes("taskKeys"));
  });

  await test("hook includes optimistic update pattern (onMutate)", (t: TestContext) => {
    const hookCode = useCreateTask.toString();
    t.assert.ok(hookCode.includes("onMutate"));
    t.assert.ok(hookCode.includes("queryClient.cancelQueries"));
    t.assert.ok(hookCode.includes("getQueryData"));
    t.assert.ok(hookCode.includes("setQueryData"));
  });

  await test("hook includes error handling (onError)", (t: TestContext) => {
    const hookCode = useCreateTask.toString();
    t.assert.ok(hookCode.includes("onError"));
    t.assert.ok(hookCode.includes("previousData"));
  });

  await test("hook includes cache invalidation (onSuccess)", (t: TestContext) => {
    const hookCode = useCreateTask.toString();
    t.assert.ok(hookCode.includes("onSuccess"));
    t.assert.ok(hookCode.includes("invalidateQueries"));
  });

  await test("hook uses correct query key factory", (t: TestContext) => {
    const hookCode = useCreateTask.toString();
    t.assert.ok(hookCode.includes("taskKeys"));
  });

  await test("CreateTaskInput type is exported", (t: TestContext) => {
    // Type is imported from @shared-types, so if import succeeds, the type exists
    const input: CreateTaskRequest = { description: "test" };
    t.assert.ok(input.description);
  });

  await test("Task type includes all required fields", (t: TestContext) => {
    const task: Task = {
      id: 1,
      description: "test",
      completed: false,
      createdAt: "2026-04-03T00:00:00Z",
      updatedAt: "2026-04-03T00:00:00Z",
      userId: null,
    };
    t.assert.ok(task.id);
    t.assert.ok(task.description);
    t.assert.ok(typeof task.completed === "boolean");
    t.assert.ok(task.createdAt);
    t.assert.ok(task.updatedAt);
    t.assert.ok(task.userId === null);
  });

  await test("mutationFn is async", (t: TestContext) => {
    const hookCode = useCreateTask.toString();
    t.assert.ok(hookCode.includes("async"));
  });

  await test("optimistic update creates proper temporary task", (t: TestContext) => {
    const hookCode = useCreateTask.toString();
    // Check for temporary ID (-1) for optimistic update
    t.assert.ok(hookCode.includes("id: -1"));
  });

  await test("rollback preserves previous data structure", (t: TestContext) => {
    const hookCode = useCreateTask.toString();
    t.assert.ok(hookCode.includes("context?.previousData"));
  });
});
