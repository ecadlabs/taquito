import { OriginationOperation } from '../../src/operations/origination-operation';
import { ForgedBytes } from '../../src/operations/types';
import { OperationContentsAndResult } from '@taquito/rpc';
import { defaultConfig } from '../../src/context';
import { OriginationOperationBuilder, RevealOperationBuilder } from '../helpers';

describe('Origination operation', () => {
  let fakeContext: any;
  let fakeForgedBytes = {} as ForgedBytes;

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
          consumed_gas: '11684',
          storage_size: '62',
          paid_storage_size_diff: '62',
        },
      },
    },
  ] as OperationContentsAndResult[];

  beforeEach(() => {
    fakeContext = {
      rpc: {
        getBlock: jest.fn(),
      },
      config: { ...defaultConfig },
    };

    fakeContext.rpc.getBlock.mockResolvedValue({
      operations: [[{ hash: 'test_hash' }], [], [], []],
      header: {
        level: 200,
      },
    });
  });

  describe('Status', () => {
    it('returns the status only for origination operation', () => {
      const originationBuilder = new OriginationOperationBuilder();
      const revealBuilder = new RevealOperationBuilder();
      const fakeContractProvider: any = {};
      const op = new OriginationOperation(
        'test_hash',
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
        'test_hash',
        {} as any,
        fakeForgedBytes,
        successfulResult,
        fakeContext,
        fakeContractProvider
      );
      expect(op.contractAddress).toEqual('KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD');
    });

    it('contract address is undefined given an wrong result', () => {
      const fakeContractProvider: any = {};
      const wrongResults: any[] = [
        {},
        [{ kind: 'origination' }],
        [{ kind: 'origination', metadata: {} }],
      ];

      wrongResults.forEach(result => {
        const op = new OriginationOperation(
          'test_hash',
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
    it('should return proper confirmation head', async done => {
      const fakeContractProvider: any = {
        at: jest.fn(),
      };

      fakeContractProvider.at.mockResolvedValue('contract');
      const op = new OriginationOperation(
        'test_hash',
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

    it('should create a contract given a successful result', async done => {
      const fakeContractProvider: any = {
        at: jest.fn(),
      };

      fakeContractProvider.at.mockResolvedValue('contract');
      const op = new OriginationOperation(
        'test_hash',
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

    it('should throw an error if no contract is available', async done => {
      const fakeContractProvider: any = {
        at: jest.fn(),
      };

      fakeContractProvider.at.mockResolvedValue('contract');
      const op = new OriginationOperation(
        'test_hash',
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
});
