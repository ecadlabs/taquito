import { CONFIGS, isSandbox, sleep } from './config';
import { Protocols } from '@taquito/taquito';
import { b58cencode, Prefix, prefix } from '@taquito/utils';
import { InMemorySigner } from '@taquito/signer';
const crypto = require('crypto');

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const nairobinet = protocol === Protocols.PtNairobi ? it : it.skip;
  const flextesanet = isSandbox({ rpc }) ? test : test.skip;
  const Tezos = lib;

  describe(`Test contract.batch containing a high number of operations through contract api using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup(true);
      done();
    });

    nairobinet('Verify contract.batch with 150 operations', async (done) => {
      const dests: { key: string, pkh: string }[] = [];
      const batchSize = 150;

      for (let i = 0; i < batchSize; i++) {
        const keyBytes = Buffer.alloc(32);
        crypto.randomFillSync(keyBytes)

        const key = b58cencode(new Uint8Array(keyBytes), prefix[Prefix.SPSK]);
        const pkh = await new InMemorySigner(key).publicKeyHash();
        dests.push({ key, pkh });
      }

      const batch = Tezos.contract.batch()
      dests.forEach(({ pkh }) => {
        batch.withTransfer({ to: pkh, amount: 0.001 });
      })
      try {
        const op = await batch.send();
        await op.confirmation();
        expect(op.status).toEqual('applied');
      } catch (e) { console.log(JSON.stringify(e)) }
      done();
    });

    flextesanet('Should be able to inject proposal operation in proposal period', async (done) => {
      const dests: { key: string, pkh: string }[] = [];
      const batchSize = 150;

      for (let i = 0; i < batchSize; i++) {
        const keyBytes = Buffer.alloc(32);
        crypto.randomFillSync(keyBytes)

        const key = b58cencode(new Uint8Array(keyBytes), prefix[Prefix.SPSK]);
        const pkh = await new InMemorySigner(key).publicKeyHash();
        dests.push({ key, pkh });
      }

      const batch = Tezos.contract.batch()
      dests.forEach(({ pkh }) => {
        batch.withTransfer({ to: pkh, amount: 0.001, fee: 350 });
      })
      try {
        const op = await batch.send();
        await op.confirmation();
        sleep(5000);
        console.log((await Tezos.rpc.getPendingOperations({})).refused)
        expect(op.status).toEqual('applied');
      } catch (e) { console.log(JSON.stringify(e)) }
      done();
    });

  });
});
