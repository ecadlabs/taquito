import { CONFIGS } from "./config";
import { ticketCode, ticketStorage } from '../packages/taquito-local-forging/test/data/code_with_ticket';
import { Protocols } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, protocol, setup }) => {
  const Tezos = lib;
  const test = require('jest-retries')
  const edonet = (protocol === Protocols.PtEdo2Zk) ? test : test.skip;

  describe(`Test origination of a token contract using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })

    edonet('Originates a contract having ticket with init and the wallet api', 2, async (done: () => void) => {
      const op = await Tezos.wallet.originate({
        code: ticketCode,
        init: ticketStorage
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();

      done();
    });

    edonet('Originates a contract having ticket with init and the contract api', 2, async (done: () => void) => {
      const op = await Tezos.contract.originate({
        code: ticketCode,
        init: `(Pair None None)`
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      done();
    });

    edonet('Originates a contract having ticket with init in JSON and the contract api', 2, async (done: () => void) => {
      const op = await Tezos.contract.originate({
        code: ticketCode,
        init: { prim: 'Pair', args: [ { prim: 'None' }, { prim: 'None' } ] }
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      done();
    });

    edonet('Originates a contract having ticket with storage and the contract api', 2, async (done: () => void) => {
      const op = await Tezos.contract.originate({
        code: ticketCode,
        storage: {
          '%x': null,
          '%y': null
        }
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      
      done();
    }); 
  });
})
