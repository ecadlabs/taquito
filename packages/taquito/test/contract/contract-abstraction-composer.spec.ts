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
      getContract: jest.fn(),
      getEntrypoints: jest.fn(),
      getChainId: jest.fn(),
    };

    mockRpcClient.getContract.mockResolvedValue({ script });
    mockRpcClient.getEntrypoints.mockResolvedValue({
      entrypoints: {
        mint: { prim: 'pair', args: [{ prim: 'key' }, { prim: 'nat' }] },
      },
    });
    mockRpcClient.getChainId.mockResolvedValue('test');

    toolkit = new TezosToolkit(mockRpcClient);
  });

  it('Should add a helloWorld method on the contract abstraction', async () => {
    const result = await toolkit.contract.at(
      'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
      composeContractAbstractionTest
    );
    expect(result.constractAbstractionTest().helloWorld()).toEqual('Hello World!');
  });
});
