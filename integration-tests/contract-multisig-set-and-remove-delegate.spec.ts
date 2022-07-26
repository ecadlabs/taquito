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
      expect(op2.status).toEqual('applied')

      const delegate = await Tezos.rpc.getDelegate(contract.address)
      expect(delegate).toEqual(null)  

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

      const packed = await Tezos.rpc.packData(pair({
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

      const signature1 = await account1.signer.sign(packed.packed, new Uint8Array())
      const signature2 = await account2.signer.sign(packed.packed, new Uint8Array())

      const op3 = await contract.methods.main(
        "0",
        'operation',
        MANAGER_LAMBDA.setDelegate(pkh),
        [signature1.prefixSig, signature2.prefixSig, null]
      ).send()
      await op3.confirmation();

      const check_the_delegate = await Tezos.rpc.getDelegate(contract.address)
      expect(check_the_delegate).toEqual(pkh)  

      const packed2 = await Tezos.rpc.packData(pair({
        data: {
          prim: 'Pair',
          args: [
            { "int": "1" },
            {
              prim: 'Left',
              args: [MANAGER_LAMBDA.removeDelegate()]
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

      const signature3 = await account1.signer.sign(packed2.packed, new Uint8Array())
      const signature4 = await account2.signer.sign(packed2.packed, new Uint8Array())
      
      const op4 = await contract.methods.main(
        "1",
        'operation',
        MANAGER_LAMBDA.removeDelegate(),
        [signature3.prefixSig, signature4.prefixSig, null]
      ).send()

      await op4.confirmation();
      const check_the_delegate_again = await Tezos.rpc.getDelegate(contract.address)
      expect(check_the_delegate_again).toEqual(null)  

    })
  })
});
