import { readFileSync } from "node:fs";
import { defineConfig } from "prisma/config";

// Load .env without dotenv — Prisma CLI runs this file via Node.js before any command
try {
  const lines = readFileSync(new URL(".env", import.meta.url), "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const raw = trimmed.slice(eq + 1).trim();
    const val = raw.replace(/^(['"])(.*)\1$/, "$2");
    process.env[key] ??= val;
  }
} catch (err: unknown) {
  if (err instanceof Error && "code" in err && (err as NodeJS.ErrnoException).code !== "ENOENT") {
    console.warn("[prisma.config] Failed to read .env:", (err as Error).message);
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Provide it via .env or environment variables.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
