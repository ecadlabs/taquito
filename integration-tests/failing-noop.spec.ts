import { LocalForger, ProtocolsHash } from "@taquito/local-forging";
import { CONFIGS } from "./config";
import { RpcForger } from "@taquito/taquito";
import { verifySignature } from "@taquito/utils";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  describe(`Test failing_noop through wallet api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup(true)
      done()
    });

    it('Verify that the failing_noop signs an int', async (done) => {
      const signed = await Tezos.wallet.signFailingNoop({
        arbitrary: "2736475837593756",
      });
      // console.log(signed);
      const pk = await Tezos.wallet.getPublicKey();
      // expect(verifySignature(signed.bytes, pk, signed.sbytes)).toBe(true);
      expect(async () => {
        await Tezos.rpc.injectOperation(signed.sbytes);
      }).rejects.toThrow(`A failing_noop operation can never be validated.`);
      done();
    });

    it('Verify that the local forger can forge the failing_noop operation', async (done) => {
      const failingOperation = await Tezos.prepare.failingNoop({arbitrary: "2736475837593756"});
      const forgeable = Tezos.prepare.toForge(failingOperation);
      const forger = new LocalForger(protocol as unknown as ProtocolsHash);
      const forgedBytes = await forger.forge(forgeable);

      const rpcForger = Tezos.getFactory(RpcForger)();
      const rpcForgedBytes = await rpcForger.forge(forgeable);
      expect(forgedBytes).toEqual(rpcForgedBytes);

      const signed = await Tezos.signer.sign(forgedBytes, new Uint8Array([3]));
      // console.log(signed);
      // expect(verifySignature(signed.bytes, await Tezos.signer.publicKey(), signed.prefixSig)).toBe(true);
      expect(async () => {
        await Tezos.rpc.injectOperation(signed.sbytes);
      }).rejects.toThrow(`A failing_noop operation can never be validated.`);
      done();
    });
  });
})
