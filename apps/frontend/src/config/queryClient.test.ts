import { describe, type TestContext, test } from "node:test";
import { ApiError } from "../services/taskService.ts";
import { queryClient } from "./queryClient.ts";

const queryDefaults = queryClient.getDefaultOptions().queries!;
const mutationDefaults = queryClient.getDefaultOptions().mutations!;

describe("queryClient retry config", () => {
  // ============================================================================
  // Query retry
  // ============================================================================
  describe("queries", () => {
    const retryFn = queryDefaults.retry as (
      failureCount: number,
      error: unknown,
    ) => boolean;
    const retryDelay = queryDefaults.retryDelay as (
      attemptIndex: number,
    ) => number;

    test("does not retry on 4xx ApiError", (t: TestContext) => {
      const error = new ApiError(400, "Bad request", "VALIDATION_ERROR");
      t.assert.strictEqual(retryFn(0, error), false);
    });

    test("does not retry on 404 ApiError", (t: TestContext) => {
      const error = new ApiError(404, "Not found", "NOT_FOUND");
      t.assert.strictEqual(retryFn(0, error), false);
    });

    test("retries on 5xx ApiError up to 3 times", (t: TestContext) => {
      const error = new ApiError(500, "Server error", "INTERNAL_ERROR");
      t.assert.strictEqual(retryFn(0, error), true);
      t.assert.strictEqual(retryFn(1, error), true);
      t.assert.strictEqual(retryFn(2, error), true);
      t.assert.strictEqual(retryFn(3, error), false);
    });

    test("retries on non-ApiError up to 3 times", (t: TestContext) => {
      const error = new Error("Network failure");
      t.assert.strictEqual(retryFn(0, error), true);
      t.assert.strictEqual(retryFn(2, error), true);
      t.assert.strictEqual(retryFn(3, error), false);
    });

    test("exponential backoff: 1s → 2s → 4s", (t: TestContext) => {
      t.assert.strictEqual(retryDelay(0), 1000);
      t.assert.strictEqual(retryDelay(1), 2000);
      t.assert.strictEqual(retryDelay(2), 4000);
    });
  });

  // ============================================================================
  // Mutation retry
  // ============================================================================
  describe("mutations", () => {
    const retryFn = mutationDefaults.retry as (
      failureCount: number,
      error: unknown,
    ) => boolean;
    const retryDelay = mutationDefaults.retryDelay as (
      attemptIndex: number,
    ) => number;

    test("does not retry mutations on 4xx ApiError", (t: TestContext) => {
      const error = new ApiError(400, "Bad request", "VALIDATION_ERROR");
      t.assert.strictEqual(retryFn(0, error), false);
    });

    test("does not retry mutations on 404 ApiError", (t: TestContext) => {
      const error = new ApiError(404, "Not found", "NOT_FOUND");
      t.assert.strictEqual(retryFn(0, error), false);
    });

    test("retries mutations on 5xx ApiError up to 3 times", (t: TestContext) => {
      const error = new ApiError(500, "Server error", "INTERNAL_ERROR");
      t.assert.strictEqual(retryFn(0, error), true);
      t.assert.strictEqual(retryFn(2, error), true);
      t.assert.strictEqual(retryFn(3, error), false);
    });

    test("mutation exponential backoff: 1s → 2s → 4s", (t: TestContext) => {
      t.assert.strictEqual(retryDelay(0), 1000);
      t.assert.strictEqual(retryDelay(1), 2000);
      t.assert.strictEqual(retryDelay(2), 4000);
    });
  });
});
