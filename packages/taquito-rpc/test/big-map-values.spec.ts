import { InvalidBigMapParameterError, UnsupportedActionError } from '@taquito/core';
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
  expect(await rpc.getBigMapValuesPage('123', { offset: 2, length: 1 }, { block: '42' })).toEqual([
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
  expect(await rpc.getBigMapValuesPage('123')).toEqual([]);
  expect(request.mock.calls[0]?.[0].query).toEqual({ offset: 0, length: 100 });
  expect(await rpc.getBigMapValuesPage('123', { offset: 0, length: 0 })).toEqual([]);
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
    new RpcClient('https://rpc.invalid', 'main', backend).getBigMapValuesPage('123', page)
  ).rejects.toBeInstanceOf(InvalidBigMapParameterError);
  expect(request).not.toHaveBeenCalled();
});
it('preserves the original backend failure', async () => {
  const backend = new HttpBackend();
  const error = new Error('Controlled RPC failure');
  vi.spyOn(backend, 'createRequest').mockRejectedValue(error);
  await expect(
    new RpcClient('https://rpc.invalid', 'main', backend).getBigMapValuesPage('123')
  ).rejects.toBe(error);
});
it('separates cache pages by map, block, offset and length and normalizes defaults', async () => {
  vi.useFakeTimers();
  const rpc = new RpcClient('https://rpc.invalid');
  const request = vi.spyOn(rpc, 'getBigMapValuesPage').mockResolvedValue([]);
  const cache = new RpcClientCache(rpc);
  try {
    await cache.getBigMapValuesPage('123');
    expect(Object.keys(cache.getAllCachedData())).toEqual([
      'https://rpc.invalid/getBigMapValuesPage/head/123/0/100/',
    ]);
    await cache.getBigMapValuesPage('123', { offset: 0, length: 100 });
    expect(request).toHaveBeenCalledTimes(1);
    await cache.getBigMapValuesPage('123', { offset: 1, length: 100 });
    await cache.getBigMapValuesPage('123', { offset: 0, length: 1 });
    await cache.getBigMapValuesPage('123', { offset: 0, length: 0 });
    await cache.getBigMapValuesPage('124');
    await cache.getBigMapValuesPage('123', {}, { block: '42' });
    expect(request).toHaveBeenCalledTimes(6);
  } finally {
    cache.deleteAllCachedData();
  }
});

it('reports an unsupported custom RPC capability through the cache', async () => {
  const rpc = new RpcClient('https://rpc.invalid');
  Object.defineProperty(rpc, 'getBigMapValuesPage', { value: undefined });
  await expect(new RpcClientCache(rpc).getBigMapValuesPage('123')).rejects.toBeInstanceOf(
    UnsupportedActionError
  );
});

it('rejects invalid map IDs before transport', async () => {
  const backend = new HttpBackend();
  const request = vi.spyOn(backend, 'createRequest');
  const rpc = new RpcClient('https://rpc.invalid', 'main', backend);
  for (const id of ['', '-1', '1/2', '1.5']) {
    await expect(rpc.getBigMapValuesPage(id)).rejects.toBeInstanceOf(InvalidBigMapParameterError);
  }
  expect(request).not.toHaveBeenCalled();
});
