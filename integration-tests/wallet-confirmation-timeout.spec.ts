import BigNumber from "bignumber.js";
import { CONFIGS, sleep } from "./config";
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  let minimalBlockDelay: BigNumber;
  _describe(`Test confirmationPollingTimeoutSecond with wallet API using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup();
      minimalBlockDelay = (await Tezos.rpc.getConstants()).minimal_block_delay ?? new BigNumber(8);
    });

    _it('Verify a timeout error is thrown when an operation is never confirmed', async () => {
      const timeout = Number(minimalBlockDelay.multipliedBy(2));
      Tezos.setProvider({ config: { confirmationPollingTimeoutSecond: timeout } })
      expect(async () => {

        const op = await Tezos.wallet.originate({
          code: `parameter string;
          storage string;
          code {CAR;
                PUSH string "Hello ";
                CONCAT;
                NIL operation; PAIR};
          `,
          init: `"test"`,
          gasLimit: 600000 // gas limit too high, the operation won't be included in a block
        }).send()
        await op.confirmation()

      }).rejects.toThrow('Confirmation polling timed out');

      await sleep(timeout * 2000);

    })
  });
})
