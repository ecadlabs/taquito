import { Protocols } from "@taquito/taquito";
import { TransferTicketParams } from "taquito/src/operations/types";
import { CONFIGS } from "./config";


CONFIGS().forEach(({ lib, setup, protocol, txRollupDepositContract, txRollupWithdrawContract }) => {
  const Tezos = lib;
  const mondaynet = protocol === Protocols.ProtoALpha ? test : test.skip;

  describe(`mondaynet test TransferTicket operation`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    })
    mondaynet("transfer tickets L2 to L1 final step in toru node rollup back to L1", async (done) => {
      // if (txRollupDepositContract && txRollupWithdrawContract) {

        const estimateParams: TransferTicketParams = {
          source: "tz1",

          ticketContents: { "string": "foobar" },
          ticketTy: { "prim": "string" },
          ticketTicketer: txRollupDepositContract || "KT1ENUSEPM5vEoLCB4FnNz5ndCTGFi1Qc314",
          ticketAmount: 1,
          destination: txRollupWithdrawContract || "KT1VwmpwP1CjxB5oyBv3WRQctpKF4S5DQw8v",
          entrypoint: "default"
        };
        const estimate = await Tezos.estimate.transferTicket(estimateParams);

        const params: TransferTicketParams = {
          ...estimateParams,
          fee: estimate.burnFeeMutez,
          gasLimit: estimate.gasLimit,
          storageLimit: estimate.storageLimit
        };

        const result = await Tezos.contract.transferTicket(params);

        expect(result).toEqual({})
      // }
      done();
    })
  })
})
