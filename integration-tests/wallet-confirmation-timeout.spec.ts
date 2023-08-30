import BigNumber from "bignumber.js";
import { CONFIGS, sleep } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  let minimal_block_delay: BigNumber;
  describe(`Test confirmationPollingTimeoutSecond with wallet API using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      minimal_block_delay = (await Tezos.rpc.getConstants()).minimal_block_delay ?? new BigNumber(15);
      done();
    });

    it('Verify a timeout error is thrown when an operation is never confirmed', async (done) => {
      const timeout = Number(minimal_block_delay.multipliedBy(2));
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

      done();
    })
  });
})
