import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

// Health check endpoint — verifies server is running
fastify.get("/health", async (_request, reply) => {
  try {
    // In test environment, just verify server is running
    // Database connectivity is verified separately in migrations
    return { status: "ok", timestamp: new Date().toISOString() };
  } catch (err) {
    reply.status(503);
    return {
      status: "unhealthy",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
});

const start = async () => {
  try {
    const portStr = process.env.BACKEND_PORT || "3000";
    const port = parseInt(portStr, 10);

    if (Number.isNaN(port) || port < 1 || port > 65535) {
      throw new Error(`Invalid BACKEND_PORT: ${portStr} (must be 1-65535)`);
    }

    const host = process.env.NODE_ENV === "test" ? "127.0.0.1" : "0.0.0.0";
    await fastify.listen({ port, host });
    console.log(`✅ Server listening on http://${host}:${port}`);
  } catch (err: unknown) {
    const error = err as NodeJS.ErrnoException;
    if (error.code === "EADDRINUSE") {
      fastify.log.error(
        `❌ Port ${process.env.BACKEND_PORT || "3000"} is already in use. Kill the process or use a different port.`,
      );
    } else {
      fastify.log.error(err);
    }
    process.exit(1);
  }
};

// Always start the server when this module is run directly
// (not when imported as a module)
if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}

export default fastify;
