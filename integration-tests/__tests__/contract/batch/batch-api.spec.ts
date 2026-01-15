import { CONFIGS } from "../../../config";
import { ligoSample, ligoSampleMichelson } from "../../../data/ligo-simple-contract";
import { managerCode } from "../../../data/manager_code";
import { MANAGER_LAMBDA, OpKind } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, knownBaker, createAddress }) => {
  const Tezos = lib;
  describe(`Test the Taquito batch api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    it('Verify simple batch transfers with origination', async () => {
      const batch = await Tezos.contract.batch()
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withOrigination({
          balance: "1",
          code: ligoSample,
          storage: 0,
        })

      const op = await batch.send();
      await op.confirmation();
      expect(op.status).toEqual('applied')
    })

    it('Verify a batch of transfers and origination operations using a combination of the two notations (array of operation with kind mixed with withTransfer method)', async () => {
      /** Tests the usage of a mix of the 2 possible notations for batched operations
       *  See for details on the 2 notations:
       *  https://taquito.io/docs/batch_API#--the-array-of-transactions-method
       *  https://taquito.io/docs/batch_API#--the-withtransfer-method
       */
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
    })

    it('Verify simple batch transfer with origination fails when storage_exhausted', async () => {
      expect.assertions(1);
      try {
        await Tezos.contract.batch()
          .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
          .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
          .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
          .withOrigination({
            balance: "1",
            code: ligoSample,
            storage: 0,
            storageLimit: 0,
          })
          .send();
      } catch (ex) {
        expect(ex).toEqual(expect.objectContaining({
          message: expect.stringContaining('storage_exhausted.operation')
        }))
      }
    })

    it('Verify batch transfer and origination from an account with a low balance', async () => {
      const LocalTez = await createAddress();
      const op = await Tezos.contract.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 2 });
      await op.confirmation();

      const batchOp = await LocalTez.contract.batch([
        {
          kind: OpKind.TRANSACTION,
          to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
          amount: 1
        },
        {
          kind: OpKind.ORIGINATION,
          balance: "0",
          code: ligoSample,
          storage: 0,
        }
      ]).send()
      await batchOp.confirmation();
      expect(op.status).toEqual('applied')
    })

    it('Verify batch transfer with chained contract calls', async () => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: managerCode,
        init: { "string": await Tezos.signer.publicKeyHash() },
      })
      await op.confirmation();
      const contract = await op.contract();
      expect(op.status).toEqual('applied')

      const batch = Tezos.contract.batch()
        .withTransfer({ to: contract.address, amount: 1 })
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 5)))
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.setDelegate(knownBaker)))
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.removeDelegate()))

      const batchOp = await batch.send();

      await batchOp.confirmation();

      expect(batchOp.status).toEqual('applied')
    });

    it('Verify batch transfer with chained contract calls using the `methodsObject` method', async () => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: managerCode,
        init: { "string": await Tezos.signer.publicKeyHash() },
      })
      await op.confirmation();
      const contract = await op.contract();
      expect(op.status).toEqual('applied')

      const batch = Tezos.contract.batch()
        .withTransfer({ to: contract.address, amount: 1 })
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 5)))
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.setDelegate(knownBaker)))
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.removeDelegate()))

      const batchOp = await batch.send();

      await batchOp.confirmation();

      expect(batchOp.status).toEqual('applied')
    });

    it('Verify simple batch transfers with origination from code in Michelson format', async () => {
      const batch = Tezos.contract.batch()
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withOrigination({
          balance: "1",
          code: ligoSampleMichelson,
          storage: 0,
        })

      const op = await batch.send();
      await op.confirmation();
      expect(op.status).toEqual('applied')
    })
  });
})
