import { RpcWrapperContractsLibrary } from '../src/rpc-wrapper';
import { script } from './data/contract-script';
import { entrypoints } from './data/contract-entrypoints';
import { ContractsLibrary } from '../src/taquito-contracts-library';

describe('RpcWrapperContractsLibrary tests', () => {
  let mockRpcClient: any;

  beforeEach(() => {
    mockRpcClient = {
      getNormalizedScript: jest.fn(),
      getEntrypoints: jest.fn(),
    };
  });

  it('RpcWrapperContractsLibrary is instantiable', () => {
    expect(
      new RpcWrapperContractsLibrary(mockRpcClient as any, new ContractsLibrary())
    ).toBeInstanceOf(RpcWrapperContractsLibrary);
  });

  it('get script from RPC when contract is not in the library', async (done) => {
    mockRpcClient.getNormalizedScript.mockResolvedValue('script-from-rpc');
    const contractAddress = 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY';
    const rpcWrapper = new RpcWrapperContractsLibrary(mockRpcClient as any, new ContractsLibrary());
    const script = await rpcWrapper.getNormalizedScript(contractAddress);
    expect(script).toEqual('script-from-rpc');
    done();
  });

  it('get script and entrypoints from library when contract is in the library', async (done) => {
    const contractAddress = 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY';
    const contractLib = new ContractsLibrary();

    contractLib.addContract({
      [contractAddress]: {
        script,
        entrypoints,
      },
    });
    const rpcWrapper = new RpcWrapperContractsLibrary(mockRpcClient as any, contractLib);
    expect((await rpcWrapper.getContract(contractAddress)).script).toBeDefined
    expect((await rpcWrapper.getContract(contractAddress)).script).toEqual(script);
    expect(await rpcWrapper.getEntrypoints(contractAddress)).toEqual(entrypoints);
    done();
  });
});
