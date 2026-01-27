import BigNumber from "bignumber.js";
import { CONFIGS, sleep } from "../../config";

CONFIGS().forEach(({ lib, rpc, setup, networkName }) => {
  const Tezos = lib;
  const notTezlinknet = networkName === 'TEZLINKNET' ? test.skip : test
  let minimalBlockDelay: BigNumber;
  describe(`Test confirmationPollingTimeoutSecond with contract API using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup();
      minimalBlockDelay = (await Tezos.rpc.getConstants()).minimal_block_delay ?? new BigNumber(4);
    });

    it('Verify a timeout error is thrown when an operation is never confirmed', async () => {
      const timeout = Number(minimalBlockDelay.multipliedBy(2));
      Tezos.setProvider({ config: { confirmationPollingTimeoutSecond: timeout } })
      expect(async () => {
        const op = await Tezos.contract.originate({
          code: `parameter string;
          storage string;
          code {CAR;
                PUSH string "Hello ";
                CONCAT;
                NIL operation; PAIR};
          `,
          init: `"test"`,
          gasLimit: 600000 // gas limit too high, the operation won't be included in a block
        })
        await op.confirmation()
      }).rejects.toThrow('Confirmation polling timed out');

      await sleep(timeout * 2000);

    })
  });
})
