import { encodeOpHash } from "@taquito/utils";
import { firstValueFrom, throwError } from "rxjs";
import { timeout } from "rxjs/operators";
import { CONFIGS } from "../../config";
import { NeverStreamProvider } from "../../test-helpers/never-stream-provider";

const CONFIRMATION_TIMEOUT_SECONDS = 8;
const MAX_TEST_TIMEOUT_MS = 30_000;
const NEVER_INCLUDED_OPERATION_HASH = encodeOpHash("00".repeat(64));

CONFIGS().forEach(({ lib, rpc }) => {
  const Tezos = lib;
  describe(`Test confirmationPollingTimeoutSecond with wallet API using: ${rpc}`, () => {
    it('Verify a timeout error is thrown when an operation is never confirmed', async () => {
      Tezos.setStreamProvider(new NeverStreamProvider());
      Tezos.setProvider({ config: { confirmationPollingTimeoutSecond: CONFIRMATION_TIMEOUT_SECONDS } });

      const op = await Tezos.operation.createOperation(NEVER_INCLUDED_OPERATION_HASH);
      await expect(
        firstValueFrom(
          op
            .confirmationObservable()
            .pipe(
              timeout({
                each: CONFIRMATION_TIMEOUT_SECONDS * 1000,
                with: () => throwError(() => new Error("Confirmation polling timed out")),
              })
            )
        )
      ).rejects.toThrow('Confirmation polling timed out');
    }, MAX_TEST_TIMEOUT_MS)
  });
})
