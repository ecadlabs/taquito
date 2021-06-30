import { importKey } from '@taquito/signer';
import { OpKind } from '@taquito/taquito';
import { CONFIGS } from './config';
import { booleanCode } from './data/boolean_parameter';

CONFIGS().forEach(({ lib, rpc, setup, knownContract }) => {
  const Tezos = lib;

  describe(`Test send more than 1 tx in the same block: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      // temporarily use a faucet key waiting to update the keygen
      await importKey(
        Tezos,
        'peqjckge.qkrrajzs@tezos.example.org',
        'y4BX7qS1UE',
        [
          'skate',
          'damp',
          'faculty',
          'morning',
          'bring',
          'ridge',
          'traffic',
          'initial',
          'piece',
          'annual',
          'give',
          'say',
          'wrestle',
          'rare',
          'ability'
        ].join(' '),
        '7d4c8c3796fdbf4869edb5703758f0e5831f5081'
      );
      done();
    });
    it('send multiple operations in a block using the contract api', async (done) => {
      const contract = await Tezos.contract.at(knownContract);

      const op1 = await Tezos.contract.transfer({
        to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
        amount: 2,
        gasLimit: 1527,
        fee: 443,
        storageLimit: 0
      });

      const op2 = await Tezos.contract.transfer({ to: 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY', amount: 2 });
      
      const op3 = await Tezos.contract.transfer({
        to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
        amount: 1,
        gasLimit: 1527,
        fee: 480,
        storageLimit: 0
      });
      
      const op4 = await Tezos.contract.originate({
        balance: '1',
        code: booleanCode,
        storage: true
      });
      
      const op5 = await Tezos.contract.originate({
        balance: '1',
        code: booleanCode,
        storage: true,
        fee: 150000,
        storageLimit: 10000,
        gasLimit: 400000
      });
      
      const op6 = await Tezos.contract
        .batch([
          {
            kind: OpKind.TRANSACTION,
            to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
            amount: 2,
            gasLimit: 1527,
            fee: 442,
            storageLimit: 0
          },
          { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
          { kind: OpKind.TRANSACTION, ...contract.methods.default([['Unit']]).toTransferParams() }
        ])
        .send();

      await Promise.all([
        op1.confirmation(),
        op2.confirmation(),
        op3.confirmation(),
        op4.confirmation(),
        op5.confirmation(),
        op6.confirmation()
      ]);

      expect(op1.status).toBe('applied');
      expect(op2.status).toBe('applied');
      expect(op3.status).toBe('applied');
      expect(op4.status).toBe('applied');
      expect(op5.status).toBe('applied');
      expect(op6.status).toBe('applied');

      if (op1.includedInBlock != op2.includedInBlock) {
        expect(op1.includedInBlock).toEqual(op2.includedInBlock - 1);
      } else {
        expect(op1.includedInBlock).toEqual(op2.includedInBlock);
      }
      if (op2.includedInBlock != op3.includedInBlock) {
        expect(op2.includedInBlock).toEqual(op3.includedInBlock - 1);
      } else {
        expect(op2.includedInBlock).toEqual(op3.includedInBlock);
      }
      if (op3.includedInBlock != op4.includedInBlock) {
        expect(op3.includedInBlock).toEqual(op4.includedInBlock - 1);
      } else {
        expect(op3.includedInBlock).toEqual(op4.includedInBlock);
      }
      if (op4.includedInBlock != op5.includedInBlock) {
        expect(op4.includedInBlock).toEqual(op5.includedInBlock - 1);
      } else {
        expect(op4.includedInBlock).toEqual(op5.includedInBlock);
      }
      if (op5.includedInBlock != op6.includedInBlock) {
        expect(op5.includedInBlock).toEqual(op6.includedInBlock - 1);
      } else {
        expect(op5.includedInBlock).toEqual(op6.includedInBlock);
      }

      done();
    });
  });
});
