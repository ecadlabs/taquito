import { TezosToolkit } from '../../src/taquito';
import { ContractAbstraction } from '../../src/contract/contract';
import { Wallet } from '../../src/wallet/wallet';
import { script } from '../contract/data-lambda-view-class';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';

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

  it('Should add a helloWorld method on the contract abstraction', async () => {
    const result = await toolkit.wallet.at(
      'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
      composeContractAbstractionTest
    );
    expect(result.constractAbstractionTest().helloWorld()).toEqual('Hello World!');
  });

  it('should retry at head when a block-pinned wallet read temporarily returns 404', async () => {
    mockRpcClient.getContract
      .mockRejectedValueOnce(
        new HttpResponseError('fail', STATUS_CODE.NOT_FOUND, 'err', 'test', 'https://test.com')
      )
      .mockResolvedValueOnce({ script });

    await toolkit.wallet.at('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D', undefined, 200);

    expect(mockRpcClient.getContract).toHaveBeenNthCalledWith(
      1,
      'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
      {
        block: '200',
      }
    );
    expect(mockRpcClient.getContract).toHaveBeenNthCalledWith(
      2,
      'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
      { block: 'head' }
    );
    expect(mockRpcClient.getEntrypoints).toHaveBeenCalledWith(
      'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D'
    );
  });

  it('should read the contract from the exact block hash without consulting head entrypoints', async () => {
    await toolkit.wallet.atExactBlock(
      'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
      undefined,
      'BLockHash200'
    );

    expect(mockRpcClient.getContract).toHaveBeenCalledWith('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D', {
      block: 'BLockHash200',
    });
    expect(mockRpcClient.getEntrypoints).toHaveBeenCalledWith(
      'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
      {
        block: 'BLockHash200',
      }
    );
  });
});
