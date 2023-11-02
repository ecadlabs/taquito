import { PollingSubscribeProvider } from "@taquito/taquito";
import BigNumber from "bignumber.js";
import { CONFIGS } from "./config";
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  let timeBetweenBlocks: BigNumber;
  _describe(`Test handling of missed blocks through contract api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup();
      timeBetweenBlocks = (await Tezos.rpc.getConstants()).delay_increment_per_round ?? new BigNumber(3);
    })

    _it('Verify the operation is found even if the poller skipped blocks', async () => {
      // To simulate the behavior where blocks are skipped, we use a polling interval higher than the time between blocks
      // Before fixing issue #1783, if the block containing the operation was skipped, the operation was never found, and the test ended with a timeout
      // After fixing issue #1783, if blocks are skipped, they will be retrieved and inspected by the Operation class
      Tezos.setStreamProvider(Tezos.getFactory(PollingSubscribeProvider)({ pollingIntervalMilliseconds: Number(timeBetweenBlocks.multipliedBy(4000)) }));
      const op = await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 });
      await op.confirmation();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(op.status).toBe('applied');

    })
  });
})
