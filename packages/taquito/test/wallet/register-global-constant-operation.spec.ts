import { TestScheduler } from 'rxjs/testing';
import { BlockResponse, OperationContentsAndResultRegisterGlobalConstant, OpKind } from '@taquito/rpc';
import { RegisterGlobalConstantWalletOperation } from '../../src/wallet/register-global-constant-operation';

describe('RegisterGlobalConstantWalletOperation', () => {
  let testScheduler: TestScheduler;
  let fakeContext: any;

  const createFakeBlock = (level: number, opHash?: string) => {
    const op = {
      hash: `block_hash_${level}`,
      header: {
        level: level,
      },
      operations: [],
    } as unknown as BlockResponse;

    if (opHash) {
      op.operations.push([{ hash: opHash, contents: [] }] as any);
    }
    return op;
  };

  const successfulResult: OperationContentsAndResultRegisterGlobalConstant = {
    kind: OpKind.REGISTER_GLOBAL_CONSTANT,
    source: 'tz1TJGsZxvr6aBGUqfQVxufesTtA7ogv2HwL1dciubXdgPHEMRH2',
    fee: '372',
    counter: '7423375',
    gas_limit: '1330',
    storage_limit: '93',
    value: {
      prim: 'Pair',
      args: [
        { int: '999' },
        { int: '999' },
      ],
    },
    metadata: {
      balance_updates: [],
      operation_result: {
        status: 'applied',
        balance_updates: [],
        consumed_milligas: '1230000',
        storage_size: '73',
        global_address: 'exprvNeeFGy8M7xhmaq7bkQcd3RsXc7ogv2HwL1dciubXdgPHEMRH2',
      },
    },
  };

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual[0]).toMatchObject(expected[0]);
    });

    fakeContext = {
      rpc: {
        getBlock: jest.fn(),
      },
      config: { confirmationPollingIntervalSecond: 10 },
    };

    fakeContext.rpc.getBlock.mockResolvedValue({
      operations: [[{ hash: 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj' }], [], [], []],
      header: {
        level: 200,
      },
    });
  });

  it('should register a global constant and return the hash', async () => {
    testScheduler.run(async (helpers) => {
      const { cold, flush } = helpers;
      const blockObservable = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
      });

      const op = new RegisterGlobalConstantWalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        fakeContext,
        blockObservable
      );

      jest.spyOn(op, 'operationResults').mockResolvedValue([successfulResult]);

      flush();
      const hash = await op.globalConstantHash();

      expect(hash).toBe('exprvNeeFGy8M7xhmaq7bkQcd3RsXc7ogv2HwL1dciubXdgPHEMRH2');
    });
  });

  it('should return applied status when operation is successful', async () => {
    testScheduler.run(async (helpers) => {
      const { cold, flush } = helpers;
      const blockObservable = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
      });

      const op = new RegisterGlobalConstantWalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        fakeContext,
        blockObservable
      );

      jest.spyOn(op, 'registerGlobalConstantOperation').mockResolvedValue(successfulResult);

      flush();
      const status = await op.status();

      expect(status).toBe('applied');
    });
  });
});