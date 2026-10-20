import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RpcClient, RpcClientCache } from '../src/taquito-rpc';

describe('RpcClientCache timer lifecycle', () => {
  let cache: RpcClientCache;
  let client: RpcClient;

  beforeEach(() => {
    vi.useFakeTimers();
    client = new RpcClient('https://example.test');
    cache = new RpcClientCache(client, 1000);
  });

  afterEach(() => {
    cache.deleteAllCachedData();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('keeps a replacement entry until its own expiry after clearing the cache', async () => {
    const getBlockHash = vi
      .spyOn(client, 'getBlockHash')
      .mockResolvedValueOnce('first')
      .mockResolvedValueOnce('second')
      .mockResolvedValueOnce('third');

    expect(await cache.getBlockHash()).toBe('first');
    vi.advanceTimersByTime(400);
    cache.deleteAllCachedData();
    expect(await cache.getBlockHash()).toBe('second');

    vi.advanceTimersByTime(600);
    expect(await cache.getBlockHash()).toBe('second');
    expect(getBlockHash).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(399);
    expect(await cache.getBlockHash()).toBe('second');
    vi.advanceTimersByTime(1);
    expect(await cache.getBlockHash()).toBe('third');
    expect(getBlockHash).toHaveBeenCalledTimes(3);
  });

  it('cancels all entry timers when clearing multiple keys repeatedly', async () => {
    const getBlockHash = vi.spyOn(client, 'getBlockHash').mockResolvedValue('block');
    await cache.getBlockHash({ block: 'head' });
    await cache.getBlockHash({ block: 'head~1' });
    expect(vi.getTimerCount()).toBe(2);

    cache.deleteAllCachedData();
    expect(vi.getTimerCount()).toBe(0);
    cache.deleteAllCachedData();
    expect(vi.getTimerCount()).toBe(0);

    await cache.getBlockHash({ block: 'head' });
    await cache.getBlockHash({ block: 'head~1' });
    expect(getBlockHash).toHaveBeenCalledTimes(4);
    cache.deleteAllCachedData();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('keeps pending callers intact without restoring a cleared response', async () => {
    let resolveFirst!: (hash: string) => void;
    const firstResponse = new Promise<string>((resolve) => {
      resolveFirst = resolve;
    });
    const getBlockHash = vi
      .spyOn(client, 'getBlockHash')
      .mockReturnValueOnce(firstResponse)
      .mockResolvedValueOnce('second')
      .mockResolvedValueOnce('third');

    const firstCaller = cache.getBlockHash();
    const concurrentCaller = cache.getBlockHash();
    expect(getBlockHash).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(400);
    cache.deleteAllCachedData();
    expect(await cache.getBlockHash()).toBe('second');

    resolveFirst('first');
    expect(await firstCaller).toBe('first');
    expect(await concurrentCaller).toBe('first');
    expect(await cache.getBlockHash()).toBe('second');
    vi.advanceTimersByTime(600);
    expect(await cache.getBlockHash()).toBe('second');
    expect(getBlockHash).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(400);
    expect(await cache.getBlockHash()).toBe('third');
    expect(getBlockHash).toHaveBeenCalledTimes(3);
  });

  it('cancels the previous timer when put overwrites an existing key', async () => {
    const getBlockHash = vi
      .spyOn(client, 'getBlockHash')
      .mockResolvedValueOnce('first')
      .mockResolvedValueOnce('third');

    expect(await cache.getBlockHash()).toBe('first');
    expect(vi.getTimerCount()).toBe(1);

    const [key] = Object.keys(cache.getAllCachedData());
    vi.advanceTimersByTime(400);
    Reflect.apply(Reflect.get(cache, 'put'), cache, [key, Promise.resolve('second')]);
    expect(vi.getTimerCount()).toBe(1);

    vi.advanceTimersByTime(600);
    expect(await cache.getBlockHash()).toBe('second');
    expect(getBlockHash).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(400);
    expect(await cache.getBlockHash()).toBe('third');
    expect(getBlockHash).toHaveBeenCalledTimes(2);
  });

  it('evicts a rejected promise immediately so retries within the TTL hit the RPC client', async () => {
    const rpcError = new Error('temporary 503');
    const getBlockHash = vi
      .spyOn(client, 'getBlockHash')
      .mockRejectedValueOnce(rpcError)
      .mockResolvedValueOnce('recovered-hash');

    await expect(cache.getBlockHash()).rejects.toBe(rpcError);
    expect(getBlockHash).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);

    // Retry well within the 1000ms TTL window
    vi.advanceTimersByTime(50);
    expect(await cache.getBlockHash()).toBe('recovered-hash');
    expect(getBlockHash).toHaveBeenCalledTimes(2);
  });

  it('does not evict a newer replacement entry when an older pending promise rejects after clear', async () => {
    let rejectFirst!: (err: Error) => void;
    const firstResponse = new Promise<string>((_resolve, reject) => {
      rejectFirst = reject;
    });
    const getBlockHash = vi
      .spyOn(client, 'getBlockHash')
      .mockReturnValueOnce(firstResponse)
      .mockResolvedValueOnce('replacement-hash')
      .mockResolvedValueOnce('third-hash');

    const firstCaller = cache.getBlockHash();
    cache.deleteAllCachedData();
    expect(await cache.getBlockHash()).toBe('replacement-hash');
    expect(vi.getTimerCount()).toBe(1);

    const staleError = new Error('stale request failed');
    rejectFirst(staleError);
    await expect(firstCaller).rejects.toBe(staleError);

    // Replacement entry should still be cached and its timer intact
    expect(vi.getTimerCount()).toBe(1);
    expect(await cache.getBlockHash()).toBe('replacement-hash');
    expect(getBlockHash).toHaveBeenCalledTimes(2);
  });
});
