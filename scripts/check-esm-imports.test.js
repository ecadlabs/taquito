const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('node:fs');
const { join } = require('node:path');

const { checkBuiltEsmImports, findForbiddenImports } = require('./check-esm-imports.js');

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
    const allowedCases = [
      'const len = globalThis.Buffer ? globalThis.Buffer.byteLength(v) : 0;',
      "const safe = typeof Buffer !== 'undefined' ? Buffer.from(v) : v;",
      "const safeReversed = 'undefined' !== typeof Buffer ? Buffer.from(v) : v;",
      "const safeFunc = typeof Buffer === 'function' ? Buffer.from(v) : v;",
      "const safeInverted = typeof Buffer === 'undefined' ? v : Buffer.from(v);",
      "const safeOr = typeof Buffer === 'undefined' || Buffer.isBuffer(v);",
      "if (typeof Buffer === 'undefined') { fallback(v); } else { Buffer.from(v); }",
      'if (globalThis.Buffer == null) { fallback(v); } else { globalThis.Buffer.byteLength(v); }',
      'if (globalThis.Buffer !== void 0) { globalThis.Buffer.byteLength(v); }',
      'if (!globalThis.Buffer) { fallback(v); } else { globalThis.Buffer.byteLength(v); }',
      'if (Boolean(globalThis.Buffer)) { globalThis.Buffer.byteLength(v); }',
      "const missingBuffer = typeof Buffer === 'undefined'; if (missingBuffer) { fallback(v); } else { Buffer.from(v); }",
      "const missingBuffer = typeof Buffer === 'undefined'; if (!missingBuffer) { Buffer.from(v); }",
      "const ok = typeof Buffer !== 'undefined'; if (ok) { const ok = true; Buffer.from(v); }",
      "function useBuffer() { if (hasBuffer) return Buffer.from(v); } const hasBuffer = typeof Buffer !== 'undefined';",
      "const g = typeof Buffer === 'undefined' || isBrowser; if (typeof Buffer !== 'undefined') { if (g) { Buffer.from(v); } }",
      "if (typeof Buffer === 'function' && typeof Buffer !== 'object') { Buffer.from(v); }",
      "if (typeof Buffer !== 'undefined') { if (globalThis.Buffer && flag) { noop(); } else { Buffer.from(v); } }",
      "function earlyReturn(x) { if (typeof Buffer === 'undefined') return x; return Buffer.from(x); }",
      "while (typeof Buffer !== 'undefined') { Buffer.from(v); break; }",
      'const optional = globalThis.Buffer?.from(v);',
      'switch (x) { case 0: const Buffer = impl; Buffer.from(v); break; }',
      'const { Buffer: BrowserBuffer } = source; BrowserBuffer.from(v);',
      'function withLocalGlobal(globalThis) { return globalThis.Buffer.from(v); }',
      'export function withParam(Buffer, x) { return Buffer.from(x); }',
    ];

    for (const snippet of allowedCases) {
      const snippetFindings = findForbiddenImports('test.es6.js', snippet);
      assert.equal(
        snippetFindings.length,
        0,
        `Expected 0 findings for allowed snippet:\n  ${snippet}\nGot: ${JSON.stringify(snippetFindings)}`
      );
    }

    writeFileSync(join(tzip16Dist, 'taquito-tzip16.es6.js'), allowedCases.join('\n') + '\n');

    const findings = checkBuiltEsmImports(root);

    assert.equal(findings.length, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('checkBuiltEsmImports flags Buffer usage inside inverted or non-narrowing guards', () => {
  const rejectedCases = [
    {
      snippet: "if (typeof Buffer === 'undefined') { Buffer.from(bytes); }",
      expectedCount: 1,
    },
    {
      snippet: "if (typeof Buffer !== 'undefined') { fallback(bytes); } else { Buffer.from(bytes); }",
      expectedCount: 1,
    },
    {
      snippet: "const badTernary = typeof Buffer === 'undefined' ? Buffer.from(bytes) : bytes;",
      expectedCount: 1,
    },
    {
      snippet: "const badElseTernary = typeof Buffer !== 'undefined' ? bytes : Buffer.from(bytes);",
      expectedCount: 1,
    },
    {
      snippet: "const badAnd = typeof Buffer === 'undefined' && Buffer.from(bytes);",
      expectedCount: 1,
    },
    {
      snippet: "const badOr = typeof Buffer !== 'undefined' || Buffer.from(bytes);",
      expectedCount: 1,
    },
    {
      snippet: "(typeof Buffer !== 'undefined' || a) && Buffer.from(bytes);",
      expectedCount: 1,
    },
    {
      snippet: "(typeof Buffer === 'undefined' && a) || Buffer.from(bytes);",
      expectedCount: 1,
    },
    {
      snippet: 'if (globalThis.Buffer == null) { globalThis.Buffer.from(bytes); }',
      expectedCount: 1,
    },
    {
      snippet: 'if (!globalThis.Buffer) { globalThis.Buffer.from(bytes); }',
      expectedCount: 1,
    },
    {
      snippet: 'if (globalThis.Buffer !== null) { globalThis.Buffer.from(bytes); }',
      expectedCount: 1,
    },
    {
      snippet: "if (typeof Buffer === 'object') { Buffer.from(bytes); }",
      expectedCount: 1,
    },
    {
      snippet: "const missing = typeof Buffer === 'undefined'; if (missing) { Buffer.from(bytes); }",
      expectedCount: 1,
    },
    {
      snippet: "let mutableGuard = typeof Buffer !== 'undefined'; if (mutableGuard) { Buffer.from(bytes); }",
      expectedCount: 1,
    },
    {
      snippet:
        "const hasBuffer = typeof Buffer !== 'undefined'; function shadowed(hasBuffer) { if (hasBuffer) { return Buffer.from(bytes); } }",
      expectedCount: 1,
    },
    {
      snippet: "const ok = true; if (ok) { const ok = typeof Buffer !== 'undefined'; Buffer.from(bytes); }",
      expectedCount: 1,
    },
    {
      snippet:
        "const ok = typeof Buffer !== 'undefined'; switch (0) { case 0: const ok = true; if (ok) Buffer.from(bytes); }",
      expectedCount: 1,
    },
    {
      snippet:
        "switch (x) { case 1: const hasBuffer = typeof Buffer !== 'undefined'; break; } const hasBuffer = true; if (hasBuffer) Buffer.from(bytes);",
      expectedCount: 1,
    },
    {
      snippet: 'function unrelated() { var Buffer; } Buffer.from(bytes);',
      expectedCount: 1,
    },
    {
      snippet: 'class C { static { var Buffer = 1; } } Buffer.from(bytes);',
      expectedCount: 1,
    },
    {
      snippet: 'const obj = { Buffer() { return Buffer.from(bytes); } };',
      expectedCount: 1,
    },
    {
      snippet: 'function f(x = Buffer.from(bytes)) { var Buffer; }',
      expectedCount: 1,
    },
    {
      snippet: "function Boolean() { return true; } if (Boolean(typeof Buffer !== 'undefined')) { Buffer.from(bytes); }",
      expectedCount: 1,
    },
    {
      snippet: 'function f(undefined) { if (globalThis.Buffer !== undefined) globalThis.Buffer.from(bytes); }',
      expectedCount: 1,
    },
    {
      snippet: "function f(Buffer) { if (typeof Buffer !== 'undefined') globalThis.Buffer.from(bytes); }",
      expectedCount: 1,
    },
    {
      snippet: 'function f(window) { if (window.Buffer) Buffer.from(bytes); }',
      expectedCount: 1,
    },
    {
      snippet: 'const shorthand = { Buffer };',
      expectedCount: 1,
    },
    {
      snippet: '(globalThis.Buffer).from(bytes);',
      expectedCount: 1,
    },
    {
      snippet: '(0, globalThis.Buffer).from(bytes);',
      expectedCount: 1,
    },
    {
      snippet: 'globalThis["Buffer"].from(bytes);',
      expectedCount: 1,
    },
    {
      snippet: 'const { from } = globalThis.Buffer;',
      expectedCount: 1,
    },
    {
      snippet: 'const B = globalThis.Buffer; B.from(bytes);',
      expectedCount: 1,
    },
    {
      snippet: 'const { Buffer } = globalThis; Buffer.from(bytes);',
      expectedCount: 1,
    },
    {
      snippet: "if (typeof Buffer.from === 'function') { Buffer.from(bytes); }",
      expectedCount: 2,
    },
  ];

  for (const { snippet, expectedCount } of rejectedCases) {
    const findings = findForbiddenImports('test.es6.js', snippet);
    assert.equal(
      findings.length,
      expectedCount,
      `Expected ${expectedCount} finding(s) for snippet:\n  ${snippet}\nGot: ${JSON.stringify(findings)}`
    );
    assert.ok(findings.every((f) => f.packageName === 'Buffer'));
  }
});
