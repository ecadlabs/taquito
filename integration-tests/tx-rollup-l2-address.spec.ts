import { TxRollupL2AddressToken } from './../packages/taquito-michelson-encoder/src/tokens/comparable/tx_rollup_l2_address';
import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";
import { UnitValue } from '../packages/taquito-michelson-encoder/src/taquito-michelson-encoder';

CONFIGS().forEach(({lib, setup, protocol}) => {
  const tezos = lib;
  const jakartanet = (protocol === Protocols.PtJakart2) ? test : test.skip;
  const txRollupToken = new TxRollupL2AddressToken({prim: "l2_address", args: [], annots: []}, 0, null as any)

  describe(`contract originations and method calls to test the type of tx_rollup_l2_address`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    })
    // jakartanet(`Originate a contract with a hex string matching the type tx_rollup_l2_address in initial storage tz4`, async (done) => {
    //   const op = await tezos.contract.originate({
    //     code: `
    //     parameter (pair address tx_rollup_l2_address);
    //     storage (unit);
    //     code {
    //       # cast the address to contract type
    //       CAR;
    //       UNPAIR;
    //       CONTRACT %deposit (pair (ticket unit) tx_rollup_l2_address);

    //       IF_SOME {
    //         SWAP;

    //         # amount for transferring
    //         PUSH mutez 0;
    //         SWAP;

    //         # create a ticket
    //         PUSH nat 10;
    //         PUSH unit Unit;
    //         TICKET;

    //         PAIR ;

    //         # deposit
    //         TRANSFER_TOKENS;

    //         DIP { NIL operation };
    //         CONS;

    //         DIP { PUSH unit Unit };
    //         PAIR;
    //       }
    //       { FAIL ; }
    //     }
    //     `,
    //     storage: "tz4VHgLiRx5ZZjwU2QaybHc11EMJk3NcyvVc"
    //   })
    //   await op.confirmation();
    //   expect(op.hash).toBeDefined();
    //   expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

    //   const contract = await op.contract();
    //   expect(JSON.stringify(await contract.storage())).toEqual(JSON.stringify(UnitValue))

    //   const methodCall = await contract.methods.default('01', 1).send();
    //   await methodCall.confirmation();

    //   // expect(methodCall.hash).toBeDefined();
    //   // expect(methodCall.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
    //   // expect(await contract.storage()).toEqual('0200000000000000000000000000000000000000000000000000000000000000')
    //   done();
    // })

    jakartanet(`contract with params and storage as tx_rollup_l2_address`, async (done) => {
      const op = await tezos.contract.originate({
        code: [{"prim":"parameter","args":[{"prim":"tx_rollup_l2_address"}]},{"prim":"storage","args":[{"prim":"tx_rollup_l2_address"}]},{"prim":"code","args":[[{"prim":"CAR"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"}]]}],
        storage: "tz4VHgLiRx5ZZjwU2QaybHc11EMJk3NcyvVc"
      })
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract();
      expect(await contract.storage()).toEqual("tz4VHgLiRx5ZZjwU2QaybHc11EMJk3NcyvVc");

      // const methodCall = await contract.methods.default('01', 1).send();
      // await methodCall.confirmation();
      done();
    })
  })
})
