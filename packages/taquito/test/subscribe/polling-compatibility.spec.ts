import { Context } from '../../src/context';
import { PollingSubscribeProvider } from '../../src/subscribe/polling-subcribe-provider';
import { blockResponse } from '../read-provider/data';
import { BlockResponse, OpKind } from '@taquito/rpc';

// Run unchanged against the integration baseline and the proposed implementation.
describe('polling public compatibility', () => {
  let context: Context;
  let provider: PollingSubscribeProvider;
  let head: BlockResponse;
  let close: Array<() => void>;

  beforeEach(() => {
    vi.useFakeTimers();
    close = [];
    head = {
      ...blockResponse,
      hash: 'B1',
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
    };
    context = new Context('https://rpc.invalid');
    vi.spyOn(context.rpc, 'getBlockHash').mockImplementation(async () => head.hash);
    vi.spyOn(context.rpc, 'getBlock').mockImplementation(async () => head);
    provider = new PollingSubscribeProvider(context, { pollingIntervalMilliseconds: 100 });
  });

  afterEach(() => {
    close.forEach((stop) => stop());
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('keeps operation and event filters and their emitted metadata', async () => {
    const event = {
      kind: 'event' as const,
      source: 'KT1event',
      nonce: 0,
      type: { prim: 'int' },
      tag: 'counter',
      payload: { int: '7' },
      result: { status: 'applied' as const },
    };
    const transaction = {
      kind: OpKind.TRANSACTION as const,
      source: 'tz1source',
      destination: 'KT1counter',
      fee: '1',
      counter: '1',
      gas_limit: '1000',
      storage_limit: '0',
      amount: '0',
      metadata: {
        operation_result: { status: 'applied' as const },
        internal_operation_results: [event, { ...event, tag: 'ignored' }],
      },
    };
    head = {
      ...head,
      header: { ...head.header, level: 42 },
      operations: [
        [],
        [],
        [],
        [
          {
            protocol: head.protocol,
            chain_id: head.chain_id,
            branch: 'B0',
            hash: 'op1',
            contents: [
              transaction,
              { ...transaction, destination: 'KT1other', metadata: undefined },
            ],
          },
        ],
      ],
    };
    const operations = provider.subscribeOperation({ destination: 'KT1counter' });
    const events = provider.subscribeEvent({ address: 'KT1event', tag: 'counter' });
    close.push(
      () => operations.close(),
      () => events.close()
    );
    const operationData = vi.fn();
    const eventData = vi.fn();
    const errors = vi.fn();
    operations.on('data', operationData);
    events.on('data', eventData);
    operations.on('error', errors);
    events.on('error', errors);
    await vi.advanceTimersByTimeAsync(201);
    expect(errors).not.toHaveBeenCalled();
    expect(operationData).toHaveBeenCalledExactlyOnceWith({ hash: 'op1', ...transaction });
    expect(eventData).toHaveBeenCalledExactlyOnceWith({
      ...event,
      opHash: 'op1',
      blockHash: 'B1',
      level: 42,
    });
  });

  it('does not replay to a second full subscriber and closes only the requested subscription', async () => {
    const first = provider.subscribeBlock('head');
    close.push(() => first.close());
    const firstData = vi.fn();
    first.on('data', firstData);
    await vi.advanceTimersByTimeAsync(1);
    const second = provider.subscribeBlock('head');
    close.push(() => second.close());
    const secondData = vi.fn();
    const closed = vi.fn();
    second.on('data', secondData);
    first.on('close', closed);
    await vi.advanceTimersByTimeAsync(100);
    expect(secondData).not.toHaveBeenCalled();
    first.close();
    head = { ...head, hash: 'B2' };
    await vi.advanceTimersByTimeAsync(100);
    expect(firstData).toHaveBeenCalledTimes(1);
    expect(closed).toHaveBeenCalledTimes(1);
    expect(secondData).toHaveBeenCalledExactlyOnceWith(head);
  });

  it('delivers an in-flight block and samples the next head after it completes', async () => {
    const firstBlock = head;
    let finish!: (value: BlockResponse) => void;
    vi.mocked(context.rpc.getBlock).mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      })
    );
    const sub = provider.subscribeBlock('head');
    close.push(() => sub.close());
    const values: string[] = [];
    sub.on('data', (value) => values.push(value.hash));
    await vi.advanceTimersByTimeAsync(1);
    head = { ...head, hash: 'B2' };
    await vi.advanceTimersByTimeAsync(250);
    finish(firstBlock);
    await vi.advanceTimersByTimeAsync(100);
    expect(values).toEqual(['B1', 'B2']);
  });
});
