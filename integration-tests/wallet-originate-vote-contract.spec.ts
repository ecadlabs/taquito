import { CONFIGS } from "./config";
import { voteSample } from "./data/vote-contract";
import { STATUS_CODE } from '@taquito/http-utils';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Originate a voting contract using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('originates a voting contract made with wallet api and inits the storage', async (done) => {
      // TODO: probably remove this as very expensive
      const op = await Tezos.wallet.originate({
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
      }).send()
      await op.confirmation()
      expect(op.opHash).toBeDefined();
      expect(op.operationResults).toBeDefined();
      done();
    });
  });
})
