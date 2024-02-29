import BigNumber from "bignumber.js";
import { CONFIGS, sleep } from "../../config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  let timeBetweenBlocks: BigNumber;
  describe(`Test confirmationPollingTimeoutSecond with wallet API using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup();
      timeBetweenBlocks = (await Tezos.rpc.getConstants()).delay_increment_per_round ?? new BigNumber(15);
    });

    it('Verify a timeout error is thrown when an operation is never confirmed', async () => {
      const timeout = Number(timeBetweenBlocks.multipliedBy(2));
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
