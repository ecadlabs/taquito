import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";
import { UnitValue } from '../packages/taquito-michelson-encoder/src/taquito-michelson-encoder';

CONFIGS().forEach(({lib, setup, protocol}) => {
  const tezos = lib;
  const jakartanet = (protocol === Protocols.PtJakart2) ? test : test.skip;
  const mondaynet = protocol === Protocols.ProtoALpha ? test : test.skip;

  describe(`jakarta contract originations and method calls to test the type of tx_rollup_l2_address`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    })
    jakartanet(`Originate a contract with a hex string type tz1 & tz4 in initial storage tz4 & string`, async (done) => {
      const op = await tezos.contract.originate({
        code: `
        parameter (pair address tx_rollup_l2_address string);
        storage (unit);
        code {
          # cast the address to contract type
          CAR;
          UNPAIR;
          CONTRACT %deposit (pair (ticket (pair unit string)) tx_rollup_l2_address);

          IF_SOME {
            SWAP;
            UNPAIR; SWAP;

            # create a ticket
            PUSH nat 10;
            SWAP;
            UNIT;
            PAIR;
            TICKET;
            PAIR;

            # amount for transfering
            PUSH mutez 0;
            SWAP;

            # deposit
            TRANSFER_TOKENS;

            DIP { NIL operation };
            CONS;

            DIP { PUSH unit Unit };
            PAIR;
          }
          { FAIL ; }
        }
        `,
        storage: "Unit"
      })
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract();
      const TOCHANGE_why_is_this_symbol = await contract.storage()
      expect(JSON.stringify(TOCHANGE_why_is_this_symbol)).toEqual(JSON.stringify(UnitValue))
      const methodCall = await contract.methods.default('txr1di1E5BgY6QSPx61eE62P7KW93ckGwH2e7', 'tz4VHgLiRx5ZZjwU2QaybHc11EMJk3NcyvVc', '1').send();
      await methodCall.confirmation();

      expect(methodCall.hash).toBeDefined();
      expect(methodCall.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(JSON.stringify(await contract.storage())).toEqual(JSON.stringify(UnitValue))
      done();
    })

    jakartanet(`jakarta contract with params and storage as tx_rollup_l2_address`, async (done) => {
      const op = await tezos.contract.originate({
        code: [{"prim":"parameter","args":[{"prim":"tx_rollup_l2_address"}]},{"prim":"storage","args":[{"prim":"tx_rollup_l2_address"}]},{"prim":"code","args":[[{"prim":"CAR"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"}]]}],
        storage: "tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce8"
      })
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract();
      const pkh = await contract.storage()
      expect(pkh).toEqual("tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce8");

      const methodCall = await contract.methods.default(pkh).send();
      await methodCall.confirmation();
      expect(methodCall.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    })
  })
  describe(`mondaynet contract originations and method calls to test the type of tx_rollup_l2_address`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    })
    // comment until possible to generate txr1 in test itself
    // mondaynet(`mondaynet Originate a contract with a hex string type tz1 & tz4 in initial storage tz4 & string`, async (done) => {
    //   const op = await tezos.contract.originate({
    //     code: `
    //     parameter (pair address tx_rollup_l2_address string);
    //     storage (unit);
    //     code {
    //       # cast the address to contract type
    //       CAR;
    //       UNPAIR;
    //       CONTRACT %deposit (pair (ticket (pair unit string)) tx_rollup_l2_address);

    //       IF_SOME {
    //         SWAP;
    //         UNPAIR; SWAP;

    //         # create a ticket
    //         PUSH nat 10;
    //         SWAP;
    //         UNIT;
    //         PAIR;
    //         TICKET;
    //         PAIR;

    //         # amount for transfering
    //         PUSH mutez 0;
    //         SWAP;

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
    //     storage: "Unit"
    //   })
    //   await op.confirmation();
    //   expect(op.hash).toBeDefined();
    //   expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

    //   const contract = await op.contract();
    //   const symbolReturn = await contract.storage()
    //   expect(JSON.stringify(symbolReturn)).toEqual(JSON.stringify(UnitValue))
    //   const methodCall = await contract.methods.default('txr1kXEJHuy7xiJ2fTPWxf2yoNY5EZ6hzQXLM', 'tz4RVDZotqkdHGckMkZLB2mUkqAk8BRqz6Jn', '1').send();
    //   await methodCall.confirmation();

    //   expect(methodCall.hash).toBeDefined();
    //   expect(methodCall.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
    //   expect(JSON.stringify(await contract.storage())).toEqual(JSON.stringify(UnitValue))
    //   done();
    // })

    mondaynet(`mondaynet contract with params and storage as tx_rollup_l2_address`, async (done) => {
      const op = await tezos.contract.originate({
        code: [{"prim":"parameter","args":[{"prim":"tx_rollup_l2_address"}]},{"prim":"storage","args":[{"prim":"tx_rollup_l2_address"}]},{"prim":"code","args":[[{"prim":"CAR"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"}]]}],
        storage: "tz4RVDZotqkdHGckMkZLB2mUkqAk8BRqz6Jn"
      })
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract();
      const pkh = await contract.storage()
      expect(pkh).toEqual("tz4RVDZotqkdHGckMkZLB2mUkqAk8BRqz6Jn");

      const methodCall = await contract.methods.default(pkh).send();
      await methodCall.confirmation();
      expect(methodCall.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    })
  })

})
