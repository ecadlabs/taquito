import { LocalForger, ProtocolsHash } from "@taquito/local-forging";
import { CONFIGS } from "./config";
import { RpcForger } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  describe(`Test failing_noop through wallet api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup(true)
      done()
    });

    it('Verify that the failing_noop signs an int and fails as expected', async (done) => {
      expect(async () => {
        const op = await Tezos.wallet.failingNoOp({
          arbitrary: "2736475837593756",
        }).send();
        await op.confirmation();
      }).rejects.toThrow(`Http error response: (500) [{"kind":"permanent","id":"proto.017-PtNairob.validate.operation.failing_noop_error"}]`);
      done();
    });

    it('Verify that the local forger can forge the failing_noop operation', async (done) => {
      const failingOperation = await Tezos.prepare.failingNoOp({arbitrary: "2736475837593756"});
      const forgeable = await Tezos.prepare.toForge(failingOperation);
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
