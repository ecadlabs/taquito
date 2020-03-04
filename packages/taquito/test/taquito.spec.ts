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
      getBigMapKey: jest.fn(),
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

  const providerKey: (keyof SetProviderOptions)[] = ['signer', 'rpc', 'protocol', 'config'];
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

  it('should use InMemorySigner when importKey is called', async done => {
    expect(toolkit.signer).toEqual({});
    await toolkit.importKey('p2sk2obfVMEuPUnadAConLWk7Tf4Dt3n4svSgJwrgpamRqJXvaYcg1');
    expect(toolkit.signer).toBeInstanceOf(InMemorySigner);
    expect(await toolkit.signer.publicKeyHash()).toEqual('tz3Lfm6CyfSTZ7EgMckptZZGiPxzs9GK59At');

    done();
  });

  it('should use InMemorySigner and activate faucet account when called with {privateKeyOrEmail, passphrase, mnemonic, secret} parameters', async done => {
    // Mock fake operation hash
    mockRpcClient.injectOperation.mockResolvedValue('test');
    expect(toolkit.signer).toEqual({});
    await toolkit.importKey('anEmail', 'testPassword', 'some mnemonic', 'secret');
    expect(toolkit.signer).toBeInstanceOf(InMemorySigner);
    expect(mockRpcClient.forgeOperations).toHaveBeenCalledWith({
      branch: 'test',
      contents: [
        { kind: 'activate_account', pkh: 'tz1hY6N55Br4KrPahoyNUrvSSyaYz5yaRcRW', secret: 'secret' },
      ],
    });
    expect(mockRpcClient.injectOperation).toHaveBeenCalled();
    expect(await toolkit.signer.publicKeyHash()).toEqual('tz1hY6N55Br4KrPahoyNUrvSSyaYz5yaRcRW');
    done();
  });

  it('should use InMemorySigner and skip activate faucet account when called with already activated account', async done => {
    // Mock RPC error when activation is already done
    mockRpcClient.forgeOperations.mockRejectedValue({ body: 'Invalid activation' });
    // Mock fake operation hash
    mockRpcClient.injectOperation.mockResolvedValue('test');
    expect(toolkit.signer).toEqual({});
    await toolkit.importKey('anEmail', 'testPassword', 'some mnemonic', 'secret');
    expect(toolkit.signer).toBeInstanceOf(InMemorySigner);
    expect(mockRpcClient.injectOperation).not.toHaveBeenCalled();
    expect(await toolkit.signer.publicKeyHash()).toEqual('tz1hY6N55Br4KrPahoyNUrvSSyaYz5yaRcRW');
    done();
  });
});
