import { InMemorySigner } from "@taquito/signer";
import { CONFIGS, defaultSecretKey, isSandbox } from "./config";
import { OpKind, Protocols, TezosToolkit } from "@taquito/taquito";
import { verifySignature } from "@taquito/utils";
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ rpc, setup, protocol }) => {

  const Tezos = new TezosToolkit(rpc);
  Tezos.setSignerProvider(new InMemorySigner(defaultSecretKey.secret_key));
  const nairobinet = !isSandbox({ rpc }) && protocol === Protocols.PtNairobi ? it : it.skip;

  _describe(`Test failing_noop through contract api, based on head, and secret_key using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
    });

    nairobinet('Verify that the contract.failingNoop result is as expected when the block and secret key are kept constant', async () => {
      const signed = await Tezos.contract.failingNoop({
        arbitrary: "48656C6C6F20576F726C64", // Hello World
        basedOnBlock: 0,
      });
      // This test is skipped from flextesa because the genesis block hash is not guaranteed to stay the same
      // The signature will change if the hash of the genesis block changes (maybe when switching to a testnet based on a new protocol).
      // Also it depends on the signing key.
      // So if any of them changes, the expected values need to be adjusted
      expect(signed).toEqual({
        bytes: 'df2788eed43ab680c8a2b79969ce4de93b9768cd2786a85ebdfba90ca7612638110000000b48656c6c6f20576f726c64',
        signature: 'spsig1QVVCiQ6aN2zmut2wKTg4zWLoP9ia4qUY2hBo21odA7P25gqfieFWJMyntaJWmyrd6v3mgjKF5n4d2wcaB3LxkLmd1MoJQ',
        signedContent: {
          branch: 'BMQZWtQjSpyJZBVHbABEmVP9VG8yEZPZ3wNftwZdXt6A33ZYatj',
          contents: [{
            kind: OpKind.FAILING_NOOP,
            arbitrary: '48656C6C6F20576F726C64'
          }]
        }
      });
    });
  });

  _describe(`Test failing_noop through contract api using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
    });

    _it('Verify that the contract.failingNoop signs a text on the genesis block', async () => {
      const signed = await Tezos.contract.failingNoop({
        arbitrary: "48656C6C6F20576F726C64", // Hello World
        basedOnBlock: 0,
      });
      const pk = await Tezos.wallet.getPK();
      expect(verifySignature(signed.bytes, pk!, signed.signature, new Uint8Array([3]))).toBe(true);
    });

    _it('Verify that the contract.failingNoop signs a text base on head block', async () => {
      const signed = await Tezos.contract.failingNoop({
        arbitrary: "48656C6C6F20576F726C64", // Hello World
        basedOnBlock: 'head',
      });
      const pk = await Tezos.wallet.getPK();
      expect(verifySignature(signed.bytes, pk!, signed.signature, new Uint8Array([3]))).toBe(true);
    });
  });
})
