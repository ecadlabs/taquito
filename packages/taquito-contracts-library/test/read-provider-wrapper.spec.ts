import { script } from './data/contract-script';
import { entrypoints } from './data/contract-entrypoints';
import { ContractsLibrary } from '../src/taquito-contracts-library';
import { ReadWrapperContractsLibrary } from '../src/read-provider-wrapper';

describe('RpcWrapperContractsLibrary tests', () => {
  let mockReadProvider: any;

  beforeEach(() => {
    mockReadProvider = {
      getScript: jest.fn(),
      getEntrypoints: jest.fn(),
    };
  });

  it('ReadWrapperContractsLibrary is instantiable', () => {
    expect(
      new ReadWrapperContractsLibrary(mockReadProvider as any, new ContractsLibrary())
    ).toBeInstanceOf(ReadWrapperContractsLibrary);
  });

  it('get a script from RPC when contract is not in the library', async (done) => {
    mockReadProvider.getScript.mockResolvedValue('script-from-rpc');
    const contractAddress = 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY';
    const readWrapper = new ReadWrapperContractsLibrary(
      mockReadProvider as any,
      new ContractsLibrary()
    );
    const script = await readWrapper.getScript(contractAddress, 'head');
    expect(script).toEqual('script-from-rpc');
    done();
  });

  it('get entrypoints from RPC when contract is not in the library', async (done) => {
    mockReadProvider.getEntrypoints.mockResolvedValue('entrypoints-from-http');
    const contractAddress = 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY';
    const readWrapper = new ReadWrapperContractsLibrary(
      mockReadProvider as any,
      new ContractsLibrary()
    );
    const entrypoints = await readWrapper.getEntrypoints(contractAddress);
    expect(entrypoints).toEqual('entrypoints-from-http');
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

    const readWrapper = new ReadWrapperContractsLibrary(mockReadProvider as any, contractLib);
    expect(await readWrapper.getScript(contractAddress, 'head')).toEqual(script);
    expect(await readWrapper.getEntrypoints(contractAddress)).toEqual(entrypoints);
    done();
  });
});
