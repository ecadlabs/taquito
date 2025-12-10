import { CONFIGS } from "../../config";
import { MichelsonMap } from "@taquito/taquito";
import { collection_code } from "../../data/collection_contract";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination with collection through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    it('Verify wallet.originate for a contract with set, list, map and then exercise all collections', async () => {
      const addr = await Tezos.signer.publicKeyHash();

      const initialStorage = {
        set1: ['2', '1', '3'],
        list1: ['1'],
        map1: MichelsonMap.fromLiteral({ "2": "1", "1": "1" })
      }

      const op = await Tezos.wallet.originate({
        balance: "1",
        code: collection_code,
        storage: initialStorage
      }).send();
      await op.confirmation()
      expect(op.opHash).toBeDefined();

      const contract = await op.contract()
      // file deepcode ignore no-any: any is good enough
      const storage: any = await contract.storage()
      expect(storage['set1'].map((x: any) => x.toString())).toEqual(['1', '2', '3'])
      expect(storage['list1'].map((x: any) => x.toString())).toEqual(['1'])
      expect(storage['map1'].get('1').toString()).toEqual('1')

      const setOp = await contract.methodsObject['setSet'](['2']).send()
      await setOp.confirmation();

      const listOp = await contract.methodsObject['setList'](['2']).send()
      await listOp.confirmation();

      const mapOp = await contract.methodsObject['setMap'](MichelsonMap.fromLiteral({ "2": "2" })).send()
      await mapOp.confirmation();

    });
  });
})
