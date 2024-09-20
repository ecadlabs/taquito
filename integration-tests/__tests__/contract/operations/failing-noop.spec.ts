import { CONFIGS } from "../../../config";
import { OpKind, TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import { verifySignature } from "@taquito/utils";

CONFIGS().forEach(({ setup, rpc, lib }) => {
  let signerAlice = new InMemorySigner('edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq')

  describe(`Test failing_noop through wallet api using: ${rpc}`, () => {
    const Tezos = lib
    beforeAll(async () => {
      setup(true)
      if (rpc.includes('paris')) {
        Tezos.setProvider({signer: signerAlice, rpc: 'https://rpc.tzkt.io/parisnet'})
      } else if (rpc.includes('ghost')) {
        Tezos.setProvider({signer: signerAlice, rpc: 'https://rpc.tzkt.io/ghostnet'})
      }
    });

    it('Verify that the contract.failingNoop signs a text on the genesis block', async () => {
      const signed = await Tezos.contract.failingNoop({
        arbitrary: "48656C6C6F20576F726C64", // Hello World
        basedOnBlock: 0,
      });
      console.log(signed)
      const pk = await Tezos.signer.publicKey();
      console.log(pk)
      expect(verifySignature(signed.bytes, pk!, signed.signature, new Uint8Array([3]))).toBe(true);
    });

    it('Verify that the contract.failingNoop signs a text base on head block', async () => {
      const signed = await Tezos.contract.failingNoop({
        arbitrary: "48656C6C6F20576F726C64", // Hello World
        basedOnBlock: 'head',
      });
      const pk = await Tezos.signer.publicKey();
      expect(verifySignature(signed.bytes, pk!, signed.signature, new Uint8Array([3]))).toBe(true);
    });
  });

  describe(`Test failing_noop through contract api, based on genesis and secret_key on mainnet`, () => {
    let Mainnet: TezosToolkit;

    beforeAll(async () => {
      Mainnet = new TezosToolkit('https://rpc.tzkt.io/mainnet'); // public archive node to fetch genesis block
      Mainnet.setSignerProvider(signerAlice); // alice's secret key
    });

    it('Verify that the contract.failingNoop result is as expected when the block and secret key are kept constant', async () => {
      const signed = await Mainnet.contract.failingNoop({
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
