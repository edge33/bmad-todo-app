#!/bin/bash
# Setup script to configure git hooks for the project
# Run this after cloning: bash setup-hooks.sh

echo "Setting up git hooks..."

# Configure git to use .husky as hooks directory
git config core.hooksPath .husky

# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg

echo "✅ Git hooks configured!"
echo "   - core.hooksPath set to .husky"
echo "   - pre-commit hook will run lint-staged"
echo "   - commit-msg hook will validate conventional commits"
echo ""
echo "Test it: git commit -m 'invalid message' (should fail)"
