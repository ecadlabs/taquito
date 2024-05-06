import { CONFIGS } from "../../../config";
import { Protocols } from '@taquito/taquito';
import { ProtoGreaterOrEqual } from '@taquito/michel-codec';

CONFIGS().forEach(({ lib, rpc, setup, knownBaker, protocol }) => {
  const Tezos = lib;
  const parisAndAlpha = ProtoGreaterOrEqual(protocol, Protocols.PtParisBQ) ? test : test.skip;

  describe(`Staking pseudo operations: ${rpc}`, () => {

    beforeAll(async () => {
      await setup(true);

      const delegateOp = await Tezos.contract.setDelegate({
        delegate: knownBaker,
        source: await Tezos.signer.publicKeyHash()
      });

      await delegateOp.confirmation();
    });

    parisAndAlpha('should throw an error when the destination specified is not the same as source', async () => {
      expect(async () => {
        const op = await Tezos.contract.stake({
          amount: 0.1,
          to: knownBaker
        });
      }).rejects.toThrow();
    });

    parisAndAlpha('should be able to stake funds to a designated delegate', async () => {
      const op = await Tezos.contract.stake({
        amount: 0.1
      });
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
    });

    parisAndAlpha('should be able to unstake funds from a designated delegate', async () => {
      const op = await Tezos.contract.unstake({
        amount: 0.1
      });
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
    });

    parisAndAlpha('should be able to finalize_unstake funds from a designated delegate', async () => {
      const op = await Tezos.contract.finalizeUnstake({});
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
    });
  });
});
