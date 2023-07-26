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
      const signed = await Tezos.wallet.signFailingNoOp({
        arbitrary: "2736475837593756",
      });
      // expect(verifySignature(signed.bytes, , signed.sbytes)).toBe(true);
      done();
    });

    it('Verify that the local forger can forge the failing_noop operation', async (done) => {
      const failingOperation = await Tezos.prepare.failingNoOp({arbitrary: "2736475837593756"});
      const forgeable = Tezos.prepare.toForge(failingOperation);
      const forger = new LocalForger(protocol as unknown as ProtocolsHash);
      const forgedBytes = await forger.forge(forgeable);

      const rpcForger = Tezos.getFactory(RpcForger)();
      const rpcForgedBytes = await rpcForger.forge(forgeable);
      expect(forgedBytes).toEqual(rpcForgedBytes);

      const singed = await Tezos.signer.sign(forgedBytes, new Uint8Array([3]));
      expect(async () => {
        const operation = await Tezos.rpc.injectOperation(singed.sbytes);
        // await operation.confirmation();
      }).rejects.toThrow(`A failing_noop operation can never be validated.`);
      done();
    });
  });
})
