import { CONFIGS } from "./config";
import { idMichelsonCode, idInitData } from "./data/id-contract";
import { MichelCodecParser, NoopParser, Context, InvalidCodeParameter } from '@taquito/taquito';


CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination in a plain Michelson contract through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    it('Verify wallet.originate for an ID contract written in plain Michelson', async () => {
      const op = await Tezos.wallet.originate({
        balance: "0",
        code: idMichelsonCode,
        init: idInitData
      }).send()
      await op.confirmation()
      expect(op.opHash).toBeDefined();
      expect(op.status).toBeDefined();
    });
  });

  describe(`Test contract origination to configure parserProvider to parse plain Michelson`, () => {

    beforeEach(async () => {
      await setup()
    })
    it('uses noopParser to originate Michelson code and fails', async () => {
      // Configure the Tezostoolkit to use the NoopParser (the Michelson won't be parsed)
      Tezos.setParserProvider(new NoopParser());

      try {
        const op = await Tezos.wallet.originate({
          balance: "0",
          code: idMichelsonCode,
          init: idInitData
        }).send();
        await op.confirmation()
      } catch (error: any) {
        expect(error).toBeInstanceOf(InvalidCodeParameter);
        expect(error.message).toEqual('Wrong code parameter type, expected an array');
      }
    });

    it('uses MichelCodecParser to originate Michelson code and succeeds', async () => {
      // Configure the Tezostoolkit to use the MichelCodecParser (the Michelson will be parsed to JSONMichelson)
      Tezos.setParserProvider(new MichelCodecParser(new Context(rpc)));

      const op = await Tezos.wallet.originate({
        balance: "0",
        code: idMichelsonCode,
        init: idInitData
      }).send();
      await op.confirmation()
      expect(op.opHash).toBeDefined();
      expect(op.status).toBeDefined();
    });

    it('no parser configured will use MichelCodecParser by default to originate Michelson code and succeeds', async () => {
      // No parserProvider configured will use MichelCodecParser by default (the Michelson will be parsed to JSONMichelson)
      const op = await Tezos.wallet.originate({
        balance: "0",
        code: idMichelsonCode,
        init: idInitData
      }).send();
      await op.confirmation()
      expect(op.opHash).toBeDefined();
      expect(op.status).toBeDefined();
    });
  });


})
