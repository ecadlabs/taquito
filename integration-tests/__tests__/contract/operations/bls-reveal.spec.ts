import { CONFIGS } from "../../../config";
import { PrefixV2 } from "@taquito/utils";
import { Protocols, TezosToolkit } from "@taquito/taquito";
import { ProtoGreaterOrEqual } from "@taquito/michel-codec";

CONFIGS().forEach(({ lib, rpc, setup, protocol, createAddress }) => {
  const seoulnetAndAlpha = ProtoGreaterOrEqual(protocol, Protocols.PtSeouLou) ? test : test.skip;
  const Tezos = lib;
  let Bls1: TezosToolkit
  let Bls2: TezosToolkit
  describe(`Test reveal of account through contract API using: ${rpc}`, () => {

    beforeAll(async () => {
      await setup(true)
      try {
        Bls1 = await createAddress(PrefixV2.BLS12_381SecretKey)
        Bls2 = await createAddress(PrefixV2.BLS12_381SecretKey)
        let transferOp = await Tezos.contract.transfer({ to: await Bls1.signer.publicKeyHash(), amount: 1 })
        await transferOp.confirmation()
        let transferOp2 = await Tezos.contract.transfer({ to: await Bls2.signer.publicKeyHash(), amount: 1 })
        await transferOp2.confirmation()
      } catch (e) {
        console.log('beforeAll transferOp error', e)
      }
    })

    seoulnetAndAlpha('verify that contract.reveal reveals tz4 address (bls key) without specifying proof', async () => {
      const pkh = await Bls1.signer.publicKeyHash()
      const pk = await Bls1.signer.publicKey()
      const op = await Bls1.contract.reveal({})
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(Number(op.consumedGas)).toBeGreaterThan(0);
      expect(op.publicKey).toEqual(pk);
      expect(op.source).toEqual(pkh);
      expect(op.status).toEqual('applied');
      expect(op.storageDiff).toEqual('0');
      expect(op.proof).toBeDefined();
    })

    seoulnetAndAlpha('verify that contract.reveal reveals tz4 address (bls key) with proof', async () => {
      const proof = (await Bls2.signer.provePossession!()).prefixSig
      const pkh = await Bls2.signer.publicKeyHash()
      const pk = await Bls2.signer.publicKey()
      const op = await Bls2.contract.reveal({ proof })
      await op.confirmation();
      console.log('op', op.operationResults)

      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(Number(op.consumedGas)).toBeGreaterThan(0);
      expect(op.publicKey).toEqual(pk);
      expect(op.source).toEqual(pkh);
      expect(op.status).toEqual('applied');
      expect(op.storageDiff).toEqual('0');
      expect(op.proof).toEqual(proof);
    })
  });
})
