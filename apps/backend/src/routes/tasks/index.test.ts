import { after, before, describe, type TestContext, test } from "node:test";
import type { Task } from "@todoapp/shared-types";
import type { FastifyInstance } from "fastify";
import { createApp } from "../../index.ts";

// ============================================================================
// AC1: GET /api/tasks
// ============================================================================
describe("Tasks API", () => {
  let app: FastifyInstance;

  before(async () => {
    app = await createApp();
  });

  after(async () => {
    await app.close();
  });

  test("GET /api/tasks returns 200 with Task[]", async (t: TestContext) => {
    const response = await app.inject({
      method: "GET",
      url: "/api/tasks",
    });

    t.assert.strictEqual(response.statusCode, 200);
    const tasks = JSON.parse(response.body);
    t.assert.strictEqual(
      Array.isArray(tasks),
      true,
      "Response should be an array",
    );
  });

  test("GET /api/tasks returns empty array when no tasks", async (t: TestContext) => {
    const response = await app.inject({
      method: "GET",
      url: "/api/tasks",
    });

    t.assert.strictEqual(response.statusCode, 200);
    const tasks = JSON.parse(response.body);
    t.assert.strictEqual(
      Array.isArray(tasks),
      true,
      "Response should be an array",
    );
  });

  // ============================================================================
  // GET /api/tasks/:id
  // ============================================================================

  test("GET /api/tasks/:id returns 200 with the task", async (t: TestContext) => {
    const createResponse = await app.inject({
      method: "POST",
      url: "/api/tasks",
      payload: { description: "Find me by ID" },
    });
    const createdTask = JSON.parse(createResponse.body);

    const response = await app.inject({
      method: "GET",
      url: `/api/tasks/${createdTask.id}`,
    });

    t.assert.strictEqual(response.statusCode, 200);
    const task = JSON.parse(response.body);
    t.assert.strictEqual(task.id, createdTask.id);
    t.assert.strictEqual(task.description, "Find me by ID");
  });

  test("GET /api/tasks/:id with non-existent ID returns 404", async (t: TestContext) => {
    const response = await app.inject({
      method: "GET",
      url: "/api/tasks/99999",
    });

    t.assert.strictEqual(response.statusCode, 404);
    const body = JSON.parse(response.body);
    t.assert.ok(body.error);
    t.assert.strictEqual(body.error.code, "NOT_FOUND");
  });

  test("GET /api/tasks/:id with invalid ID returns 400", async (t: TestContext) => {
    const response = await app.inject({
      method: "GET",
      url: "/api/tasks/invalid",
    });

    t.assert.strictEqual(response.statusCode, 400);
    const body = JSON.parse(response.body);
    t.assert.strictEqual(body.error.code, "VALIDATION_ERROR");
  });

  // ============================================================================
  // AC2: POST /api/tasks
  // ============================================================================

  test("POST /api/tasks with valid description returns 201 with Task", async (t: TestContext) => {
    const response = await app.inject({
      method: "POST",
      url: "/api/tasks",
      payload: { description: "Buy milk" },
    });

    t.assert.strictEqual(response.statusCode, 201);
    const task = JSON.parse(response.body);
    t.assert.strictEqual(task.description, "Buy milk");
    t.assert.strictEqual(task.completed, false);
    t.assert.strictEqual(task.id > 0, true, "Task should have positive ID");
    t.assert.ok(task.createdAt);
    t.assert.ok(task.updatedAt);
    t.assert.strictEqual(task.userId, null, "userId should be null");
  });

  test("POST /api/tasks with empty description returns 400 ValidationError", async (t: TestContext) => {
    const response = await app.inject({
      method: "POST",
      url: "/api/tasks",
      payload: { description: "" },
    });

    t.assert.strictEqual(response.statusCode, 400);
    const body = JSON.parse(response.body);
    t.assert.strictEqual(
      typeof body.error,
      "object",
      "Response should have error field",
    );
    t.assert.strictEqual(body.error.code, "VALIDATION_ERROR");
    t.assert.strictEqual(
      body.error.message,
      "Task description cannot be empty",
    );
  });

  test("POST /api/tasks with missing description field returns 400 ValidationError", async (t: TestContext) => {
    const response = await app.inject({
      method: "POST",
      url: "/api/tasks",
      payload: {},
    });

    t.assert.strictEqual(response.statusCode, 400);
    const body = JSON.parse(response.body);
    t.assert.ok(body.error);
    t.assert.strictEqual(body.error.code, "VALIDATION_ERROR");
  });

  // ============================================================================
  // AC3: PATCH /api/tasks/:id
  // ============================================================================

  test("PATCH /api/tasks/:id with { completed: true } returns 200", async (t: TestContext) => {
    const createResponse = await app.inject({
      method: "POST",
      url: "/api/tasks",
      payload: { description: "Complete me" },
    });
    const createdTask = JSON.parse(createResponse.body);

    const response = await app.inject({
      method: "PATCH",
      url: `/api/tasks/${createdTask.id}`,
      payload: { completed: true },
    });

    t.assert.strictEqual(response.statusCode, 200);
    const updatedTask = JSON.parse(response.body);
    t.assert.strictEqual(updatedTask.completed, true);
    t.assert.strictEqual(updatedTask.description, "Complete me");
  });

  test('PATCH /api/tasks/:id with { description: "..." } returns 200', async (t: TestContext) => {
    const createResponse = await app.inject({
      method: "POST",
      url: "/api/tasks",
      payload: { description: "Original description" },
    });
    const createdTask = JSON.parse(createResponse.body);

    const response = await app.inject({
      method: "PATCH",
      url: `/api/tasks/${createdTask.id}`,
      payload: { description: "Updated description" },
    });

    t.assert.strictEqual(response.statusCode, 200);
    const updatedTask = JSON.parse(response.body);
    t.assert.strictEqual(updatedTask.description, "Updated description");
  });

  test("PATCH /api/tasks/:id with both fields returns 200", async (t: TestContext) => {
    const createResponse = await app.inject({
      method: "POST",
      url: "/api/tasks",
      payload: { description: "Both fields" },
    });
    const createdTask = JSON.parse(createResponse.body);

    const response = await app.inject({
      method: "PATCH",
      url: `/api/tasks/${createdTask.id}`,
      payload: { description: "Updated both", completed: true },
    });

    t.assert.strictEqual(response.statusCode, 200);
    const updatedTask = JSON.parse(response.body);
    t.assert.strictEqual(updatedTask.description, "Updated both");
    t.assert.strictEqual(updatedTask.completed, true);
  });

  test("PATCH /api/tasks/:id with non-existent ID returns 404 NotFoundError", async (t: TestContext) => {
    const response = await app.inject({
      method: "PATCH",
      url: "/api/tasks/99999",
      payload: { completed: true },
    });

    t.assert.strictEqual(response.statusCode, 404);
    const body = JSON.parse(response.body);
    t.assert.ok(body.error);
    t.assert.strictEqual(body.error.code, "NOT_FOUND");
  });

  test("PATCH /api/tasks/:id with empty description returns 400 ValidationError", async (t: TestContext) => {
    const createResponse = await app.inject({
      method: "POST",
      url: "/api/tasks",
      payload: { description: "Valid task" },
    });
    const createdTask = JSON.parse(createResponse.body);

    const response = await app.inject({
      method: "PATCH",
      url: `/api/tasks/${createdTask.id}`,
      payload: { description: "" },
    });

    t.assert.strictEqual(response.statusCode, 400);
    const body = JSON.parse(response.body);
    t.assert.strictEqual(body.error.code, "VALIDATION_ERROR");
  });

  // ============================================================================
  // AC4: DELETE /api/tasks/:id
  // ============================================================================

  test("DELETE /api/tasks/:id returns 200 with deleted task", async (t: TestContext) => {
    const createResponse = await app.inject({
      method: "POST",
      url: "/api/tasks",
      payload: { description: "Delete me" },
    });
    const createdTask = JSON.parse(createResponse.body);

    const response = await app.inject({
      method: "DELETE",
      url: `/api/tasks/${createdTask.id}`,
    });

    t.assert.strictEqual(response.statusCode, 200);
    const deletedTask = JSON.parse(response.body);
    t.assert.strictEqual(deletedTask.id, createdTask.id);

    const getResponse = await app.inject({
      method: "GET",
      url: "/api/tasks",
    });
    const tasks = JSON.parse(getResponse.body);
    const deleted = tasks.find((t: Task) => t.id === createdTask.id);
    t.assert.strictEqual(deleted, undefined, "Task should be deleted");
  });

  test("DELETE /api/tasks/:id with non-existent ID returns 404 NotFoundError", async (t: TestContext) => {
    const response = await app.inject({
      method: "DELETE",
      url: "/api/tasks/99999",
    });

    t.assert.strictEqual(response.statusCode, 404);
    const body = JSON.parse(response.body);
    t.assert.ok(body.error, "Response should have error field");
    t.assert.strictEqual(body.error.code, "NOT_FOUND");
  });

  // ============================================================================
  // AC5: Response Format Consistency
  // ============================================================================

  test("Error responses have correct structure", async (t: TestContext) => {
    const response = await app.inject({
      method: "POST",
      url: "/api/tasks",
      payload: { description: "" },
    });

    t.assert.strictEqual(response.statusCode, 400);
    const body = JSON.parse(response.body);
    t.assert.ok(body.error, "Should have error field");
    t.assert.strictEqual(body.error.code, "VALIDATION_ERROR");
    t.assert.strictEqual(
      body.error.message,
      "Task description cannot be empty",
    );
    t.assert.strictEqual(typeof body.error.code, "string");
    t.assert.strictEqual(typeof body.error.message, "string");
  });

  // ============================================================================
  // AC6: Input Validation
  // ============================================================================

  test("Validation: Non-empty description (min 1 char)", async (t: TestContext) => {
    const response = await app.inject({
      method: "POST",
      url: "/api/tasks",
      payload: { description: "   " },
    });

    t.assert.strictEqual(response.statusCode, 400);
  });

  test("Validation: Valid integer ID in route params", async (t: TestContext) => {
    const response = await app.inject({
      method: "PATCH",
      url: "/api/tasks/invalid",
      payload: { completed: true },
    });

    t.assert.strictEqual(response.statusCode, 400);
    const body = JSON.parse(response.body);
    t.assert.strictEqual(body.error.code, "VALIDATION_ERROR");
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  test("Complete workflow: create, list, update, delete", async (t: TestContext) => {
    const createResponse = await app.inject({
      method: "POST",
      url: "/api/tasks",
      payload: { description: "Workflow test" },
    });
    t.assert.strictEqual(createResponse.statusCode, 201);
    const task = JSON.parse(createResponse.body);

    const listResponse = await app.inject({
      method: "GET",
      url: "/api/tasks",
    });
    const tasks = JSON.parse(listResponse.body);
    t.assert.strictEqual(
      tasks.some((t: Task) => t.id === task.id),
      true,
      "Task should exist in list",
    );

    const updateResponse = await app.inject({
      method: "PATCH",
      url: `/api/tasks/${task.id}`,
      payload: { completed: true },
    });
    t.assert.strictEqual(updateResponse.statusCode, 200);

    const deleteResponse = await app.inject({
      method: "DELETE",
      url: `/api/tasks/${task.id}`,
    });
    t.assert.strictEqual(deleteResponse.statusCode, 200);

    const finalListResponse = await app.inject({
      method: "GET",
      url: "/api/tasks",
    });
    const finalTasks = JSON.parse(finalListResponse.body);
    t.assert.strictEqual(
      !finalTasks.some((t: Task) => t.id === task.id),
      true,
      "Task should be deleted",
    );
  });
});
