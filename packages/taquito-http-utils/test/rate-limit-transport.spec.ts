import { createServer } from 'node:http';
import { once } from 'node:events';
import { it, expect, vi } from 'vitest';
it('recovers an actual RPC GET through the real HTTP backend', async () => {
  vi.resetModules();
  vi.stubEnv('TAQUITO_HTTP_RETRY_BASE_MS', '0');
  const requests: Array<{ url: string | undefined; method: string | undefined }> = [];
  const server = createServer((req, res) => {
    requests.push({ url: req.url, method: req.method });
    res.setHeader('Content-Type', 'application/json');
    if (requests.length === 1) {
      res.statusCode = 429;
      res.setHeader('Retry-After', '0');
      res.end('busy');
    } else res.end(JSON.stringify('BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX'));
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const address = server.address();
    if (address === null || typeof address === 'string') throw new Error('No TCP address');
    const { RpcClient } = await import('@taquito/rpc');
    expect(await new RpcClient(`http://127.0.0.1:${address.port}`).getBlockHash()).toBe(
      'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX'
    );
    expect(requests).toEqual([
      { url: '/chains/main/blocks/head/hash', method: 'GET' },
      { url: '/chains/main/blocks/head/hash', method: 'GET' },
    ]);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
    vi.unstubAllEnvs();
  }
});
