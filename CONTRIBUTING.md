# Contributing to todoapp

We appreciate your interest in contributing! Please follow these guidelines to maintain code quality and project consistency.

## Initial Setup - Configure Git Hooks

After cloning the repository, run this command to enable git hooks:

```bash
git config core.hooksPath .husky
```

This configures git to use the `.husky` directory for hooks instead of `.git/hooks`.

Alternatively, run the setup script:
```bash
bash setup-hooks.sh
```

Once configured, git hooks will automatically:
- Run Biome on staged files before commits
- Validate commit messages against Conventional Commits

## Code Quality Standards

This project uses **Biome** for linting and formatting. Biome ensures consistent code style and catches common errors automatically.

### Running Biome Locally

```bash
# Auto-fix all issues
pnpm run check

# Lint only (no changes)
pnpm run lint

# Format code
pnpm run format

# Check formatting without changes
pnpm run format:check
```

### Pre-Commit Hooks

Git hooks run automatically before commits to ensure code quality:

- **pre-commit hook**: Runs Biome on staged files and auto-fixes issues
- **commit-msg hook**: Validates commit messages against Conventional Commits

If you need to bypass hooks (rarely!):
```bash
git commit --no-verify
```

## Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/) to maintain a structured commit history that enables automated changelog generation.

### Commit Format

```
type(scope?): subject
```

### Valid Commit Types

- **feat** — new feature
- **fix** — bug fix
- **refactor** — code refactoring (no feature or bug fix)
- **perf** — performance improvement
- **docs** — documentation
- **style** — formatting/style changes (not CSS)
- **test** — test additions or modifications
- **ci** — CI/CD configuration
- **chore** — build, dependencies, tooling

### Subject Line Rules

- Lowercase start
- Imperative mood (e.g., "add" not "added")
- No period at end
- Maximum 50 characters

### Examples

```
feat(api): add user authentication endpoint
fix(frontend): resolve task list scroll issue
refactor(db): simplify query builder
docs: update README with setup instructions
test: add unit tests for task service
```

## Development Workflow

### Manual Commits

```bash
# Stage your changes
git add .

# Commit with conventional format
git commit -m "feat(feature-name): description"

# Pre-commit hook runs Biome automatically
# Commit succeeds if all checks pass
```

### Interactive Commits with Commitizen

Commitizen guides you through the commit format interactively:

```bash
pnpm run commit

# Follow the prompts to select type, scope, subject, body, footer
```

## Pre-Commit Workflow

When you commit, the following happens automatically:

1. **Biome Check** — Auto-fixes formatting and linting issues
2. **File Re-staging** — Fixed files are re-staged automatically
3. **Commit Message Validation** — Checks format against Conventional Commits
4. **Commit Succeeds** — If all checks pass

If Biome finds unfixable issues, the commit fails and you must resolve them manually.

## VS Code Setup

VS Code auto-formatting is recommended for best experience:

1. **Install Biome Extension** — Look for "biomejs.biome" in Extensions
2. **Format on Save** — Automatically formats on file save
3. **Code Actions** — Auto-fixes and import organization on save

Settings are pre-configured in `.vscode/settings.json`.

## Troubleshooting

### Pre-Commit Hook Not Running

Ensure Husky is initialized:
```bash
pnpm exec husky install
```

### Biome Not Auto-Fixing

Check that Biome rules are correctly configured in `biome.json`. Manual fix if needed:
```bash
pnpm run check
```

### Commitlint Rejects Commit

Verify your commit message follows Conventional Commits format:
- Must start with type: `feat`, `fix`, `refactor`, etc.
- Subject must be lowercase and imperative
- Example: `feat(scope): add feature`

### Need to Bypass Hooks

Only use for emergencies:
```bash
git commit --no-verify
```

This should be rare. Track and discuss why bypass was needed.

## Type Safety

All code should be type-safe:

```bash
# Run TypeScript checks
pnpm run check:types
```

Aim for zero TypeScript errors. Use `@ts-ignore` only with justification.

## Testing

All new features should include tests. Run tests locally:

```bash
pnpm run test
```

## Before Submitting a Pull Request

- [ ] Code follows project conventions
- [ ] Biome check passes: `pnpm run check`
- [ ] TypeScript check passes: `pnpm run check:types`
- [ ] Tests pass: `pnpm run test`
- [ ] Commit messages follow Conventional Commits
- [ ] No console warnings or errors

## CI/CD

GitHub Actions automatically validates every push and pull request using the workflow defined in `.github/workflows/test.yml`.

### Automated Checks

When you push code or open a pull request, four jobs run in parallel:

1. **Unit Tests** — Backend unit tests with mocked dependencies
   - No database required
   - Fast feedback on business logic
   - Coverage reports uploaded to Codecov
   - Command: `pnpm run test:unit`

2. **Feature Tests** — API endpoint testing with real database
   - PostgreSQL 16 service container
   - Database migrations run automatically
   - Backend server started on `localhost:3000`
   - Tests API contracts and data persistence
   - Command: `pnpm run test:feature`

3. **E2E Tests** — Full user workflow testing with Playwright
   - PostgreSQL 16 service container
   - Both frontend (`localhost:5173`) and backend (`localhost:3000`) running
   - User interactions tested end-to-end
   - HTML reports and traces uploaded on failure
   - Command: `pnpm run test:e2e`

4. **Lint & Type Check** — Code quality validation
   - TypeScript type checking: `pnpm run type-check`
   - Biome linting: `pnpm run check`
   - No database required
   - Catches errors before they reach main

### PR Status

Each pull request shows individual status checks for all four jobs. A PR cannot be merged until all jobs pass.

View detailed logs:
1. Click the "Checks" tab on your PR
2. Click on a failed job to see detailed output
3. Review logs to understand what needs fixing

### Local Testing Before PR

Run the same checks locally to catch issues early:

```bash
# Run all checks (recommended before pushing)
pnpm run check         # Biome linting
pnpm run type-check    # TypeScript checking
pnpm run test:unit     # Unit tests
pnpm run test:feature  # Feature tests (needs PostgreSQL)
pnpm run test:e2e      # E2E tests (needs servers running)
```

### Environment Variables

The workflow uses these environment variables (configured automatically):
- `NODE_ENV=test` — Set for CI environment
- `DATABASE_URL` — Points to PostgreSQL test container
- `BACKEND_PORT=3000` — Backend server port
- `FRONTEND_PORT=5173` — Frontend dev server port

For CI-specific configuration, see `.env.example`.

### Troubleshooting Failed Checks

**Failed Linting Check:**
```bash
pnpm run check  # Auto-fix most issues
# Review remaining errors and fix manually
```

**Failed Type Check:**
```bash
pnpm run type-check  # See specific type errors
# Fix TypeScript errors in affected files
```

**Failed Unit Tests:**
```bash
pnpm run test:unit  # Run locally to reproduce
# Debug failing test and update code or test
```

**Failed Feature Tests:**
```bash
# Start PostgreSQL first (Docker or local)
pnpm run db:migrate  # Run migrations
pnpm run start:backend &  # Start backend
pnpm run test:feature  # Test API endpoints
```

**Failed E2E Tests:**
```bash
# Start PostgreSQL first
pnpm run db:migrate
pnpm dev  # Start frontend and backend in separate terminals
pnpm run test:e2e  # Run E2E tests
# Check Playwright traces in test-results/ folder
```

### Branch Protection Rules

The `main` branch is protected:
- All status checks must pass
- Pull requests are required (no direct pushes)
- Admins can override for emergency fixes

## Questions?

- Review [Biome Documentation](https://biomejs.dev/)
- Check [Conventional Commits](https://www.conventionalcommits.org/)
- Open an issue for clarification

Thank you for contributing!
