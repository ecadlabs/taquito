import { CONFIGS } from "./config";
import { MANAGER_LAMBDA } from "@taquito/taquito";
import { genericMultisig } from "./data/multisig";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;


  describe(`Generic Multisig: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('test manager transfers scenarios for Babylon/005', async (done) => {
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
      const contract = await op.contract();
      expect(op.status).toEqual('applied')

      // Utility function that mimic the PAIR operation of michelson
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

      const op2 = await contract.methods.main(
        // Counter
        "0",
        // Sub function
        'operation',
        // Action
        MANAGER_LAMBDA.transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 500),
        // Signature list
        [signature1.prefixSig, signature2.prefixSig, null]
      ).send()

      await op2.confirmation();
      done();
    })
  })
});
