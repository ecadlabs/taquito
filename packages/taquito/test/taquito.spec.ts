import { TezosToolkit, SetProviderOptions } from '../src/taquito';
import { RpcTzProvider } from '../src/tz/rpc-tz-provider';
import { RpcContractProvider } from '../src/contract/rpc-contract-provider';
import { InMemorySigner } from '@taquito/signer';
import { PollingSubscribeProvider } from '../src/subscribe/polling-provider';
import { NoopSigner } from '../src/signer/noop';
import { RpcClient } from '@taquito/rpc';

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
    toolkit = new TezosToolkit();
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
        toolkit = new TezosToolkit();
        expect(toolkit.rpc).toBeInstanceOf(RpcClient);
        toolkit.setProvider({ rpc: 'test' });
        expect(toolkit.rpc['url']).toEqual('test');
        toolkit.setProvider({ [key]: 'test' as any });
        expect(toolkit.rpc['url']).toEqual('test');
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
});
