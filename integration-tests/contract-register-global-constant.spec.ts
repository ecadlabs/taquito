import { Protocols } from '@taquito/taquito';
import { CONFIGS } from './config';
const crypto = require('crypto');

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  
  describe(`Register global constants using: ${rpc}`, () => {
    const randomAnnots = () => crypto.randomBytes(3).toString('hex');
    let annots = randomAnnots();

    beforeEach(async (done) => {
      await setup(true);
      done();
    });

    test('Verify contract.registerGlobalConstant to register a Micheline expression to the global table of constants', async (done) => {
      // We use a randomized annots in the Micheline expression because an expression can only be registered once.
      const op = await Tezos.contract.registerGlobalConstant({
        value: {
          prim: 'list',
          args: [{ prim: 'nat' }],
          annots: [`%${annots}`]
        },
        fee: 500,
        storageLimit: 90,
        gasLimit: 1400
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.fee).toEqual(500);
      expect(op.storageLimit).toEqual(90);
      expect(op.gasLimit).toEqual(1400);
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(op.status).toEqual('applied');
      expect(Number(op.consumedGas)).toBeGreaterThan(0);

      done();
    });

    test(
      'Verify contract.registerGlobalConstant to register a global constant with auto-estimation of the fee, storage limit and gas limit',
      async (done) => {
        const op = await Tezos.contract.registerGlobalConstant({
          value: {
            prim: 'list',
            args: [{ prim: 'nat' }],
            annots: [`%${randomAnnots()}`]
          }
        });
        await op.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        expect(op.status).toEqual('applied');

        done();
      }
    );

  });
});
