import { OperationContentsAndResultTransferTicket } from "@taquito/rpc";
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
        const signer = await InMemorySigner.fromSecretKey("edsk2vSxPjmjjvSGoXQUTgUiRw91Ws9FzFF9V63CZNgdF1a6UWDvWZ")
        await Tezos.setProvider({signer})
        const estimateParams: TransferTicketParams = {
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

        const res = await Tezos.contract.transferTicket(params);
        const results = res.results
        const transferResult = results[0] as OperationContentsAndResultTransferTicket

        expect(estimate.burnFeeMutez).toBeLessThan(Number.POSITIVE_INFINITY)
        expect(estimate.gasLimit).toBeLessThan(Number.POSITIVE_INFINITY)
        expect(estimate.storageLimit).toBeLessThan(Number.POSITIVE_INFINITY)


        expect(transferResult.kind).toEqual('transfer_ticket');
        expect(transferResult.destination).toEqual(txRollupWithdrawContract);
        expect(transferResult.ticket_ticketer).toEqual(txRollupDepositContract);
        expect(transferResult.ticket_amount).toBeLessThan(Number.POSITIVE_INFINITY);
        expect(transferResult.ticket_ty).toEqual(params.ticketTy);
        expect(transferResult.entrypoint).toEqual('default');
        expect(transferResult.metadata.operation_result.status).toEqual('applied')
        expect(transferResult.metadata.operation_result.balance_updates).toEqual([])
        expect(transferResult.metadata).toBeDefined()
      // }
      done();
    })
  })
})
