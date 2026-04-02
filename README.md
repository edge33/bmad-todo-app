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

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher

Install pnpm globally if not already installed:
```bash
npm install -g pnpm
```

## Getting Started

### Installation

Install dependencies for all workspaces:
```bash
pnpm install
```

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

When adding new packages or features:

1. Follow the existing directory structure
2. Use scoped naming: `@todoapp/package-name`
3. Update `tsconfig.base.json` paths if needed
4. Ensure workspace dependencies are declared properly
5. Run `pnpm -r run build` to verify everything builds

## License

MIT
