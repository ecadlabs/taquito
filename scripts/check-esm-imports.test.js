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

test('checkBuiltEsmImports flags typedarray-to-buffer and fast-text-encoding imports in built esm files', () => {
  const root = mkdtempSync(join(os.tmpdir(), 'check-esm-imports-'));

  try {
    const signerDist = join(root, 'taquito-remote-signer', 'dist');
    mkdirSync(signerDist, { recursive: true });
    writeFileSync(
      join(signerDist, 'taquito-remote-signer.es6.js'),
      "import toBuffer from 'typedarray-to-buffer';\n"
    );

    const forgerDist = join(root, 'taquito-local-forging', 'dist');
    mkdirSync(forgerDist, { recursive: true });
    writeFileSync(
      join(forgerDist, 'taquito-local-forging.es6.js'),
      "import 'fast-text-encoding';\n"
    );

    const findings = checkBuiltEsmImports(root);

    assert.equal(findings.length, 2);
    assert.deepEqual(
      findings.map((f) => f.packageName).sort(),
      ['fast-text-encoding', 'typedarray-to-buffer']
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('checkBuiltEsmImports flags unguarded global Buffer usage across lexical scopes and expressions', () => {
  const root = mkdtempSync(join(os.tmpdir(), 'check-esm-imports-'));

  try {
    const distDir = join(root, 'taquito-local-forging', 'dist');
    mkdirSync(distDir, { recursive: true });
    writeFileSync(
      join(distDir, 'taquito-local-forging.es6.js'),
      [
        '// Comment mentioning Buffer.from(foo) should be ignored',
        "const msg = 'Buffer is too short';",
        'const regex = /[\'"]/;',
        'const isOpWithGasBuffer = () => true;',
        'function innerScopeOnly() { function Buffer() {} return Buffer; }',
        "import { Buffer as BrowserBuffer } from 'buffer';",
        "const hex = Buffer.from(bytes).toString('hex');",
        'const interpolated = `${Buffer.alloc(4)}`;',
        'const unguardedGlobal = globalThis.Buffer.from(bytes);',
      ].join('\n') + '\n'
    );

    const findings = checkBuiltEsmImports(root);

    assert.equal(findings.length, 3);
    assert.deepEqual(
      findings.map((f) => f.packageName),
      ['Buffer', 'Buffer', 'Buffer']
    );
    assert.match(findings[0].importStatement, /Buffer\.from/);
    assert.match(findings[1].importStatement, /Buffer\.alloc/);
    assert.match(findings[2].importStatement, /globalThis\.Buffer\.from/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('checkBuiltEsmImports allows Buffer usage when bound in scope or guarded by a runtime check', () => {
  const root = mkdtempSync(join(os.tmpdir(), 'check-esm-imports-'));

  try {
    const utilsDist = join(root, 'taquito-utils', 'dist');
    mkdirSync(utilsDist, { recursive: true });
    writeFileSync(
      join(utilsDist, 'taquito-utils.es6.js'),
      [
        'function Buffer(arg, encodingOrOffset, length) {}',
        "export const toHex = (s) => Buffer.from(s, 'utf8').toString('hex');",
      ].join('\n') + '\n'
    );

    const tzip16Dist = join(root, 'taquito-tzip16', 'dist');
    mkdirSync(tzip16Dist, { recursive: true });
    writeFileSync(
      join(tzip16Dist, 'taquito-tzip16.es6.js'),
      [
        'const len = globalThis.Buffer ? globalThis.Buffer.byteLength(v) : 0;',
        "const safe = typeof Buffer !== 'undefined' ? Buffer.from(v) : v;",
        'export function withParam(Buffer, x) { return Buffer.from(x); }',
      ].join('\n') + '\n'
    );

    const findings = checkBuiltEsmImports(root);

    assert.equal(findings.length, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
