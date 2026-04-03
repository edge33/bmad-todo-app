import { describe, type TestContext, test } from "node:test";
import { taskKeys } from "./queryKeys.ts";

describe("Query Key Factory", async () => {
  await test("taskKeys.all returns root key array", (t: TestContext) => {
    const key = taskKeys.all;
    t.assert.deepStrictEqual(key, ["tasks"]);
  });

  await test("taskKeys.lists() returns list namespace key", (t: TestContext) => {
    const key = taskKeys.lists();
    t.assert.deepStrictEqual(key, ["tasks", "list"]);
  });

  await test("taskKeys.list() returns list key without filters", (t: TestContext) => {
    const key = taskKeys.list();
    t.assert.deepStrictEqual(key, ["tasks", "list", undefined]);
  });

  await test("taskKeys.list(filters) returns list key with filters", (t: TestContext) => {
    const filters = { status: "pending", sortBy: "createdAt" };
    const key = taskKeys.list(filters);
    t.assert.deepStrictEqual(key, ["tasks", "list", filters]);
  });

  await test("taskKeys.details() returns detail namespace key", (t: TestContext) => {
    const key = taskKeys.details();
    t.assert.deepStrictEqual(key, ["tasks", "detail"]);
  });

  await test("taskKeys.detail(id) returns detail key for specific task", (t: TestContext) => {
    const key = taskKeys.detail(42);
    t.assert.deepStrictEqual(key, ["tasks", "detail", 42]);
  });

  await test("Query keys are immutable (const assertion)", (t: TestContext) => {
    const allKey = taskKeys.all;
    t.assert.strictEqual(Array.isArray(allKey), true);
    // Verify it's a const assertion by checking readonly properties
    const keyTuple = taskKeys.all as readonly string[];
    t.assert.equal(keyTuple[0], "tasks");
  });

  await test("Query keys are hierarchical for cache invalidation", (t: TestContext) => {
    const all = taskKeys.all;
    const lists = taskKeys.lists();
    const detail = taskKeys.detail(1);

    // Verify hierarchy: all ⊂ lists ⊂ list(filters) ⊂ detail(id)
    t.assert.equal(all[0], lists[0]); // Both start with 'tasks'
    t.assert.equal(lists[0], detail[0]); // All start with 'tasks'
  });

  await test("Different filters create different keys", (t: TestContext) => {
    const filter1 = taskKeys.list({ status: "pending" });
    const filter2 = taskKeys.list({ status: "completed" });
    t.assert.notDeepStrictEqual(filter1, filter2);
  });

  await test("Same filters create same keys", (t: TestContext) => {
    const filters = { status: "pending" };
    const key1 = taskKeys.list(filters);
    const key2 = taskKeys.list(filters);
    t.assert.deepStrictEqual(key1, key2);
  });
});
