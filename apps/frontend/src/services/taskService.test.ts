import { describe, type TestContext, test } from "node:test";
import { ApiError, mapErrorToUserMessage } from "./taskService.ts";

describe("mapErrorToUserMessage", () => {
  test("maps VALIDATION_ERROR code to input error message", (t: TestContext) => {
    const error = new ApiError(
      400,
      "Task description cannot be empty",
      "VALIDATION_ERROR",
    );
    t.assert.strictEqual(
      mapErrorToUserMessage(error),
      "Please check your input and try again",
    );
  });

  test("maps 400 status (no code) to input error message", (t: TestContext) => {
    const error = new ApiError(400, "Bad request");
    t.assert.strictEqual(
      mapErrorToUserMessage(error),
      "Please check your input and try again",
    );
  });

  test("maps NOT_FOUND code to not-found message", (t: TestContext) => {
    const error = new ApiError(404, "Task with ID 5 not found", "NOT_FOUND");
    t.assert.strictEqual(
      mapErrorToUserMessage(error),
      "This task no longer exists",
    );
  });

  test("maps 404 status (no code) to not-found message", (t: TestContext) => {
    const error = new ApiError(404, "Not found");
    t.assert.strictEqual(
      mapErrorToUserMessage(error),
      "This task no longer exists",
    );
  });

  test("maps 500 INTERNAL_ERROR to generic error message", (t: TestContext) => {
    const error = new ApiError(500, "Internal server error", "INTERNAL_ERROR");
    t.assert.strictEqual(
      mapErrorToUserMessage(error),
      "Something went wrong. Please try again.",
    );
  });

  test("maps non-ApiError to generic error message", (t: TestContext) => {
    t.assert.strictEqual(
      mapErrorToUserMessage(new Error("Network failure")),
      "Something went wrong. Please try again.",
    );
  });

  test("maps unknown thrown value to generic error message", (t: TestContext) => {
    t.assert.strictEqual(
      mapErrorToUserMessage("some string"),
      "Something went wrong. Please try again.",
    );
  });
});
