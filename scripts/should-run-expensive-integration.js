#!/usr/bin/env node

const { execFileSync } = require('child_process');

const eventName = process.env.EVENT_NAME;
const baseSha = process.env.BASE_SHA;
const headSha = process.env.HEAD_SHA;

if (eventName !== 'pull_request') {
  process.stdout.write('true');
  process.exit(0);
}

if (!baseSha || !headSha) {
  console.error('BASE_SHA and HEAD_SHA are required for pull_request events');
  process.exit(1);
}

const changedFiles = execFileSync('git', ['diff', '--name-only', `${baseSha}...${headSha}`], {
  encoding: 'utf8',
})
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

const safePathPatterns = [
  /^website\//,
  /^packages\/[^/]+\/src\/version\.ts$/,
  /^packages\/taquito\/README\.md$/,
];

const jsonMetadataPatterns = [
  /^package\.json$/,
  /^package-lock\.json$/,
  /^example\/package\.json$/,
  /^integration-tests\/package\.json$/,
  /^website\/package\.json$/,
  /^website\/package-lock\.json$/,
  /^packages\/[^/]+\/package\.json$/,
  /^packages\/taquito-michel-codec\/pack-test-tool\/package\.json$/,
];

const shouldRun = changedFiles.some((file) => {
  if (safePathPatterns.some((pattern) => pattern.test(file))) {
    return false;
  }

  if (jsonMetadataPatterns.some((pattern) => pattern.test(file))) {
    return !isSafeJsonMetadataChange(file);
  }

  return true;
});

process.stdout.write(shouldRun ? 'true' : 'false');

function isSafeJsonMetadataChange(file) {
  try {
    const before = readJson(`${baseSha}:${file}`);
    const after = readJson(`${headSha}:${file}`);

    if (file.endsWith('package-lock.json')) {
      return JSON.stringify(sanitizePackageLock(file, before)) === JSON.stringify(sanitizePackageLock(file, after));
    }

    return JSON.stringify(sanitizePackageJson(before)) === JSON.stringify(sanitizePackageJson(after));
  } catch {
    return false;
  }
}

function readJson(ref) {
  return JSON.parse(
    execFileSync('git', ['show', ref], {
      encoding: 'utf8',
    }),
  );
}

function sanitizePackageJson(json) {
  const clone = structuredClone(json);
  delete clone.version;

  for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    normalizeTaquitoDependencyMap(clone[field]);
  }

  return clone;
}

function sanitizePackageLock(file, json) {
  const clone = structuredClone(json);

  if (clone.version) clone.version = '__VERSION__';
  if (clone.packages && clone.packages[''] && clone.packages[''].version) {
    clone.packages[''].version = '__VERSION__';
  }
  if (clone.packages && clone.packages['']) {
    normalizeTaquitoDependencyMap(clone.packages[''].dependencies);
  }

  if (!clone.packages) {
    return clone;
  }

  if (file === 'website/package-lock.json') {
    for (const [pkgPath, pkg] of Object.entries(clone.packages)) {
      if (!pkgPath.startsWith('node_modules/@taquito/')) continue;
      normalizePackageLockPackage(pkg, true);
    }
    return clone;
  }

  for (const [pkgPath, pkg] of Object.entries(clone.packages)) {
    if (
      pkgPath === '' ||
      pkgPath.startsWith('packages/') ||
      pkgPath.startsWith('node_modules/@taquito/') ||
      pkgPath === 'example' ||
      pkgPath === 'integration-tests'
    ) {
      normalizePackageLockPackage(pkg, false);
    }
  }

  return clone;
}

function normalizePackageLockPackage(pkg, normalizeRegistryFields) {
  if (!pkg || typeof pkg !== 'object') return;

  if (pkg.version) pkg.version = '__VERSION__';
  if (normalizeRegistryFields) {
    if (pkg.resolved) pkg.resolved = '__RESOLVED__';
    if (pkg.integrity) pkg.integrity = '__INTEGRITY__';
  }

  for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    normalizeTaquitoDependencyMap(pkg[field]);
  }
}

function normalizeTaquitoDependencyMap(map) {
  if (!map || typeof map !== 'object') return;

  for (const key of Object.keys(map)) {
    if (key.startsWith('@taquito/')) {
      map[key] = '__TAQUITO_VERSION__';
    }
  }
}
