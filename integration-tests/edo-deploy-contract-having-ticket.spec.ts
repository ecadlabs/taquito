import { CONFIGS } from "./config";
import { ticketCode, ticketStorage } from '../packages/taquito-local-forging/test/data/code_with_ticket';
import { Protocols } from "@taquito/taquito";
import { importKey } from "@taquito/signer";

CONFIGS().forEach(({ lib, rpc, protocol }) => {
  const Tezos = lib;

  const edonet = (protocol === Protocols.PtEdoTez) ? test : test.skip;

  describe(`Test origination of a token contract using: ${rpc}`, () => {

    beforeEach(async (done) => {
      // temporary while the key gen doesn't use Taquito v8
      await importKey(
        Tezos,
        'peqjckge.qkrrajzs@tezos.example.org',
        'y4BX7qS1UE',
        [
            'skate',
            'damp',
            'faculty',
            'morning',
            'bring',
            'ridge',
            'traffic',
            'initial',
            'piece',
            'annual',
            'give',
            'say',
            'wrestle',
            'rare',
            'ability',
        ].join(' '),
        '7d4c8c3796fdbf4869edb5703758f0e5831f5081'
    );
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

    edonet('Originates a contract having ticket with init and the contract api', async (done) => {
      const op = await Tezos.contract.originate({
        code: ticketCode,
        init: `(Pair None None)`
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();

      done();
    });

    edonet('Originates a contract having ticket with init in JSON and the contract api', async (done) => {
      const op = await Tezos.contract.originate({
        code: ticketCode,
        init: { prim: 'Pair', args: [ { prim: 'None' }, { prim: 'None' } ] }
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();

      done();
    });

    edonet('Originates a contract having ticket with storage and the contract api', async (done) => {
      const op = await Tezos.contract.originate({
        code: ticketCode,
        storage: {
          '%x': null,
          '%y': null
        }
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      
      done();
    });
  });
})
