import { describe, type TestContext, test } from "node:test";
import {
  errorHandler,
  NotFoundError,
  ValidationError,
} from "./errorHandler.ts";

describe("errorHandler", () => {
  // ============================================================================
  // ValidationError → 400 VALIDATION_ERROR
  // ============================================================================
  test("ValidationError maps to 400 VALIDATION_ERROR", (t: TestContext) => {
    const { status, body } = errorHandler(new ValidationError("Bad input"));

    t.assert.strictEqual(status, 400);
    t.assert.strictEqual(body.error.code, "VALIDATION_ERROR");
    t.assert.strictEqual(body.error.message, "Bad input");
  });

  // ============================================================================
  // NotFoundError → 404 NOT_FOUND
  // ============================================================================
  test("NotFoundError maps to 404 NOT_FOUND", (t: TestContext) => {
    const { status, body } = errorHandler(new NotFoundError("Task", 42));

    t.assert.strictEqual(status, 404);
    t.assert.strictEqual(body.error.code, "NOT_FOUND");
    t.assert.ok(body.error.message.includes("42"));
  });

  // ============================================================================
  // Unknown error → 500 INTERNAL_ERROR
  // ============================================================================
  test("unknown Error maps to 500 INTERNAL_ERROR", (t: TestContext) => {
    const { status, body } = errorHandler(new Error("DB connection failed"));

    t.assert.strictEqual(status, 500);
    t.assert.strictEqual(body.error.code, "INTERNAL_ERROR");
    t.assert.strictEqual(body.error.message, "Internal server error");
  });

  test("non-Error value maps to 500 INTERNAL_ERROR", (t: TestContext) => {
    const { status, body } = errorHandler("some string error");

    t.assert.strictEqual(status, 500);
    t.assert.strictEqual(body.error.code, "INTERNAL_ERROR");
  });

  // ============================================================================
  // Context is accepted without throwing
  // ============================================================================
  test("accepts context with action and taskId for 500", (t: TestContext) => {
    const { status, body } = errorHandler(new Error("unexpected"), {
      action: "delete",
      taskId: 7,
    });

    t.assert.strictEqual(status, 500);
    t.assert.strictEqual(body.error.code, "INTERNAL_ERROR");
  });

  test("accepts context with action only for 500", (t: TestContext) => {
    const { status, body } = errorHandler(new Error("unexpected"), {
      action: "getAll",
    });

    t.assert.strictEqual(status, 500);
    t.assert.strictEqual(body.error.code, "INTERNAL_ERROR");
  });

  // ============================================================================
  // Error response structure
  // ============================================================================
  test("error response always has { error: { code, message } } shape", (t: TestContext) => {
    for (const input of [
      new ValidationError("x"),
      new NotFoundError("Task", 1),
      new Error("boom"),
    ]) {
      const { body } = errorHandler(input);
      t.assert.strictEqual(typeof body.error.code, "string");
      t.assert.strictEqual(typeof body.error.message, "string");
    }
  });
});
