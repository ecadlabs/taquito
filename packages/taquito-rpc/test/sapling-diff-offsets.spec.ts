import { createServer } from 'node:http';
import { once } from 'node:events';
import { it, expect, vi, afterEach, describe } from 'vitest';
import { HttpBackend } from '@taquito/http-utils';
import { ParameterValidationError } from '@taquito/core';
import { RpcClient, RpcClientCache, SaplingDiffResponse } from '../src/taquito-rpc';

afterEach(() => vi.restoreAllMocks());

const POOL = 'KT1GFkBEDZtngCS737gNgtt6LemG2a8kaifC';
const caughtUp: SaplingDiffResponse = {
  root: '0af0c796c808d89d09e4b8dfff5909f96dbefab60f46c3b33ea97f886a97321c',
  commitments_and_ciphertexts: [],
  nullifiers: [],
};

const byContract = {
  call: (rpc: RpcClient, offsets?: Parameters<RpcClient['getSaplingDiffByContract']>[2]) =>
    rpc.getSaplingDiffByContract(POOL, { block: 'head' }, offsets),
  url: `https://rpc.invalid/chains/main/blocks/head/context/contracts/${POOL}/single_sapling_get_diff`,
};
const byId = {
  call: (rpc: RpcClient, offsets?: Parameters<RpcClient['getSaplingDiffById']>[2]) =>
    rpc.getSaplingDiffById('5', { block: 'head' }, offsets),
  url: 'https://rpc.invalid/chains/main/blocks/head/context/sapling/5/get_diff',
};

describe.each([
  ['getSaplingDiffByContract', byContract],
  ['getSaplingDiffById', byId],
])('%s', (_name, target) => {
  it('sends both offsets as the node query parameters', async () => {
    const backend = new HttpBackend();
    const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(caughtUp);
    const rpc = new RpcClient('https://rpc.invalid', 'main', backend);

    expect(await target.call(rpc, { offsetCommitment: 24, offsetNullifier: 11 })).toBe(caughtUp);
    expect(request).toHaveBeenCalledExactlyOnceWith({
      url: target.url,
      method: 'GET',
      query: { offset_commitment: 24, offset_nullifier: 11 },
    });
  });

  it('sends only the offset that is set', async () => {
    const backend = new HttpBackend();
    const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(caughtUp);
    await target.call(new RpcClient('https://rpc.invalid', 'main', backend), {
      offsetNullifier: 3,
    });
    expect(request.mock.calls[0]?.[0]).toMatchObject({ query: { offset_nullifier: 3 } });
    expect(request.mock.calls[0]?.[0]).not.toHaveProperty('query.offset_commitment', 0);
  });

  it('sends no query when no offset is given, as before', async () => {
    const backend = new HttpBackend();
    const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(caughtUp);
    const rpc = new RpcClient('https://rpc.invalid', 'main', backend);
    await target.call(rpc);
    await target.call(rpc, {});
    for (const [options] of request.mock.calls) {
      expect(options).toEqual({ url: target.url, method: 'GET', query: undefined });
    }
  });

  it('sends the largest offset the protocol accepts', async () => {
    const backend = new HttpBackend();
    const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(caughtUp);
    const rpc = new RpcClient('https://rpc.invalid', 'main', backend);
    await target.call(rpc, { offsetCommitment: 4294967295, offsetNullifier: 4294967295 });
    expect(request.mock.calls[0]?.[0]).toMatchObject({
      query: { offset_commitment: 4294967295, offset_nullifier: 4294967295 },
    });
  });

  // 4294967296 is the first value the Shadownet node answered with a 500 (protocol PsUshuai).
  it.each([-1, 1.5, Number.NaN, 4294967296, Number.MAX_SAFE_INTEGER + 1])(
    'rejects %s before sending a request',
    async (bad) => {
      const backend = new HttpBackend();
      const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(caughtUp);
      const rpc = new RpcClient('https://rpc.invalid', 'main', backend);
      await expect(target.call(rpc, { offsetCommitment: bad })).rejects.toBeInstanceOf(
        ParameterValidationError
      );
      await expect(target.call(rpc, { offsetNullifier: bad })).rejects.toThrow(
        /offsetNullifier must be an integer from 0 to 4294967295/
      );
      expect(request).not.toHaveBeenCalled();
    }
  );
});

it('puts the offsets in the URL through the real HTTP backend', async () => {
  const urls: Array<string | undefined> = [];
  const server = createServer((req, res) => {
    urls.push(req.url);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(caughtUp));
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const address = server.address();
    if (address === null || typeof address === 'string') throw new Error('No TCP address');
    const rpc = new RpcClient('http://127.0.0.1:' + address.port);

    expect(
      await rpc.getSaplingDiffByContract(POOL, undefined, {
        offsetCommitment: 24,
        offsetNullifier: 11,
      })
    ).toEqual(caughtUp);
    await rpc.getSaplingDiffByContract(POOL);

    expect(urls).toEqual([
      `/chains/main/blocks/head/context/contracts/${POOL}/single_sapling_get_diff?offset_commitment=24&offset_nullifier=11`,
      `/chains/main/blocks/head/context/contracts/${POOL}/single_sapling_get_diff`,
    ]);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});

describe('RpcClientCache', () => {
  it('caches each offset pair under its own key', async () => {
    const rpc = new RpcClient('https://rpc.invalid');
    const forwarded = vi.spyOn(rpc, 'getSaplingDiffByContract').mockResolvedValue(caughtUp);
    const cache = new RpcClientCache(rpc);

    await cache.getSaplingDiffByContract(POOL);
    await cache.getSaplingDiffByContract(POOL, { block: 'head' }, { offsetCommitment: 24 });
    await cache.getSaplingDiffByContract(POOL, { block: 'head' }, { offsetCommitment: 26 });
    await cache.getSaplingDiffByContract(POOL, { block: 'head' }, { offsetCommitment: 26 });
    await cache.getSaplingDiffByContract(POOL);

    expect(forwarded.mock.calls).toEqual([
      [POOL, { block: 'head' }],
      [POOL, { block: 'head' }, { offsetCommitment: 24 }],
      [POOL, { block: 'head' }, { offsetCommitment: 26 }],
    ]);
  });

  it('keeps the old two-argument call for custom clients when no offset is set', async () => {
    const rpc = new RpcClient('https://rpc.invalid');
    const forwarded = vi.spyOn(rpc, 'getSaplingDiffById').mockResolvedValue(caughtUp);
    await new RpcClientCache(rpc).getSaplingDiffById('5', { block: 'head' }, {});
    expect(forwarded).toHaveBeenCalledExactlyOnceWith('5', { block: 'head' });
  });

  it('validates offsets before forwarding', async () => {
    const rpc = new RpcClient('https://rpc.invalid');
    const forwarded = vi.spyOn(rpc, 'getSaplingDiffById').mockResolvedValue(caughtUp);
    await expect(
      new RpcClientCache(rpc).getSaplingDiffById('5', undefined, { offsetNullifier: -1 })
    ).rejects.toBeInstanceOf(ParameterValidationError);
    expect(forwarded).not.toHaveBeenCalled();
  });
});
