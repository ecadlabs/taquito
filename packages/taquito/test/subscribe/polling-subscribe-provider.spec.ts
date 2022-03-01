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

  it('should set the pollingIntervalMilliseconds property based on the minimal_block_delay constant', async (done) => {
    const pollingSubscribeProvider = new PollingSubscribeProvider(mockContext);
    mockReadProvider.getProtocolConstants.mockResolvedValue({
      time_between_blocks: [new BigNumber('30'), new BigNumber('20')],
      minimal_block_delay: new BigNumber(15),
    });
    await pollingSubscribeProvider['getConfirmationPollingInterval']();
    expect(pollingSubscribeProvider.config.pollingIntervalMilliseconds).toEqual(5000);
    expect(pollingSubscribeProvider.config.shouldObservableSubscriptionRetry).toBeFalsy();
    expect(pollingSubscribeProvider.config.observableSubscriptionRetryFunction.prototype).toEqual(
      retry().prototype
    );
    done();
  });

  it('should set the pollingIntervalMilliseconds property based on the time_between_blocks constant', async (done) => {
    const pollingSubscribeProvider = new PollingSubscribeProvider(mockContext);
    mockReadProvider.getProtocolConstants.mockResolvedValue({
      time_between_blocks: [new BigNumber('30'), new BigNumber('20')],
    });
    await pollingSubscribeProvider['getConfirmationPollingInterval']();
    expect(pollingSubscribeProvider.config.pollingIntervalMilliseconds).toEqual(10000);
    expect(pollingSubscribeProvider.config.shouldObservableSubscriptionRetry).toBeFalsy();
    expect(pollingSubscribeProvider.config.observableSubscriptionRetryFunction.prototype).toEqual(
      retry().prototype
    );
    done();
  });

  it('should use default polling interval on error fetching the constants', async (done) => {
    const pollingSubscribeProvider = new PollingSubscribeProvider(mockContext);
    mockReadProvider.getProtocolConstants.mockRejectedValue(new Error());
    const pollingInterval = await pollingSubscribeProvider['getConfirmationPollingInterval']();
    expect(pollingInterval).toEqual(5000);
    expect(pollingSubscribeProvider.config.pollingIntervalMilliseconds).toBeUndefined();
    expect(pollingSubscribeProvider.config.shouldObservableSubscriptionRetry).toBeFalsy();
    expect(pollingSubscribeProvider.config.observableSubscriptionRetryFunction.prototype).toEqual(
      retry().prototype
    );
    done();
  });

  it('should use default polling interval if time_between_blocks is 0 (sandbox)', async (done) => {
    const pollingSubscribeProvider = new PollingSubscribeProvider(mockContext);
    mockReadProvider.getProtocolConstants.mockResolvedValue({
      time_between_blocks: [new BigNumber('0'), new BigNumber('0')],
    });
    await pollingSubscribeProvider['getConfirmationPollingInterval']();
    expect(pollingSubscribeProvider.config.pollingIntervalMilliseconds).toEqual(1000);
    expect(pollingSubscribeProvider.config.shouldObservableSubscriptionRetry).toBeFalsy();
    expect(pollingSubscribeProvider.config.observableSubscriptionRetryFunction.prototype).toEqual(
      retry().prototype
    );
    done();
  });
});
