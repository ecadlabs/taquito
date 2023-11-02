import { InvalidBalanceError, MichelCodecParser, NoopParser, Context, InvalidCodeParameter } from '@taquito/taquito';
import { CONFIGS } from "./config";
import { idMichelsonCode, idInitData } from "./data/id-contract"
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  _describe(`Test contract origination to configure parserProvider to parse plain Michelson`, () => {

    beforeEach(async () => {
      await setup()
    })
    _it('uses noopParser to originate Michelson code and fails', async () => {
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
    });

    _it('uses MichelCodecParser to originate Michelson code and succeeds', async () => {
      // Configure the Tezostoolkit to use the MichelCodecParser (the Michelson will be parsed to JSONMichelson)
      Tezos.setParserProvider(new MichelCodecParser(new Context(rpc)));

      const op = await Tezos.contract.originate({
        balance: "0",
        code: idMichelsonCode,
        init: idInitData
      });
      await op.confirmation()
      expect(op.status).toEqual('applied')
    });

    _it('no parser configured will use MichelCodecParser by default to originate Michelson code and succeeds', async () => {
      // No parserProvider configured will use MichelCodecParser by default (the Michelson will be parsed to JSONMichelson)
      const op = await Tezos.contract.originate({
        balance: "0",
        code: idMichelsonCode,
        init: idInitData
      });
      await op.confirmation()
      expect(op.status).toEqual('applied')
    });
  });

  _describe(`Test contract origination in a plain Michelson through contract api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    _it('Verify contract.originate for an ID contract written in plain Michelson', async () => {
      const op = await Tezos.contract.originate({
        balance: "0",
        code: idMichelsonCode,
        init: idInitData
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
    });
    _it('Origination should pass with balance as number', async () => {
      const op = await Tezos.contract.originate({
        balance: 0,
        code: idMichelsonCode,
        init: idInitData
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
    });
    _it('Origination should thow error if given NaN for balance', async () => {
      expect(() => Tezos.contract.originate({
        balance: "asdf",
        code: idMichelsonCode,
        init: idInitData
      })).rejects.toThrowError(InvalidBalanceError)
    });
  });
})
