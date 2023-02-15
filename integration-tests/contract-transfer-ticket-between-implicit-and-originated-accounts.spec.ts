import { CONFIGS } from "./config";
import { Protocols, DefaultContractType, TezosToolkit } from "@taquito/taquito";
import { ticketsSendTz, ticketsBagTz, ticketsBlackholeTz } from "./data/code_with_ticket_transfer";
import { RpcClient, TicketTokenParams } from '@taquito/rpc';

CONFIGS().forEach(({ lib, protocol, rpc, setup, createAddress }) => {
  const Tezos1 = lib;
  const client = new RpcClient(rpc);
  const mumbaiAndAlpha = protocol === Protocols.PtMumbaii || protocol === Protocols.ProtoALpha ? test : test.skip;
  let tezos1Pkh: string;
  let Tezos2: TezosToolkit;
  let ticketSendContract: DefaultContractType;
  let ticketBagContract: DefaultContractType;
  let ticketBlackholeContract: DefaultContractType;
  let ticketToken: TicketTokenParams

  describe(`Test contract origination of a simple contract through contract api using: ${rpc}`, () => {

    beforeAll(async (done) => {
      await setup(true);
      try {
        Tezos2 = await createAddress();
        tezos1Pkh = await Tezos1.signer.publicKeyHash();

        const ticketSendOrigination = await Tezos1.contract.originate({ code: ticketsSendTz, storage: null});
        await ticketSendOrigination.confirmation();
        ticketSendContract = await ticketSendOrigination.contract();

        const ticketBagOrigination = await Tezos1.contract.originate({ code: ticketsBagTz, storage: []});
        await ticketBagOrigination.confirmation();
        ticketBagContract = await ticketBagOrigination.contract();

        const ticketBlackholeOrigination = await Tezos1.contract.originate({ code: ticketsBlackholeTz, storage: null});
        await ticketBlackholeOrigination.confirmation();
        ticketBlackholeContract = await ticketBlackholeOrigination.contract();

        ticketToken = { ticketer: ticketSendContract.address, content_type: { prim: 'string' }, content: { string: 'Ticket' } };
      } catch(error){
        console.error(error);
      }
      done();
    });

    describe('transfer tickets between implicit and originated accounts', () => {

        mumbaiAndAlpha('will send 3 tickets from an originated to an implicit account', async (done) => {
            const ticketSendToImplicitOp = await ticketSendContract.methods.default(tezos1Pkh, '3').send();
            await ticketSendToImplicitOp.confirmation();
            expect(ticketSendToImplicitOp.status).toEqual('applied');

            let tezos1TicketBalance = await client.getTicketBalance(tezos1Pkh, ticketToken );
            expect(tezos1TicketBalance).toBe('3');
            done();
        });

        mumbaiAndAlpha('will transfer 1 tickets from an implicit to another implicit account', async(done) => {
          const implicitToImplicitOp = await Tezos1.contract.transferTicket({
              ticketContents: { string: "Ticket" },
              ticketTy: { prim: "string" },
              ticketTicketer: ticketSendContract.address,
              ticketAmount: 1,
              destination: await Tezos2.signer.publicKeyHash(),
              entrypoint: 'default',
          });
          await implicitToImplicitOp.confirmation();
          expect(implicitToImplicitOp.status).toEqual('applied');

          let tezos2TicketBalance = await client.getTicketBalance(await Tezos2.signer.publicKeyHash(), ticketToken );
          expect(tezos2TicketBalance).toBe('1');
          done();
      });

        mumbaiAndAlpha('will transfer 1 ticket from an implicit to an origianted account', async(done) => {
          const implicitToOriginatedOp = await Tezos1.contract.transferTicket({
              ticketContents: { string: "Ticket" },
              ticketTy: { prim: "string" },
              ticketTicketer: ticketSendContract.address,
              ticketAmount: 1,
              destination: ticketBagContract.address,
              entrypoint: 'save',
            });
            await implicitToOriginatedOp.confirmation();
            expect(implicitToOriginatedOp.status).toEqual('applied');

            let contractBagTicketBalance = await client.getTicketBalance(ticketBagContract.address, ticketToken );
            expect(contractBagTicketBalance).toBe('1');
            done();
        });

        mumbaiAndAlpha('will send 1 ticket from an origianted to another originated account to dispose', async (done) => {
          const ticketSendOriginatedOp = await ticketBagContract.methods.send(ticketBlackholeContract.address, '1').send();
          await ticketSendOriginatedOp.confirmation();
          expect(ticketSendOriginatedOp.status).toEqual('applied');

          let contractBagTicketBalance = await client.getTicketBalance(ticketBagContract.address, ticketToken );
          expect(contractBagTicketBalance).toBe('0');
          done();
        });

    });
  });
});
