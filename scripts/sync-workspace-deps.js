#!/usr/bin/env node
// Sets the version in all workspace package.json files and syncs cross-workspace
// @taquito/* dependency ranges.
//
// We do this instead of npm version --workspaces because npm version crashes on
// workspaces with npm: overrides (arborist's #parseSettings calls npa on the
// override specs, which chokes on the npm: alias format).
//
// Also works around npm/cli#7843: npm version --workspaces does NOT update
// cross-workspace dependency ranges.

const { readdirSync, readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');

const version = process.argv[2];
if (!version) {
  console.error('Usage: sync-workspace-deps.js <version>');
  process.exit(1);
}

const root = join(__dirname, '..');
const range = `^${version}`;

// Update root package.json version
const rootPkgPath = join(root, 'package.json');
const rootPkg = JSON.parse(readFileSync(rootPkgPath, 'utf8'));
rootPkg.version = version;
writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');

// Collect all workspace package.json paths from the workspaces field
const pkgPaths = [];
for (const pattern of rootPkg.workspaces || []) {
  if (pattern.endsWith('/*')) {
    // Glob-style: packages/*
    const dir = join(root, pattern.replace('/*', ''));
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const p = join(dir, entry.name, 'package.json');
      if (existsSync(p)) pkgPaths.push(p);
    }
  } else {
    // Exact path: example, integration-tests, etc.
    const p = join(root, pattern, 'package.json');
    if (existsSync(p)) pkgPaths.push(p);
  }
}

for (const pkgPath of pkgPaths) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  let changed = false;

  if (pkg.version !== version) {
    pkg.version = version;
    changed = true;
  }

  for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
    const deps = pkg[field];
    if (!deps) continue;
    for (const name of Object.keys(deps)) {
      if (name.startsWith('@taquito/') && deps[name] !== range) {
        deps[name] = range;
        changed = true;
      }
    }
  }

  if (changed) {
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`${pkg.name}@${version}`);
  }
}
