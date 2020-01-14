import { CONFIGS } from "./config";
import { ligoSample } from "./data/ligo-simple-contract";
import { managerCode } from "./data/manager_code";
import { MANAGER_LAMBDA } from "@taquito/taquito";

CONFIGS.forEach(({ lib, rpc, setup, knownBaker }) => {
  const Tezos = lib;
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
          kind: 'transaction',
          to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
          amount: 2
        },
        {
          kind: 'origination',
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
      const op = await Tezos.batch()
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
      await op.confirmation();
      expect(op.status).toEqual('backtracked')
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
        .withContractCall(contract.methods.do(MANAGER_LAMBDA.transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 50)))
        .withContractCall(contract.methods.do(MANAGER_LAMBDA.setDelegate(knownBaker)))
        .withContractCall(contract.methods.do(MANAGER_LAMBDA.removeDelegate()))

      const batchOp = await batch.send();

      await batchOp.confirmation();

      expect(batchOp.status).toEqual('applied')
      done();
    })
  });
})
