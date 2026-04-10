import { smartContractAbstractionSemantic } from '../../src/contract/semantic';
import { RpcContractProvider } from '../../src/contract/rpc-contract-provider';
import { Context } from '../../src/context';
import { Semantic } from '@taquito/michelson-encoder';

describe('smartContractAbstractionSemantic test', () => {
  let rpcContractProvider: RpcContractProvider;
  let mockRpcClient: {
    getScript: ReturnType<typeof vi.fn>;
    getStorage: ReturnType<typeof vi.fn>;
    getBigMapExpr: ReturnType<typeof vi.fn>;
    getBlockHeader: ReturnType<typeof vi.fn>;
    getEntrypoints: ReturnType<typeof vi.fn>;
    getManagerKey: ReturnType<typeof vi.fn>;
    getBlock: ReturnType<typeof vi.fn>;
    getContract: ReturnType<typeof vi.fn>;
    getBlockMetadata: ReturnType<typeof vi.fn>;
    injectOperation: ReturnType<typeof vi.fn>;
    packData: ReturnType<typeof vi.fn>;
    preapplyOperations: ReturnType<typeof vi.fn>;
    getChainId: ReturnType<typeof vi.fn>;
    getSaplingDiffById: ReturnType<typeof vi.fn>;
  };

  let mockSigner: {
    publicKeyHash: ReturnType<typeof vi.fn>;
    publicKey: ReturnType<typeof vi.fn>;
    sign: ReturnType<typeof vi.fn>;
  };

  let mockEstimate;
  let semantic: Semantic;

  beforeEach(() => {
    mockRpcClient = {
      getBigMapExpr: vi.fn(),
      getEntrypoints: vi.fn(),
      getBlock: vi.fn(),
      getScript: vi.fn(),
      getManagerKey: vi.fn(),
      getStorage: vi.fn(),
      getBlockHeader: vi.fn(),
      getBlockMetadata: vi.fn(),
      getContract: vi.fn(),
      injectOperation: vi.fn(),
      packData: vi.fn(),
      preapplyOperations: vi.fn(),
      getChainId: vi.fn(),
      getSaplingDiffById: vi.fn(),
    };

    mockSigner = {
      publicKeyHash: vi.fn(),
      publicKey: vi.fn(),
      sign: vi.fn(),
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
