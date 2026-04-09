import { strict as assert } from "node:assert";
import { describe, mock, type TestContext, test } from "node:test";

type GraceCallback = (ctx: { err?: Error; signal?: string }) => Promise<void>;
let capturedCallback: GraceCallback;

mock.module("close-with-grace", {
  defaultExport: (_opts: unknown, cb: GraceCallback) => {
    capturedCallback = cb;
  },
});

mock.module("./db/prisma.ts", {
  namedExports: { prisma: { $disconnect: async () => {} } },
});

describe("close with grace", async () => {
  const createApp = (await import("./index.ts")).default;

  test("calls close on clean shutdown", async (t: TestContext) => {
    const app = await createApp();
    const closeSpy = t.mock.method(app, "close", async () => {});

    await capturedCallback({});

    assert.equal(closeSpy.mock.calls.length, 1);
  });

  test("logs error and calls close on error shutdown", async (t: TestContext) => {
    const app = await createApp();
    const closeSpy = t.mock.method(app, "close", async () => {});
    const logErrorSpy = t.mock.method(app.log, "error", () => {});

    const err = new Error("crash");
    await capturedCallback({ err, signal: "uncaughtException" });

    assert.equal(logErrorSpy.mock.calls.length, 1);
    const [loggedObj, loggedMsg] = logErrorSpy.mock.calls[0]?.arguments as [
      { err: Error; signal: string },
      string,
    ];
    assert.equal(loggedObj.err, err);
    assert.equal(loggedObj.signal, "uncaughtException");
    assert.equal(loggedMsg, "server closing due to error");
    assert.equal(closeSpy.mock.calls.length, 1);
  });
});
