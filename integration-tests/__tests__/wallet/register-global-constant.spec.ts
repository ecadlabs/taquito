import { InMemorySigner } from "@taquito/signer";
import { CONFIGS } from "../../config";
const crypto = require('crypto');

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test wallet registerGlobalConstant using: ${rpc}`, () => {
    
    const randomAnnots = () => crypto.randomBytes(16).toString('hex');
    let annots = randomAnnots();

    beforeEach(async () => {
      await setup(true);
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