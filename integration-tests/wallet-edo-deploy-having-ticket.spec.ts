import { CONFIGS } from "./config";
import { ticketCode, ticketStorage } from '../packages/taquito-local-forging/test/data/code_with_ticket';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contract origination having ticket with init through wallet api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })

    it('Verify wallet.contract for a contract having ticket with init', async (done) => {
      const op = await Tezos.wallet.originate({
        code: ticketCode,
        init: ticketStorage
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();

      done();
    });

    it('Verify contract.originate having ticket with init in JSON', async (done) => {
      const op = await Tezos.wallet.originate({
        code: ticketCode,
        init: { prim: 'Pair', args: [ { prim: 'None' }, { prim: 'None' } ] }
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();
      done();
    });

    it('Verify wallet.originate for a contract having ticket with storage', async (done) => {
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
