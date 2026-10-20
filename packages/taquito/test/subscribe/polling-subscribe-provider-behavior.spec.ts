/**
 * Tests for PollingSubscribeProvider: switchMap → exhaustMap fix.
 *
 * exhaustMap prevents in-flight RPC requests from being cancelled when
 * new timer ticks arrive before the previous request completes.
 */

import { PollingSubscribeProvider } from '../../src/subscribe/polling-subcribe-provider';
import { BlockResponse } from '@taquito/rpc';

function deferred<T>(): {
  promise: Promise<T>;
  resolve: (v: T) => void;
  reject: (e: Error) => void;
} {
  let resolve!: (v: T) => void;
  let reject!: (e: Error) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function makeBlock(hash: string, level: number): BlockResponse {
  return {
    hash,
    protocol: 'proto1',
    chain_id: 'NetXdQprcVkpaWU',
    header: { level } as BlockResponse['header'],
    metadata: {} as BlockResponse['metadata'],
    operations: [[], [], [], []],
  } as BlockResponse;
}

describe('PollingSubscribeProvider: exhaustMap behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not cancel in-flight RPC requests when new timer ticks arrive', async () => {
    // We control when getBlock resolves so we can simulate a slow RPC
    const firstCall = deferred<BlockResponse>();
    const mockRpc = {
      getBlock: vi.fn().mockReturnValue(firstCall.promise),
    };

    const mockContext = {
      rpc: mockRpc,
      readProvider: {
        getProtocolConstants: vi.fn(),
      },
    } as any;

    const provider = new PollingSubscribeProvider(mockContext, {
      pollingIntervalMilliseconds: 100,
    });

    const dataSpy = vi.fn();
    const sub = provider.subscribeBlock('head');
    sub.on('data', dataSpy);

    // timer(0, 100) schedules an immediate emission, which calls getBlock
    await vi.advanceTimersByTimeAsync(1);
    expect(mockRpc.getBlock).toHaveBeenCalledTimes(1);

    // Advance past 3 more ticks (100, 200, 300ms) without resolving the promise.
    //
    // BUG (switchMap): each tick cancels the previous inner observable and calls
    //   getBlock again. getBlock ends up called 4 times total.
    //
    // EXPECTED (exhaustMap): subsequent ticks are ignored while the first call
    //   is in-flight. getBlock stays at 1 call.
    await vi.advanceTimersByTimeAsync(300);
    expect(mockRpc.getBlock).toHaveBeenCalledTimes(1);

    // Resolve the first (and only) RPC call
    firstCall.resolve(makeBlock('BLockHash1', 1));
    await vi.advanceTimersByTimeAsync(0); // flush microtasks

    expect(dataSpy).toHaveBeenCalledTimes(1);
    expect(dataSpy).toHaveBeenCalledWith(expect.objectContaining({ hash: 'BLockHash1' }));

    sub.close();
  });

  it('should resume polling after a slow RPC call completes', async () => {
    const block1 = makeBlock('BLockHash1', 1);
    const block2 = makeBlock('BLockHash2', 2);

    const firstCall = deferred<BlockResponse>();
    const secondCall = deferred<BlockResponse>();
    const mockRpc = {
      getBlock: vi
        .fn()
        .mockReturnValueOnce(firstCall.promise)
        .mockReturnValueOnce(secondCall.promise),
    };

    const mockContext = {
      rpc: mockRpc,
      readProvider: {
        getProtocolConstants: vi.fn(),
      },
    } as any;

    const provider = new PollingSubscribeProvider(mockContext, {
      pollingIntervalMilliseconds: 100,
    });

    const dataSpy = vi.fn();
    const sub = provider.subscribeBlock('head');
    sub.on('data', dataSpy);

    // First tick fires, getBlock called once
    await vi.advanceTimersByTimeAsync(1);
    expect(mockRpc.getBlock).toHaveBeenCalledTimes(1);

    // Simulate slow RPC: 250ms pass without resolution.
    // Timer ticks at 100ms and 200ms should be ignored by exhaustMap.
    await vi.advanceTimersByTimeAsync(250);

    // Now resolve the first call
    firstCall.resolve(block1);
    await vi.advanceTimersByTimeAsync(0); // flush microtasks

    // BUG (switchMap): switchMap cancelled the first call when the 100ms tick
    //   arrived, so the resolved value never reaches the subscriber. dataSpy = 0.
    //
    // EXPECTED (exhaustMap): the first call was never cancelled. dataSpy = 1.
    expect(dataSpy).toHaveBeenCalledTimes(1);

    // After the first call completes, exhaustMap is free again.
    // The next timer tick (at 300ms) should start a second call.
    // Current time is ~251ms, so advancing 100ms takes us past the 300ms tick.
    await vi.advanceTimersByTimeAsync(100);
    expect(mockRpc.getBlock).toHaveBeenCalledTimes(2);

    // Resolve the second call with a different block
    secondCall.resolve(block2);
    await vi.advanceTimersByTimeAsync(0);

    expect(dataSpy).toHaveBeenCalledTimes(2);
    expect(dataSpy).toHaveBeenLastCalledWith(expect.objectContaining({ hash: 'BLockHash2' }));

    sub.close();
  });

  it('should not emit duplicate blocks even with overlapping timer ticks', async () => {
    // Regression guard: distinctUntilKeyChanged('hash') already works.
    const block = makeBlock('BLockSame', 1);
    const mockRpc = {
      getBlock: vi.fn().mockResolvedValue(block),
    };

    const mockContext = {
      rpc: mockRpc,
      readProvider: {
        getProtocolConstants: vi.fn(),
      },
    } as any;

    const provider = new PollingSubscribeProvider(mockContext, {
      pollingIntervalMilliseconds: 50,
    });

    const dataSpy = vi.fn();
    const sub = provider.subscribeBlock('head');
    sub.on('data', dataSpy);

    // Advance through several ticks. The RPC returns the same block hash each time.
    await vi.advanceTimersByTimeAsync(1);
    await vi.advanceTimersByTimeAsync(50);
    await vi.advanceTimersByTimeAsync(50);

    // Should only have emitted once despite multiple successful polls
    expect(dataSpy).toHaveBeenCalledTimes(1);

    sub.close();
  });

  it('should recover on subsequent subscriptions after an RPC error instead of poisoning newBlock$', async () => {
    const rpcError = new Error('transient RPC failure');
    const block2 = makeBlock('BLockAfterError', 2);

    const mockRpc = {
      getBlock: vi
        .fn()
        .mockRejectedValueOnce(rpcError)
        .mockResolvedValueOnce(block2),
    };

    const mockContext = {
      rpc: mockRpc,
      readProvider: {
        getProtocolConstants: vi.fn(),
      },
    } as any;

    const provider = new PollingSubscribeProvider(mockContext, {
      pollingIntervalMilliseconds: 100,
    });

    const errSpy1 = vi.fn();
    const sub1 = provider.subscribeBlock('head');
    sub1.on('error', errSpy1);

    // First subscription triggers getBlock, which rejects
    await vi.advanceTimersByTimeAsync(1);
    expect(errSpy1).toHaveBeenCalledTimes(1);
    expect(errSpy1).toHaveBeenCalledWith(rpcError);
    sub1.close();

    // Second subscription should start a fresh poll and receive block2,
    // NOT replay the stale error from share({ resetOnError: false })
    const dataSpy2 = vi.fn();
    const errSpy2 = vi.fn();
    const sub2 = provider.subscribeBlock('head');
    sub2.on('data', dataSpy2);
    sub2.on('error', errSpy2);

    await vi.advanceTimersByTimeAsync(1);

    expect(errSpy2).not.toHaveBeenCalled();
    expect(mockRpc.getBlock).toHaveBeenCalledTimes(2);
    expect(dataSpy2).toHaveBeenCalledTimes(1);
    expect(dataSpy2).toHaveBeenCalledWith(expect.objectContaining({ hash: 'BLockAfterError' }));

    sub2.close();
  });

  it('should retry cleanly when shouldObservableSubscriptionRetry is true without stack overflow', async () => {
    const rpcError = new Error('transient network error');
    const block1 = makeBlock('BLockRecovered', 1);

    const mockRpc = {
      getBlock: vi
        .fn()
        .mockRejectedValueOnce(rpcError)
        .mockResolvedValue(block1),
    };

    const mockContext = {
      rpc: mockRpc,
      readProvider: {
        getProtocolConstants: vi.fn(),
      },
    } as any;

    const provider = new PollingSubscribeProvider(mockContext, {
      pollingIntervalMilliseconds: 100,
      shouldObservableSubscriptionRetry: true,
    });

    const dataSpy = vi.fn();
    const errSpy = vi.fn();
    const sub = provider.subscribeBlock('head');
    sub.on('data', dataSpy);
    sub.on('error', errSpy);

    // First timer tick rejects, retry() re-subscribes to newBlock$, which resets on error
    // and schedules the retry after pollingIntervalMilliseconds (100ms).
    await vi.advanceTimersByTimeAsync(110);

    expect(errSpy).toHaveBeenCalledTimes(1);
    expect(errSpy).toHaveBeenCalledWith(rpcError);
    expect(dataSpy).toHaveBeenCalledTimes(1);
    expect(dataSpy).toHaveBeenCalledWith(expect.objectContaining({ hash: 'BLockRecovered' }));

    sub.close();
  });

  it('should stop polling and retrying when close() is called inside an error callback', async () => {
    const rpcError = new Error('RPC failure');
    const block1 = makeBlock('BLockAfterClose', 1);

    const mockRpc = {
      getBlock: vi
        .fn()
        .mockRejectedValueOnce(rpcError)
        .mockResolvedValue(block1),
    };

    const mockContext = {
      rpc: mockRpc,
      readProvider: {
        getProtocolConstants: vi.fn(),
      },
    } as any;

    const provider = new PollingSubscribeProvider(mockContext, {
      pollingIntervalMilliseconds: 100,
      shouldObservableSubscriptionRetry: true,
    });

    const dataSpy = vi.fn();
    const errSpy = vi.fn();
    const sub = provider.subscribeBlock('head');
    sub.on('data', dataSpy);
    sub.on('error', (err) => {
      errSpy(err);
      sub.close();
    });

    await vi.advanceTimersByTimeAsync(500);

    expect(errSpy).toHaveBeenCalledTimes(1);
    expect(mockRpc.getBlock).toHaveBeenCalledTimes(1);
    expect(dataSpy).not.toHaveBeenCalled();
  });

  it('should wait pollingIntervalMilliseconds between retry attempts on persistent RPC failure', async () => {
    const rpcError = new Error('persistent RPC outage');

    const mockRpc = {
      getBlock: vi.fn().mockRejectedValue(rpcError),
    };

    const mockContext = {
      rpc: mockRpc,
      readProvider: {
        getProtocolConstants: vi.fn(),
      },
    } as any;

    const provider = new PollingSubscribeProvider(mockContext, {
      pollingIntervalMilliseconds: 100,
      shouldObservableSubscriptionRetry: true,
    });

    const errSpy = vi.fn();
    const sub = provider.subscribeBlock('head');
    sub.on('error', errSpy);

    // At t=1ms: only the initial poll should have executed (1 call), NOT a tight 0ms retry loop
    await vi.advanceTimersByTimeAsync(1);
    expect(mockRpc.getBlock).toHaveBeenCalledTimes(1);
    expect(errSpy).toHaveBeenCalledTimes(1);

    // At t=50ms: still waiting for the 100ms polling interval before retrying
    await vi.advanceTimersByTimeAsync(49);
    expect(mockRpc.getBlock).toHaveBeenCalledTimes(1);

    // At t=105ms: second attempt fires
    await vi.advanceTimersByTimeAsync(55);
    expect(mockRpc.getBlock).toHaveBeenCalledTimes(2);
    expect(errSpy).toHaveBeenCalledTimes(2);

    sub.close();
  });
});
