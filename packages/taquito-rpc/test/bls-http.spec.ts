import { createServer } from 'node:http';
import { AddressInfo } from 'node:net';
import { RpcClient, RpcClientCache } from '../src/taquito-rpc';
import { HttpResponseError } from '@taquito/http-utils';
import { blsFixture } from '../../../test-fixtures/bls-rpc';

it('sends the BLS wire payloads through the real HTTP backend', async () => {
  const received: Array<{ url: string | undefined; method: string | undefined; body: unknown }> =
    [];
  const responses: Record<string, unknown> = {
    '/bls/aggregate_public_keys': {
      public_key: blsFixture.public_key,
      public_key_hash: blsFixture.public_key_hash,
    },
    '/bls/check_proof': false,
    '/bls/aggregate_signatures': blsFixture.signature,
    '/bls/threshold_signatures': null,
  };
  const server = createServer(async (request, response) => {
    const chunks: Buffer[] = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    received.push({
      url: request.url,
      method: request.method,
      body: JSON.parse(Buffer.concat(chunks).toString()),
    });
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(responses[request.url ?? '']));
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const client = new RpcClientCache(
      new RpcClient(`http://127.0.0.1:${(server.address() as AddressInfo).port}/`, 'custom-chain')
    );
    const proof = { public_key: blsFixture.public_key, proof: blsFixture.proof };
    expect(await client.aggregatePublicKeys([proof])).toEqual(
      responses['/bls/aggregate_public_keys']
    );
    expect(await client.checkProof(proof)).toBe(false);
    expect(await client.aggregateSignatures(blsFixture.aggregate)).toBe(blsFixture.signature);
    expect(await client.thresholdSignatures(blsFixture.threshold)).toBeNull();
    expect(received).toEqual([
      { url: '/bls/aggregate_public_keys', method: 'POST', body: [proof] },
      { url: '/bls/check_proof', method: 'POST', body: proof },
      { url: '/bls/aggregate_signatures', method: 'POST', body: blsFixture.aggregate },
      { url: '/bls/threshold_signatures', method: 'POST', body: blsFixture.threshold },
    ]);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});

it('keeps an HTTP rejection distinct from a false proof response', async () => {
  const server = createServer((_request, response) => {
    response.writeHead(400, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'invalid public key' }));
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const client = new RpcClient(`http://127.0.0.1:${(server.address() as AddressInfo).port}`);
    await expect(
      client.checkProof({ public_key: 'invalid', proof: blsFixture.proof })
    ).rejects.toBeInstanceOf(HttpResponseError);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});
