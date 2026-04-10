#!/usr/bin/env node

const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const version = process.argv[2];

if (!version) {
  console.error('Usage: sync-website-release.js <version>');
  process.exit(1);
}

const websitePackageJsonPath = resolve(__dirname, '..', 'website', 'package.json');
const versionsConfigPath = resolve(__dirname, '..', 'website', 'src', 'config', 'versions.mjs');

const websitePackage = JSON.parse(readFileSync(websitePackageJsonPath, 'utf8'));
websitePackage.version = version;

for (const [name] of Object.entries(websitePackage.dependencies || {})) {
  if (name.startsWith('@taquito/')) {
    websitePackage.dependencies[name] = `^${version}`;
  }
}

writeFileSync(websitePackageJsonPath, `${JSON.stringify(websitePackage, null, 2)}\n`);

const versionsConfig = readFileSync(versionsConfigPath, 'utf8');
const versionsMatch = versionsConfig.match(/export const VERSIONS = \[(.*)\];/);
if (!versionsMatch) {
  console.error(`Unable to parse versions list in ${versionsConfigPath}`);
  process.exit(1);
}

const versions = Array.from(versionsMatch[1].matchAll(/"([^"]+)"/g), (match) => match[1]).filter(
  (item, index, items) => items.indexOf(item) === index,
);

const stableVersions = versions.filter((item) => item !== 'next' && item !== version);
const nextVersions = ['next', version, ...stableVersions];

let nextConfig = versionsConfig.replace(
  /export const VERSIONS = \[.*\];/,
  `export const VERSIONS = ${JSON.stringify(nextVersions)};`,
);
nextConfig = nextConfig.replace(/export const DEFAULT_VERSION = ".*";/, `export const DEFAULT_VERSION = "${version}";`);

writeFileSync(versionsConfigPath, nextConfig);
