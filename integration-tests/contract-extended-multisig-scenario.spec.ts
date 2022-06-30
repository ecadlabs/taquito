/**
 * CB: I would like to have your opinion about the design and eventual missing features:
      - There is currently no way to add a new manager. Would it be okay to have an entrypoint that any existing manager can call to add a new manager 
        or have an entrypoint that needs approval before being called?
      - When a manager wants a proposal to be approved by the other managers, he sends a lambda that returns a list of operations to the propose entrypoint 
        with an expiry date
      - The other managers can call the approve entrypoint to, well, approve the proposal
      - When the required number of approvals is reached (this number is set in the storage and can be modified), the proposal becomes available for execution
      - One of the managers calls the execute entrypoint that will run the lambda from the proposal
This design seems to me more convenient as it lets the managers come and approve the proposal whenever they have time (within the limit of the expiry date) 
instead of sending all the signatures to the contract and process them (which also increases drastically the gas cost). 
*/

import { CONFIGS } from "./config";
import { MANAGER_LAMBDA } from "@taquito/taquito";
import { extended_multisig } from "./data/extended_multisig";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
  const test = require('jest-retries')

  describe(`Extended Multisig: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup()
      done()
    })
    test('test manager transfers scenarios', 2, async (done: () => void) => {
      const account1 = await createAddress();
      const account2 = await createAddress();
      const account3 = await createAddress();

      // Originate the multisig contract
      const op = await Tezos.contract.originate({
        balance: "1",
        code: extended_multisig,
        storage: {
          stored_counter: 0,
          threshold: 2,
          keys: [await account1.signer.publicKey(), await account2.signer.publicKey(), await account3.signer.publicKey()]
        }
      })
      const contract = await op.contract();
      expect(op.status).toEqual('applied')
      console.log("contract address : "+contract.address)
     

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

      console.log("signature1 : "+JSON.stringify(signature1))
      console.log("signature2 : "+JSON.stringify(signature2))

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
