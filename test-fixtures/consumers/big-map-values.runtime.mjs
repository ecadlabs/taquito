// Runs against the installed packages through require and import (see scripts/test-installed-consumers.mjs).
export default async function ({ assert, load }) {
  const [sdk, rpcPkg, core, http, encoder] = await Promise.all(
    [
      '@taquito/taquito',
      '@taquito/rpc',
      '@taquito/core',
      '@taquito/http-utils',
      '@taquito/michelson-encoder',
    ].map(load)
  );
  const backend = new http.HttpBackend();
  const calls = [];
  backend.createRequest = async (options) => {
    calls.push(options);
    return options.url.endsWith('/hash')
      ? 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX'
      : [{ int: '42' }];
  };
  const rpc = new rpcPkg.RpcClient('https://rpc.invalid', 'main', backend);
  const toolkit = new sdk.TezosToolkit(rpc);
  const schema = new encoder.Schema({
    prim: 'big_map',
    args: [{ prim: 'string' }, { prim: 'nat' }],
  });

  const page = await toolkit.contract.getBigMapValuesPageByID('123', schema, { length: 1 });
  assert.equal(page.values[0].toFixed(), '42');
  assert.equal(
    calls[1].url,
    'https://rpc.invalid/chains/main/blocks/' + page.blockHash + '/context/big_maps/123'
  );
  assert.deepEqual(calls[1].query, { offset: 0, length: 1 });

  calls.length = 0;
  const values = await toolkit.contract.listBigMapValuesByID('123', schema, { length: 1 });
  assert.equal(values[0].toFixed(), '42');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://rpc.invalid/chains/main/blocks/head/context/big_maps/123');

  for (const name of ['UnsupportedActionError', 'InvalidBigMapParameterError']) {
    assert.equal(sdk[name], core[name]);
    assert.equal(rpcPkg[name], core[name]);
  }
  Object.defineProperty(rpc, 'getBigMapValuesPage', { value: undefined });
  await assert.rejects(
    new rpcPkg.RpcClientCache(rpc).getBigMapValuesPage('123'),
    core.UnsupportedActionError
  );
}
