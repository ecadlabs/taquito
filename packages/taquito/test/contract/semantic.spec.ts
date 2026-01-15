import { smartContractAbstractionSemantic } from '../../src/contract/semantic';
import { RpcContractProvider } from '../../src/contract/rpc-contract-provider';
import { Context } from '../../src/context';
import { Semantic } from '@taquito/michelson-encoder';

describe('smartContractAbstractionSemantic test', () => {
  let rpcContractProvider: RpcContractProvider;
  let mockRpcClient: {
    getScript: jest.Mock<any, any>;
    getStorage: jest.Mock<any, any>;
    getBigMapExpr: jest.Mock<any, any>;
    getBlockHeader: jest.Mock<any, any>;
    getEntrypoints: jest.Mock<any, any>;
    getManagerKey: jest.Mock<any, any>;
    getBlock: jest.Mock<any, any>;
    getContract: jest.Mock<any, any>;
    getBlockMetadata: jest.Mock<any, any>;
    injectOperation: jest.Mock<any, any>;
    packData: jest.Mock<any, any>;
    preapplyOperations: jest.Mock<any, any>;
    getChainId: jest.Mock<any, any>;
    getSaplingDiffById: jest.Mock<any, any>;
  };

  let mockSigner: {
    publicKeyHash: jest.Mock<any, any>;
    publicKey: jest.Mock<any, any>;
    sign: jest.Mock<any, any>;
  };

  let mockEstimate;
  let semantic: Semantic;

  beforeEach(() => {
    mockRpcClient = {
      getBigMapExpr: jest.fn(),
      getEntrypoints: jest.fn(),
      getBlock: jest.fn(),
      getScript: jest.fn(),
      getManagerKey: jest.fn(),
      getStorage: jest.fn(),
      getBlockHeader: jest.fn(),
      getBlockMetadata: jest.fn(),
      getContract: jest.fn(),
      injectOperation: jest.fn(),
      packData: jest.fn(),
      preapplyOperations: jest.fn(),
      getChainId: jest.fn(),
      getSaplingDiffById: jest.fn(),
    };

    mockSigner = {
      publicKeyHash: jest.fn(),
      publicKey: jest.fn(),
      sign: jest.fn(),
    };

    mockEstimate = {};

    // Required for operations confirmation polling
    mockRpcClient.getBlock.mockResolvedValue({
      operations: [[], [], [], []],
      header: {
        level: 0,
      },
    });

    const context = new Context(mockRpcClient as any, mockSigner as any);
    rpcContractProvider = new RpcContractProvider(
      // deepcode ignore no-any: any is good enough
      context,
      mockEstimate as any
    );

    semantic = smartContractAbstractionSemantic(rpcContractProvider);
  });

  it('bigMap with bigMap ID', async () => {
    expect(
      semantic['big_map'](
        { int: '1' },
        { prim: 'big_map', args: [{ prim: 'address' }, { prim: 'int' }] }
      )
    ).toHaveProperty('id');
    expect(
      semantic['big_map'](
        { int: '1' },
        { prim: 'big_map', args: [{ prim: 'address' }, { prim: 'int' }] }
      )
    ).toHaveProperty('schema');
    expect(
      semantic['big_map'](
        { int: '1' },
        { prim: 'big_map', args: [{ prim: 'address' }, { prim: 'int' }] }
      )
    ).toHaveProperty('provider');
  });

  it('bigMap without bigMap ID', async () => {
    expect(
      semantic['big_map']({}, { prim: 'big_map', args: [{ prim: 'address' }, { prim: 'int' }] })
    ).toMatchObject({});
  });

  it('saplingState with saplingState ID', async () => {
    expect(
      semantic['sapling_state']({ int: '1' }, { prim: 'sapling_state', args: [{ int: '8' }] })
    ).toHaveProperty('id');
    expect(
      semantic['sapling_state']({ int: '1' }, { prim: 'sapling_state', args: [{ int: '8' }] })
    ).toHaveProperty('provider');
  });

  it('saplingState without saplingState ID', async () => {
    expect(
      semantic['sapling_state']({}, { prim: 'sapling_state', args: [{ int: '8' }] })
    ).toMatchObject({});
  });
});
