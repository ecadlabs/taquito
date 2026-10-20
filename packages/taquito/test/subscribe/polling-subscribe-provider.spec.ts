import { retry } from 'rxjs/operators';
import { Context } from '../../src/context';
import { PollingSubscribeProvider } from '../../src/subscribe/polling-subcribe-provider';
import BigNumber from 'bignumber.js';

describe('Configurations for the PollingSubscribeProvider', () => {
  let mockReadProvider: {
    getProtocolConstants: ReturnType<typeof vi.fn>;
  };
  let mockContext: any;

  beforeAll(() => {
    mockReadProvider = {
      getProtocolConstants: vi.fn(),
    };

    mockContext = {
      readProvider: mockReadProvider,
    };
  });

  it('Should be initialized with default config values', () => {
    const pollingSubscribeProvider = new PollingSubscribeProvider(mockContext);
    expect(pollingSubscribeProvider.config.pollingIntervalMilliseconds).toBeUndefined();
    expect(pollingSubscribeProvider.config.shouldObservableSubscriptionRetry).toBeFalsy();
    expect(pollingSubscribeProvider.config.observableSubscriptionRetryFunction.prototype).toEqual(
      retry().prototype
    );
  });

  it('Should set a pollingIntervalMilliseconds property on instantiation', () => {
    const pollingSubscribeProvider = new PollingSubscribeProvider(mockContext, {
      pollingIntervalMilliseconds: 2000,
    });
    expect(pollingSubscribeProvider.config.pollingIntervalMilliseconds).toEqual(2000);
    expect(pollingSubscribeProvider.config.shouldObservableSubscriptionRetry).toBeFalsy();
    expect(pollingSubscribeProvider.config.observableSubscriptionRetryFunction.prototype).toEqual(
      retry().prototype
    );
  });

  it('Should override the default shouldObservableSubscriptionRetry property on instantiation', () => {
    const pollingSubscribeProvider = new PollingSubscribeProvider(mockContext, {
      shouldObservableSubscriptionRetry: true,
    });
    expect(pollingSubscribeProvider.config.pollingIntervalMilliseconds).toBeUndefined();
    expect(pollingSubscribeProvider.config.shouldObservableSubscriptionRetry).toBeTruthy();
    expect(pollingSubscribeProvider.config.observableSubscriptionRetryFunction.prototype).toEqual(
      retry().prototype
    );
  });

  it('should set the pollingIntervalMilliseconds property based on the minimal_block_delay constant', async () => {
    const pollingSubscribeProvider = new PollingSubscribeProvider(mockContext);
    mockReadProvider.getProtocolConstants.mockResolvedValue({
      minimal_block_delay: new BigNumber(15),
    });
    await pollingSubscribeProvider['getConfirmationPollingInterval']();
    expect(pollingSubscribeProvider.config.pollingIntervalMilliseconds).toEqual(5000);
    expect(pollingSubscribeProvider.config.shouldObservableSubscriptionRetry).toBeFalsy();
    expect(pollingSubscribeProvider.config.observableSubscriptionRetryFunction.prototype).toEqual(
      retry().prototype
    );
  });

  it('should use default polling interval on error fetching the constants', async () => {
    const pollingSubscribeProvider = new PollingSubscribeProvider(mockContext);
    mockReadProvider.getProtocolConstants.mockRejectedValue(new Error());
    const pollingInterval = await pollingSubscribeProvider['getConfirmationPollingInterval']();
    expect(pollingInterval).toEqual(5000);
    expect(pollingSubscribeProvider.config.pollingIntervalMilliseconds).toBeUndefined();
    expect(pollingSubscribeProvider.config.shouldObservableSubscriptionRetry).toBeFalsy();
    expect(pollingSubscribeProvider.config.observableSubscriptionRetryFunction.prototype).toEqual(
      retry().prototype
    );
  });

  it('should use minimum polling interval if minimal_block_delay is 0 (sandbox)', async () => {
    const pollingSubscribeProvider = new PollingSubscribeProvider(mockContext);
    mockReadProvider.getProtocolConstants.mockResolvedValue({
      minimal_block_delay: new BigNumber('0'),
    });
    await pollingSubscribeProvider['getConfirmationPollingInterval']();
    expect(pollingSubscribeProvider.config.pollingIntervalMilliseconds).toEqual(700);
    expect(pollingSubscribeProvider.config.shouldObservableSubscriptionRetry).toBeFalsy();
    expect(pollingSubscribeProvider.config.observableSubscriptionRetryFunction.prototype).toEqual(
      retry().prototype
    );
  });

  it('should not throw in subscribeEvent when a block contains operation contents without metadata', async () => {
    const blockWithMissingMetadata = {
      hash: 'BLockHashEvent1',
      protocol: 'proto1',
      chain_id: 'NetXdQprcVkpaWU',
      header: { level: 42 },
      metadata: {},
      operations: [
        [
          {
            hash: 'opWithoutMetadata',
            contents: [{ kind: 'endorsement', slot: 0 }],
          },
          {
            hash: 'opWithEvent',
            contents: [
              {
                kind: 'transaction',
                metadata: {
                  internal_operation_results: [
                    {
                      kind: 'event',
                      source: 'KT1TezoooozzSmartPyzzSTATiCzzzwwBFA1',
                      nonce: 0,
                      type: { prim: 'int' },
                      tag: 'my_tag',
                      payload: { int: '1' },
                      result: { status: 'applied' },
                    },
                  ],
                },
              },
            ],
          },
        ],
      ],
    };

    const provider = new PollingSubscribeProvider(
      {
        rpc: {
          getBlock: vi.fn().mockResolvedValue(blockWithMissingMetadata),
        },
        readProvider: mockReadProvider,
      } as unknown as Context,
      { pollingIntervalMilliseconds: 50 }
    );

    const receivedEvents: unknown[] = [];
    const errors: unknown[] = [];

    await new Promise<void>((resolve, reject) => {
      const sub = provider.subscribeEvent({
        address: 'KT1TezoooozzSmartPyzzSTATiCzzzwwBFA1',
      });
      sub.on('data', (ev) => {
        receivedEvents.push(ev);
        sub.close();
        resolve();
      });
      sub.on('error', (err) => {
        errors.push(err);
        sub.close();
        reject(err);
      });
    });

    expect(errors).toEqual([]);
    expect(receivedEvents).toHaveLength(1);
    expect(receivedEvents[0]).toMatchObject({
      opHash: 'opWithEvent',
      blockHash: 'BLockHashEvent1',
      level: 42,
      kind: 'event',
      source: 'KT1TezoooozzSmartPyzzSTATiCzzzwwBFA1',
      tag: 'my_tag',
    });
  });
});
