import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";
import { UnitValue } from '../packages/taquito-michelson-encoder/src/taquito-michelson-encoder';

CONFIGS().forEach(({lib, setup, protocol}) => {
  const tezos = lib;
  const jakartanet = (protocol === Protocols.PtJakart2) ? test : test.skip;

  describe(`contract originations and method calls to test the type of tx_rollup_l2_address`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    })
    jakartanet(`Originate a contract with a hex string matching the type tx_rollup_l2_address in initial storage tz4`, async (done) => {
      const op = await tezos.contract.originate({
        code: `
        parameter (pair tx_rollup_l2_address tx_rollup_l2_address);
        storage (option (tx_rollup_l2_address));
        code {CAR; UNPAIR; ADD; SOME; NIL operation; PAIR}
        `,
        storage: "tz4VHgLiRx5ZZjwU2QaybHc11EMJk3NcyvVc"
      })
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const contract = await op.contract();
      expect(await contract.storage()).toEqual(UnitValue)

      // const methodCall = await contract.methods.default('01', 1).send();
      // await methodCall.confirmation();

      // expect(methodCall.hash).toBeDefined();
      // expect(methodCall.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      // expect(await contract.storage()).toEqual('0200000000000000000000000000000000000000000000000000000000000000')
      done();
    })
  })
})
