import { CONFIGS } from "./config";
import { rpcContractResponse, rpcContractResponse2, rpcContractResponse4 } from '../packages/taquito-michelson-encoder/data/sample19_sapling';
import { NoopParser, Protocols } from "@taquito/taquito";
import { importKey } from "@taquito/signer";

CONFIGS().forEach(({ lib, rpc, protocol }) => {
  const Tezos = lib;

  const edonet = (protocol === Protocols.PtEdoTez) ? test : test.skip;

  describe(`Test origination of contracts with sapling using: ${rpc}`, () => {

    beforeEach(async (done) => {
      // temporary while the key gen doesn't use Taquito v8
      await importKey(
        Tezos,
        'uvwdqcla.tuthsnwn@tezos.example.org',
        '1PRrBcoxQZ',
        [
            "young",
            "foam",
            "dance",
            "hero",
            "recall",
            "city",
            "junk",
            "sing",
            "cross",
            "such",
            "obvious",
            "supply",
            "warfare",
            "math",
            "valve"
        ].join(' '),
        'f594b62f89cc2a22ed1bb7dc3af3b47b89ad7e25'
    );
      done()
    })

    edonet('Originates a contract having an empty sapling state in its storage', async (done) => {
      const op = await Tezos.contract.originate({
        code: rpcContractResponse.script.code,
        init: `{}` // empty sapling state
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      done();
    }); 

    edonet('Originates a contract with sapling states in its storage', async (done) => {
      const op = await Tezos.contract.originate({
        code: rpcContractResponse2.script.code,
        init: `(Pair 0 {} {})`
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();

      done();
    });

    edonet('Originates a contract with sapling states in its storage and init in JSON', async (done) => {
      Tezos['_context'].parser = new NoopParser();
        const op = await Tezos.contract.originate({
        code: rpcContractResponse4.script.code,
        init: { prim: 'Pair', args: [ {}, {} ] }
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();

      done();
    });
  });
})