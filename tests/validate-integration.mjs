#!/usr/bin/env node

/**
 * Monorepo Integration Tests
 * 
 * Tests that validate the monorepo can be used for cross-workspace development:
 * - Package references work correctly
 * - TypeScript paths are configured
 * - Workspace protocol dependencies are valid
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

console.log('🔗 Testing Monorepo Integration\n');

// Test workspace references
console.log('Workspace References:');

test('Root package.json properly defines workspace members', () => {
  const rootPkgPath = path.join(rootDir, 'package.json');
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
  
  if (!rootPkg.workspaces || rootPkg.workspaces.length === 0) {
    throw new Error('Root package.json must define workspaces');
  }
  
  const expectedPaths = ['apps/*', 'packages/*'];
  const hasBoth = expectedPaths.every(path => rootPkg.workspaces.includes(path));
  
  if (!hasBoth) {
    throw new Error('Root workspaces must include "apps/*" and "packages/*"');
  }
});

test('Frontend workspace declares shared dependencies correctly', () => {
  const frontendPkgPath = path.join(rootDir, 'apps/frontend/package.json');
  const frontendPkg = JSON.parse(fs.readFileSync(frontendPkgPath, 'utf-8'));
  
  if (!frontendPkg.dependencies || !frontendPkg.dependencies['@todoapp/shared-types']) {
    throw new Error('Frontend should depend on @todoapp/shared-types');
  }
  
  if (frontendPkg.dependencies['@todoapp/shared-types'] !== 'workspace:*') {
    throw new Error('Frontend shared-types dependency should use workspace:* protocol');
  }
});

test('Backend workspace declares shared dependencies correctly', () => {
  const backendPkgPath = path.join(rootDir, 'apps/backend/package.json');
  const backendPkg = JSON.parse(fs.readFileSync(backendPkgPath, 'utf-8'));
  
  if (!backendPkg.dependencies || !backendPkg.dependencies['@todoapp/shared-types']) {
    throw new Error('Backend should depend on @todoapp/shared-types');
  }
  
  if (backendPkg.dependencies['@todoapp/shared-types'] !== 'workspace:*') {
    throw new Error('Backend shared-types dependency should use workspace:* protocol');
  }
});

// Test TypeScript configuration
console.log('\nTypeScript Configuration:');

test('Root tsconfig.base.json has proper path mapping', () => {
  const tsconfigPath = path.join(rootDir, 'tsconfig.base.json');
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
  
  if (!tsconfig.compilerOptions || !tsconfig.compilerOptions.paths) {
    throw new Error('tsconfig.base.json must have compilerOptions.paths');
  }
  
  const paths = tsconfig.compilerOptions.paths;
  const requiredPaths = [
    '@todoapp/shared-types/*',
    '@todoapp/shared-utils/*',
    '@todoapp/frontend/*',
    '@todoapp/backend/*'
  ];
  
  requiredPaths.forEach(pathKey => {
    if (!paths[pathKey]) {
      throw new Error(`Missing path mapping for ${pathKey}`);
    }
  });
});

test('All workspace members have proper tsconfig inheritance', () => {
  const workspaceMembers = [
    'apps/frontend',
    'apps/backend',
    'packages/shared-types',
    'packages/shared-utils'
  ];
  
  workspaceMembers.forEach(member => {
    const tsconfigPath = path.join(rootDir, member, 'tsconfig.json');
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
    
    if (!tsconfig.extends || !tsconfig.extends.includes('tsconfig.base.json')) {
      throw new Error(`${member}/tsconfig.json must extend tsconfig.base.json`);
    }
  });
});

test('Workspace members have outDir configured', () => {
  const workspaceMembers = [
    'apps/frontend',
    'apps/backend',
    'packages/shared-types',
    'packages/shared-utils'
  ];
  
  workspaceMembers.forEach(member => {
    const tsconfigPath = path.join(rootDir, member, 'tsconfig.json');
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
    
    if (!tsconfig.compilerOptions || !tsconfig.compilerOptions.outDir) {
      throw new Error(`${member}/tsconfig.json must have outDir configured`);
    }
  });
});

// Test build scripts
console.log('\nBuild Scripts:');

test('Root package.json has dev script for parallel development', () => {
  const rootPkgPath = path.join(rootDir, 'package.json');
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
  
  if (!rootPkg.scripts || !rootPkg.scripts.dev) {
    throw new Error('Root package.json should have dev script');
  }
  
  if (!rootPkg.scripts.dev.includes('pnpm -r')) {
    throw new Error('Root dev script should use pnpm -r for all workspaces');
  }
});

test('Root package.json has build script for all workspaces', () => {
  const rootPkgPath = path.join(rootDir, 'package.json');
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
  
  if (!rootPkg.scripts || !rootPkg.scripts.build) {
    throw new Error('Root package.json should have build script');
  }
  
  if (!rootPkg.scripts.build.includes('pnpm -r')) {
    throw new Error('Root build script should use pnpm -r for all workspaces');
  }
});

test('Root package.json has test script for all workspaces', () => {
  const rootPkgPath = path.join(rootDir, 'package.json');
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
  
  if (!rootPkg.scripts || !rootPkg.scripts.test) {
    throw new Error('Root package.json should have test script');
  }
  
  if (!rootPkg.scripts.test.includes('pnpm -r')) {
    throw new Error('Root test script should use pnpm -r for all workspaces');
  }
});

// Test package.json standards
console.log('\nPackage Standards:');

test('All workspace members use type: module (ESM)', () => {
  const workspaceMembers = [
    'apps/frontend',
    'apps/backend',
    'packages/shared-types',
    'packages/shared-utils'
  ];
  
  workspaceMembers.forEach(member => {
    const pkgPath = path.join(rootDir, member, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    
    if (pkg.type !== 'module') {
      throw new Error(`${member}/package.json should have type: "module"`);
    }
  });
});

test('All workspace members have scoped names', () => {
  const expectedScopes = {
    'apps/frontend': '@todoapp/frontend',
    'apps/backend': '@todoapp/backend',
    'packages/shared-types': '@todoapp/shared-types',
    'packages/shared-utils': '@todoapp/shared-utils'
  };
  
  Object.entries(expectedScopes).forEach(([member, expectedName]) => {
    const pkgPath = path.join(rootDir, member, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    
    if (pkg.name !== expectedName) {
      throw new Error(`${member} should be named ${expectedName}, got ${pkg.name}`);
    }
  });
});

test('Shared packages have proper build outputs defined', () => {
  const sharedPackages = [
    'packages/shared-types',
    'packages/shared-utils'
  ];
  
  sharedPackages.forEach(member => {
    const pkgPath = path.join(rootDir, member, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    
    if (!pkg.main || !pkg.types || !pkg.files) {
      throw new Error(`${member}/package.json should have main, types, and files fields`);
    }
  });
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
  console.log('\n✅ All integration tests passed! Monorepo is ready for development.');
  process.exit(0);
}
