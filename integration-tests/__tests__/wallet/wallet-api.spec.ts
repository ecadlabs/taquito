import { CONFIGS } from "../../config";
import { firstValueFrom, throwError } from 'rxjs';
import { timeout, toArray } from 'rxjs/operators';

const CONFIRMATION_OBSERVABLE_TIMEOUT_MS = 60_000;

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  beforeAll(async () => {
    await setup({ preferFreshKey: true, minBalanceMutez: 5_000_000 });
  })

  describe(`Test wallet api using: ${rpc}`, () => {
    test('Test simple origination and wait for confirmation using promise', async () => {
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
      }).send();

      let conf1 = await walletOp.confirmation();
      expect(await walletOp.status()).toBe('applied');
      let currentConf1 = await walletOp.getCurrentConfirmation();
      expect(currentConf1).toEqual(1)
      expect(conf1).toEqual(expect.objectContaining({
        expectedConfirmation: 1,
        currentConfirmation: 1,
        completed: true
      }));

      conf1 = await walletOp.confirmation();
      currentConf1 = await walletOp.getCurrentConfirmation();
      expect(currentConf1).toEqual(1)
      expect(conf1).toEqual(expect.objectContaining({
        expectedConfirmation: 1,
        currentConfirmation: 1,
        completed: true
      }));

      const conf2 = await walletOp.confirmation(2);
      const currentConf2 = await walletOp.getCurrentConfirmation();
      expect(currentConf2).toEqual(2)
      expect(conf2).toEqual(expect.objectContaining({
        expectedConfirmation: 2,
        currentConfirmation: 2,
        completed: true
      }));

    });

    test('Test simple origination and wait for confirmation using observable', async () => {
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
      }).send();

      const events = await firstValueFrom(
        walletOp.confirmationObservable(3).pipe(
          timeout({
            each: CONFIRMATION_OBSERVABLE_TIMEOUT_MS,
            with: () =>
              throwError(
                () => new Error('Timed out waiting for wallet confirmation observable to complete')
              ),
          }),
          toArray()
        )
      );

      expect(events).toEqual(expect.arrayContaining([
        expect.objectContaining({
          currentConfirmation: 1,
          expectedConfirmation: 3,
          completed: false
        }),
        expect.objectContaining({
          currentConfirmation: 2,
          expectedConfirmation: 3,
          completed: false
        }),
        expect.objectContaining({
          currentConfirmation: 3,
          expectedConfirmation: 3,
          completed: true
        })
      ]));
      expect(await walletOp.status()).toBe('applied');

    });
  });
});
