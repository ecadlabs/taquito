import { TezosToolkit } from "@taquito/taquito";
import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, createTz4Address }) => {
  const Tezos = lib;

  describe(`Test contract origination of a simple contract through contract api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();

      const Tz = await createTz4Address();
      const pk = await Tz.signer.publicKey();
      const pkh = await Tz.signer.publicKeyHash();

      console.log(pk);
      console.log(pkh);
      done();
    });

    test('Verify contract.originate for a simple contract', async (done) => {
      const op = await Tezos.contract.originate({
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
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(Number(op.consumedGas)).toBeGreaterThan(0);
      expect(op.contractAddress).toBeDefined();
      expect(op.status).toEqual('applied');
      expect(op.storageDiff).toEqual('62');

      done();
    });

    // it('test originate tz4', async (done) => {
      
      
    //   done();
    // })
  });
});
