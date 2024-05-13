import { CONFIGS } from "../../config";
import { OpKind, TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import { verifySignature } from "@taquito/utils";

CONFIGS().forEach(({ lib, setup, rpc }) => {
  describe(`Test failing_noop through wallet api using: ${rpc}`, () => {
    let Tezos = lib;

    beforeAll(async () => {
      setup(true)
      if (rpc.includes('parisnet')) {
        Tezos.setProvider({ rpc: 'https://rpc.tzkt.io/parisnet' }); // public archive node to fetch genesis block
      } else if (rpc.includes('ghostnet')) {
        Tezos.setProvider({ rpc: 'https://rpc.tzkt.io/ghostnet' }); // public archive node to fetch genesis block
      }
    });

    it('Verify that the wallet.failingNoop signs a text on the genesis block', async () => {
      const signed = await Tezos.wallet.signFailingNoop({
        arbitrary: "48656C6C6F20576F726C64", // Hello World
        basedOnBlock: 0,
      });
      const pk = await Tezos.wallet.pk();
      expect(verifySignature(signed.bytes, pk!, signed.signature, new Uint8Array([3]))).toBe(true);
    });

    it('Verify that the wallet.failingNoop signs a text base on head block', async () => {
      const signed = await Tezos.wallet.signFailingNoop({
        arbitrary: "48656C6C6F20576F726C64", // Hello World
        basedOnBlock: 'head',
      });
      const pk = await Tezos.wallet.pk();
      expect(verifySignature(signed.bytes, pk!, signed.signature, new Uint8Array([3]))).toBe(true);
    });
  });

  describe(`Test failing_noop through wallet api, based on genesis and secret_key on mainnet`, () => {
    let Mainnet: TezosToolkit;

    beforeAll(async () => {
      Mainnet = new TezosToolkit('https://rpc.tzkt.io/mainnet'); // public archive node to fetch genesis block
      Mainnet.setSignerProvider(new InMemorySigner('edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq')); // alice's secret key
    });

    it('Verify that the wallet.failingNoop result is as expected when the block and secret key are kept constant', async () => {
      const signed = await Mainnet.wallet.signFailingNoop({
        arbitrary: "48656C6C6F20576F726C64", // Hello World
        basedOnBlock: 0,
      });
      expect(signed).toEqual({
        bytes: '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed8424c7ccd00b110000000b48656c6c6f20576f726c64',
        signature: 'edsigtYFkwJo6uVY5J1KnjnMFsj3Y1MKD9vqmtX2sF2u6yyg6fLJWn6Cy1CcbwJAkmEq5Zxvh49uYkMtHHGbeBm8LqBJg2uYjqG',
        signedContent: {
          branch: 'BLockGenesisGenesisGenesisGenesisGenesisf79b5d1CoW2',
          contents: [{
            kind: OpKind.FAILING_NOOP,
            arbitrary: '48656C6C6F20576F726C64'
          }]
        }
      });
    });
  });
})
