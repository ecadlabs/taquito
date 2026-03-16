import { Context, Operation } from "@taquito/taquito";
import { encodeOpHash } from "@taquito/utils";
import { CONFIGS } from "../../config";
import { NeverStreamProvider } from "../../test-helpers/never-stream-provider";

const CONFIRMATION_TIMEOUT_SECONDS = 8;
const MAX_TEST_TIMEOUT_MS = 30_000;
const NEVER_INCLUDED_OPERATION_HASH = encodeOpHash("11".repeat(64));
const DUMMY_FORGED_BYTES = {
  opbytes: "00",
  opOb: {},
  counter: 0,
};

CONFIGS().forEach(({ rpc }) => {
  describe(`Test confirmationPollingTimeoutSecond with contract API using: ${rpc}`, () => {
    it('Verify a timeout error is thrown when an operation is never confirmed', async () => {
      const context = new Context(rpc);
      context.stream = new NeverStreamProvider();
      context.setPartialConfig({ confirmationPollingTimeoutSecond: CONFIRMATION_TIMEOUT_SECONDS });

      const op = new Operation(NEVER_INCLUDED_OPERATION_HASH, DUMMY_FORGED_BYTES, [], context);
      await expect(op.confirmation()).rejects.toThrow('Confirmation polling timed out');
    }, MAX_TEST_TIMEOUT_MS)
  });
})
