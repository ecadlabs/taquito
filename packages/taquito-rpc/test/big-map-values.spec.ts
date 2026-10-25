import { UnsupportedActionError } from '@taquito/core';
import { it, expect, vi, afterEach } from 'vitest';
import { HttpBackend } from '@taquito/http-utils';
import { RpcClient, RpcClientCache } from '../src/taquito-rpc';
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});
it('requests a finite values page at the selected chain and block', async () => {
  const backend = new HttpBackend();
  const request = vi.spyOn(backend, 'createRequest').mockResolvedValue([{ int: '42' }]);
  const rpc = new RpcClient('https://rpc.invalid', 'other', backend);
  expect(await rpc.getBigMapValues('123', { offset: 2, length: 1 }, { block: '42' })).toEqual([
    { int: '42' },
  ]);
  expect(request).toHaveBeenCalledExactlyOnceWith({
    url: 'https://rpc.invalid/chains/other/blocks/42/context/big_maps/123',
    method: 'GET',
    query: { offset: 2, length: 1 },
  });
});

it('uses finite defaults and preserves an explicit zero-length low-level request', async () => {
  const backend = new HttpBackend();
  const request = vi.spyOn(backend, 'createRequest').mockResolvedValue([]);
  const rpc = new RpcClient('https://rpc.invalid', 'main', backend);
  expect(await rpc.getBigMapValues('123')).toEqual([]);
  expect(request.mock.calls[0]?.[0].query).toEqual({ offset: 0, length: 100 });
  expect(await rpc.getBigMapValues('123', { offset: 0, length: 0 })).toEqual([]);
  expect(request.mock.calls[1]?.[0].query).toEqual({ offset: 0, length: 0 });
});
it.each([
  { offset: -1 },
  { offset: 1.5 },
  { offset: Infinity },
  { offset: Number.MAX_SAFE_INTEGER + 1 },
  { length: -1 },
  { length: 1.5 },
  { length: NaN },
])('rejects invalid RPC pagination %#', async (page) => {
  const backend = new HttpBackend();
  const request = vi.spyOn(backend, 'createRequest');
  await expect(
    new RpcClient('https://rpc.invalid', 'main', backend).getBigMapValues('123', page)
  ).rejects.toBeInstanceOf(RangeError);
  expect(request).not.toHaveBeenCalled();
});
it.each([{ value: {} }, { value: [{ int: '1' }, { int: '2' }] }])(
  'rejects malformed or overlength responses %#',
  async ({ value }) => {
    const backend = new HttpBackend();
    vi.spyOn(backend, 'createRequest').mockResolvedValue(value);
    await expect(
      new RpcClient('https://rpc.invalid', 'main', backend).getBigMapValues('123', { length: 1 })
    ).rejects.toBeInstanceOf(TypeError);
  }
);
it('preserves the original backend failure', async () => {
  const backend = new HttpBackend();
  const error = new Error('Controlled RPC failure');
  vi.spyOn(backend, 'createRequest').mockRejectedValue(error);
  await expect(
    new RpcClient('https://rpc.invalid', 'main', backend).getBigMapValues('123')
  ).rejects.toBe(error);
});
it('separates cache pages by map, block, offset and length and normalizes defaults', async () => {
  vi.useFakeTimers();
  const rpc = new RpcClient('https://rpc.invalid');
  const request = vi.spyOn(rpc, 'getBigMapValues').mockResolvedValue([]);
  const cache = new RpcClientCache(rpc);
  try {
    await cache.getBigMapValues('123');
    await cache.getBigMapValues('123', { offset: 0, length: 100 });
    expect(request).toHaveBeenCalledTimes(1);
    await cache.getBigMapValues('123', { offset: 1, length: 100 });
    await cache.getBigMapValues('123', { offset: 0, length: 1 });
    await cache.getBigMapValues('123', { offset: 0, length: 0 });
    await cache.getBigMapValues('124');
    await cache.getBigMapValues('123', {}, { block: '42' });
    expect(request).toHaveBeenCalledTimes(6);
  } finally {
    cache.deleteAllCachedData();
  }
});

it('reports an unsupported custom RPC capability through the cache', async () => {
  const rpc = new RpcClient('https://rpc.invalid');
  Object.defineProperty(rpc, 'getBigMapValues', { value: undefined });
  await expect(new RpcClientCache(rpc).getBigMapValues('123')).rejects.toBeInstanceOf(
    UnsupportedActionError
  );
});

it('rejects invalid map IDs before transport', async () => {
  const backend = new HttpBackend();
  const request = vi.spyOn(backend, 'createRequest');
  const rpc = new RpcClient('https://rpc.invalid', 'main', backend);
  for (const id of ['', '-1', '1/2', '1.5']) {
    await expect(rpc.getBigMapValues(id)).rejects.toBeInstanceOf(RangeError);
  }
  expect(request).not.toHaveBeenCalled();
});
