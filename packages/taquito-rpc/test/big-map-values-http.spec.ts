import { createServer } from 'node:http';
import { once } from 'node:events';
import { it, expect } from 'vitest';
import { RpcClient } from '../src/taquito-rpc';
it('serializes real GET pagination and leaves HTTP 404 visible', async () => {
  const urls: Array<string | undefined> = [];
  const server = createServer((req, res) => {
    urls.push(req.url);
    res.setHeader('Content-Type', 'application/json');
    if (urls.length === 1) res.end('[{"int":"42"}]');
    else {
      res.statusCode = 404;
      res.end('missing map');
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('No TCP address');
    const rpc = new RpcClient('http://127.0.0.1:' + address.port, 'other');
    expect(await rpc.getBigMapValues('123', { offset: 2, length: 1 }, { block: '42' })).toEqual([
      { int: '42' },
    ]);
    await expect(rpc.getBigMapValues('999', { length: 1 })).rejects.toMatchObject({
      status: 404,
      body: 'missing map',
    });
    expect(urls).toEqual([
      '/chains/other/blocks/42/context/big_maps/123?offset=2&length=1',
      '/chains/other/blocks/head/context/big_maps/999?offset=0&length=1',
    ]);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});
