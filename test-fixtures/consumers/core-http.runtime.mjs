import { createServer } from 'node:http';
import { createRequire } from 'node:module';

// Enumerable CommonJS exports from the installed pre-pilot packages.
const baselineNames = {
  '@taquito/core': [
    'DeprecationError',
    'InvalidAddressError',
    'InvalidAmountError',
    'InvalidBigMapParameterError',
    'InvalidBlockHashError',
    'InvalidChainIdError',
    'InvalidContractAddressError',
    'InvalidDerivationPathError',
    'InvalidFinalizeUnstakeAmountError',
    'InvalidHexStringError',
    'InvalidKeyError',
    'InvalidKeyHashError',
    'InvalidMessageError',
    'InvalidOperationHashError',
    'InvalidOperationKindError',
    'InvalidProofError',
    'InvalidPublicKeyError',
    'InvalidSignatureError',
    'InvalidStakingAddressError',
    'InvalidViewParameterError',
    'NetworkError',
    'ParameterValidationError',
    'PermissionDeniedError',
    'ProhibitedActionError',
    'PublicKeyNotFoundError',
    'RpcError',
    'TaquitoError',
    'TezosToolkitConfigError',
    'UnsupportedActionError',
    'VERSION',
    'ValidationResult',
  ],
  '@taquito/http-utils': [
    'HttpBackend',
    'HttpRequestFailed',
    'HttpResponseError',
    'HttpTimeoutError',
    'STATUS_CODE',
    'VERSION',
    'classifyTransportError',
  ],
};

export default async function ({ assert, load, mode }) {
  const core = await load('@taquito/core');
  const http = await load('@taquito/http-utils');
  const require = createRequire(import.meta.url);
  const commonCore = require('@taquito/core');
  const commonHttp = require('@taquito/http-utils');
  for (const [name, loaded, commonjs, entry] of [
    ['@taquito/core', core, commonCore, 'taquito-core'],
    ['@taquito/http-utils', http, commonHttp, 'taquito-http-utils'],
  ]) {
    const manifest = require(`${name}/package.json`);
    assert.equal(manifest.name, name);
    assert.equal(manifest.exports['.'].module, `./dist/${entry}.bundler.mjs`);
    assert.ok(require.resolve(`${name}/dist/${entry}.bundler.mjs`).endsWith('.bundler.mjs'));
    assert.ok(require.resolve(`${name}/README.md`).endsWith('README.md'));
    const deep = await load(`${name}/dist/lib/${entry}.js`);
    const commonDeep = require(`${name}/dist/lib/${entry}`);
    assert.equal(mode === 'import' ? deep.default : deep, commonDeep);
    assert.equal(require(`${name}/dist/lib/errors`), require(`${name}/dist/lib/errors.js`));
    assert.equal(
      require.resolve(`${name}/dist/${entry}.es6`),
      require.resolve(`${name}/dist/${entry}.es6.js`)
    );
    assert.equal(
      require.resolve(`${name}/dist/${entry}.es6.js.map`),
      require.resolve(`${name}/dist/${entry}.es6.js`) + '.map'
    );
    for (const exported of baselineNames[name]) {
      assert.ok(Object.hasOwn(commonjs, exported), `${name} lost the ${exported} export`);
    }
    if (mode === 'import') {
      for (const exported of Object.keys(commonjs)) {
        assert.equal(
          loaded[exported],
          commonjs[exported],
          `${name} changed the ${exported} export`
        );
      }
    }
  }
  if (mode === 'import') {
    // Native ESM shares the CommonJS namespace and constructor instances.
    assert.equal(core.default, commonCore);
    assert.equal(http.default, commonHttp);
    assert.equal(core['module.exports'], commonCore);
    assert.equal(http['module.exports'], commonHttp);
  }
  const requireHttp = createRequire(require.resolve('@taquito/http-utils'));
  assert.equal(requireHttp.resolve('@taquito/core'), require.resolve('@taquito/core'));
  assert.equal(core.ValidationResult.INVALID_CHECKSUM, 1);
  const invalid = new core.InvalidAddressError('invalid');
  assert.equal(invalid.message, 'Invalid address "invalid"');
  assert.ok(invalid instanceof core.ParameterValidationError);
  const server = createServer((_request, response) => {
    response.writeHead(404, { 'content-type': 'application/json' });
    response.end('{"error":"missing"}');
  });
  try {
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const url = `http://127.0.0.1:${server.address().port}/missing`;
    await assert.rejects(new http.HttpBackend(2000).createRequest({ url }), (error) => {
      assert.ok(error instanceof http.HttpResponseError);
      assert.ok(error instanceof core.NetworkError);
      assert.equal(error.status, 404);
      assert.equal(error.body, '{"error":"missing"}');
      assert.equal(error.url, url);
      return true;
    });
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}
