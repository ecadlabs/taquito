import { TezosToolkit } from '../../src/taquito';
import { ContractAbstraction } from '../../src/contract/contract';
import { ContractProvider } from '../../src/contract/interface';
import { script } from './data-lambda-view-class';

class ContractAbstractionTest {
  constructor(private abs: ContractAbstraction<ContractProvider>) {}

  helloWorld(): string {
    return 'Hello World!';
  }
}

function composeContractAbstractionTest<T extends ContractAbstraction<ContractProvider>>(abs: T) {
  return Object.assign(abs, {
    constractAbstractionTest(this: ContractAbstraction<ContractProvider>) {
      return new ContractAbstractionTest(this);
    },
  });
}

describe('Contract abstraction composer test', () => {
  let mockRpcClient: any;
  let toolkit: TezosToolkit;

  beforeEach(() => {
    mockRpcClient = {
      getNormalizedScript: jest.fn(),
      getEntrypoints: jest.fn(),
      getBlockHeader: jest.fn(),
    };

    mockRpcClient.getNormalizedScript.mockResolvedValue(script);
    mockRpcClient.getEntrypoints.mockResolvedValue({
      entrypoints: {
        mint: { prim: 'pair', args: [{ prim: 'key' }, { prim: 'nat' }] },
      },
    });
    mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });

    toolkit = new TezosToolkit('url');
    toolkit['_context'].rpc = mockRpcClient;
  });

  it('Should add a helloWorld method on the contract abstraction', async (done) => {
    const result = await toolkit.contract.at('test', composeContractAbstractionTest);
    expect(result.constractAbstractionTest().helloWorld()).toEqual('Hello World!');
    done();
  });
});
