import { CONFIGS } from "./config";
import { ticketCode, ticketStorage } from '../packages/taquito-local-forging/test/data/code_with_ticket';
import { Protocols } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, protocol, setup }) => {
  const Tezos = lib;

  const edonet = (protocol === Protocols.PtEdo2Zk) ? test : test.skip;

  describe(`Test origination of a token contract made with wallet api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })

    edonet('Originates a contract having ticket with init and the wallet api', async (done) => {
      const op = await Tezos.wallet.originate({
        code: ticketCode,
        init: ticketStorage
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();

      done();
    });

    edonet('Originates a contract having ticket with init in JSON and the wallet api', async (done) => {
      const op = await Tezos.wallet.originate({
        code: ticketCode,
        init: { prim: 'Pair', args: [ { prim: 'None' }, { prim: 'None' } ] }
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();
      done();
    });

    edonet('Originates a contract having ticket with storage and the wallet api', async (done) => {
      const op = await Tezos.wallet.originate({
        code: ticketCode,
        storage: {
          '%x': null,
          '%y': null
        }
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();
      
      done();
    }); 
  });
})
