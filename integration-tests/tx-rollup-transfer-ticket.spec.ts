import { Protocols } from "@taquito/taquito";
import { RpcContractProvider } from "taquito/src/contract/rpc-contract-provider";
import { TransferTicketOperation } from "taquito/src/operations/transfer-ticket-operation";
import { TransferTicketParams } from "taquito/src/operations/types";
import { CONFIGS } from "./config";


CONFIGS().forEach(({ lib, setup, protocol }) => {
  const Tezos = lib;
  const mondaynet = protocol === Protocols.ProtoALpha ? test : test.skip;

  describe(`mondaynet test TransferTicket operation`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    })
    mondaynet("transfer tickets L2 to L1 final step in toru node rollup back to L1", async (done) => {
      // const transferTicketOperation = new TransferTicketOperation()
      const estimateParams: TransferTicketParams = {
        source: "tz1",

        ticketContents: {},
        ticketTy: {},
        ticketTicketer: '',
        ticketAmount: 2,
        destination: "tz1",
        entrypoint: "default"
      }
      const estimate = await Tezos.estimate.transferTicket(estimateParams)

      const params: TransferTicketParams = {
        ...estimateParams,
        fee: estimate.burnFeeMutez,
        gasLimit: estimate.gasLimit,
        storageLimit: estimate.storageLimit
      }

      const result = await Tezos.contract.transferTicket(params)
    })
  })
})
