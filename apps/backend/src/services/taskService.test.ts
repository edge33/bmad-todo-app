import { beforeEach, describe, mock, type TestContext, test } from "node:test";
import { NotFoundError, ValidationError } from "../middleware/errorHandler.ts";

function makePrismaTask(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    description: "Test task",
    completed: false,
    userId: null,
    createdAt: new Date("2026-04-09T10:00:00.000Z"),
    updatedAt: new Date("2026-04-09T10:00:00.000Z"),
    ...overrides,
  };
}

// Shared mock functions — each test configures these before running
const mockPrisma = {
  task: {
    findMany: async (_args?: unknown) =>
      [] as ReturnType<typeof makePrismaTask>[],
    findUnique: async (_args?: unknown) =>
      null as ReturnType<typeof makePrismaTask> | null,
    create: async (_args?: unknown) => makePrismaTask(),
    update: async (_args?: unknown) => makePrismaTask(),
    delete: async (_args?: unknown) => makePrismaTask(),
    deleteMany: async () => ({ count: 0 }),
  },
};

describe("taskService", async () => {
  // Mock the prisma module ONCE at describe level, then reconfigure per-test
  mock.module("../db/prisma.ts", {
    namedExports: { prisma: mockPrisma },
  });

  // Import taskService AFTER mock is set up
  const { taskService } = await import("./taskService.ts");

  // Reset mock implementations between tests
  beforeEach(() => {
    mockPrisma.task.findMany = async () => [];
    mockPrisma.task.findUnique = async () => null;
    mockPrisma.task.create = async () => makePrismaTask();
    mockPrisma.task.update = async () => makePrismaTask();
    mockPrisma.task.delete = async () => makePrismaTask();
  });

  // ===========================================================================
  // getAll
  // ===========================================================================
  test("getAll returns tasks with dates converted to ISO strings", async (t: TestContext) => {
    mockPrisma.task.findMany = async () => [
      makePrismaTask(),
      makePrismaTask({ id: 2 }),
    ];

    const result = await taskService.getAll();

    t.assert.strictEqual(result.length, 2);
    t.assert.strictEqual(typeof result[0]?.createdAt, "string");
    t.assert.strictEqual(result[0]?.createdAt, "2026-04-09T10:00:00.000Z");
    t.assert.strictEqual(typeof result[0]?.updatedAt, "string");
  });

  test("getAll returns empty array when no tasks", async (t: TestContext) => {
    mockPrisma.task.findMany = async () => [];

    const result = await taskService.getAll();

    t.assert.strictEqual(result.length, 0);
  });

  test("getAll passes orderBy createdAt desc to Prisma", async (t: TestContext) => {
    let capturedArgs: unknown;
    mockPrisma.task.findMany = async (args?: unknown) => {
      capturedArgs = args;
      return [];
    };

    await taskService.getAll();

    t.assert.deepStrictEqual(capturedArgs, {
      orderBy: { createdAt: "desc" },
    });
  });

  // ===========================================================================
  // getById
  // ===========================================================================
  test("getById returns task with ISO string dates", async (t: TestContext) => {
    mockPrisma.task.findUnique = async () => makePrismaTask();

    const result = await taskService.getById(1);

    t.assert.strictEqual(result.id, 1);
    t.assert.strictEqual(result.description, "Test task");
    t.assert.strictEqual(result.createdAt, "2026-04-09T10:00:00.000Z");
  });

  test("getById throws NotFoundError when task does not exist", async (t: TestContext) => {
    mockPrisma.task.findUnique = async () => null;

    await t.assert.rejects(
      () => taskService.getById(999),
      (err: unknown) => {
        t.assert.ok(err instanceof NotFoundError);
        return true;
      },
    );
  });

  // ===========================================================================
  // create
  // ===========================================================================
  test("create creates task with valid description", async (t: TestContext) => {
    mockPrisma.task.create = async () =>
      makePrismaTask({ description: "Buy milk" });

    const result = await taskService.create({ description: "Buy milk" });

    t.assert.strictEqual(result.description, "Buy milk");
    t.assert.strictEqual(result.completed, false);
    t.assert.strictEqual(typeof result.createdAt, "string");
  });

  test("create trims whitespace from description", async (t: TestContext) => {
    let capturedData: unknown;
    mockPrisma.task.create = async (args?: unknown) => {
      capturedData = (args as { data: { description: string } }).data;
      return makePrismaTask({ description: "Buy milk" });
    };

    await taskService.create({ description: "  Buy milk  " });

    t.assert.deepStrictEqual(capturedData, { description: "Buy milk" });
  });

  test("create throws ValidationError for empty description", async (t: TestContext) => {
    await t.assert.rejects(
      () => taskService.create({ description: "" }),
      (err: unknown) => {
        t.assert.ok(err instanceof ValidationError);
        return true;
      },
    );
  });

  test("create throws ValidationError for whitespace-only description", async (t: TestContext) => {
    await t.assert.rejects(
      () => taskService.create({ description: "   " }),
      (err: unknown) => {
        t.assert.ok(err instanceof ValidationError);
        return true;
      },
    );
  });

  test("create throws ValidationError for non-string description", async (t: TestContext) => {
    await t.assert.rejects(
      () => taskService.create({ description: 123 as unknown as string }),
      (err: unknown) => {
        t.assert.ok(err instanceof ValidationError);
        return true;
      },
    );
  });

  // ===========================================================================
  // update
  // ===========================================================================
  test("update updates completed status", async (t: TestContext) => {
    mockPrisma.task.update = async () => makePrismaTask({ completed: true });

    const result = await taskService.update(1, { completed: true });

    t.assert.strictEqual(result.completed, true);
  });

  test("update updates description", async (t: TestContext) => {
    mockPrisma.task.update = async () =>
      makePrismaTask({ description: "Updated" });

    const result = await taskService.update(1, { description: "Updated" });

    t.assert.strictEqual(result.description, "Updated");
  });

  test("update updates both fields", async (t: TestContext) => {
    let capturedArgs: unknown;
    mockPrisma.task.update = async (args?: unknown) => {
      capturedArgs = args;
      return makePrismaTask({ description: "New", completed: true });
    };

    await taskService.update(1, { description: "New", completed: true });

    t.assert.deepStrictEqual(capturedArgs, {
      where: { id: 1 },
      data: { description: "New", completed: true },
    });
  });

  test("update throws ValidationError when no fields provided", async (t: TestContext) => {
    await t.assert.rejects(
      () => taskService.update(1, {}),
      (err: unknown) => {
        t.assert.ok(err instanceof ValidationError);
        return true;
      },
    );
  });

  test("update throws ValidationError for empty description", async (t: TestContext) => {
    await t.assert.rejects(
      () => taskService.update(1, { description: "" }),
      (err: unknown) => {
        t.assert.ok(err instanceof ValidationError);
        return true;
      },
    );
  });

  test("update throws ValidationError for non-boolean completed", async (t: TestContext) => {
    await t.assert.rejects(
      () => taskService.update(1, { completed: "yes" as unknown as boolean }),
      (err: unknown) => {
        t.assert.ok(err instanceof ValidationError);
        return true;
      },
    );
  });

  test("update throws NotFoundError when task does not exist (P2025)", async (t: TestContext) => {
    mockPrisma.task.update = async () => {
      throw Object.assign(new Error("Record not found"), { code: "P2025" });
    };

    await t.assert.rejects(
      () => taskService.update(999, { completed: true }),
      (err: unknown) => {
        t.assert.ok(err instanceof NotFoundError);
        return true;
      },
    );
  });

  // ===========================================================================
  // delete
  // ===========================================================================
  test("delete deletes and returns task", async (t: TestContext) => {
    mockPrisma.task.delete = async () => makePrismaTask();

    const result = await taskService.delete(1);

    t.assert.strictEqual(result.id, 1);
    t.assert.strictEqual(typeof result.createdAt, "string");
  });

  test("delete throws NotFoundError when task does not exist (P2025)", async (t: TestContext) => {
    mockPrisma.task.delete = async () => {
      throw Object.assign(new Error("Record not found"), { code: "P2025" });
    };

    await t.assert.rejects(
      () => taskService.delete(999),
      (err: unknown) => {
        t.assert.ok(err instanceof NotFoundError);
        return true;
      },
    );
  });
});
