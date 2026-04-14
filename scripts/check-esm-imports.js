const { readdirSync, readFileSync } = require('node:fs');
const { join, resolve } = require('node:path');

const repoRoot = resolve(__dirname, '..');
const packagesDir = join(repoRoot, 'packages');

const forbiddenImportChecks = [
  {
    packageName: 'bignumber.js',
    pattern:
      /import\s+(?:[^'";]+,\s*)?\{[^}]+\}\s+from\s+['"]bignumber\.js['"];?/g,
    reason: 'named imports from bignumber.js are not safe in published browser ESM bundles',
  },
];

function findBuiltEsmFiles(rootDir = packagesDir) {
  return readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(rootDir, entry.name, 'dist'))
    .flatMap((distDir) => {
      try {
        return readdirSync(distDir)
          .filter((fileName) => fileName.endsWith('.es6.js'))
          .map((fileName) => join(distDir, fileName));
      } catch {
        return [];
      }
    });
}

function findForbiddenImports(filePath, source) {
  const findings = [];

  for (const check of forbiddenImportChecks) {
    for (const match of source.matchAll(check.pattern)) {
      findings.push({
        filePath,
        packageName: check.packageName,
        importStatement: match[0],
        reason: check.reason,
      });
    }
  }

  return findings;
}

function checkBuiltEsmImports(rootDir = packagesDir) {
  return findBuiltEsmFiles(rootDir).flatMap((filePath) =>
    findForbiddenImports(filePath, readFileSync(filePath, 'utf8'))
  );
}

function formatFinding(finding) {
  const relativePath = finding.filePath.startsWith(repoRoot)
    ? finding.filePath.slice(repoRoot.length + 1)
    : finding.filePath;

  return `${relativePath}\n  ${finding.importStatement}\n  ${finding.reason}`;
}

if (require.main === module) {
  const findings = checkBuiltEsmImports();

  if (findings.length > 0) {
    console.error('Forbidden ESM import shape found in built artifacts:\n');
    for (const finding of findings) {
      console.error(formatFinding(finding));
    }
    process.exit(1);
  }

  console.log('Built ESM import checks passed.');
}

module.exports = {
  checkBuiltEsmImports,
  findBuiltEsmFiles,
  findForbiddenImports,
  formatFinding,
};
