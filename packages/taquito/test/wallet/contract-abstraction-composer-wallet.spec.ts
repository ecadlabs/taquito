import { TezosToolkit } from '../../src/taquito';
import { ContractAbstraction } from '../../src/contract/contract';
import { Wallet } from '../../src/wallet/wallet';
import { script } from '../contract/data-lambda-view-class';

class ContractAbstractionTest {
  constructor(private abs: ContractAbstraction<Wallet>) {}

  helloWorld(): string {
    return 'Hello World!';
  }
}

function composeContractAbstractionTest<T extends ContractAbstraction<Wallet>>(abs: T) {
  return Object.assign(abs, {
    constractAbstractionTest(this: ContractAbstraction<Wallet>) {
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

  it('Should add a helloWorld method on the contract abstraction', async (done) => {
    const result = await toolkit.wallet.at(
      'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
      composeContractAbstractionTest
    );
    expect(result.constractAbstractionTest().helloWorld()).toEqual('Hello World!');
    done();
  });
});
