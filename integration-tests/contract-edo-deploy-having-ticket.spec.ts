import { CONFIGS } from "./config";
import { ticketCode, ticketStorage } from './data/code_with_ticket';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test origination of a token contract using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })
    test('Originates a contract having ticket with init and the wallet api', async (done) => {
      const op = await Tezos.wallet.originate({
        code: ticketCode,
        init: ticketStorage
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();

      done();
    });

    test('Originates a contract having ticket with init and the contract api', async (done) => {
      const op = await Tezos.contract.originate({
        code: ticketCode,
        init: `(Pair None None)`
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      done();
    });

    test('Originates a contract having ticket with init in JSON and the contract api', async (done) => {
      const op = await Tezos.contract.originate({
        code: ticketCode,
        init: { prim: 'Pair', args: [ { prim: 'None' }, { prim: 'None' } ] }
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      done();
    });

    test('Originates a contract having ticket with storage and the contract api', async (done) => {
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
