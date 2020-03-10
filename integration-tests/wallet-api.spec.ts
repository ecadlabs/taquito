import { CONFIGS } from "./config";

CONFIGS.forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  beforeEach(async (done) => {
    await setup();
    done();
  })

  describe(`Test wallet api using: ${rpc}`, () => {
    it('Test', async (done) => {
      const walletOp = await Tezos.wallet.originate({
        balance: "1",
        code: `parameter string;
        storage string;
        code {CAR;
              PUSH string "Hello ";
              CONCAT;
              NIL operation; PAIR};
        `,
        init: `"test"`
      })
      await walletOp.confirmation();
      done()
    })
  })
})
