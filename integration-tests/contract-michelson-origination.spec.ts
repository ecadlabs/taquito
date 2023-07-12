import { InvalidBalanceError, MichelCodecParser, NoopParser, Context, InvalidCodeParameter } from '@taquito/taquito';
import { CONFIGS } from "./config";
import { idMichelsonCode, idInitData } from "./data/id-contract"

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contract origination to configure parserProvider to parse plain Michelson`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('uses noopParser to originate Michelson code and fails', async (done) => {
      // Configure the Tezostoolkit to use the NoopParser (the Michelson won't be parsed)
      Tezos.setParserProvider(new NoopParser());

      try {
        const op = await Tezos.contract.originate({
          balance: "0",
          code: idMichelsonCode,
          init: idInitData
        });
        await op.confirmation()
      } catch (error: any) {
        expect(error).toBeInstanceOf(InvalidCodeParameter);
        expect(error.message).toEqual('Wrong code parameter type, expected an array');
      }
      done();
    });

    it('uses MichelCodecParser to originate Michelson code and succeeds', async (done) => {
      // Configure the Tezostoolkit to use the MichelCodecParser (the Michelson will be parsed to JSONMichelson)
      Tezos.setParserProvider(new MichelCodecParser(new Context(rpc)));

      const op = await Tezos.contract.originate({
        balance: "0",
        code: idMichelsonCode,
        init: idInitData
      });
      await op.confirmation()
      expect(op.status).toEqual('applied')
      done();
    });

    it('no parser configured will use MichelCodecParser by default to originate Michelson code and succeeds', async (done) => {
      // No parserProvider configured will use MichelCodecParser by default (the Michelson will be parsed to JSONMichelson)
      const op = await Tezos.contract.originate({
        balance: "0",
        code: idMichelsonCode,
        init: idInitData
      });
      await op.confirmation()
      expect(op.status).toEqual('applied')
      done();
    });
  });

  describe(`Test contract origination in a plain Michelson through contract api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('Verify contract.originate for an ID contract written in plain Michelson', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "0",
        code: idMichelsonCode,
        init: idInitData
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });
    it('Origination should pass with balance as number', async (done) => {
      const op = await Tezos.contract.originate({
        balance: 0,
        code: idMichelsonCode,
        init: idInitData
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });
    it('Origination should thow error if given NaN for balance', async (done) => {
      expect(() => Tezos.contract.originate({
        balance: "asdf",
        code: idMichelsonCode,
        init: idInitData
      })).rejects.toThrowError(InvalidBalanceError)
      done();
    });
  });
})
