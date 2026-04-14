const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('node:fs');
const { join } = require('node:path');

const { checkBuiltEsmImports } = require('./check-esm-imports.js');

test('checkBuiltEsmImports flags named imports from bignumber.js in built esm files', () => {
  const root = mkdtempSync(join(os.tmpdir(), 'check-esm-imports-'));

  try {
    const distDir = join(root, 'taquito-local-forging', 'dist');
    mkdirSync(distDir, { recursive: true });
    writeFileSync(
      join(distDir, 'taquito-local-forging.es6.js'),
      "import BigNumber$1, { BigNumber } from 'bignumber.js';\n"
    );

    const findings = checkBuiltEsmImports(root);

    assert.equal(findings.length, 1);
    assert.match(findings[0].importStatement, /\{ BigNumber \}/);
    assert.equal(findings[0].packageName, 'bignumber.js');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('checkBuiltEsmImports ignores default-only imports from bignumber.js in built esm files', () => {
  const root = mkdtempSync(join(os.tmpdir(), 'check-esm-imports-'));

  try {
    const distDir = join(root, 'taquito-utils', 'dist');
    mkdirSync(distDir, { recursive: true });
    writeFileSync(join(distDir, 'taquito-utils.es6.js'), "import BigNumberJs from 'bignumber.js';\n");

    const findings = checkBuiltEsmImports(root);

    assert.equal(findings.length, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
