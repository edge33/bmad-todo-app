import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import closeWithGrace from "close-with-grace";
import Fastify from "fastify";
import { prisma } from "./db/prisma.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const createApp = async () => {
  const fastify = Fastify({
    logger: process.env.NODE_ENV !== "test",
  });

  // Register CORS plugin
  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  });

  // Health check endpoint (register before autoload)
  fastify.get("/health", async (_request, reply) => {
    try {
      await prisma.$queryRawUnsafe("SELECT 1");
      return { status: "ok", timestamp: new Date().toISOString() };
    } catch (err) {
      reply.status(503);
      return {
        status: "unhealthy",
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  });

  // Graceful Prisma disconnect on server shutdown
  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  // Register routes with autoload (must be last)
  await fastify.register(autoload, {
    dir: join(__dirname, "routes"),
    options: { prefix: "/api" },
  });

  closeWithGrace({ delay: 10_000 }, async ({ err, signal }) => {
    if (err != null) {
      fastify.log.error({ err, signal }, "server closing due to error");
    }
    fastify.log.info({ signal }, "server closing");
    await fastify.close();
  });

  return fastify;
};

const start = async () => {
  try {
    const fastify = await createApp();

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
      console.error(
        `❌ Port ${process.env.BACKEND_PORT || "3000"} is already in use. Kill the process or use a different port.`,
      );
    } else {
      console.error(err);
    }
    process.exit(1);
  }
};

// Always start the server when this module is run directly
// (not when imported as a module, and not during tests)
if (
  import.meta.url === `file://${process.argv[1]}` &&
  process.env.NODE_ENV !== "test"
) {
  start();
}

export default createApp;
