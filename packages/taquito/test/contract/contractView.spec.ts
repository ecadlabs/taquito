import { RpcContractProvider } from '../../src/contract/rpc-contract-provider';
import { tokenInit, tokenCode } from './data';
import { Context } from '../../src/context';
import { ContractView } from '../../src/contract/contract';
import { InvalidParameterError } from '../../src/contract/errors';

describe('ContractView test', () => {
  let rpcContractProvider: RpcContractProvider;
  let mockRpcClient: {
    getNormalizedScript: jest.Mock<any, any>;
    getStorage: jest.Mock<any, any>;
    getEntrypoints: jest.Mock<any, any>;
    getChainId: jest.Mock<any, any>;
  };

  let mockSigner: {
    publicKeyHash: jest.Mock<any, any>;
    publicKey: jest.Mock<any, any>;
    sign: jest.Mock<any, any>;
  };

  let mockEstimate: {
    originate: jest.Mock<any, any>;
    transfer: jest.Mock<any, any>;
    setDelegate: jest.Mock<any, any>;
    registerDelegate: jest.Mock<any, any>;
  };

  beforeEach(() => {
    mockRpcClient = {
      getEntrypoints: jest.fn(),
      getNormalizedScript: jest.fn(),
      getStorage: jest.fn(),
      getChainId: jest.fn(),
    };

    mockSigner = {
      publicKeyHash: jest.fn(),
      publicKey: jest.fn(),
      sign: jest.fn(),
    };

    mockEstimate = {
      originate: jest.fn(),
      transfer: jest.fn(),
      registerDelegate: jest.fn(),
      setDelegate: jest.fn(),
    };

    rpcContractProvider = new RpcContractProvider(
      new Context(mockRpcClient as any, mockSigner as any),
      mockEstimate as any
    );

    mockRpcClient.getChainId.mockResolvedValue('NetXjD3HPJJjmcd')

    mockRpcClient.getNormalizedScript.mockResolvedValue({
      code: tokenCode,
      storage: tokenInit,
    });
    mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
    mockSigner.publicKey.mockResolvedValue('test_pub_key');
    mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
  });

  it('should create instances of ContractView for the entry points that match the tzip4 view signature', async (done) => {
    // The tzip4 view signature is a pair where its second arguments is a contract.
    mockRpcClient.getEntrypoints.mockResolvedValue({
      entrypoints: {
        transfer: {
          prim: 'pair',
          args: [
            { prim: 'pair', args: [{ prim: 'address', annots: ['test'] }, { prim: 'address' }] },
            { prim: 'nat' },
          ],
        },
        getTotalSupply: {
          prim: 'pair',
          args: [{ prim: 'unit' }, { prim: 'contract', args: [{ prim: 'nat' }] }],
        },
        getBalance: {
          prim: 'pair',
          args: [{ prim: 'address' }, { prim: 'contract', args: [{ prim: 'nat' }] }],
        },
        getAllowance: {
          prim: 'pair',
          args: [
            { prim: 'pair', args: [{ prim: 'address' }, { prim: 'address' }] },
            { prim: 'contract', args: [{ prim: 'nat' }] },
          ],
        },
      },
    });

    const result = await rpcContractProvider.at('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D');

    expect(() => result.views.transfer()).toThrow(); // Entry point transfer is not a view
    expect(result.views.getTotalSupply([['Unit']])).toBeInstanceOf(ContractView);
    expect(result.views.getBalance('tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1')).toBeInstanceOf(
      ContractView
    );
    expect(
      result.views.getAllowance(
        'tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1',
        'tz1Nu949TjA4zzJ1iobz76fHPZbWUraRVrCE'
      )
    ).toBeInstanceOf(ContractView);

    try {
      result.views.getAllowance(
        'tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1',
        'tz1Nu949TjA4zzJ1iobz76fHPZbWUraRVrCE',
        'test'
      );
    } catch (e) {
      expect(e.message).toContain(
        `getAllowance Received 3 arguments while expecting one of the following signatures`
      );
      expect(e).toBeInstanceOf(Error);
      expect(e).toBeInstanceOf(InvalidParameterError);
    }
    done();
  });
});
