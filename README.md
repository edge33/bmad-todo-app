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

## Continuous Integration & Deployment

This project uses GitHub Actions for automated testing and quality checks. When you push code or create a pull request, the CI/CD pipeline automatically runs:

### GitHub Actions Workflow

The workflow is defined in `.github/workflows/test.yml` and includes four parallel jobs:

#### 1. Unit Tests Job
- **Environment:** Node.js 24, no database
- **Purpose:** Test backend business logic with mocked dependencies
- **Command:** `pnpm run test:unit`
- **Details:**
  - Uses Node.js built-in test framework
  - Mocks database and external services
  - Validates logic in isolation
  - Uploads coverage reports to Codecov

#### 2. Feature Tests Job
- **Environment:** Node.js 24 + PostgreSQL 16
- **Purpose:** Test API endpoints with a real database
- **Command:** `pnpm run test:feature`
- **Details:**
  - Spins up PostgreSQL service container
  - Runs database migrations
  - Starts backend server on `localhost:3000`
  - Tests API endpoints with Bruno or similar tool
  - Validates request/response contracts and data persistence

#### 3. E2E Tests Job
- **Environment:** Node.js 24 + PostgreSQL 16 + Frontend dev server
- **Purpose:** Test full user workflows end-to-end
- **Command:** `pnpm run test:e2e`
- **Details:**
  - Spins up PostgreSQL service container
  - Starts backend server on `localhost:3000`
  - Starts frontend dev server on `localhost:5173`
  - Runs Playwright E2E tests in headless mode
  - Validates UI interactions and state management
  - Uploads HTML reports and test traces on failure

#### 4. Lint & Type Check Job
- **Environment:** Node.js 24, no database
- **Purpose:** Validate code quality and TypeScript correctness
- **Commands:**
  - `pnpm run type-check` — TypeScript type checking
  - `pnpm run check` — Biome linting
- **Details:**
  - Catches type errors early
  - Enforces code style and best practices
  - Fast feedback for developers

### Parallel Execution

All four jobs run in parallel for fast feedback. The entire workflow typically completes in 3-5 minutes.

### PR Status Checks

When you open a pull request:
- GitHub shows individual job status for each test
- All four jobs must pass before merging
- Failed jobs show detailed logs for debugging

### Caching Strategy

To speed up builds, the workflow caches:
- **pnpm store** — Package dependencies
- **Node modules** — Installed packages
- **Playwright browsers** — E2E test engines

Cache is automatically invalidated when `pnpm-lock.yaml` changes.

### Local Testing

To test locally before pushing, run the complete test suite:

```bash
# Run all tests across workspaces
pnpm test

# Run only unit tests
pnpm run test:unit

# Run feature tests (requires Docker or local PostgreSQL)
pnpm run test:feature

# Run E2E tests (requires running servers)
pnpm run test:e2e

# Run linting and type checks
pnpm run check
pnpm run type-check
```

### Environment Variables for CI/CD

The workflow uses environment variables from `.env.example`:
- `NODE_ENV=test` — Set automatically in CI
- `DATABASE_URL` — Test database (PostgreSQL service)
- `BACKEND_PORT=3000` — Backend server port
- `FRONTEND_PORT=5173` — Frontend dev server port
- `VITE_API_URL=http://localhost:3000` — API endpoint for frontend

### Troubleshooting Failed Checks

**Type Check Failed:**
- Run `pnpm run type-check` locally and fix errors
- Check TypeScript configuration in `tsconfig.base.json`

**Linting Failed:**
- Run `pnpm run check` to auto-fix most issues
- Check Biome configuration in `biome.json`

**Unit Tests Failed:**
- Run `pnpm run test:unit` locally
- Check test output for specific failures

**Feature Tests Failed:**
- Ensure PostgreSQL is running
- Run `pnpm run db:migrate` to sync database
- Run `pnpm run start:backend` and test manually

**E2E Tests Failed:**
- Check that both frontend and backend start correctly
- Run servers locally: `pnpm dev` in separate terminal
- Run `pnpm run test:e2e` to reproduce failure
- Review Playwright traces uploaded to workflow artifacts

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
