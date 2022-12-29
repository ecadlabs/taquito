import { BlockResponse, OperationContentsAndResult, OperationContentsAndResultIncreasePaidStorage, RpcClient } from '@taquito/rpc';
import { rxSandbox } from 'rx-sandbox';
import { Context } from '../../src/context';
import { createIncreasePaidStorageOperation } from '../../src/contract';
import { Wallet } from '../../src/wallet';
import { IncreasePaidStorageWalletOperation } from '../../src/wallet/increase-paid-storage-operation';

describe('WalletOperation', () => {
  let mockContext: any;
  const createFakeBlock = (level: number, opHash?: string) => {
    const op = {
      hash: `block_hash_${level}`,
      header: {
        level: level,
      },
      operations: [
        {
          kind: "increase_paid_storage",
          source: "tz2R5pfZ3LKopsjcoJqoKQJ7PExN9ucmDzbb",
          fee: "397",
          counter: "134341",
          gas_limit: "1100",
          storage_limit: "0",
          amount: "1",
          destination: "KT1QHMgTYHgzuVY2uzQJQ3hKtm9sbpWdenQy",
          metadata: {
            balance_updates: [
              {
                kind: "contract",
                contract: "tz2R5pfZ3LKopsjcoJqoKQJ7PExN9ucmDzbb",
                change: "-397",
                origin: "block"
              },
              {
                kind: "accumulator",
                category: "block fees",
                change: "397",
                origin: "block"
              }
            ],
            operation_result: {
              status: "applied",
              balance_updates: [
                {
                  kind: "contract",
                  contract: "tz2R5pfZ3LKopsjcoJqoKQJ7PExN9ucmDzbb",
                  change: "-250",
                  origin: "block"
                },
                {
                  kind: "burned",
                  category: "storage fees",
                  change: "250",
                  origin: "block"
                }
              ],
              consumed_milligas: "1000000"
            }
          }
        }
      ],
    } as unknown as BlockResponse;

    if (opHash) {
      op.operations.push([{ hash: opHash, contents: [] }] as any);
    }

    return op;
  };

  beforeAll(() => {
    mockContext = {
      operationFactory: {
        createIncreasePaidStorageOperation: jest.fn(),
      },
      walletProvider: {
        mapIncreasePaidStorageWalletParams: jest.fn(),
        sendOperations: jest.fn(),
      },
    };
    mockContext.walletProvider.mapIncreasePaidStorageWalletParams.mockResolvedValue({
      source: 'tz2WyYB6AfhX3vHozXgo8kUK443Znv6Fv8D3',
      amount: 1,
      destination: 'KT1P1w5D61s69zfYNubLzonUkgC7zEkXTbY7',
      fee: 397,
      gasLimit: 1100,
      storageLimit: 0,
    });
    mockContext.walletProvider.sendOperations.mockResolvedValue('ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE')

    mockContext.operationFactory.createIncreasePaidStorageOperation.mockResolvedValue({
      source: 'tz2WyYB6AfhX3vHozXgo8kUK443Znv6Fv8D3',
      amount: 1,
      destination: 'KT1P1w5D61s69zfYNubLzonUkgC7zEkXTbY7',
      fee: 397,
      gas_limit: 1100,
      storage_limit: 0,
    })
  });

  describe('increasePaidStorage', () => {
    it('should return format for operation to be sent', async (done) => {
      const op = await createIncreasePaidStorageOperation({
        source: 'tz2WyYB6AfhX3vHozXgo8kUK443Znv6Fv8D3',
        amount: 1,
        destination: 'KT1P1w5D61s69zfYNubLzonUkgC7zEkXTbY7',
        fee: 397,
        gasLimit: 1100,
        storageLimit: 0,
      });
      expect(op.source).toEqual('tz2WyYB6AfhX3vHozXgo8kUK443Znv6Fv8D3');
      expect(op.amount).toEqual(1);
      expect(op.destination).toEqual('KT1P1w5D61s69zfYNubLzonUkgC7zEkXTbY7');
      expect(op.fee).toEqual(397);
      expect(op.gas_limit).toEqual(1100);
      expect(op.storage_limit).toEqual(0);
      done();
    });
  });
  describe('operation', () => {
    it('should return instance of IncreasePaidStorageWalletOperation', async (done) => {
      const { cold, flush } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE')
      });
      const op = new IncreasePaidStorageWalletOperation(
        'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
        new Context('url'),
        blockObs
      );

      expect(await op.getCurrentConfirmation()).toEqual(0);

      flush();
      expect(op).toBeInstanceOf(IncreasePaidStorageWalletOperation);
      done();
    });
  });
  describe('wallet', () => {
    it('should return the correct mocked data', async (done) => {
      const wallet = new Wallet(mockContext);
      const op = await wallet.increasePaidStorage({ amount: 1, destination: 'KT1P1w5D61s69zfYNubLzonUkgC7zEkXTbY7' }).send();
      expect(op).toEqual({
        source: 'tz2WyYB6AfhX3vHozXgo8kUK443Znv6Fv8D3',
        amount: 1,
        destination: 'KT1P1w5D61s69zfYNubLzonUkgC7zEkXTbY7',
        fee: 397,
        gas_limit: 1100,
        storage_limit: 0
      })
      done();
    });
  });
});
