import { Protocols, TezosToolkit, TezosOperationError } from "@taquito/taquito";
import { ProtoGreaterOrEqual } from "@taquito/michel-codec";
import { CONFIGS, NetworkType } from "../../../config";
import { InvalidStakingAddressError, InvalidFinalizeUnstakeAmountError } from '@taquito/core';

CONFIGS().forEach(({ lib, rpc, setup, createAddress, networkType, protocol }) => {
  const rionet = (networkType == NetworkType.TESTNET && protocol === Protocols.PsRiotuma) ? test : test.skip;
  const seoulnetAndAlpha = ProtoGreaterOrEqual(protocol, Protocols.PtSeouLou) ? test: test.skip;

  const Tezos = lib;
  let thirdParty: TezosToolkit
  describe(`Staking pseudo operations: ${rpc}`, () => {
    beforeAll(async () => {
      await setup(true);
      try{
        const address = await Tezos.signer.publicKeyHash()
        if(!await Tezos.rpc.getDelegate(address)){
          const delegateOp = await Tezos.contract.registerDelegate({});
          await delegateOp.confirmation();
        }
        thirdParty = await createAddress();
        const op = await Tezos.contract.transfer({amount: 1, to: await thirdParty.signer.publicKeyHash() });
        await op.confirmation();
      }catch(e){console.log}
    });

    it('should be able to stake funds to a designated delegate', async () => {
      const op = await Tezos.contract.stake({
        amount: 0.1
      });
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
    });

    it('should be able to unstake funds from a designated delegate', async () => {
      const op = await Tezos.contract.unstake({
        amount: 0.1
      });
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
    });

    it('should be able to finalize_unstake funds from a designated delegate', async () => {
      const op = await Tezos.contract.finalizeUnstake({});
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
    });

    seoulnetAndAlpha('should be able to finalize_unstake funds with different source and destination', async () => {
      const op = await thirdParty.contract.finalizeUnstake({to: await Tezos.signer.publicKeyHash()});
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
    });

    it('should throw error when param is against pseudo operation', async () => {
      expect(async () => {
        const op = await Tezos.contract.stake({ amount: 1, to: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA' });
        await op.confirmation()
      }).rejects.toThrow(InvalidStakingAddressError);
      expect(async () => {
        const op = await Tezos.contract.unstake({ amount: 1, to: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA' });
        await op.confirmation()
      }).rejects.toThrow(InvalidStakingAddressError);
      expect(async () => {
        const op = await Tezos.contract.finalizeUnstake({ amount: 1 });
        await op.confirmation()
      }).rejects.toThrow(InvalidFinalizeUnstakeAmountError);
    });

    rionet('should throw error when param is against pseudo operation - finalizeUnstake', async () => {
      expect(async () => {
        const op = await Tezos.contract.finalizeUnstake({ to: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA' });
        await op.confirmation()
      }).rejects.toThrow(TezosOperationError);
    });
  });
});
