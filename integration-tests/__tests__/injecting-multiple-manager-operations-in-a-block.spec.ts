import { CONFIGS, TAQUITO_MUTEZ } from '../config';
import { rethrowInfrastructureRpcError } from '../test-helpers/rpc-error-assertions';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test injecting more than one manager operation in a block: ${rpc}`, () => {
    beforeAll(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 5_000_000 });
    });

    it('Verify that doing transfers without awaiting the confirmation after each will fail', async () => {
      let caughtError: unknown;

      try {
        const op1 = await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: TAQUITO_MUTEZ, mutez: true });
        const op2 = await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: TAQUITO_MUTEZ, mutez: true });

        await op1.confirmation();
        await op2.confirmation();
        expect.fail('Expected one of the transfers to fail without awaiting confirmations');
      } catch (error: any) {
        caughtError = error;
      }

      rethrowInfrastructureRpcError(caughtError);
      expect(caughtError).toBeInstanceOf(Error);
      expect((caughtError as Error).message).toBeTruthy();
    });
  });
});
