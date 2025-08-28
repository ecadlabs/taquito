import { CONFIGS } from "../../../config";
import { DefaultContractType, TezosToolkit } from "@taquito/taquito";
import { ticketsBagTz, ticketsBlackholeTz } from "../../../data/code_with_ticket_transfer";
import { RpcClient, TicketTokenParams } from '@taquito/rpc';

CONFIGS().forEach(({ lib, rpc, setup, createAddress, knownTicketContract }) => {
  const Tezos1 = lib;
  const client = new RpcClient(rpc);

  let tezos1Pkh: string;
  let tezos2Pkh: string;
  let Tezos2: TezosToolkit;
  let ticketSendContract: DefaultContractType;
  let ticketBagContract: DefaultContractType;
  let ticketBlackholeContract: DefaultContractType;
  let ticketToken: TicketTokenParams

  describe(`Test transfer ticket between implicit and originated accounts, in ${rpc}`, () => {

    beforeAll(async () => {
      await setup(true);
      try {
        Tezos2 = await createAddress();
        tezos1Pkh = await Tezos1.signer.publicKeyHash();
        tezos2Pkh = await Tezos2.signer.publicKeyHash();

        // ticketSend contract has one default entrypoint which accepts an address to issue tickets to
        ticketSendContract = await Tezos1.contract.at(knownTicketContract);

        // ticketBag contract has two entrypoints, one is "save" to receive tickets and the other is "send" to send tickets out
        const ticketBagOrigination = await Tezos1.contract.originate({ code: ticketsBagTz, storage: [] });
        await ticketBagOrigination.confirmation();
        ticketBagContract = await ticketBagOrigination.contract();

        // ticketBlackhole contract has one default entrypoint to accept tickets and dispose them
        const ticketBlackholeOrigination = await Tezos1.contract.originate({ code: ticketsBlackholeTz, storage: null });
        await ticketBlackholeOrigination.confirmation();
        ticketBlackholeContract = await ticketBlackholeOrigination.contract();

        ticketToken = { ticketer: ticketSendContract.address, content_type: { prim: 'string' }, content: { string: 'Ticket' } };
      } catch (error) {
        console.error(error);
      }
    });

    it('will send 3 tickets from an originated to an implicit account', async () => {
      const ticketSendToImplicitOp = await ticketSendContract.methods.default(tezos1Pkh, '3').send();
      await ticketSendToImplicitOp.confirmation();
      expect(ticketSendToImplicitOp.status).toEqual('applied');

      let tezos1TicketBalance = await client.getTicketBalance(tezos1Pkh, ticketToken);
      expect(tezos1TicketBalance).toBeGreaterThanOrEqual(Number('3'));
    });

    it('will transfer 1 tickets from an implicit to another implicit account', async () => {
      let tezos2TicketBalanceBefore = await client.getTicketBalance(tezos2Pkh, ticketToken);
      expect(tezos2TicketBalanceBefore).toBe('0');

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

      let tezos1TicketBalanceAfter = await client.getTicketBalance(await Tezos1.signer.publicKeyHash(), ticketToken);
      expect(tezos1TicketBalanceAfter).toBeGreaterThanOrEqual(Number('2'));
      let tezos2TicketBalanceAfter = await client.getTicketBalance(await Tezos2.signer.publicKeyHash(), ticketToken);
      expect(tezos2TicketBalanceAfter).toBe('1');
    });

    it('will transfer 1 ticket from an implicit to an originated account', async () => {
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

      let contractBagTicketBalance = await client.getTicketBalance(ticketBagContract.address, ticketToken);
      expect(contractBagTicketBalance).toBe('1');
    });

    it('will send 1 ticket from an origianted to another originated account to dispose', async () => {
      const ticketSendOriginatedOp = await ticketBagContract.methods.send(ticketBlackholeContract.address).send();
      await ticketSendOriginatedOp.confirmation();
      expect(ticketSendOriginatedOp.status).toEqual('applied');

      let contractBagTicketBalance = await client.getTicketBalance(ticketBagContract.address, ticketToken);
      expect(contractBagTicketBalance).toBe('0');
    });
  });
});
