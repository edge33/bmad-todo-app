# TodoApp - Modern Monorepo

A full-stack TypeScript monorepo application built with pnpm workspaces, React + Vite for the frontend, and Fastify for the backend.

## Project Structure

```
todoapp/
├── apps/
│   ├── frontend/          # React + Vite application
│   └── backend/           # Fastify API server
├── packages/
│   ├── shared-types/      # Shared API type definitions
│   └── shared-utils/      # Shared utility functions
├── pnpm-workspace.yaml    # pnpm workspace configuration
├── package.json           # Root workspace package.json
├── tsconfig.base.json     # Shared TypeScript base configuration
└── README.md              # This file
```

## Technology Stack

- **Package Manager:** pnpm 8.15.4+
- **Language:** TypeScript 5.3.3+
- **Frontend:** React 18.2+ with Vite 5.0+
- **Backend:** Fastify 4.25+
- **Node.js:** 18.0.0+

## Prerequisites

- Node.js 24.0.0 or higher
- pnpm 8.0.0 or higher
- Docker and Docker Compose (for containerized development)

Install pnpm globally if not already installed:
```bash
npm install -g pnpm
```

### Docker Setup

Docker is optional but recommended for local development and testing. It provides:
- PostgreSQL database environment
- Isolated service containers
- Volume management for hot-reload development

**Prerequisites:**
- Docker Engine 20.10+ or Docker Desktop
- Docker Compose 2.0+ (included with Docker Desktop)

Verify installation:
```bash
docker --version
docker-compose --version
```

## Getting Started

### Installation

Install dependencies for all workspaces:
```bash
pnpm install
```

### Docker Containers (Optional)

To run services in Docker containers:

1. **Copy environment configuration:**
   ```bash
   cp .env.example .env
   ```

2. **Start containers:**
   ```bash
   docker-compose up -d
   ```

   This starts:
   - PostgreSQL 16 on `localhost:5432`
   - Backend (placeholder, built in Epic 6)
   - Frontend (placeholder, built in Epic 2)

3. **View logs:**
   ```bash
   docker-compose logs -f postgres  # PostgreSQL logs
   docker-compose logs -f backend   # Backend logs
   docker-compose logs -f frontend  # Frontend logs
   ```

4. **Stop containers:**
   ```bash
   docker-compose down
   ```

   To remove volumes (warning: deletes database data):
   ```bash
   docker-compose down -v
   ```

For detailed Docker setup and troubleshooting, see [docs/docker-setup.md](./docs/docker-setup.md).

### Development

Start all services in development mode:
```bash
pnpm dev
```

Or run development for specific workspaces:
```bash
pnpm -r --filter @todoapp/frontend run dev
pnpm -r --filter @todoapp/backend run dev
```

### Building

Build all workspaces:
```bash
pnpm build
```

Build specific workspaces:
```bash
pnpm -r --filter @todoapp/frontend run build
pnpm -r --filter @todoapp/backend run build
```

### Testing

Run tests for all workspaces:
```bash
pnpm test
```

### Linting

Lint all workspaces:
```bash
pnpm lint
```

### Type Checking

Run TypeScript type checking:
```bash
pnpm type-check
```

## Workspace Organization

### Apps

#### Frontend (`apps/frontend`)
React application with Vite bundler, featuring:
- Hot module reloading
- TypeScript support
- Ready for component libraries and routing

#### Backend (`apps/backend`)
Fastify API server with:
- TypeScript support
- RESTful API routing
- Shared types integration

### Packages

#### Shared Types (`packages/shared-types`)
Type definitions shared across frontend and backend:
- API request/response interfaces
- Domain models
- Enums and constants

#### Shared Utils (`packages/shared-utils`)
Common utility functions:
- Validators
- Formatters
- Helpers

## pnpm Workspaces

All packages use the `workspace:*` protocol for inter-workspace dependencies, ensuring:
- Single lock file (`pnpm-lock.yaml`)
- Consistent versions across workspaces
- Efficient disk usage through hard linking

## TypeScript Configuration

The monorepo uses:
- A shared base TypeScript configuration (`tsconfig.base.json`)
- Workspace-specific extensions with path mapping
- Project references for better type checking performance

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Code quality standards and Biome linting
- Conventional Commits requirements
- Pre-commit hook setup
- Pull request guidelinesasdasd

## Code Quality

This project uses:

- **Biome** — Linting and formatting
- **Conventional Commits** — Structured commit history
- **Husky** — Git hooks for quality checks
- **TypeScript Strict Mode** — Full type safety

### Code Quality Commands

```bash
# Check and auto-fix all issues
pnpm run check

# Lint only
pnpm run lint

# Format code
pnpm run format

# Type check
pnpm run check:types

# Interactive commits (optional)
pnpm run commit
```

Pre-commit hooks run automatically on `git commit` to ensure quality.

## License

MIT
