import { InMemorySigner } from "@taquito/signer";
import { CONFIGS } from "../../config";
const crypto = require('crypto');

CONFIGS().forEach(({ lib, rpc, setup }) => {
  let signerAlice = new InMemorySigner('edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq');

  describe(`Test wallet registerGlobalConstant using: ${rpc}`, () => {
    const Tezos = lib
    const randomAnnots = () => crypto.randomBytes(16).toString('hex');
    let annots = randomAnnots();

    beforeAll(async () => {
      setup(true)
      if (rpc.includes('seoul')) {
        Tezos.setProvider({ signer: signerAlice, rpc: 'https://rpc.tzkt.io/seoulnet' })
      } else if (rpc.includes('ghost')) {
        Tezos.setProvider({ signer: signerAlice, rpc: 'https://rpc.tzkt.io/ghostnet' })
      } else if (rpc.includes('shadow')) {
        Tezos.setProvider({ signer: signerAlice, rpc: 'https://rpc.tzkt.io/shadownet' })
      }
    });
    
    test('Should register a global constant', async () => {
      const walletOp = await Tezos.wallet.registerGlobalConstant({
        value: {
          prim: 'Pair',
          args: [
            { int: '999' },
            { int: '999' },
          ],
          annots: [`%${annots}`]
        },
      }).send();

      expect(walletOp.opHash).toBeDefined();
      expect(walletOp.opHash).toMatch(/^[a-zA-Z0-9]{51}$/);

      const conf = await walletOp.confirmation();
      expect(conf?.completed).toBe(true);

      const status = await walletOp.status();
      expect(status).toBe('applied');

      const globalConstantHash = await walletOp.globalConstantHash();
      expect(globalConstantHash).toBeDefined();
      expect(globalConstantHash).toMatch(/^expr[a-zA-Z0-9]{50}$/);
    });
  });
});