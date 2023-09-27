import { InMemorySigner } from "@taquito/signer";
import { CONFIGS, defaultSecretKey } from "./config";
import { OpKind, TezosToolkit } from "@taquito/taquito";
import { verifySignature } from "@taquito/utils";

CONFIGS().forEach(({ setup }) => {
  let rpc = 'https://mainnet-archive.ecadinfra.com/'
  const Tezos = new TezosToolkit(rpc);
  Tezos.setSignerProvider(new InMemorySigner(defaultSecretKey.secret_key));

  describe(`Test failing_noop through wallet api, based on head, and secret_key using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    it('Verify that the wallet.signFailingNoop result is as expected when the block and private key are kept constant', async done => {
      const signed = await Tezos.wallet.signFailingNoop({
        arbitrary: "48656C6C6F20576F726C64", // Hello World
        basedOnBlock: 0,
      });


      expect(signed).toEqual({
        bytes: '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed8424c7ccd00b110000000b48656c6c6f20576f726c64',
        signature: 'spsig1Q6oLPX3mTUpUJJAFKhFdvrc8HwNBABjFpKWLfs91uDtSsLLWgbSLZpZFA7BsTPabYxghXQkKx1ogDTRcRQoKYaFX6aGLt',
        signedContent: {
          branch: 'BLockGenesisGenesisGenesisGenesisGenesisf79b5d1CoW2',
          contents: [{
            kind: OpKind.FAILING_NOOP,
            arbitrary: '48656C6C6F20576F726C64'
          }]
        }
      });
      done();
    });
  });

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
      const pk = await Tezos.wallet.getPK();
      expect(verifySignature(signed.bytes, pk!, signed.signature, new Uint8Array([3]))).toBe(true);
      done();
    });

    it('Verify that the wallet.signFailingNoop signs a text based on head block', async (done) => {
      const signed = await Tezos.wallet.signFailingNoop({
        arbitrary: "48656C6C6F20576F726C64", // Hello World
        basedOnBlock: 'head',
      });
      const pk = await Tezos.wallet.getPK();
      expect(verifySignature(signed.bytes, pk!, signed.signature, new Uint8Array([3]))).toBe(true);
      done();
    });
  });
})
