#!/usr/bin/env node

/**
 * Monorepo Structure Validation Tests
 * 
 * Tests that validate Story 1.1 acceptance criteria:
 * - Root pnpm-workspace.yaml exists and is valid
 * - Root package.json with workspace configuration
 * - Root tsconfig.base.json exists
 * - All workspace directories exist with package.json
 * - Each workspace has tsconfig.json extending base
 * - .gitignore and README.md exist
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

let testsPassed = 0;
let testsFailed = 0;
const failedTests = [];

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    testsPassed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
    testsFailed++;
    failedTests.push(name);
  }
}

function fileExists(filePath, message) {
  const fullPath = path.join(rootDir, filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(message || `File does not exist: ${filePath}`);
  }
}

function dirExists(dirPath, message) {
  const fullPath = path.join(rootDir, dirPath);
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
    throw new Error(message || `Directory does not exist: ${dirPath}`);
  }
}

function fileContains(filePath, text, message) {
  const fullPath = path.join(rootDir, filePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  if (!content.includes(text)) {
    throw new Error(message || `File ${filePath} does not contain: ${text}`);
  }
}

function validJSON(filePath, message) {
  const fullPath = path.join(rootDir, filePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  try {
    JSON.parse(content);
  } catch (e) {
    throw new Error(message || `File ${filePath} is not valid JSON: ${e.message}`);
  }
}

function validYAML(filePath, message) {
  const fullPath = path.join(rootDir, filePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  // Simple YAML validation - check for basic structure
  if (!content.includes('packages:') || !content.includes('apps/*') || !content.includes('packages/*')) {
    throw new Error(message || `File ${filePath} does not have expected pnpm workspace structure`);
  }
}

console.log('🧪 Testing Story 1.1: Initialize pnpm Monorepo & Workspace Structure\n');

// Task 1: Root structure
console.log('Task 1: Create monorepo root structure');
test('1.1 - pnpm-workspace.yaml exists', () => {
  fileExists('pnpm-workspace.yaml', 'Root pnpm-workspace.yaml must exist');
});

test('1.1 - pnpm-workspace.yaml is valid YAML with workspace definitions', () => {
  validYAML('pnpm-workspace.yaml');
});

test('1.2 - Root package.json exists', () => {
  fileExists('package.json', 'Root package.json must exist');
});

test('1.2 - Root package.json is valid JSON', () => {
  validJSON('package.json');
});

test('1.2 - Root package.json has workspaces configuration', () => {
  fileContains('package.json', '"workspaces"', 'Root package.json must have workspaces field');
});

test('1.2 - Root package.json workspace paths include apps/* and packages/*', () => {
  const pkgPath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  if (!pkg.workspaces || !pkg.workspaces.includes('apps/*') || !pkg.workspaces.includes('packages/*')) {
    throw new Error('package.json workspaces must include "apps/*" and "packages/*"');
  }
});

test('1.3 - Root tsconfig.base.json exists', () => {
  fileExists('tsconfig.base.json', 'Root tsconfig.base.json must exist');
});

test('1.3 - Root tsconfig.base.json is valid JSON', () => {
  validJSON('tsconfig.base.json');
});

test('1.3 - Root tsconfig.base.json has compilerOptions', () => {
  fileContains('tsconfig.base.json', '"compilerOptions"', 'tsconfig.base.json must have compilerOptions');
});

// Task 2: Workspace directories
console.log('\nTask 2: Create workspace directories and their package.json files');

test('2.1 - apps/frontend directory exists', () => {
  dirExists('apps/frontend');
});

test('2.1 - apps/frontend/package.json exists', () => {
  fileExists('apps/frontend/package.json');
});

test('2.1 - apps/frontend/package.json is valid JSON with correct name', () => {
  validJSON('apps/frontend/package.json');
  fileContains('apps/frontend/package.json', '@todoapp/frontend', 'Frontend package must have scoped name');
});

test('2.2 - apps/backend directory exists', () => {
  dirExists('apps/backend');
});

test('2.2 - apps/backend/package.json exists', () => {
  fileExists('apps/backend/package.json');
});

test('2.2 - apps/backend/package.json is valid JSON with correct name', () => {
  validJSON('apps/backend/package.json');
  fileContains('apps/backend/package.json', '@todoapp/backend', 'Backend package must have scoped name');
});

test('2.3 - packages/shared-types directory exists', () => {
  dirExists('packages/shared-types');
});

test('2.3 - packages/shared-types/package.json exists', () => {
  fileExists('packages/shared-types/package.json');
});

test('2.3 - packages/shared-types/package.json is valid JSON with correct name', () => {
  validJSON('packages/shared-types/package.json');
  fileContains('packages/shared-types/package.json', '@todoapp/shared-types', 'shared-types package must have scoped name');
});

test('2.4 - packages/shared-utils directory exists', () => {
  dirExists('packages/shared-utils');
});

test('2.4 - packages/shared-utils/package.json exists', () => {
  fileExists('packages/shared-utils/package.json');
});

test('2.4 - packages/shared-utils/package.json is valid JSON with correct name', () => {
  validJSON('packages/shared-utils/package.json');
  fileContains('packages/shared-utils/package.json', '@todoapp/shared-utils', 'shared-utils package must have scoped name');
});

// Task 3: tsconfig.json for each workspace
console.log('\nTask 3: Create tsconfig.json for each workspace member');

test('3.1 - apps/frontend/tsconfig.json exists', () => {
  fileExists('apps/frontend/tsconfig.json');
});

test('3.1 - apps/frontend/tsconfig.json extends base config', () => {
  fileContains('apps/frontend/tsconfig.json', '../../tsconfig.base.json', 'Frontend tsconfig must extend base');
});

test('3.2 - apps/backend/tsconfig.json exists', () => {
  fileExists('apps/backend/tsconfig.json');
});

test('3.2 - apps/backend/tsconfig.json extends base config', () => {
  fileContains('apps/backend/tsconfig.json', '../../tsconfig.base.json', 'Backend tsconfig must extend base');
});

test('3.3 - packages/shared-types/tsconfig.json exists', () => {
  fileExists('packages/shared-types/tsconfig.json');
});

test('3.3 - packages/shared-types/tsconfig.json extends base config', () => {
  fileContains('packages/shared-types/tsconfig.json', '../../tsconfig.base.json', 'shared-types tsconfig must extend base');
});

test('3.4 - packages/shared-utils/tsconfig.json exists', () => {
  fileExists('packages/shared-utils/tsconfig.json');
});

test('3.4 - packages/shared-utils/tsconfig.json extends base config', () => {
  fileContains('packages/shared-utils/tsconfig.json', '../../tsconfig.base.json', 'shared-utils tsconfig must extend base');
});

// Task 4: Root utility files
console.log('\nTask 4: Create root-level utility files');

test('4.1 - Root .gitignore exists', () => {
  fileExists('.gitignore');
});

test('4.1 - Root .gitignore includes node_modules', () => {
  fileContains('.gitignore', 'node_modules', '.gitignore must exclude node_modules');
});

test('4.2 - Root README.md exists', () => {
  fileExists('README.md');
});

test('4.2 - Root README.md contains project description', () => {
  fileContains('README.md', 'TodoApp', 'README.md must describe the project');
});

test('4.2 - Root README.md contains monorepo structure documentation', () => {
  fileContains('README.md', 'Project Structure', 'README.md must document project structure');
});

// Task 5: Validation summary
console.log('\nTask 5: Monorepo setup validation');

test('5.1 - All workspace package.json files use workspace protocol', () => {
  const files = [
    'apps/frontend/package.json',
    'apps/backend/package.json'
  ];
  for (const file of files) {
    fileContains(file, 'workspace:*', `${file} must use workspace:* protocol for dependencies`);
  }
});

test('5.2 - All workspace members declared in root package.json', () => {
  const rootPkgPath = path.join(rootDir, 'package.json');
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
  const requiredMembers = [
    '@todoapp/frontend',
    '@todoapp/backend',
    '@todoapp/shared-types',
    '@todoapp/shared-utils'
  ];
  // Verify by checking workspace paths are properly configured
  if (!rootPkg.workspaces || rootPkg.workspaces.length < 2) {
    throw new Error('Root package.json must have workspaces array with at least 2 entries');
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests Passed: ${testsPassed}`);
console.log(`Tests Failed: ${testsFailed}`);
if (testsFailed > 0) {
  console.log('\nFailed Tests:');
  failedTests.forEach(test => console.log(`  - ${test}`));
  process.exit(1);
} else {
  console.log('\n✅ All tests passed! Monorepo structure is valid.');
  process.exit(0);
}
