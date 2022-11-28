import { CONFIGS } from "./config";
import { ticketCode, ticketStorage } from './data/code_with_ticket';
import { ticketCodeProto14, ticketStorageProto14 } from './data/code_with_ticket_proto14';
import { Protocols } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const kathmandunet = protocol === Protocols.PtKathman ? test: test.skip;
  const limanetAndAlpha = protocol === Protocols.PtLimaPtL || protocol === Protocols.ProtoALpha ? test: test.skip;

  describe(`Test contract origination having ticket with init through wallet api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done();
    });

    kathmandunet('Verify wallet.originate for a contract having ticket with init', async (done) => {
      const op = await Tezos.wallet.originate({
        code: ticketCodeProto14,
        init: ticketStorageProto14
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();

      done();
    });

    kathmandunet('Verify wallet.originate having ticket with init in JSON', async (done) => {
      const op = await Tezos.wallet.originate({
        code: ticketCodeProto14,
        init: { prim: 'Pair', args: [ { prim: 'None' }, { prim: 'None' } ] }
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();
      done();
    });

    kathmandunet('Verify wallet.originate for a contract having ticket with storage', async (done) => {
      const op = await Tezos.wallet.originate({
        code: ticketCodeProto14,
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
  
  describe(`Test contract origination having ticket with init through wallet api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done();
    });

    limanetAndAlpha('Verify wallet.originate for a contract having ticket with init', async (done) => {
      const op = await Tezos.wallet.originate({
        code: ticketCode,
        init: ticketStorage
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();

      done();
    });

    limanetAndAlpha('Verify wallet.originate having ticket with init in JSON', async (done) => {
      const op = await Tezos.wallet.originate({
        code: ticketCode,
        init: { prim: 'Pair', args: [ { prim: 'None' }, { prim: 'None' } ] }
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();
      done();
    });

    limanetAndAlpha('Verify wallet.originate for a contract having ticket with storage', async (done) => {
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
