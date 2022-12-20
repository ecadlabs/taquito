import { defaultConfigConfirmation } from '../../src/context';
import { OriginationOperation } from '../../src/operations/origination-operation';
import { ForgedBytes } from '../../src/operations/types';
import { OperationContentsAndResult } from '@taquito/rpc';
import { OriginationOperationBuilder, RevealOperationBuilder } from '../helpers';
import { PollingSubscribeProvider } from '../../src/subscribe/polling-subcribe-provider';

describe('Origination operation', () => {
  let fakeContext: any;
  const fakeForgedBytes = {} as ForgedBytes;

  const successfulResult = [
    {
      kind: 'origination',
      source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
      fee: '30000',
      counter: '1121110',
      gas_limit: '90000',
      storage_limit: '2000',
      balance: '1000000',
      script: {},
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
            change: '-30000',
          },
          {
            kind: 'freezer',
            category: 'fees',
            delegate: 'tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU',
            cycle: 325,
            change: '30000',
          },
        ],
        operation_result: {
          status: 'applied',
          balance_updates: [
            {
              kind: 'contract',
              contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
              change: '-62000',
            },
            {
              kind: 'contract',
              contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
              change: '-257000',
            },
            {
              kind: 'contract',
              contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
              change: '-1000000',
            },
            {
              kind: 'contract',
              contract: 'KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD',
              change: '1000000',
            },
          ],
          originated_contracts: ['KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD'],
          consumed_milligas: '11684000',
          storage_size: '62',
          paid_storage_size_diff: '62',
        },
      },
    },
  ] as OperationContentsAndResult[];

  beforeEach(() => {
    fakeContext = {
      stream: new PollingSubscribeProvider(fakeContext),
      rpc: {
        getBlock: jest.fn(),
      },
      config: { ...defaultConfigConfirmation },
      getConfirmationPollingInterval: jest.fn(),
    };

    fakeContext.rpc.getBlock.mockResolvedValue({
      operations: [[{ hash: 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj' }], [], [], []],
      header: {
        level: 200,
      },
    });
    fakeContext.getConfirmationPollingInterval.mockResolvedValue(10);
  });

  describe('Status', () => {
    it('returns the status only for origination operation', () => {
      const originationBuilder = new OriginationOperationBuilder();
      const revealBuilder = new RevealOperationBuilder();
      const fakeContractProvider: any = {};
      const op = new OriginationOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {} as any,
        fakeForgedBytes,
        [
          revealBuilder.withResult({ status: 'applied' }).build(),
          originationBuilder.withResult({ status: 'failed' }).build(),
        ],
        fakeContext,
        fakeContractProvider
      );
      expect(op.revealStatus).toEqual('applied');
      expect(op.status).toEqual('failed');
    });
  });

  describe('Contract address', () => {
    it('should contains the originated contract address given a successful result', () => {
      const fakeContractProvider: any = {};
      const op = new OriginationOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {} as any,
        fakeForgedBytes,
        successfulResult,
        fakeContext,
        fakeContractProvider
      );

      console.log(op['params']);
      expect(op.contractAddress).toEqual('KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD');
    });

    it('contract address is undefined given a wrong result', () => {
      const fakeContractProvider: any = {};
      const wrongResults: any[] = [
        {},
        [{ kind: 'origination' }],
        [{ kind: 'origination', metadata: {} }],
      ];

      wrongResults.forEach((result) => {
        const op = new OriginationOperation(
          'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
          {} as any,
          fakeForgedBytes,
          result,
          fakeContext,
          fakeContractProvider
        );
        expect(op.contractAddress).toBeUndefined();
      });
    });
  });

  describe('Contract', () => {
    it('should return proper confirmation head', async (done) => {
      const fakeContractProvider: any = {
        at: jest.fn(),
      };

      fakeContractProvider.at.mockResolvedValue('contract');
      const op = new OriginationOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {} as any,
        {} as any,
        successfulResult,
        fakeContext,
        fakeContractProvider
      );
      const confirmation = await op.confirmation();
      expect(confirmation).toEqual(200);
      done();
    });

    it('should create a contract given a successful result', async (done) => {
      const fakeContractProvider: any = {
        at: jest.fn(),
      };

      fakeContractProvider.at.mockResolvedValue('contract');
      const op = new OriginationOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {} as any,
        fakeForgedBytes,
        successfulResult,
        fakeContext,
        fakeContractProvider
      );
      const contract = await op.contract();
      expect(contract).toBe('contract');
      expect(fakeContractProvider.at).toHaveBeenCalledWith('KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD');
      done();
    });

    it('should throw an error if no contract is available', async (done) => {
      const fakeContractProvider: any = {
        at: jest.fn(),
      };

      fakeContractProvider.at.mockResolvedValue('contract');
      const op = new OriginationOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {} as any,
        fakeForgedBytes,
        'wrong_result' as any,
        fakeContext,
        fakeContractProvider
      );

      await expect(op.contract()).rejects.toEqual(
        new Error('No contract was originated in this operation')
      );
      done();
    });
  });

  it('should successfully retrieve all members of OriginationOperation', () => {
    const originationBuilder = new OriginationOperationBuilder();
    const fakeContractProvider: any = {};
    const op = new OriginationOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      {
        fee: '2991',
        gas_limit: '26260',
        storage_limit: '257',
      } as any,
      fakeForgedBytes,
      [originationBuilder.withResult({ status: 'applied' }).build()],
      fakeContext,
      fakeContractProvider
    );

    expect(op.revealStatus).toEqual('unknown');
    expect(op.status).toEqual('applied');
    expect(op.consumedGas).toEqual('15953');
    expect(op.consumedMilliGas).toEqual('15952999');
    expect(op.contractAddress).toEqual('KT1UvU4PamD38HYWwG4UjgTKU2nHJ42DqVhX');
    expect(op.errors).toBeUndefined();
    expect(op.fee).toEqual('2991');
    expect(op.gasLimit).toEqual('26260');
    expect(op.hash).toEqual('ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj');
    expect(op.storageDiff).toBeFalsy();
    expect(op.operationResults).toEqual({
      consumed_milligas: '15952999',
      status: 'applied',
      originated_contracts: ['KT1UvU4PamD38HYWwG4UjgTKU2nHJ42DqVhX'],
      storage_size: '62',
    });
    expect(op.revealOperation).toBeUndefined();
    expect(op.storageSize).toEqual('62');
    expect(op.storageLimit).toEqual('257');
  });
});
