import { CONFIGS } from '../../config';
import { InvalidAddressError } from '@taquito/core';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  let simpleContractAddress: string;
  describe(`Test Increase Paid Storage using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 5_000_000 });

      try {
        const op = await Tezos.wallet
          .originate({
            balance: '1',
            code: `parameter string;
          storage string;
          code {CAR;
                PUSH string "Hello ";
                CONCAT;
                NIL operation; PAIR};
          `,
            init: `"test"`,
          })
          .send();

        await op.confirmation();
        expect(await op.status()).toBe('applied');

        simpleContractAddress = (await op.contract()).address;
      } catch (e) {
        console.log(JSON.stringify(e));
        throw e;
      }
    });

    it(`should be able to increase the paid storage of a contract successfully: ${rpc}`, async () => {
      const paidSpaceBefore = await Tezos.rpc.getStoragePaidSpace(simpleContractAddress);

      const op = await Tezos.wallet
        .increasePaidStorage({
          amount: 1,
          destination: simpleContractAddress,
        })
        .send();

      await op.confirmation();
      expect(await op.status()).toBe('applied');
      expect(op.opHash).toBeDefined();

      const paidSpaceAfter = await Tezos.rpc.getStoragePaidSpace(simpleContractAddress);

      expect(parseInt(paidSpaceAfter)).toEqual(parseInt(paidSpaceBefore) + 1);
    });

    it(`should be able to include increasePaidStorage operation in a batch: ${rpc}`, async () => {
      const paidSpaceBefore = await Tezos.rpc.getStoragePaidSpace(simpleContractAddress);

      const batch = await Tezos.wallet
        .batch()
        .withOrigination({
          balance: '1',
          code: `parameter string;
          storage string;
          code {CAR;
                PUSH string "Hello ";
                CONCAT;
                NIL operation; PAIR};
          `,
          init: `"test"`,
        })
        .withIncreasePaidStorage({
          amount: 1,
          destination: simpleContractAddress,
        });
      const op = await batch.send();
      const conf = await op.confirmation();
      const currentConf = await op.getCurrentConfirmation();

      expect(currentConf).toEqual(1);
      expect(conf).toEqual(
        expect.objectContaining({
          expectedConfirmation: 1,
          currentConfirmation: 1,
          completed: true,
        })
      );
      expect(await op.status()).toBe('applied');

      const paidSpaceAfter = await Tezos.rpc.getStoragePaidSpace(simpleContractAddress);

      expect(parseInt(paidSpaceAfter)).toEqual(parseInt(paidSpaceBefore) + 1);
    });

    it('should return error when destination contract address is invalid', () => {
      expect(() =>
        Tezos.wallet.increasePaidStorage({
          amount: 1,
          destination: 'invalid_address',
        })
      ).toThrow(InvalidAddressError);
    });
  });
});
