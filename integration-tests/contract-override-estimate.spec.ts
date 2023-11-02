import { CONFIGS } from "./config";
import { InvalidEstimateValueError } from '@taquito/taquito';
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;

  _describe(`Test contract API operations with overridden estimate values ${rpc}`, () => {
    let pkh: string;

    beforeAll(async () => {
      await setup();

      try {
        const account = await createAddress();
        pkh = await account.signer.publicKeyHash();
      } catch (e) {
        console.log(JSON.stringify(e));
      }

    });

    _it('should throw an error when overriding origination estimate values with decimals', async () => {
      expect(async () => {
        const op = await Tezos.contract.originate({
          balance: "1",
          code: `parameter string;
          storage string;
          code {CAR;
                PUSH string "Hello ";
                CONCAT;
                NIL operation; PAIR};
          `,
          init: `"test"`,
          storageLimit: 100.22
        });
        await op.confirmation();
      }).rejects.toThrowError(InvalidEstimateValueError);

    });

    _it('should throw an error when overriding transfer/transaction estimate values with decimal', async () => {
      expect(async () => {
        const op = await Tezos.contract.transfer({
          to: pkh,
          amount: 1,
          fee: 10.5
        });
        await op.confirmation();
      }).rejects.toThrowError(InvalidEstimateValueError);

    });
  });
});
