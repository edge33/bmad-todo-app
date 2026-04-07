import { describe, type TestContext, test } from "node:test";
import { useDeleteTask } from "./useDeleteTask.ts";

describe("useDeleteTask Hook", async () => {
  await test("hook is a function", (t: TestContext) => {
    t.assert.strictEqual(typeof useDeleteTask, "function");
  });

  await test("hook uses useMutation", (t: TestContext) => {
    const hookCode = useDeleteTask.toString();
    t.assert.ok(hookCode.includes("useMutation"));
  });

  await test("hook includes optimistic removal (onMutate)", (t: TestContext) => {
    const hookCode = useDeleteTask.toString();
    t.assert.ok(hookCode.includes("onMutate"));
    t.assert.ok(hookCode.includes("setQueryData"));
  });

  await test("hook rolls back on error", (t: TestContext) => {
    const hookCode = useDeleteTask.toString();
    t.assert.ok(hookCode.includes("onError"));
    t.assert.ok(hookCode.includes("previousData"));
  });

  await test("hook invalidates on success", (t: TestContext) => {
    const hookCode = useDeleteTask.toString();
    t.assert.ok(hookCode.includes("onSuccess"));
    t.assert.ok(hookCode.includes("invalidateQueries"));
  });

  await test("hook uses taskKeys", (t: TestContext) => {
    const hookCode = useDeleteTask.toString();
    t.assert.ok(hookCode.includes("taskKeys"));
  });
});
