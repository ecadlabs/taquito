import { CONFIGS } from "./config";
import { OpKind, Protocols } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const jakartanetAndMondaynet = (protocol === Protocols.PtJakart2) || (protocol === Protocols.ProtoALpha) ? it : it.skip;
  const Tezos = lib;
  describe(`Test tx rollup origination using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup(true)
      done()
    })
    jakartanetAndMondaynet('should succeed to originate a rollup with auto-estimate of the fees', async (done) => {
      const op = await Tezos.contract.originateTxRollup();
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.originatedRollup).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(op.status).toBe('applied');

      done();
    });

    jakartanetAndMondaynet('should succeed to originate a rollup with defined fees', async (done) => {
      const op = await Tezos.contract.originateTxRollup({
        storageLimit: 6000,
        gasLimit: 2000,
        fee: 500
      });
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.originatedRollup).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(op.status).toBe('applied');

      done();
    });

    jakartanetAndMondaynet('should succeed to include a rollupOrigination operation in a batch', async (done) => {
      const op = await Tezos.contract.batch([
        { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 },
        { kind: OpKind.TX_ROLLUP_ORIGINATION }
      ]).send();
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(op.status).toBe('applied');

      console.log(op.hash)

      done();
    });

    jakartanetAndMondaynet('should succeed to include a rollupOrigination operation in a batch using `with` method', async (done) => {
      const op = await Tezos.contract.batch()
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTxRollupOrigination()
        .send();
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(op.status).toBe('applied');
      done();
    });
  });
})
