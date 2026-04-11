#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { externalPackages, getWorkspacePackages } = require('./package-catalog-data.js');

const repoRoot = path.resolve(__dirname, '..');
const readmePath = path.join(repoRoot, 'README.md');

const START_MARKER = '<!-- package-catalog:start -->';
const END_MARKER = '<!-- package-catalog:end -->';

function escapeCell(value) {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function renderTable(packages, includeNotes = false) {
  const header = includeNotes
    ? '| Package | npm | Source | Description | Notes |'
    : '| Package | npm | Source | Description |';
  const divider = includeNotes ? '| --- | --- | --- | --- | --- |' : '| --- | --- | --- | --- |';
  const rows = packages.map((pkg) => {
    const base = [
      `\`${pkg.name}\``,
      `[npm](${pkg.npmUrl})`,
      `[source](${pkg.sourceUrl})`,
      escapeCell(pkg.description),
    ];

    if (includeNotes) {
      base.push(escapeCell(pkg.notes || ''));
    }

    return `| ${base.join(' | ')} |`;
  });

  return [header, divider, ...rows].join('\n');
}

function renderCatalog() {
  const workspacePackages = getWorkspacePackages();

  return [
    `${START_MARKER}`,
    '### Workspace Packages',
    '',
    renderTable(workspacePackages),
    '',
    '### Related Official Package',
    '',
    renderTable(externalPackages, true),
    `${END_MARKER}`,
  ].join('\n');
}

function replaceCatalogSection(readmeContents, renderedCatalog) {
  const pattern = new RegExp(`${START_MARKER}[\\s\\S]*${END_MARKER}`);

  if (!pattern.test(readmeContents)) {
    throw new Error(`Could not find ${START_MARKER} ... ${END_MARKER} block in README.md`);
  }

  return readmeContents.replace(pattern, renderedCatalog);
}

function main() {
  const mode = process.argv[2] || '--write';
  const readmeContents = fs.readFileSync(readmePath, 'utf8');
  const renderedCatalog = renderCatalog();
  const nextReadme = replaceCatalogSection(readmeContents, renderedCatalog);

  if (mode === '--write') {
    if (nextReadme !== readmeContents) {
      fs.writeFileSync(readmePath, nextReadme);
      console.log('Updated README package catalog.');
    } else {
      console.log('README package catalog is already up to date.');
    }
    return;
  }

  if (mode === '--check') {
    if (nextReadme !== readmeContents) {
      console.error('README package catalog is stale. Run `npm run sync:package-catalog`.');
      process.exit(1);
    }

    console.log('README package catalog is up to date.');
    return;
  }

  console.error('Usage: node scripts/package-catalog.js [--write|--check]');
  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = {
  externalPackages,
  getWorkspacePackages,
  renderCatalog,
  replaceCatalogSection,
};
