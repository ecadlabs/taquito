import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";
import { voteSample } from "./data/vote-contract";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;

  // We skip this test for Falphanet 
  // The code of the contract is no longer valid 
  // because of the deprecated SET_DELEGATE key_hash
  const it = (protocol !== Protocols.PsrsRVg1) ? test : test.skip;

  describe(`Originate a voting contract using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('originates a voting contract and inits the storage', async (done) => {
      // TODO: probably remove this as very expensive
      const op = await Tezos.contract.originate({
        balance: "1",
        code: voteSample,
        storage: {
          mgr1: {
            addr: await Tezos.signer.publicKeyHash(),
            key: null,
          },
          mgr2: {
            addr: await Tezos.signer.publicKeyHash(),
            key: await Tezos.signer.publicKeyHash(),
          },
        }
      })
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });
  });
})
