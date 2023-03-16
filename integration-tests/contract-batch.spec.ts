import { CONFIGS } from './config';
import { ligoSample, ligoSampleMichelson } from './data/ligo-simple-contract';
import { managerCode } from './data/manager_code';
import { MANAGER_LAMBDA, OpKind } from '@taquito/taquito';

CONFIGS().forEach(({ lib, rpc, setup, knownBaker, knownContract, createAddress }) => {
  const Tezos = lib;

  describe(`Test contract.batch through contract api using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });
    test('Verify contract.batch simple transfers with origination code in JSON Michelson format', async (done) => {
      const batch = Tezos.contract
        .batch()
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withOrigination({
          balance: '1',
          code: ligoSample,
          storage: 0
        });

      const op = await batch.send();
      await op.confirmation();
      expect(op.status).toEqual('applied');
      expect(Number(op.consumedGas)).toBeGreaterThan(0);
      done();
    });

    test('Verify contract.batch simple transfers with origination code in Michelson format', async (done) => {
      const batch = Tezos.contract
        .batch()
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withOrigination({
          balance: '1',
          code: ligoSampleMichelson,
          storage: 0
        });

      const op = await batch.send();
      await op.confirmation();
      expect(op.status).toEqual('applied');
      done();
    });

    test('Verify batch of transfers and origination operation using a combination of the two notations (array of operation with kind mixed with withTransfer method)', async (done) => {
      const op = await Tezos.contract.batch([
        {
          kind: OpKind.TRANSACTION,
          to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
          amount: 0.02
        },
        {
          kind: OpKind.ORIGINATION,
          balance: "1",
          code: ligoSample,
          storage: 0,
        }
      ])
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .send();
      await op.confirmation();
      expect(op.status).toEqual('applied')
      done();
    })

    test('Verify handling of contract.batch simple transfers with bad origination', async (done) => {
      expect.assertions(1);
      try {
        await Tezos.contract
          .batch()
          .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
          .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
          .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
          .withOrigination({
            balance: '1',
            code: ligoSample,
            storage: 0,
            storageLimit: 0
          })
          .send();
      } catch (ex) {
        expect(ex).toEqual(
          expect.objectContaining({
            message: expect.stringContaining('storage_exhausted.operation')
          })
        );
      }
      done();
    });

    test('Verify transfer and origination for contract.batch simple transfers from an account with low balance', async (done) => {
      const LocalTez = await createAddress();
      const op = await Tezos.contract.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 2 });
      await op.confirmation();

      const contract = await Tezos.contract.at(knownContract);

      const batchOp = await LocalTez.contract
        .batch([
          {
            kind: OpKind.TRANSACTION,
            to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
            amount: 0.01
          },
          {
            kind: OpKind.ORIGINATION,
            balance: '0',
            code: ligoSample,
            storage: 0
          }
        ])
        .send();
      await batchOp.confirmation();
      expect(op.status).toEqual('applied');
      done();
    });

    test('Verify contract.batch simple transfers with chained contract calls', async (done) => {
      const op = await Tezos.contract.originate({
        balance: '1',
        code: managerCode,
        init: { string: await Tezos.signer.publicKeyHash() }
      });

      const contract = await op.contract();
      expect(op.status).toEqual('applied');

      const batch = Tezos.contract
        .batch()
        .withTransfer({ to: contract.address, amount: 1 })
        .withContractCall(
          contract.methods.do(MANAGER_LAMBDA.transferImplicit('tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh', 5))
        )
        .withContractCall(contract.methods.do(MANAGER_LAMBDA.setDelegate(knownBaker)))
        .withContractCall(contract.methods.do(MANAGER_LAMBDA.removeDelegate()));

      const batchOp = await batch.send();

      await batchOp.confirmation();

      expect(batchOp.status).toEqual('applied');
      done();
    });

    test('Verify contract.batch of simple transfers and a contract entrypoint call using the array notation with kind', async (done) => {
      const contract = await Tezos.contract.at(knownContract);
      const batchOp = await Tezos.contract
        .batch([
          { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 },
          { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 },
          { kind: OpKind.TRANSACTION, ...contract.methods.default([['Unit']]).toTransferParams() }
        ])
        .send();

      await batchOp.confirmation();

      expect(batchOp.status).toEqual('applied');
      done();
    });

    test('Verify that with a batch of multiple originations contract address info can be got from the getOriginatedContractAddresses member function', async (done) => {
      const batch = Tezos.contract
        .batch()
        .withOrigination({
          balance: '1',
          code: ligoSample,
          storage: 0
        })
        .withOrigination({
          balance: '1',
          code: ligoSampleMichelson,
          storage: 0
        })

      const op = await batch.send();
      await op.confirmation();

      const addresses = op.getOriginatedContractAddresses();
      expect(op.status).toEqual('applied');
      expect(addresses.length).toEqual(2);
      done();
    })

    test('Verify batch contract calls can specify amount, fee, gasLimit and storageLimit', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: managerCode,
        init: { "string": await Tezos.signer.publicKeyHash() },
      })
      const contract = await op.contract();

      const estimateOp = await Tezos.estimate.batch([
        { ...(contract.methodsObject.do(MANAGER_LAMBDA.transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 5)).toTransferParams()), kind: OpKind.TRANSACTION },
        { ...(contract.methodsObject.do(MANAGER_LAMBDA.setDelegate(knownBaker)).toTransferParams()), kind: OpKind.TRANSACTION },
        { ...(contract.methodsObject.do(MANAGER_LAMBDA.removeDelegate()).toTransferParams()), kind: OpKind.TRANSACTION },
      ])

      const batch = Tezos.contract.batch()
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 5)), { fee: estimateOp[0].suggestedFeeMutez, gasLimit: estimateOp[0].gasLimit, storageLimit: estimateOp[0].storageLimit })
        .withContractCall(contract.methods.do(MANAGER_LAMBDA.setDelegate(knownBaker)), { fee: estimateOp[1].suggestedFeeMutez, gasLimit: estimateOp[1].gasLimit, storageLimit: estimateOp[1].storageLimit })
        .withContractCall(contract.methods.do(MANAGER_LAMBDA.removeDelegate()), { fee: estimateOp[2].suggestedFeeMutez, gasLimit: estimateOp[2].gasLimit, storageLimit: estimateOp[2].storageLimit })
      const batchOp = await batch.send();
      await batchOp.confirmation();

      expect(batchOp.fee).toEqual(estimateOp[0].suggestedFeeMutez + estimateOp[1].suggestedFeeMutez + estimateOp[2].suggestedFeeMutez)
      expect(batchOp.gasLimit).toEqual(estimateOp[0].gasLimit + estimateOp[1].gasLimit + estimateOp[2].gasLimit)
      expect(batchOp.storageLimit).toEqual(estimateOp[0].storageLimit + estimateOp[1].storageLimit + estimateOp[2].storageLimit)
      done()
    })
  });
});
