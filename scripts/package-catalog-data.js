const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const packagesDir = path.join(repoRoot, 'packages');
const hiddenWorkspacePackages = new Set(['@taquito/sapling-spend-params']);

const externalPackages = [
  {
    name: '@taquito/sapling-wasm',
    description: 'Sapling Wasm bindings for Taquito and compatible consumers.',
    npmUrl: 'https://www.npmjs.com/package/@taquito/sapling-wasm',
    sourceUrl: 'https://github.com/ecadlabs/sapling-wasm/tree/main/packages/sapling-wasm',
    notes: 'Official Taquito package, published from the separate `ecadlabs/sapling-wasm` repository.',
  },
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function comparePackages(left, right) {
  return left.name.localeCompare(right.name);
}

function getWorkspacePackages() {
  return fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const packageDir = path.join(packagesDir, entry.name);
      const packageJsonPath = path.join(packageDir, 'package.json');

      if (!fs.existsSync(packageJsonPath)) {
        return null;
      }

      const packageJson = readJson(packageJsonPath);
      const relativeDir = path.relative(repoRoot, packageDir).replace(/\\/g, '/');

      return {
        name: packageJson.name,
        description: packageJson.description || '',
        npmUrl: `https://www.npmjs.com/package/${packageJson.name}`,
        sourceUrl: `./${relativeDir}`,
      };
    })
    .filter(Boolean)
    .filter((pkg) => !hiddenWorkspacePackages.has(pkg.name))
    .sort(comparePackages);
}

module.exports = {
  externalPackages,
  getWorkspacePackages,
};
