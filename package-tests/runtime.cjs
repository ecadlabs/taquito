/* eslint-disable @typescript-eslint/no-var-requires -- These consumers verify CommonJS require. */
const assert = require('node:assert/strict');
const { createServer } = require('node:http');

module.exports = async function checkConsumer(core, http) {
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
};
