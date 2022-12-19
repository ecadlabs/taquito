import { CONFIGS } from "./config";
import { OpKind, Protocols } from "@taquito/taquito";


CONFIGS().forEach(({ lib, rpc, setup, protocol, txRollupAddress }) => {
  const Tezos = lib;

<<<<<<< HEAD
  const Limanet = protocol === Protocols.PtLimaPtL ? it : it.skip;
=======
  const kathAndLima = protocol === Protocols.PtKathman || protocol === Protocols.PtLimaPtL ? it : it.skip;
>>>>>>> a917ed69e (format and lint)
  describe(`Test tx rollup batch using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup(true);
      done();
    });
    Limanet('should succeed to submit a tx rollup batch with auto-estimate of the fees', async (done) => {
      const op = await Tezos.contract.txRollupSubmitBatch({
        content: '626c6f62',
        rollup: txRollupAddress
      });
      await op.confirmation(2);
      expect(op.hash).toBeDefined();
      expect(op.content).toEqual('626c6f62');
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(op.status).toBe('applied');
      expect(Number(op.consumedGas)).toBeGreaterThan(0);

      done();
    });

    Limanet('should succeed to submit a tx rollup batch with defined fees', async (done) => {
      const op = await Tezos.contract.txRollupSubmitBatch({
        content: '626c6f62',
        rollup: txRollupAddress,
        storageLimit: 6000,
        gasLimit: 3000,
        fee: 500
      });
      await op.confirmation(2);
      expect(op.hash).toBeDefined();
      expect(op.content).toEqual('626c6f62');
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(op.status).toBe('applied');

      done();
    });

    Limanet('should succeed to include a tx rollup batch operation in a batch', async (done) => {
      const op = await Tezos.contract.batch([
        { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 },
        { kind: OpKind.TX_ROLLUP_SUBMIT_BATCH, content: '626c6f62', rollup: txRollupAddress, }
      ]).send();
      await op.confirmation(2);
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(op.status).toBe('applied');

      done();
    });

    Limanet('should succeed to include a tx rollup batch operation in a batch using `with` method', async (done) => {
      const op = await Tezos.contract.batch()
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTxRollupSubmitBatch({ content: '626c6f62', rollup: txRollupAddress })
        .send();
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(op.status).toBe('applied');

      done();
    });
  });
});
