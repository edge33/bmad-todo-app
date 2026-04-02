# Docker Setup Guide

This document explains how to use Docker and Docker Compose for todoapp development and testing.

## Overview

The `docker-compose.yml` file orchestrates three services:
- **PostgreSQL 16** — Database with persistent volume
- **Backend** — Fastify API server (placeholder, built in Epic 6)
- **Frontend** — React + Vite application (placeholder, built in Epic 2)

## Prerequisites

- Docker 20.10+ or Docker Desktop
- Docker Compose 2.0+
- `.env` file in project root (copy from `.env.example`)

Verify installation:
```bash
docker --version       # Should show Docker version
docker-compose version # Should show Compose version
```

## Configuration

### Environment Variables

All service configuration is managed via `.env` file. Copy from example and customize:

```bash
cp .env.example .env
```

**Key variables:**

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todoapp_dev
POSTGRES_PASSWORD=postgres
POSTGRES_INITDB_ARGS=

# Backend Service
BACKEND_PORT=3000
NODE_ENV=development

# Frontend Service
FRONTEND_PORT=5173
```

### Docker Compose Structure

**Services:**

| Service | Port | Purpose | Status |
|---------|------|---------|--------|
| `postgres` | 5432 | PostgreSQL 16 database | ✅ Ready |
| `backend` | 3000 | Fastify API server | 🚧 Placeholder (Epic 6) |
| `frontend` | 5173 | React + Vite frontend | 🚧 Placeholder (Epic 2) |

**Volumes:**

| Name | Purpose | Persistence |
|------|---------|-------------|
| `postgres_data` | Database files | Named volume (persistent) |
| `backend_node_modules` | Backend dependencies | Named volume (fast) |
| `frontend_node_modules` | Frontend dependencies | Named volume (fast) |

**Bind Mounts (for hot-reload):**

| Source | Container Path | Purpose |
|--------|-----------------|---------|
| `./apps/backend/src` | `/app/src` | Backend code sync |
| `./apps/frontend/src` | `/app/src` | Frontend code sync |

## Usage

### Start Services

```bash
docker-compose up -d
```

- `-d` runs in background
- Services start in order (postgres first, then backend/frontend)
- Backend waits for postgres to be healthy before starting

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f postgres
docker-compose logs -f backend
docker-compose logs -f frontend

# Last 50 lines
docker-compose logs --tail 50 postgres
```

### Stop Services

```bash
# Stop containers (preserves volumes and state)
docker-compose stop

# Remove containers (volumes persist)
docker-compose down

# Remove everything including volumes (⚠️ deletes database!)
docker-compose down -v
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart postgres
docker-compose restart backend
```

## PostgreSQL Database

### Connect from Host Machine

```bash
# Using psql client
psql -h localhost -U postgres -d todoapp_dev

# Using environment variable
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todoapp_dev psql
```

When prompted for password, enter value from `POSTGRES_PASSWORD` in `.env` (default: `postgres`)

### Connect from Backend Container

Backend automatically connects using `DATABASE_URL` from `.env`:

```
postgresql://postgres:postgres@postgres:5432/todoapp_dev
```

Docker networking resolves `postgres` hostname to the PostgreSQL container.

### Create Database Dump

```bash
docker exec todoapp-postgres pg_dump -U postgres todoapp_dev > backup.sql
```

### Restore from Dump

```bash
docker exec -i todoapp-postgres psql -U postgres < backup.sql
```

### View Database Statistics

```bash
docker exec todoapp-postgres psql -U postgres -c "\l+"  # List databases
docker exec todoapp-postgres psql -U postgres -c "\du+" # List users
```

## Volume Management

### View Volumes

```bash
# List all volumes
docker volume ls

# Inspect specific volume
docker volume inspect todoapp_postgres_data
```

### Backup Volume Data

```bash
# Create backup of postgres_data
docker run --rm -v todoapp_postgres_data:/data -v $(pwd):/backup \
  ubuntu tar czf /backup/postgres_backup.tar.gz -C /data .
```

### Persist Across Restarts

Named volumes automatically persist when containers restart:

```bash
docker-compose down           # Stops and removes containers
docker-compose up -d          # Restarts containers
# Data in postgres_data volume is unchanged
```

### Clean Up Unused Volumes

```bash
docker volume prune  # Removes all unused volumes
```

## Code Changes and Hot-Reload

Source code bind mounts enable hot-reload:

1. **Edit code:**
   ```bash
   echo "console.log('test')" >> apps/backend/src/index.ts
   ```

2. **Changes sync immediately:**
   ```bash
   docker exec todoapp-backend ls /app/src/index.ts  # File exists in container
   ```

3. **Application reloads:**
   - Backend (Node.js dev mode): automatically reloads
   - Frontend (Vite dev server): automatically hot reloads

To rebuild after major dependency changes:

```bash
docker-compose down
docker-compose up -d --build  # Rebuild images
```

## Networking

Services communicate via Docker internal networking:

**From Backend to PostgreSQL:**
```
postgresql://postgres:postgres@postgres:5432/todoapp_dev
```
Docker DNS resolves `postgres` to PostgreSQL container's internal IP.

**From Host to Services:**
```
Backend:   http://localhost:3000
Frontend:  http://localhost:5173
PostgreSQL: postgresql://localhost:5432
```

**Verify networking:**
```bash
docker exec todoapp-backend ping postgres  # Should resolve to internal IP
```

## Troubleshooting

### Port Already in Use

If ports 5432, 3000, or 5173 are already in use:

1. **Find what's using the port:**
   ```bash
   lsof -i :5432   # Check port 5432
   ```

2. **Stop conflicting service or modify .env:**
   ```env
   BACKEND_PORT=3001    # Change from 3000
   FRONTEND_PORT=5174   # Change from 5173
   ```

3. **Restart containers:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### PostgreSQL Fails to Start

**Issue:** PostgreSQL container exits immediately

**Solutions:**
- Check logs: `docker-compose logs postgres`
- Verify `POSTGRES_PASSWORD` is set in `.env`
- Remove corrupt data: `docker volume rm todoapp_postgres_data`
- Restart: `docker-compose up -d`

### Cannot Connect to PostgreSQL

**Issue:** `Connection refused` or `host not found`

**Solutions:**
- Verify service is running: `docker-compose ps`
- Check DATABASE_URL in `.env`
- Wait for healthcheck: `docker-compose logs postgres` should show "PostgreSQL init process complete"
- Test locally: `psql -h localhost -U postgres`

### Volume Permissions Issues

**Issue:** Permission denied in bind mounts

**Solutions:**
- Check ownership: `ls -la apps/backend/src`
- Fix permissions: `chmod 755 apps/backend/src`
- Or use named volume instead of bind mount (slower for development)

### Images Out of Date

**Issue:** Docker using old image versions

**Solutions:**
```bash
# Rebuild images with latest base images
docker-compose down
docker-compose pull              # Pull latest service images
docker-compose up -d --build     # Rebuild with latest base images
```

### Memory Issues

If Docker containers consume too much memory:

```bash
# Check resource usage
docker stats

# Limit memory in docker-compose.yml
# (advanced: modify services with memory: 2g, cpus: 2)
```

## Production Deployment

This docker-compose setup is for **local development only**.

For production:
- Use managed database services (AWS RDS, Google Cloud SQL, Azure Database)
- Use container orchestration (Kubernetes, Docker Swarm)
- Implement proper secret management
- Add health checks and monitoring
- Configure logging and observability

## Related Documentation

- [README.md](../README.md) — Project overview
- [docker-compose.yml](../docker-compose.yml) — Service definitions
- [.env.example](../.env.example) — Environment template
- [Epic 6: Backend API & Persistence](../_bmad-output/planning-artifacts/epics.md) — Database schema details
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
