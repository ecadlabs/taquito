import { TezosToolkit, SetProviderOptions } from '../src/taquito';
import { RpcTzProvider } from '../src/tz/rpc-tz-provider';
import { RpcContractProvider } from '../src/contract/rpc-contract-provider';
import { PollingSubscribeProvider } from '../src/subscribe/polling-provider';
import { NoopSigner } from '../src/signer/noop';
import { RpcClient } from '@taquito/rpc';
import { retry } from 'rxjs/operators';

describe('TezosToolkit test', () => {
  let mockRpcClient: any;
  let toolkit: TezosToolkit;

  beforeEach(() => {
    mockRpcClient = {
      getBlock: jest.fn(),
      getScript: jest.fn(),
      getManagerKey: jest.fn(),
      getStorage: jest.fn(),
      getBlockHeader: jest.fn(),
      getBlockMetadata: jest.fn(),
      getContract: jest.fn(),
      forgeOperations: jest.fn(),
      injectOperation: jest.fn(),
      preapplyOperations: jest.fn(),
    };

    mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
    mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
    mockRpcClient.preapplyOperations.mockResolvedValue([]);
    mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });

    // Required for operations confirmation polling
    mockRpcClient.getBlock.mockResolvedValue({
      operations: [[{ hash: 'test' }], [], [], []],
      header: {
        level: 0,
      },
    });

    mockRpcClient.getManagerKey.mockResolvedValue('test');
    toolkit = new TezosToolkit('url');
    toolkit['_context'].rpc = mockRpcClient;
  });

  it('setProvider with string should create rpc provider', () => {
    toolkit.setProvider({ rpc: 'test' });
    expect(toolkit.tz).toBeInstanceOf(RpcTzProvider);
    expect(toolkit.contract).toBeInstanceOf(RpcContractProvider);
  });

  const providerKey: (keyof SetProviderOptions)[] = [
    'signer',
    'rpc',
    'stream',
    'protocol',
    'config',
  ];
  providerKey
    .filter(x => x !== 'rpc')
    .forEach(key => {
      it(`setting ${key} provider should not override the rpc provider`, () => {
        toolkit = new TezosToolkit('rpc');
        expect(toolkit.rpc).toBeInstanceOf(RpcClient);
        toolkit.setProvider({ rpc: 'test' });
        expect(toolkit.rpc.getRpcUrl()).toEqual('test');
        toolkit.setProvider({ [key]: 'test' as any });
        expect(toolkit.rpc.getRpcUrl()).toEqual('test');
      });
    });

  providerKey
    .filter(x => x !== 'signer')
    .forEach(key => {
      it(`setting ${key} provider should not override the signer provider`, () => {
        expect(toolkit.signer).toBeInstanceOf(NoopSigner);
        toolkit.setProvider({ signer: 'test' as any });
        const instance = toolkit.signer;
        expect(instance).toEqual('test');
        toolkit.setProvider({ [key]: 'test' as any });
        expect(toolkit.signer).toEqual(instance);
      });
    });

  providerKey
    .filter(x => x !== 'stream')
    .forEach(key => {
      it(`setting ${key} provider should not override the stream provider`, () => {
        expect(toolkit.stream).toBeInstanceOf(PollingSubscribeProvider);
        toolkit.setProvider({ stream: 'test' as any });
        const instance = toolkit.stream;
        expect(instance).toBeInstanceOf(PollingSubscribeProvider);
        toolkit.setProvider({ [key]: 'test' as any });
        expect(toolkit.stream).toEqual(instance);
      });
    });

  test('getVersionInfo returns well formed response', () => {
    const versionInfo = toolkit.getVersionInfo();
    expect(versionInfo.commitHash).toBeTruthy();
    expect(versionInfo.version).toBeTruthy();
  });

  it("setProvider allows to change configurations for the confirmation methods and streamer", () => {
    // There is default config set on the context class:
    expect(toolkit["_context"].config.confirmationPollingIntervalSecond).toBeUndefined();
    expect(toolkit["_context"].config.confirmationPollingTimeoutSecond).toEqual(180);
    expect(toolkit["_context"].config.defaultConfirmationCount).toEqual(1);
    expect(toolkit["_context"].config.streamerPollingIntervalMilliseconds).toEqual(20000);
    expect(toolkit["_context"].config.shouldObservableSubscriptionRetry).toBeFalsy();
    expect(toolkit["_context"].config.observableSubscriptionRetryFunction.prototype).toEqual(retry().prototype);
    
    // can customize one of the config: confirmationPollingTimeoutSecond
    toolkit.setProvider({ config: { confirmationPollingTimeoutSecond:2 } })
    expect(toolkit["_context"].config.confirmationPollingIntervalSecond).toBeUndefined();
    expect(toolkit["_context"].config.confirmationPollingTimeoutSecond).toEqual(2);
    expect(toolkit["_context"].config.defaultConfirmationCount).toEqual(1);
    expect(toolkit["_context"].config.streamerPollingIntervalMilliseconds).toEqual(20000);
    expect(toolkit["_context"].config.shouldObservableSubscriptionRetry).toBeFalsy();
    expect(toolkit["_context"].config.observableSubscriptionRetryFunction.prototype).toEqual(retry().prototype);

    // can customize another config: confirmationPollingIntervalSecond
    // confirmationPollingTimeoutSecond should remain to 2 as set precedently
    toolkit.setProvider({ config: { confirmationPollingIntervalSecond:40 } });
    expect(toolkit["_context"].config.confirmationPollingIntervalSecond).toBeDefined();
    expect(toolkit["_context"].config.confirmationPollingIntervalSecond).toEqual(40);
    expect(toolkit["_context"].config.confirmationPollingTimeoutSecond).toEqual(2);
    expect(toolkit["_context"].config.defaultConfirmationCount).toEqual(1);
    expect(toolkit["_context"].config.streamerPollingIntervalMilliseconds).toEqual(20000);
    expect(toolkit["_context"].config.shouldObservableSubscriptionRetry).toBeFalsy();
    expect(toolkit["_context"].config.observableSubscriptionRetryFunction.prototype).toEqual(retry().prototype);
});

});
