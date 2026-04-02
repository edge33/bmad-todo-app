# Contributing to todoapp

We appreciate your interest in contributing! Please follow these guidelines to maintain code quality and project consistency.

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

GitHub Actions automatically validates:

- **Code Quality** — Biome linting and formatting
- **Type Checking** — TypeScript strict mode
- **Unit Tests** — All tests pass
- **E2E Tests** — User flows work correctly

All checks must pass before merging to main.

## Questions?

- Review [Biome Documentation](https://biomejs.dev/)
- Check [Conventional Commits](https://www.conventionalcommits.org/)
- Open an issue for clarification

Thank you for contributing!
