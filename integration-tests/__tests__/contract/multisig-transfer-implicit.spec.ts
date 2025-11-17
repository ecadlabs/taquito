import { CONFIGS } from "../../config";
import { MANAGER_LAMBDA } from "@taquito/taquito";
import { genericMultisig } from "../../data/multisig";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;

  describe(`Test multisig contract through contract api for origination, contract interaction, and transfer to an implicit account with: ${rpc}`, () => {
    beforeEach(async () => {
      await setup()
    })
    test('Verify contract.originate, contract interaction, and transfer to an implicit account for a contract with multiple signatures', async () => {
      const account1 = await createAddress();
      const account2 = await createAddress();
      const account3 = await createAddress();

      // Originate the multisig contract
      const op = await Tezos.contract.originate({
        balance: "1",
        code: genericMultisig,
        storage: {
          stored_counter: 0,
          threshold: 2,
          keys: [await account1.signer.publicKey(), await account2.signer.publicKey(), await account3.signer.publicKey()]
        }
      })
      await op.confirmation();
      const contract = await op.contract();
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
              args: [MANAGER_LAMBDA.transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 500)]
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

      const op2 = await contract.methodsObject.main([
        // Counter
        "0",
        // Sub function
        'operation',
        // Action
        MANAGER_LAMBDA.transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 500),
        // Signature list
        [signature1.prefixSig, signature2.prefixSig, null]
      ]).send()

      await op2.confirmation();

      expect(op2.status).toEqual('applied')

    })
  })
});
