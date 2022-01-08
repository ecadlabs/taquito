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
    getBlockHeader: jest.Mock<any, any>;
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
      getBlockHeader: jest.fn(),
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

    mockRpcClient.getBlockHeader.mockResolvedValue({
      protocol: 'PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb',
      chain_id: 'NetXjD3HPJJjmcd',
      hash: 'BMCnvCbzC9v4HxTXWpUpaA7hooFVkQGfg16zMgzeb3eUNVB58S1',
      level: 847136,
      proto: 2,
      predecessor: 'BLqnKLAfqAf5pjoVMkj4VztdmmksSu3fx3q2eRTwTRL2CGvgws2',
      timestamp: '2020-11-04T18:39:20Z',
      validation_pass: 4,
      operations_hash: 'LLoZpwx6pGPmWYdSns1WHJ9GL4UFxGdjn9nWL3KFvXNKa2ioHuXSb',
      fitness: ['01', '00000000000ced1f'],
      context: 'CoVmCTMPFiauJwp59yFm45K3LCKNJeeSzhBggF6nVJgrrnPTxyTV',
      priority: 0,
      proof_of_work_nonce: '7073f75508b30400',
      seed_nonce_hash: 'nceUd4hqZULXQPyioXpWBsv2qVEAf77wP52impoDVPF6rgG1X1R48',
      signature:
        'siguQC9rv8ZRoH7jsxQPDiQN37GPKccxsVaqgRSDuTsfbjX4NcHgx9MS1CEfQYK7PgSxfjokia6ZRpdGJnde1y3BPjpKeftf',
    });
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

    const result = await rpcContractProvider.at('test');

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
    expect(() =>
      result.views.getAllowance(
        'tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1',
        'tz1Nu949TjA4zzJ1iobz76fHPZbWUraRVrCE',
        'test'
      )
    ).toThrowError(InvalidParameterError);
    done();
  });
});
