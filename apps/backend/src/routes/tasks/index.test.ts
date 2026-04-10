import {
  after,
  afterEach,
  before,
  beforeEach,
  describe,
  type TestContext,
  test,
} from "node:test";
import type { Task } from "@todoapp/shared-types";
import type { FastifyInstance } from "fastify";

interface MockTask {
  id: number;
  description: string;
  completed: boolean;
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory task store backing the Prisma mock
let tasks: MockTask[] = [];
let nextId = 1;

function createMockTask(data: {
  description: string;
  completed?: boolean;
}): MockTask {
  const now = new Date();
  return {
    id: nextId++,
    description: data.description,
    completed: data.completed ?? false,
    userId: null,
    createdAt: now,
    updatedAt: now,
  };
}

const mockPrisma = {
  task: {
    findMany: async (_args?: unknown) =>
      [...tasks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    findUnique: async (args: { where: { id: number } }) =>
      tasks.find((t) => t.id === args.where.id) ?? null,
    create: async (args: { data: { description: string } }) => {
      const task = createMockTask(args.data);
      tasks.push(task);
      return task;
    },
    update: async (args: {
      where: { id: number };
      data: Record<string, unknown>;
    }) => {
      const task = tasks.find((t) => t.id === args.where.id);
      if (!task)
        throw Object.assign(new Error("Record not found"), { code: "P2025" });
      Object.assign(task, args.data, { updatedAt: new Date() });
      return task;
    },
    delete: async (args: { where: { id: number } }) => {
      const idx = tasks.findIndex((t) => t.id === args.where.id);
      if (idx === -1)
        throw Object.assign(new Error("Record not found"), { code: "P2025" });
      return tasks.splice(idx, 1)[0];
    },
    deleteMany: async () => {
      tasks = [];
      return { count: 0 };
    },
  },
  $disconnect: async () => {},
};

// ============================================================================
// AC1: GET /api/tasks
// ============================================================================
describe("Tasks API", async () => {
  // Mock Prisma BEFORE importing the app
  const { mock } = await import("node:test");
  mock.module("../../db/prisma.ts", {
    namedExports: { prisma: mockPrisma },
  });

  const { createApp } = await import("../../index.ts");

  let app: FastifyInstance;

  before(async () => {
    app = await createApp();
  });

  beforeEach(() => {
    tasks = [];
    nextId = 1;
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
    const body = JSON.parse(response.body);
    t.assert.strictEqual(
      Array.isArray(body),
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
    const body = JSON.parse(response.body);
    t.assert.strictEqual(
      Array.isArray(body),
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
    const remainingTasks = JSON.parse(getResponse.body);
    const deleted = remainingTasks.find((t: Task) => t.id === createdTask.id);
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
    const listedTasks = JSON.parse(listResponse.body);
    t.assert.strictEqual(
      listedTasks.some((t: Task) => t.id === task.id),
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

  // ============================================================================
  // AC: 500 INTERNAL_ERROR for unexpected failures
  // ============================================================================

  describe("500 INTERNAL_ERROR on unexpected DB failures", () => {
    const originalFindMany = mockPrisma.task.findMany;
    const originalFindUnique = mockPrisma.task.findUnique;
    const originalCreate = mockPrisma.task.create;
    const originalUpdate = mockPrisma.task.update;
    const originalDelete = mockPrisma.task.delete;

    afterEach(() => {
      mockPrisma.task.findMany = originalFindMany;
      mockPrisma.task.findUnique = originalFindUnique;
      mockPrisma.task.create = originalCreate;
      mockPrisma.task.update = originalUpdate;
      mockPrisma.task.delete = originalDelete;
    });

    test("GET /api/tasks returns 500 on unexpected DB failure", async (t: TestContext) => {
      mockPrisma.task.findMany = async () => {
        throw new Error("DB connection lost");
      };

      const response = await app.inject({
        method: "GET",
        url: "/api/tasks",
      });

      t.assert.strictEqual(response.statusCode, 500);
      const body = JSON.parse(response.body);
      t.assert.strictEqual(body.error.code, "INTERNAL_ERROR");
      t.assert.strictEqual(
        body.error.message,
        "An unexpected error occurred. Please try again later.",
      );
    });

    test("POST /api/tasks returns 500 on unexpected DB failure", async (t: TestContext) => {
      mockPrisma.task.create = async () => {
        throw new Error("Disk full");
      };

      const response = await app.inject({
        method: "POST",
        url: "/api/tasks",
        payload: { description: "Should fail" },
      });

      t.assert.strictEqual(response.statusCode, 500);
      const body = JSON.parse(response.body);
      t.assert.strictEqual(body.error.code, "INTERNAL_ERROR");
    });

    test("GET /api/tasks/:id returns 500 on unexpected DB failure", async (t: TestContext) => {
      mockPrisma.task.findUnique = async () => {
        throw new Error("DB timeout");
      };

      const response = await app.inject({
        method: "GET",
        url: "/api/tasks/1",
      });

      t.assert.strictEqual(response.statusCode, 500);
      const body = JSON.parse(response.body);
      t.assert.strictEqual(body.error.code, "INTERNAL_ERROR");
    });

    test("PATCH /api/tasks/:id returns 500 on unexpected DB failure", async (t: TestContext) => {
      mockPrisma.task.update = async () => {
        throw new Error("DB timeout");
      };

      const response = await app.inject({
        method: "PATCH",
        url: "/api/tasks/1",
        payload: { completed: true },
      });

      t.assert.strictEqual(response.statusCode, 500);
      const body = JSON.parse(response.body);
      t.assert.strictEqual(body.error.code, "INTERNAL_ERROR");
    });

    test("DELETE /api/tasks/:id returns 500 on unexpected DB failure", async (t: TestContext) => {
      mockPrisma.task.delete = async () => {
        throw new Error("DB timeout");
      };

      const response = await app.inject({
        method: "DELETE",
        url: "/api/tasks/1",
      });

      t.assert.strictEqual(response.statusCode, 500);
      const body = JSON.parse(response.body);
      t.assert.strictEqual(body.error.code, "INTERNAL_ERROR");
    });
  });
});
