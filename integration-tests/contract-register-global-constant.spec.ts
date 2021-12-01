import { Protocols } from '@taquito/taquito';
import { CONFIGS } from './config';
import BigNumber from 'bignumber.js';
const crypto = require('crypto');

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const hangzhounetOrHigher = (protocol === Protocols.PtHangz2 || protocol === Protocols.PtIdiaza) ? test : test.skip;

  describe(`Test contract register global constants through contract api using: ${rpc}`, () => {
    const randomAnnots = () => crypto.randomBytes(3).toString('hex');
    let annots = randomAnnots();

    beforeEach(async (done) => {
      await setup(true);
      done();
    });

    hangzhounetOrHigher('Verify contract.registerGlobalConstant to register a Micheline expression to the global table of constants', async (done) => {
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

      done();
    });

    hangzhounetOrHigher(
      'Verify contract.registerGlobalConstant to register a global constant and deploy a contract with the constant',
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

    hangzhounetOrHigher('registers a global constant and deploy a contract with the constant', async (done) => {
      const expression1 = { "prim": "int" }
      const constantHash1 = 'expruu5BTdW7ajqJ9XPTF3kgcV78pRiaBW3Gq31mgp3WSYjjUBYxre';

      const expression2 = {
        "prim": "IF_LEFT",
        "args":
          [[{
            "prim": "IF_LEFT",
            "args":
              [[{ "prim": "SWAP" }, { "prim": "SUB" }],
              [{ "prim": "ADD" }]]
          }],
          [{ "prim": "DROP", "args": [{ "int": "2" }] },
          {
            "prim": "PUSH",
            "args": [{ "prim": "int" }, { "int": "0" }]
          }]]
      };
      const constantHash2 = 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe'

      try {
        // try to register the expression 1
        const op = await Tezos.contract.registerGlobalConstant({
          value: expression1
        });
        await op.confirmation();
        expect(op.globalConstantHash).toEqual(constantHash1);
      } catch (ex: any) {
        // If the expression 1 is already registered, the operation fails
        // We can not register the same constant multiple time
        expect(ex.message).toMatch(/context.storage_error/);
      }

      try {
        // try to register the expression 2
        const op2 = await Tezos.contract.registerGlobalConstant({
          value: expression2
        });
        await op2.confirmation();
        expect(op2.globalConstantHash).toEqual(constantHash2);
      } catch (ex: any) {
        expect(ex.message).toMatch(/context.storage_error/);
      }

      const op = await Tezos.contract.originate({
        code: [
          {
            prim: 'parameter',
            args: [
              {
                prim: 'or',
                args: [
                  {
                    prim: 'or',
                    args: [
                      { prim: 'int', annots: ['%decrement'] },
                      { prim: 'int', annots: ['%increment'] }
                    ]
                  },
                  { prim: 'unit', annots: ['%reset'] }
                ]
              }
            ]
          },
          { prim: 'storage', args: [{ prim: 'constant', args: [{ string: constantHash1 }] }] },
          {
            prim: 'code',
            args: [
              [
                { prim: 'UNPAIR' },
                {
                  prim: 'constant',
                  args: [{ string: constantHash2 }]
                },
                { prim: 'NIL', args: [{ prim: 'operation' }] },
                { prim: 'PAIR' }
              ]
            ]
          }
        ],
        // TODO: Replace `init` property with `storage` when `constant` will be supported in the `Michelson-Encoder` package
        init: { int: '4' }
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const contract = await op.contract();

      const storage: any = await contract.storage();
      expect(storage).toEqual(new BigNumber(4));

      done();
    });
  });
});
