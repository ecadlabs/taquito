import { CONFIGS } from "./config";
import { MANAGER_LAMBDA } from "@taquito/taquito";
import { genericMultisig } from "./data/multisig";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
 
  describe(`Generic Multisig set delegate: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup(true)
      done()
    })
    test('test manager transfers set delegate scenarios', async () => {

      const account1 = await createAddress();
      const account2 = await createAddress();
      const account3 = await createAddress();

      const pkh = await Tezos.signer.publicKeyHash();
      const op = await Tezos.contract.registerDelegate({});
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)

      const account = await Tezos.rpc.getDelegate(pkh)
      expect(account).toEqual(pkh)  

      // Originate the multisig contract
      const op2 = await Tezos.contract.originate({
        balance: "1",
        code: genericMultisig,
        storage: {
          stored_counter: 0,
          threshold: 2,
          keys: [await account1.signer.publicKey(), await account2.signer.publicKey(), await account3.signer.publicKey()]
        }
      })
      const contract = await op2.contract();
      expect(op.status).toEqual('applied')

      // Utility function that mimics the PAIR operation of michelson
      // file deepcode ignore no-any: any is good enough
      const pair = ({ data, type }: any, value: any) => {
        return {
          data: {
            prim: 'Pair',
            args: [{ "string": value }, data]
          },
          type: {
            prim: 'pair',
            args: [{ prim: "address" }, type]
          }
        }
      }

      // Packing the data that need to be sign by each party of the multi-sig
      // The data passed to this step is specific to this multi-sig implementation
      // file deepcode ignore no-any: any is good enough
      const { packed } = await Tezos.rpc.packData(pair({
        data: {
          prim: 'Pair',
          args: [
            { "int": "0" },
            {
              prim: 'Left',
              args: [MANAGER_LAMBDA.setDelegate(pkh)]
            }
          ]
        } as any,
        type: {
          "prim": "pair",
          "args":
            [{
              "prim": "nat",
              "annots": ["%counter"]
            },
            {
              "prim": "or",
              "args":
                [{
                  "prim": "lambda",
                  "args":
                    [{ "prim": "unit" },
                    {
                      "prim": "list",
                      "args":
                        [{
                          "prim":
                            "operation"
                        }]
                    }],
                  "annots":
                    ["%operation"]
                },
                {
                  "prim": "pair",
                  "args":
                    [{
                      "prim": "nat",
                      "annots":
                        ["%threshold"]
                    },
                    {
                      "prim": "list",
                      "args":
                        [{ "prim": "key" }],
                      "annots":
                        ["%keys"]
                    }],
                  "annots":
                    ["%change_keys"]
                }],
              "annots": [":action"]
            }],
          "annots": [":payload"]
        }
      }, contract.address))

      // Signing the packed
      const signature1 = await account1.signer.sign(packed, new Uint8Array())
      const signature2 = await account2.signer.sign(packed, new Uint8Array())

      const op3 = await contract.methods.main(
        // Counter
        "0",
        // Sub function
        'operation',
        // Action
        MANAGER_LAMBDA.setDelegate(pkh),
        // Signature list
        [signature1.prefixSig, signature2.prefixSig, null]
      ).send()
      await op3.confirmation();
    })
  })
});
