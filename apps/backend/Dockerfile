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
    pnpm --filter @todoapp/backend run db:generate

# ---- Production ----
FROM base AS production
ENV NODE_ENV=production
COPY --from=build /app /app
COPY apps/backend/entrypoint.sh /app/apps/backend/entrypoint.sh
RUN chmod +x /app/apps/backend/entrypoint.sh && \
    addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app
USER appuser
WORKDIR /app/apps/backend
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "src/index.ts"]
