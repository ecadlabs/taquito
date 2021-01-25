import { CONFIGS } from "./config";
import { ticketCode, ticketCode3, ticketCode4, ticketStorage, ticketStorage3, ticketStorage4 } from '../packages/taquito-local-forging/test/data/code_with_ticket';
import { Protocols } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;

  const edonet = (protocol === Protocols.PtEdoTez) ? test : test.skip;

  describe(`Test origination of a token contract using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })

    edonet('Originates a contract having ticket', async (done) => {
      // This test currently fails with TezosOperationError: (permanent) proto.008-PtEdoTez.michelson_v1.unexpected_ticket

      const op = await Tezos.contract.originate({
        code: ticketCode,
        init: ticketStorage
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract();
      console.log('contract', contract);
      
      done();
    });
  });
})
