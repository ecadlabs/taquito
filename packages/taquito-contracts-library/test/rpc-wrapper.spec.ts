import { RpcWrapperContractsLibrary } from '../src/rpc-wrapper';
import { script } from './data/contract-script';
import { entrypoints } from './data/contract-entrypoints';
import { ContractsLibrary } from '../src/taquito-contracts-library';

describe('RpcWrapperContractsLibrary tests', () => {
    let mockRpcClient: any;

    beforeEach(() => {
        mockRpcClient = {
            getScript: jest.fn(),
            getEntrypoints: jest.fn()
        };
    });

    it('RpcWrapperContractsLibrary is instantiable', () => {
        expect(
            new RpcWrapperContractsLibrary(mockRpcClient as any, new ContractsLibrary())
        ).toBeInstanceOf(RpcWrapperContractsLibrary);
    });

    it('get script from RPC when contract is not in the library', async (done) => {
        mockRpcClient.getScript.mockResolvedValue('script-from-rpc');
        const contractAddress = 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY';
        const rpcWrapper = new RpcWrapperContractsLibrary(mockRpcClient as any, new ContractsLibrary());
        const script = await rpcWrapper.getScript(contractAddress);
        expect(script).toEqual('script-from-rpc');
        done()
    });

    it('get entrypoints from RPC when contract is not in the library', async (done) => {
        mockRpcClient.getEntrypoints.mockResolvedValue('entrypoints-from-http');
        const contractAddress = 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY';
        const rpcWrapper = new RpcWrapperContractsLibrary(mockRpcClient as any, new ContractsLibrary());
        const entrypoints = await rpcWrapper.getEntrypoints(contractAddress);
        expect(entrypoints).toEqual('entrypoints-from-http');
        done()
    });

    it('get script and entrypoints from library when contract is in the library', async (done) => {
        const contractAddress = 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY';
        const contractLib = new ContractsLibrary();

        contractLib.addContract({
            [contractAddress]: {
                script,
                entrypoints
            }
        })

        const rpcWrapper = new RpcWrapperContractsLibrary(mockRpcClient as any, contractLib);
        expect(await rpcWrapper.getScript(contractAddress)).toEqual(script);
        expect(await rpcWrapper.getEntrypoints(contractAddress)).toEqual(entrypoints);
        done()
    });

});
