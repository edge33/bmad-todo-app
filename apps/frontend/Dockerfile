# ---- Base ----
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared-types/package.json packages/shared-types/
COPY packages/shared-utils/package.json packages/shared-utils/
COPY apps/frontend/package.json apps/frontend/
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM deps AS build
COPY packages/ packages/
COPY apps/frontend/ apps/frontend/
COPY tsconfig.base.json ./
RUN pnpm --filter @todoapp/shared-types run build && \
    pnpm --filter @todoapp/shared-utils run build && \
    pnpm --filter @todoapp/frontend run build

# ---- Production ----
FROM nginx:alpine AS production
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid
USER nginx
EXPOSE 5173
