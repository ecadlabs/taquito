import { it, expect, vi, afterEach } from 'vitest';
import { HttpBackend } from '@taquito/http-utils';
import { UnsupportedActionError } from '@taquito/core';
import { RpcClient, RpcClientCache } from '../src/taquito-rpc';
import fixtures from '../../../test-fixtures/bls-aggregate-proofs.json';
afterEach(() => vi.restoreAllMocks());
it('posts the aggregate key and exact proof array at the root BLS endpoint', async () => {
  const backend = new HttpBackend();
  const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(fixtures.aggregateProof);
  const client = new RpcClient('https://rpc.invalid///', 'other-chain', backend);
  const body = {
    public_key: fixtures.aggregate.public_key,
    proofs: fixtures.members.map((m) => m.overrideProof),
  };
  expect(await client.aggregateProofs(body)).toBe(fixtures.aggregateProof);
  expect(request).toHaveBeenCalledExactlyOnceWith(
    { url: 'https://rpc.invalid/bls/aggregate_proofs', method: 'POST' },
    body
  );
});

it.each([{proofs: []}, {proofs: fixtures.members.map((m) => m.selfProof)}])(
  'preserves a null result without filtering the input %#',
  async ({proofs}) => {
    const backend = new HttpBackend();
    const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(null);
    const client = new RpcClient('https://rpc.invalid', undefined, backend);
    const body = { public_key: fixtures.aggregate.public_key, proofs };
    expect(await client.aggregateProofs(body)).toBeNull();
    expect(request.mock.calls[0]?.[1]).toBe(body);
  }
);
it('preserves backend error identity', async () => {
  const backend = new HttpBackend();
  const error = new Error('Controlled backend failure');
  vi.spyOn(backend, 'createRequest').mockRejectedValue(error);
  await expect(
    new RpcClient('https://rpc.invalid', undefined, backend).aggregateProofs({
      public_key: fixtures.aggregate.public_key,
      proofs: [],
    })
  ).rejects.toBe(error);
});
it('forwards each cache call with the original receiver and no result cache', async () => {
  const rpc = new RpcClient('https://rpc.invalid');
  const forwarded = vi.spyOn(rpc, 'aggregateProofs').mockImplementation(async function (
    this: RpcClient,
    params
  ) {
    expect(this.getRpcUrl()).toBe('https://rpc.invalid');
    expect(params.public_key).toBe(fixtures.aggregate.public_key);
    return fixtures.aggregateProof;
  });
  const cache = new RpcClientCache(rpc);
  const body = {
    public_key: fixtures.aggregate.public_key,
    proofs: fixtures.members.map((m) => m.overrideProof),
  };
  expect(await cache.aggregateProofs(body)).toBe(fixtures.aggregateProof);
  expect(await cache.aggregateProofs(body)).toBe(fixtures.aggregateProof);
  expect(forwarded).toHaveBeenCalledTimes(2);
});
it('reports a missing optional capability without bypassing a custom client', async () => {
  const rpc = new RpcClient('https://rpc.invalid');
  Object.defineProperty(rpc, 'aggregateProofs', { value: undefined });
  await expect(
    new RpcClientCache(rpc).aggregateProofs({
      public_key: fixtures.aggregate.public_key,
      proofs: [],
    })
  ).rejects.toBeInstanceOf(UnsupportedActionError);
});
