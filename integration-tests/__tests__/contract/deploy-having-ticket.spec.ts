import { CONFIGS } from "../../config";
import { ticketCode } from '../../data/code_with_ticket';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test origination of a token contract using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
    });

    it('Originates a contract having ticket with init and the contract api', async () => {
      const op = await Tezos.contract.originate({
        code: ticketCode,
        init: `(Pair None None)`
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
    });

    it('Originates a contract having ticket with init in JSON and the contract api', async () => {
      const op = await Tezos.contract.originate({
        code: ticketCode,
        init: { prim: 'Pair', args: [{ prim: 'None' }, { prim: 'None' }] }
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
    });

    it('Originates a contract having ticket with storage and the contract api', async () => {
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
    });
  });
});
