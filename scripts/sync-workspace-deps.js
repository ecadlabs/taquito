#!/usr/bin/env node
// Sets the version in workspace package.json files and syncs cross-workspace
// @taquito/* dependency ranges.

const { existsSync, readdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const version = process.argv[2];

if (!version) {
  console.error('Usage: sync-workspace-deps.js <version>');
  process.exit(1);
}

const root = join(__dirname, '..');
const rootPkgPath = join(root, 'package.json');
const rootPkg = JSON.parse(readFileSync(rootPkgPath, 'utf8'));
const range = `^${version}`;

rootPkg.version = version;
writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');

const packageJsonPaths = [];

for (const workspace of rootPkg.workspaces || []) {
  if (workspace.endsWith('/*')) {
    const dir = join(root, workspace.slice(0, -2));
    if (!existsSync(dir)) {
      continue;
    }

    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }

      const packageJsonPath = join(dir, entry.name, 'package.json');
      if (existsSync(packageJsonPath)) {
        packageJsonPaths.push(packageJsonPath);
      }
    }
  } else {
    const packageJsonPath = join(root, workspace, 'package.json');
    if (existsSync(packageJsonPath)) {
      packageJsonPaths.push(packageJsonPath);
    }
  }
}

for (const packageJsonPath of packageJsonPaths) {
  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  let changed = false;

  if (pkg.version !== version) {
    pkg.version = version;
    changed = true;
  }

  for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
    const deps = pkg[field];
    if (!deps) {
      continue;
    }

    for (const name of Object.keys(deps)) {
      if (name.startsWith('@taquito/') && deps[name] !== range) {
        deps[name] = range;
        changed = true;
      }
    }
  }

  if (changed) {
    writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`${pkg.name}@${version}`);
  }
}
