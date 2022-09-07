import { OperationContentsAndResultTransferTicket, RpcClient } from "@taquito/rpc";
import { Protocols } from "@taquito/taquito";
import { TransferTicketParams } from "taquito/src/operations/types";
import { CONFIGS } from "./config";
import { InMemorySigner } from "@taquito/signer"
import { ticketsWithdrawal } from "./data/tickets_withdrawal_contract";
import { ticketsDeposit } from "./data/tickets_deposit_contract";
import { HttpBackend } from "@taquito/http-utils";


CONFIGS().forEach(({ lib, setup, protocol, txRollupDepositContract, txRollupWithdrawContract }) => {
  const Tezos = lib;
  const mondaynet = protocol === Protocols.ProtoALpha ? test: test.skip;

  describe(`mondaynet test TransferTicket operation`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    })
    mondaynet("transfer tickets L2 to L1 final step in toru node rollup back to L1", async (done) => {
      try {
        const backend = new HttpBackend
        const checkFinalized = async () => {
          // check L2 finalization
          const req = await backend.createRequest<{metadata: {finalized: boolean}}>({ url: 'http://mondaynet.ecadinfra.com:9999/block/head', method: 'GET'})
          expect(typeof req.metadata.finalized).toEqual('boolean')

          if (req.metadata.finalized) {
            const signer = await InMemorySigner.fromSecretKey(process.env['TX_ROLLUP_TICKETS_OWNER_SECRET'] || '')
            await Tezos.setProvider({signer})
            const estimateParams: TransferTicketParams = {
              ticketContents: { "string": "foobar" },
              ticketTy: { "prim": "string" },
              ticketTicketer: txRollupDepositContract,
              ticketAmount: 1,
              destination: txRollupWithdrawContract,
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
            // break test transfer_ticket
            expect(transferResult.kind).toEqual('');
            const expectedDest = txRollupWithdrawContract
            const expectedTicketer = txRollupDepositContract
            expect(transferResult.destination).toEqual(expectedDest);
            expect(transferResult.ticket_ticketer).toEqual(expectedTicketer);
            expect(transferResult.ticket_amount).toEqual('1');
            expect(transferResult.ticket_ty).toEqual(params.ticketTy);
            expect(transferResult.entrypoint).toEqual('default');
            expect(transferResult.metadata.operation_result.status).toEqual('applied')
            expect(transferResult.metadata.operation_result.balance_updates).toEqual([])
            expect(transferResult.metadata).toBeDefined()
          }
          return setTimeout(() => checkFinalized, 60000)
        }
        await checkFinalized()

      } catch (err) {
        throw err;
      }
      done();
    })
  })
})
