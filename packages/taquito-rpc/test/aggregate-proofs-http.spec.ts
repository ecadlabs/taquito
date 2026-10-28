import { createServer } from 'node:http';
import { once } from 'node:events';
import { it, expect } from 'vitest';
import { RpcClient } from '../src/taquito-rpc';
import fixtures from '../../../test-fixtures/bls-aggregate-proofs.json';
it('sends exact aggregate-proof JSON through the real HTTP backend and preserves HTTP errors', async () => {
  const requests: Array<{ url: string | undefined; method: string | undefined; body: unknown }> =
    [];
  const server = createServer(async (req, res) => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(Buffer.from(chunk));
    requests.push({
      url: req.url,
      method: req.method,
      body: JSON.parse(Buffer.concat(chunks).toString()),
    });
    res.setHeader('Content-Type', 'application/json');
    if (requests.length === 1) res.end(JSON.stringify(fixtures.aggregateProof));
    else {
      res.statusCode = 400;
      res.end('invalid proof encoding');
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const address = server.address();
    if (address === null || typeof address === 'string') throw new Error('No TCP address');
    const client = new RpcClient('http://127.0.0.1:' + address.port, 'custom');
    const body = {
      public_key: fixtures.aggregate.public_key,
      proofs: fixtures.members.map((m) => m.overrideProof),
    };
    expect(await client.aggregateProofs(body)).toBe(fixtures.aggregateProof);
    await expect(client.aggregateProofs(body)).rejects.toMatchObject({
      status: 400,
      body: 'invalid proof encoding',
    });
    expect(requests).toEqual([
      { url: '/bls/aggregate_proofs', method: 'POST', body },
      { url: '/bls/aggregate_proofs', method: 'POST', body },
    ]);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});
