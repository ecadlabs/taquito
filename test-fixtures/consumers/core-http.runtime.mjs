import { createServer } from 'node:http';
import { createRequire } from 'node:module';

export default async function ({ assert, load, mode }) {
  const core = await load('@taquito/core');
  const http = await load('@taquito/http-utils');
  const require = createRequire(import.meta.url);
  const commonCore = require('@taquito/core');
  const commonHttp = require('@taquito/http-utils');
  assert.equal(core.NetworkError, commonCore.NetworkError);
  assert.equal(http.HttpResponseError, commonHttp.HttpResponseError);
  if (mode === 'import') {
    // Record current CJS interop until the native ESM default-export policy is agreed.
    assert.equal(core.default, commonCore);
    assert.equal(http.default, commonHttp);
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
