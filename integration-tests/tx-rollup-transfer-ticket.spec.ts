import { OperationContentsAndResultTransferTicket } from "@taquito/rpc";
import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";
import { InMemorySigner } from "@taquito/signer"
import { HttpBackend } from "@taquito/http-utils";


CONFIGS().forEach(({ lib, setup, txRollupDepositContract, txRollupWithdrawContract, txRollupRpc }) => {
  const Tezos = lib;
  const withTORU = txRollupRpc !== '' ? test : test.skip;

  describe(`mondaynet test TransferTicket operation`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    })
    withTORU("transfer tickets L2 to L1 final step in toru node rollup back to L1", async (done) => {
        const backend = new HttpBackend()
        const checkFinalized = async () => {
          // check L2 finalization
          const req = await backend.createRequest<{metadata: {finalized: boolean}}>({ url: txRollupRpc, method: 'GET'})
          expect(typeof req.metadata.finalized).toEqual('boolean')

          if (req.metadata.finalized) {
            const signer = await InMemorySigner.fromSecretKey(process.env['TX_ROLLUP_TICKETS_OWNER_SECRET'] || '')
            await Tezos.setProvider({signer})
            const estimateParams = {
              ticketContents: { "string": "foobar" },
              ticketTy: { "prim": "string" },
              ticketTicketer: txRollupDepositContract,
              ticketAmount: 1,
              destination: txRollupWithdrawContract,
              entrypoint: "default"
            };
            const estimate = await Tezos.estimate.transferTicket(estimateParams);

            const params = {
              ...estimateParams,
              fee: estimate.burnFeeMutez,
              gasLimit: estimate.gasLimit,
              storageLimit: estimate.storageLimit
            };

            const op = await Tezos.contract.transferTicket(params);
            // currently times out if confirmations is awaited
            // await op.confirmation()
            const results = op.results
            const transferResult = results[1] as OperationContentsAndResultTransferTicket

            expect(estimate.burnFeeMutez).toBeLessThan(Number.POSITIVE_INFINITY)
            expect(estimate.gasLimit).toBeLessThan(Number.POSITIVE_INFINITY)
            expect(estimate.storageLimit).toBeLessThan(Number.POSITIVE_INFINITY)
            expect(transferResult.kind).toEqual('transfer_ticket');
            expect(transferResult.destination).toEqual(txRollupWithdrawContract);
            expect(transferResult.ticket_ticketer).toEqual(txRollupDepositContract);
            expect(transferResult.ticket_amount).toEqual('1');
            expect(transferResult.ticket_ty).toEqual(params.ticketTy);
            expect(transferResult.entrypoint).toEqual('default');
            expect(transferResult.metadata.operation_result.status).toEqual('applied')
            expect(transferResult.metadata.operation_result.balance_updates).toEqual([])
            expect(transferResult.metadata).toBeDefined()
            expect(op.status).toEqual('applied')
          } else {
            await setTimeout(() => checkFinalized, 60000)
          }
        }
        await checkFinalized()

      done();
    })
  })
})
