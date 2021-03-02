import { CONFIGS } from "./config";
import { ligoSample, ligoSampleMichelson } from "./data/ligo-simple-contract";
import { managerCode } from "./data/manager_code";
import { Protocols, MANAGER_LAMBDA, MANAGER_LAMBDA_V9, OpKind } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, knownBaker, knownBakerContract, createAddress, protocol }) => {
  const Tezos = lib;
  let MANAGER = MANAGER_LAMBDA;
  if( protocol === Protocols.PsrsRVg1) {
    MANAGER = MANAGER_LAMBDA_V9
  }
  
  describe(`Test batch api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('Simple transfers with origination', async (done) => {
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

    it('Simple transfers with origination using with', async (done) => {
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

    it('Simple transfers with bad origination', async (done) => {
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

    it('Test batch from account with low balance', async (done) => {
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

    it('Chain contract calls', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: managerCode,
        init: { "string": await Tezos.signer.publicKeyHash() },
      })

      const contract = await op.contract();
      expect(op.status).toEqual('applied')

      const batch = Tezos.batch()
        .withTransfer({ to: contract.address, amount: 1 })
        .withContractCall(contract.methods.do(MANAGER.transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 50)))
        .withContractCall(contract.methods.do(MANAGER.setDelegate(knownBakerContract || knownBaker)))
        .withContractCall(contract.methods.do(MANAGER.removeDelegate()))

      const batchOp = await batch.send();

      await batchOp.confirmation();

      expect(batchOp.status).toEqual('applied')
      done();
    })

    it('Simple transfers with origination and code in Michelson format', async (done) => {
      const batch = await Tezos.batch()
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
