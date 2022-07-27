import { CONFIGS } from "./config";
import { ticketCode, ticketStorage } from '../packages/taquito-local-forging/test/data/code_with_ticket';

const test = require('jest-retries');

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contract origination having ticket with init through contract api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })
    test('Verify contract.originate for a contract having ticket with init', 2, async (done: () => void) => {
      // TODO: Replace it with contract.originate
      const op = await Tezos.wallet.originate({
        code: ticketCode,
        init: ticketStorage
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();

      done();
    });

    test('Verify originate.contract for a contract having ticket with init', 2, async (done: () => void) => {
      const op = await Tezos.contract.originate({
        code: ticketCode,
        init: `(Pair None None)`
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      done();
    });

    test('Verify contract.originate having ticket with init in JSON', 2, async (done: () => void) => {
      const op = await Tezos.contract.originate({
        code: ticketCode,
        init: { prim: 'Pair', args: [ { prim: 'None' }, { prim: 'None' } ] }
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      done();
    });

    test('Verify contract.originate for a contract having ticket with storage', 2, async (done: () => void) => {
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
