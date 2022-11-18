import { CONFIGS } from "./config";
import { ticketCode, ticketStorage } from './data/code_with_ticket';
import { ticketCodeProto14, ticketStorageProto14 } from './data/code_with_ticket_proto14';
import { Protocols } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const kathmandunet = protocol === Protocols.PtKathman ? test: test.skip;
  const limanetAndAlpha = protocol === Protocols.PtLimaPtL || protocol === Protocols.ProtoALpha ? test: test.skip;

  describe(`Test origination of a token contract using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })
    kathmandunet('Originates a contract having ticket with init and the wallet api', async (done) => {
      const op = await Tezos.wallet.originate({
        code: ticketCodeProto14,
        init: ticketStorageProto14
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();

      done();
    });

    kathmandunet('Originates a contract having ticket with init and the contract api', async (done) => {
      const op = await Tezos.contract.originate({
        code: ticketCodeProto14,
        init: `(Pair None None)`
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      done();
    });

    kathmandunet('Originates a contract having ticket with init in JSON and the contract api', async (done) => {
      const op = await Tezos.contract.originate({
        code: ticketCodeProto14,
        init: { prim: 'Pair', args: [ { prim: 'None' }, { prim: 'None' } ] }
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      done();
    });

    kathmandunet('Originates a contract having ticket with storage and the contract api', async (done) => {
      const op = await Tezos.contract.originate({
        code: ticketCodeProto14,
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

  describe(`Test origination of a token contract using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })
    limanetAndAlpha('Originates a contract having ticket with init and the wallet api', async (done) => {
      const op = await Tezos.wallet.originate({
        code: ticketCode,
        init: ticketStorage
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();

      done();
    });

    limanetAndAlpha('Originates a contract having ticket with init and the contract api', async (done) => {
      const op = await Tezos.contract.originate({
        code: ticketCode,
        init: `(Pair None None)`
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      done();
    });

    limanetAndAlpha('Originates a contract having ticket with init in JSON and the contract api', async (done) => {
      const op = await Tezos.contract.originate({
        code: ticketCode,
        init: { prim: 'Pair', args: [ { prim: 'None' }, { prim: 'None' } ] }
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      done();
    });

    limanetAndAlpha('Originates a contract having ticket with storage and the contract api', async (done) => {
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
