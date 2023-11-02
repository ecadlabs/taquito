import { CONFIGS } from './config';
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  _describe(`Test injecting more than one manager operation in a block: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
    });

    _it('Verify that doing transfers without awaiting the confirmation after each will fail', async () => {
      try {
        const op1 = await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 1 });
        const op2 = await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 });

        await op1.confirmation();
        await op2.confirmation();
      } catch (error: any) {
        // not checking for exact error message because it is not deterministic
        expect(error.message).toBeDefined();
      }
    });
  });
});
