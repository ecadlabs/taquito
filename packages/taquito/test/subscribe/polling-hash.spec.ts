import { Context } from '../../src/context';
import { RpcReadAdapter } from '../../src/read-provider/rpc-read-adapter';
import { RpcClient } from '@taquito/rpc';
import { PollingSubscribeProvider } from '../../src/subscribe/polling-subcribe-provider';
import { blockResponse } from '../read-provider/data';
import { BlockResponse } from '@taquito/rpc';

describe('two-step polling through public subscriptions', () => {
  let context: Context;
  let provider: PollingSubscribeProvider;
  let head: string;
  let close: Array<() => void>;

  const block = (hash: string): BlockResponse => ({
    ...blockResponse,
    hash,
    metadata: {
      protocol: blockResponse.protocol,
      next_protocol: blockResponse.protocol,
      max_operations_ttl: 120,
      max_operation_data_length: 32768,
      max_block_header_length: 239,
      max_operation_list_length: [],
      baker: 'tz1baker',
      test_chain_status: { status: 'not_running' },
    },
    operations: [[], [], [], []],
  });

  beforeEach(() => {
    vi.useFakeTimers();
    head = 'B1';
    close = [];
    context = new Context('https://rpc.invalid');
    vi.spyOn(context.rpc, 'getBlockHash').mockImplementation(async () => head);
    vi.spyOn(context.rpc, 'getBlock').mockImplementation(async () => block(head));
    provider = new PollingSubscribeProvider(context, { pollingIntervalMilliseconds: 100 });
  });

  afterEach(() => {
    close.forEach((stop) => stop());
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('polls hashes without downloading blocks for hash-only subscribers', async () => {
    const sub = provider.subscribe('head');
    close.push(() => sub.close());
    const received: string[] = [];
    sub.on('data', (hash) => received.push(hash));
    await vi.advanceTimersByTimeAsync(201);
    expect(context.rpc.getBlockHash).toHaveBeenCalledTimes(3);
    expect(context.rpc.getBlockHash).toHaveBeenCalledWith({ block: 'head' });
    expect(context.rpc.getBlock).not.toHaveBeenCalled();
    expect(received).toEqual(['B1']);
    head = 'B2';
    await vi.advanceTimersByTimeAsync(100);
    expect(received).toEqual(['B1', 'B2']);
  });
  it('shares polls and fetches each changed head by its concrete hash', async () => {
    const hashes = provider.subscribe('head');
    const blocks = provider.subscribeBlock('head');
    close.push(
      () => hashes.close(),
      () => blocks.close()
    );
    const received: string[] = [];
    blocks.on('data', (value) => received.push(value.hash));
    await vi.advanceTimersByTimeAsync(201);
    expect(context.rpc.getBlockHash).toHaveBeenCalledTimes(3);
    expect(context.rpc.getBlock).toHaveBeenCalledTimes(1);
    expect(context.rpc.getBlock).toHaveBeenLastCalledWith({ block: 'B1' });
    head = 'B2';
    await vi.advanceTimersByTimeAsync(100);
    expect(context.rpc.getBlock).toHaveBeenLastCalledWith({ block: 'B2' });
    head = 'B1';
    await vi.advanceTimersByTimeAsync(100);
    expect(context.rpc.getBlock).toHaveBeenCalledTimes(3);
    expect(received).toEqual(['B1', 'B2', 'B1']);
  });
  it('retries the same full block while a hash subscriber keeps polling', async () => {
    provider = new PollingSubscribeProvider(context, {
      pollingIntervalMilliseconds: 100,
      shouldObservableSubscriptionRetry: true,
    });
    const failure = new Error('temporary full block failure');
    vi.mocked(context.rpc.getBlock).mockRejectedValueOnce(failure);
    const hashes = provider.subscribe('head');
    const blocks = provider.subscribeBlock('head');
    close.push(
      () => hashes.close(),
      () => blocks.close()
    );
    const received = vi.fn();
    const errors = vi.fn();
    const hashErrors = vi.fn();
    blocks.on('data', received);
    blocks.on('error', errors);
    hashes.on('error', hashErrors);
    await vi.advanceTimersByTimeAsync(301);
    expect(errors).toHaveBeenCalledExactlyOnceWith(failure);
    expect(hashErrors).not.toHaveBeenCalled();
    expect(received).toHaveBeenCalledExactlyOnceWith(block('B1'));
    expect(context.rpc.getBlock).toHaveBeenCalledTimes(2);
    expect(vi.mocked(context.rpc.getBlock).mock.calls).toEqual([
      [{ block: 'B1' }],
      [{ block: 'B1' }],
    ]);
  });
  it('starts and restarts full reads while hash-only polling remains active', async () => {
    const hashes = provider.subscribe('head');
    close.push(() => hashes.close());
    await vi.advanceTimersByTimeAsync(201);
    for (let attempt = 0; attempt < 2; attempt++) {
      const blocks = provider.subscribeBlock('head');
      close.push(() => blocks.close());
      const received = vi.fn();
      blocks.on('data', received);
      await vi.advanceTimersByTimeAsync(100);
      expect(received).toHaveBeenCalledExactlyOnceWith(block('B1'));
      blocks.close();
    }
    expect(context.rpc.getBlock).toHaveBeenCalledTimes(2);
  });

  it('finishes a slow block read and then fetches a head observed during that read', async () => {
    let finish!: (value: BlockResponse) => void;
    vi.mocked(context.rpc.getBlock).mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      })
    );
    const blocks = provider.subscribeBlock('head');
    close.push(() => blocks.close());
    const received: string[] = [];
    blocks.on('data', (value) => received.push(value.hash));
    await vi.advanceTimersByTimeAsync(1);
    head = 'B2';
    await vi.advanceTimersByTimeAsync(250);
    expect(context.rpc.getBlock).toHaveBeenCalledTimes(1);
    finish(block('B1'));
    await vi.advanceTimersByTimeAsync(100);
    expect(received).toEqual(['B1', 'B2']);
    expect(context.rpc.getBlock).toHaveBeenLastCalledWith({ block: 'B2' });
  });

  it('does not cancel a slow hash read or request overlapping hashes', async () => {
    let finish!: (value: string) => void;
    vi.mocked(context.rpc.getBlockHash).mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      })
    );
    const hashes = provider.subscribe('head');
    close.push(() => hashes.close());
    const received: string[] = [];
    hashes.on('data', (hash) => received.push(hash));
    await vi.advanceTimersByTimeAsync(301);
    expect(context.rpc.getBlockHash).toHaveBeenCalledTimes(1);
    finish('B1');
    await vi.advanceTimersByTimeAsync(0);
    expect(received).toEqual(['B1']);
  });

  it('shares recovery after a hash read fails for both consumer types', async () => {
    provider = new PollingSubscribeProvider(context, {
      pollingIntervalMilliseconds: 100,
      shouldObservableSubscriptionRetry: true,
    });
    const failure = new Error('hash endpoint unavailable');
    vi.mocked(context.rpc.getBlockHash).mockRejectedValueOnce(failure);
    const hashes = provider.subscribe('head');
    const blocks = provider.subscribeBlock('head');
    close.push(
      () => hashes.close(),
      () => blocks.close()
    );
    const hashErrors = vi.fn();
    const blockErrors = vi.fn();
    const hashData = vi.fn();
    const blockData = vi.fn();
    hashes.on('error', hashErrors);
    blocks.on('error', blockErrors);
    hashes.on('data', hashData);
    blocks.on('data', blockData);
    await vi.advanceTimersByTimeAsync(201);
    expect(hashErrors).toHaveBeenCalledExactlyOnceWith(failure);
    expect(blockErrors).toHaveBeenCalledExactlyOnceWith(failure);
    expect(hashData).toHaveBeenCalledExactlyOnceWith('B1');
    expect(blockData).toHaveBeenCalledExactlyOnceWith(block('B1'));
    expect(context.rpc.getBlockHash).toHaveBeenCalledTimes(3);
    expect(context.rpc.getBlock).toHaveBeenCalledTimes(1);
  });

  it('stops polling after the last subscriber closes and ignores a pending result', async () => {
    let finish!: (value: BlockResponse) => void;
    vi.mocked(context.rpc.getBlock).mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      })
    );
    const blocks = provider.subscribeBlock('head');
    const hashes = provider.subscribe('head');
    close.push(
      () => blocks.close(),
      () => hashes.close()
    );
    const received = vi.fn();
    blocks.on('data', received);
    await vi.advanceTimersByTimeAsync(1);
    blocks.close();
    hashes.close();
    finish(block('B1'));
    await vi.advanceTimersByTimeAsync(500);
    expect(received).not.toHaveBeenCalled();
    expect(context.rpc.getBlockHash).toHaveBeenCalledTimes(1);
    expect(context.rpc.getBlock).toHaveBeenCalledTimes(1);
  });

  it('routes both polling stages through the configured read provider', async () => {
    const customRpc = new RpcClient('https://custom.invalid');
    const customHash = vi.spyOn(customRpc, 'getBlockHash').mockResolvedValue('Bcustom');
    const customBlock = vi.spyOn(customRpc, 'getBlock').mockResolvedValue(block('Bcustom'));
    context.readProvider = new RpcReadAdapter(customRpc);
    const sub = provider.subscribeBlock('head');
    close.push(() => sub.close());
    const received = vi.fn();
    sub.on('data', received);
    await vi.advanceTimersByTimeAsync(201);
    expect(customHash).toHaveBeenCalledTimes(3);
    expect(customHash).toHaveBeenCalledWith({ block: 'head' });
    expect(customBlock).toHaveBeenCalledExactlyOnceWith({ block: 'Bcustom' });
    expect(received).toHaveBeenCalledExactlyOnceWith(block('Bcustom'));
    expect(context.rpc.getBlockHash).not.toHaveBeenCalled();
    expect(context.rpc.getBlock).not.toHaveBeenCalled();
  });
});
