import { CONFIGS } from "../../config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  beforeEach(async () => {
    await setup();
  });

  describe(`Test wallet registerGlobalConstant using: ${rpc}`, () => {
    test('Should register a global constant', async () => {
      const walletOp = await Tezos.wallet.registerGlobalConstant({
        value: {
          prim: 'Pair',
          args: [
            { int: '999' },
            { int: '999' },
          ],
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