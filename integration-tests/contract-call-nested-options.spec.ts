import { DefaultContractType } from "@taquito/taquito";
import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, setup }) => {
  const Tezos = lib;
  describe(`Test nested options contract`, () => {
    let nestedOptionsContract: DefaultContractType;
    beforeAll(async () => {
      await setup();
      const nestedOptionsOriginate = await Tezos.contract.originate({
        code: `{
          parameter
            (option (option nat));
          storage string ;
          code {
            CAR ;
              {
                    IF_SOME
                      {
                        IF_SOME
                          {
                            DROP ;
                            PUSH string "nested1 some";
                          }
                          {
                            PUSH string "nested1 null";
                          }
                      }
                      {
                        PUSH string "nested2 null";
                      }
                  }
            NIL operation ;
            PAIR ;
          }
        }`, storage: 'init'
      });
      await nestedOptionsOriginate.confirmation();
      nestedOptionsContract = await nestedOptionsOriginate.contract();
    })
    it('making contract calls with methodsObject', async () =>{
      const nested2None1 = await nestedOptionsContract.methodsObject.default(null).send();
      await nested2None1.confirmation();
      expect(await nestedOptionsContract.storage()).toEqual('nested2 null');

      const nested2Some1 = await nestedOptionsContract.methodsObject.default([1]).send();
      await nested2Some1.confirmation();
      expect(await nestedOptionsContract.storage()).toEqual('nested1 some');

      const nested2Some2 = await nestedOptionsContract.methodsObject.default({Some: 1}).send();
      await nested2Some2.confirmation();
      expect(await nestedOptionsContract.storage()).toEqual('nested1 some');

      const nested2SomeNone = await nestedOptionsContract.methodsObject.default({Some: null}).send();
      await nested2SomeNone.confirmation();
      expect(await nestedOptionsContract.storage()).toEqual('nested1 null');
    });
  });
});
