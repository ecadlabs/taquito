/* eslint-disable @typescript-eslint/no-explicit-any */
import { ForgedBytes, BatchOperation } from '@taquito/taquito';
import { defaultConfigConfirmation } from '../../src/context';
import {
  RevealOperationBuilder,
  TransferOperationBuilder,
  OriginationOperationBuilder,
  DelegationOperationBuilder,
} from '../helpers';

import {
  resultOriginations,
  successfulResult,
  resultWithoutOrigination,
  resultSingleOrigination,
} from '../data/batch-results';

describe('Batch operation', () => {
  let fakeContext: any;
  const fakeForgedBytes = {} as ForgedBytes;

  beforeEach(() => {
    fakeContext = {
      rpc: {
        getBlock: jest.fn(),
      },
      config: { ...defaultConfigConfirmation },
    };

    fakeContext.rpc.getBlock.mockResolvedValue({
      operations: [[{ hash: 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj' }], [], [], []],
      header: {
        level: 200,
      },
    });
  });
  it('should contains compute the consumed gas, storage diff and storage size properly', () => {
    const op = new BatchOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      {} as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.storageDiff).toEqual('0');
    expect(op.consumedGas).toEqual(String(15285 + 15953 + 10207 + 15794 + 10000 + 15722 + 10000));
  });

  describe('Status', () => {
    it('should ignore reveal operation status', () => {
      const revealBuilder = new RevealOperationBuilder();

      const op = new BatchOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {} as any,
        '',
        fakeForgedBytes,
        [revealBuilder.withResult({ status: 'applied' }).build()],
        fakeContext
      );

      expect(op.status).toEqual('unknown');
    });

    it('should consider transaction operation status', () => {
      const revealBuilder = new RevealOperationBuilder();
      const txBuilder = new TransferOperationBuilder();

      const op = new BatchOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {} as any,
        '',
        fakeForgedBytes,
        [
          revealBuilder.withResult({ status: 'applied' }).build(),
          txBuilder.withResult({ status: 'applied' }).build(),
        ],
        fakeContext
      );

      expect(op.status).toEqual('applied');
      expect(op.revealStatus).toEqual('applied');
    });

    it('should consider origination operation status', () => {
      const revealBuilder = new RevealOperationBuilder();
      const txBuilder = new OriginationOperationBuilder();

      const op = new BatchOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {} as any,
        '',
        fakeForgedBytes,
        [
          revealBuilder.withResult({ status: 'applied' }).build(),
          txBuilder.withResult({ status: 'applied' }).build(),
        ],
        fakeContext
      );

      expect(op.status).toEqual('applied');
      expect(op.revealStatus).toEqual('applied');
    });

    it('should consider delegation operation status', () => {
      const revealBuilder = new RevealOperationBuilder();
      const txBuilder = new DelegationOperationBuilder();

      const op = new BatchOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {} as any,
        '',
        fakeForgedBytes,
        [
          revealBuilder.withResult({ status: 'applied' }).build(),
          txBuilder.withResult({ status: 'applied' }).build(),
        ],
        fakeContext
      );

      expect(op.status).toEqual('applied');
      expect(op.revealStatus).toEqual('applied');
    });

    it('should consider this first status when using batch', () => {
      const revealBuilder = new RevealOperationBuilder();
      const delegationBuilder = new DelegationOperationBuilder();
      const originationBuilder = new OriginationOperationBuilder();

      const op = new BatchOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {} as any,
        '',
        fakeForgedBytes,
        [
          revealBuilder.withResult({ status: 'applied' }).build(),
          originationBuilder.withResult({ status: 'backtracked' }).build(),
          delegationBuilder.withResult({ status: 'failed' }).build(),
        ],
        fakeContext
      );

      expect(op.status).toEqual('backtracked');
      expect(op.revealStatus).toEqual('applied');
    });

    it('should be able to batch multiple origination operations and retrieve originated contract addresses using getOriginatedContractAddresses()', () => {
      const op = new BatchOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {} as any,
        '',
        fakeForgedBytes,
        resultOriginations,
        fakeContext
      );

      expect(op.status).toEqual('applied');
      expect(op.getOriginatedContractAddresses().length).toEqual(2);
      expect(op.getOriginatedContractAddresses()).toEqual([
        'KT1Wr1xjQAzb44AcPRV9F9oyPurkFz7y2otC',
        'KT1SG1LfkoMoEqR5srtiYeYcciaZfBTGzTgY',
      ]);
    });

    it('should be able to handle non-existing "originated_contracts" property elegantly', () => {
      const op = new BatchOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {} as any,
        '',
        fakeForgedBytes,
        resultWithoutOrigination,
        fakeContext
      );

      expect(op.status).toEqual('applied');
      expect(op.getOriginatedContractAddresses().length).toEqual(0);
      expect(op.getOriginatedContractAddresses()).toEqual([]);
    });

    it('should be able to batch operations with a single origination', () => {
      const op = new BatchOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {} as any,
        '',
        fakeForgedBytes,
        resultSingleOrigination,
        fakeContext
      );

      expect(op.status).toEqual('applied');
      expect(op.getOriginatedContractAddresses().length).toEqual(1);
      expect(op.getOriginatedContractAddresses()).toEqual(['KT1Em8ALyerHtZd1s5s6quJDZrTRxnmdKcKd']);
    });
  });
});
