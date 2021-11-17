import { CONFIGS } from "./config";
import { ligoSample, ligoSampleMichelson } from "./data/ligo-simple-contract";
import { managerCode } from "./data/manager_code";
import { MANAGER_LAMBDA, OpKind } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, knownBaker, createAddress }) => {
  const Tezos = lib;
  describe(`Test the Taquito batch api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('Verify simple batch transfers with origination', async (done) => {
      const batch = await Tezos.batch()
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
        .withOrigination({
          balance: "1",
          code: ligoSample,
          storage: 0,
        })

      const op = await batch.send();
      await op.confirmation();
      expect(op.status).toEqual('applied')
      done();
    })

    it('Verify simple batch transfers with origination using .withTransfer', async (done) => {
      const op = await Tezos.batch([
        {
          kind: OpKind.TRANSACTION,
          to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
          amount: 2
        },
        {
          kind: OpKind.ORIGINATION,
          balance: "1",
          code: ligoSample,
          storage: 0,
        }
      ])
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
        .send();
      await op.confirmation();
      expect(op.status).toEqual('applied')
      done();
    })

    it('Verify simple batch transfer with origination fails when storage_exhausted', async (done) => {
      expect.assertions(1);
      try {
        await Tezos.batch()
          .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
          .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
          .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
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
      done();
    })

    it('Verify batch transfer from an account with a low balance', async (done) => {
      const LocalTez = await createAddress();
      const op = await Tezos.contract.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 2 });
      await op.confirmation();

      const batchOp = await LocalTez.batch([
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
      done();
    })

    it('Verify batch transfer with chained contract calls', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: managerCode,
        init: { "string": await Tezos.signer.publicKeyHash() },
      })

      const contract = await op.contract();
      expect(op.status).toEqual('applied')

      const batch = Tezos.batch()
        .withTransfer({ to: contract.address, amount: 1 })
        .withContractCall(contract.methods.do(MANAGER_LAMBDA.transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 50)))
        .withContractCall(contract.methods.do(MANAGER_LAMBDA.setDelegate(knownBaker)))
        .withContractCall(contract.methods.do(MANAGER_LAMBDA.removeDelegate()))

      const batchOp = await batch.send();

      await batchOp.confirmation();

      expect(batchOp.status).toEqual('applied')
      done();
    });

    it('Verify batch transfer with chained contract calls using the `methodsObject` method', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: managerCode,
        init: { "string": await Tezos.signer.publicKeyHash() },
      })

      const contract = await op.contract();
      expect(op.status).toEqual('applied')

      const batch = Tezos.batch()
        .withTransfer({ to: contract.address, amount: 1 })
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 50)))
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.setDelegate(knownBaker)))
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.removeDelegate()))

      const batchOp = await batch.send();

      await batchOp.confirmation();

      expect(batchOp.status).toEqual('applied')
      done();
    });

    it('Verify simple batch transfers with origination from code in Michelson format', async (done) => {
      const batch = Tezos.batch()
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
        .withOrigination({
          balance: "1",
          code: ligoSampleMichelson,
          storage: 0,
        })

      const op = await batch.send();
      await op.confirmation();
      expect(op.status).toEqual('applied')
      done();
    })
  });
})
