import { LocalForger, ProtocolsHash } from "@taquito/local-forging";
import { CONFIGS } from "./config";
import { OpKind, RpcForger } from "@taquito/taquito";
import { verifySignature } from "@taquito/utils";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  describe(`Test failing_noop through wallet api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done();
    });

    it('Verify that the wallet.signFailingNoop signs a text on the genesis block', async (done) => {
      const signed = await Tezos.wallet.signFailingNoop({
        arbitrary: "48656C6C6F20576F726C64", // Hello World
        basedOnBlock: 0,
      });
      expect(signed).toEqual({
        bytes: 'df2788eed43ab680c8a2b79969ce4de93b9768cd2786a85ebdfba90ca7612638110000000b48656c6c6f20576f726c64',
        signature: 'spsig1QVVCiQ6aN2zmut2wKTg4zWLoP9ia4qUY2hBo21odA7P25gqfieFWJMyntaJWmyrd6v3mgjKF5n4d2wcaB3LxkLmd1MoJQ',
        signedContent: {
          branch: await Tezos.rpc.getBlockHash({block: 'genesis'}),
          contents: [{
            kind: OpKind.FAILING_NOOP,
            arbitrary: '48656C6C6F20576F726C64'
          }]
        }
      });
      const pk = await Tezos.wallet.getPublicKey();
      expect(verifySignature(signed.bytes, pk!, signed.signature, new Uint8Array([3]))).toBe(true);
      done();
    });

    it('Verify that the wallet.signFailingNoop signs a text', async (done) => {
      const signed = await Tezos.wallet.signFailingNoop({
        arbitrary: "48656C6C6F20576F726C64", // Hello World
        basedOnBlock: 'head',
      });
      const pk = await Tezos.wallet.getPublicKey();
      expect(verifySignature(signed.bytes, pk!, signed.signature, new Uint8Array([3]))).toBe(true);
      done();
    });

    it('Verify that the contract.failingNoop signs a text on the genesis block', async (done) => {
      const signed = await Tezos.contract.failingNoop({
        arbitrary: "48656C6C6F20576F726C64", // Hello World
        basedOnBlock: 0,
      });
      expect(signed).toEqual({
        bytes: 'df2788eed43ab680c8a2b79969ce4de93b9768cd2786a85ebdfba90ca7612638110000000b48656c6c6f20576f726c64',
        signature: 'spsig1QVVCiQ6aN2zmut2wKTg4zWLoP9ia4qUY2hBo21odA7P25gqfieFWJMyntaJWmyrd6v3mgjKF5n4d2wcaB3LxkLmd1MoJQ',
        signedContent: {
          branch: await Tezos.rpc.getBlockHash({block: 'genesis'}),
          contents: [{
            kind: OpKind.FAILING_NOOP,
            arbitrary: '48656C6C6F20576F726C64'
          }]
        }
      });
      const pk = await Tezos.wallet.getPublicKey();
      expect(verifySignature(signed.bytes, pk!, signed.signature, new Uint8Array([3]))).toBe(true);
      done();
    });

    it('Verify that the contract.failingNoop signs a text', async (done) => {
      const signed = await Tezos.contract.failingNoop({
        arbitrary: "48656C6C6F20576F726C64", // Hello World
        basedOnBlock: 'head',
      });
      const pk = await Tezos.wallet.getPublicKey();
      expect(verifySignature(signed.bytes, pk!, signed.signature, new Uint8Array([3]))).toBe(true);
      done();
    });

    it('Verify that the local forger can forge the failing_noop operation on the genesis block', async (done) => {
      const failingOperation = await Tezos.prepare.failingNoop({
        arbitrary: "48656C6C6F20576F726C64",
        basedOnBlock: 0,
      });
      const forgeable = Tezos.prepare.toForge(failingOperation);
      const forger = new LocalForger(protocol as unknown as ProtocolsHash);
      const forgedBytes = await forger.forge(forgeable);

      const rpcForger = Tezos.getFactory(RpcForger)();
      const rpcForgedBytes = await rpcForger.forge(forgeable);
      expect(forgedBytes).toEqual(rpcForgedBytes);
      const signed = await Tezos.signer.sign(forgedBytes, new Uint8Array([3]));

      expect(signed.prefixSig).toBe('spsig1QVVCiQ6aN2zmut2wKTg4zWLoP9ia4qUY2hBo21odA7P25gqfieFWJMyntaJWmyrd6v3mgjKF5n4d2wcaB3LxkLmd1MoJQ');
      expect(verifySignature(signed.bytes, await Tezos.signer.publicKey(), signed.prefixSig, new Uint8Array([3]))).toBe(true);
      done();
    });

    it('Verify that the local forger can forge the failing_noop operation', async (done) => {
      const failingOperation = await Tezos.prepare.failingNoop({
        arbitrary: "48656C6C6F20576F726C64", 
        basedOnBlock: 'head',
      });
      const forgeable = Tezos.prepare.toForge(failingOperation);
      const forger = new LocalForger(protocol as unknown as ProtocolsHash);
      const forgedBytes = await forger.forge(forgeable);

      const rpcForger = Tezos.getFactory(RpcForger)();
      const rpcForgedBytes = await rpcForger.forge(forgeable);
      expect(forgedBytes).toEqual(rpcForgedBytes);
      const signed = await Tezos.signer.sign(forgedBytes, new Uint8Array([3]));

      expect(verifySignature(signed.bytes, await Tezos.signer.publicKey(), signed.prefixSig, new Uint8Array([3]))).toBe(true);
      expect(async () => {
        await Tezos.rpc.injectOperation(signed.sbytes);
      }).rejects.toThrow(`A failing_noop operation can never be validated.`);
      done();
    });
  });
})
