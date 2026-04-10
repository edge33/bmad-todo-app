# ---- Base ----
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared-types/package.json packages/shared-types/
COPY packages/shared-utils/package.json packages/shared-utils/
COPY apps/backend/package.json apps/backend/
COPY apps/backend/prisma/schema.prisma apps/backend/prisma/
COPY apps/backend/prisma.config.ts apps/backend/
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM deps AS build
COPY tsconfig.base.json ./
COPY packages/ packages/
COPY apps/backend/ apps/backend/
RUN pnpm --filter @todoapp/shared-types run build && \
    pnpm --filter @todoapp/shared-utils run build && \
    pnpm --filter @todoapp/backend run db:generate && \
    pnpm --filter @todoapp/backend deploy --legacy --prod /app/deploy && \
    # Remove unused database WASM compilers (keep only postgresql) \
    find /app/deploy/node_modules -name '*.wasm-base64.*' ! -name '*postgresql*' -delete && \
    # Remove prisma CLI and dev-only transitive deps pulled in via peer dependency \
    rm -rf /app/deploy/node_modules/.pnpm/prisma@* \
           /app/deploy/node_modules/.pnpm/@prisma+studio* \
           /app/deploy/node_modules/.pnpm/@prisma+dev* \
           /app/deploy/node_modules/.pnpm/@prisma+engines* \
           /app/deploy/node_modules/.pnpm/@electric-sql* \
           /app/deploy/node_modules/.pnpm/effect@* \
           /app/deploy/node_modules/.pnpm/typescript@* \
           /app/deploy/node_modules/.pnpm/react-dom@* \
           /app/deploy/node_modules/.pnpm/react@1* \
           /app/deploy/node_modules/.pnpm/chart.js@* \
           /app/deploy/node_modules/.pnpm/fast-check@* \
           /app/deploy/node_modules/.pnpm/hono@* \
           /app/deploy/node_modules/.pnpm/remeda@* \
           /app/deploy/node_modules/prisma

# ---- Migrate ----
FROM deps AS migrate
COPY apps/backend/prisma apps/backend/prisma/
COPY apps/backend/prisma.config.ts apps/backend/
WORKDIR /app/apps/backend
CMD ["npx", "prisma", "migrate", "deploy"]

# ---- Production ----
FROM node:24-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/deploy .

COPY apps/backend/entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh && \
    addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app
USER appuser
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "src/index.ts"]
