import { retry } from 'rxjs/operators';
import { PollingSubscribeProvider } from '../../src/subscribe/polling-subcribe-provider';
import BigNumber from 'bignumber.js';

describe('Configurations for the PollingSubscribeProvider', () => {
  let mockReadProvider: {
    getProtocolConstants: jest.Mock<any, any>;
  };
  let mockContext: any;

  beforeAll(() => {
    mockReadProvider = {
      getProtocolConstants: jest.fn(),
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
});
