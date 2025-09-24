import { CONFIGS } from '../../config';
import { DefaultContractType, TezosToolkit } from '@taquito/taquito';
import { RpcClient, TicketTokenParams } from '@taquito/rpc';
import { ticketsSendTz } from '../../data/code_with_ticket_transfer';

CONFIGS().forEach(({ lib, rpc, setup, createAddress, knownTicketContract }) => {
  const Tezos = lib;
  const client = new RpcClient(rpc);

  let ticketSendContract: DefaultContractType;
  let recipient: TezosToolkit;
  let sender: TezosToolkit;
  let recipientPkh: string;
  let senderPkh: string
  let ticketToken: TicketTokenParams;

  describe(`Transfer tickets between implicit accounts using: ${rpc}`, () => {

    beforeAll(async () => {
      await setup(true);
      try {
        recipient = await createAddress();
        sender = await createAddress();

        recipientPkh = await recipient.signer.publicKeyHash();
        senderPkh = await sender.wallet.pkh();

        const fundSender = await Tezos.contract.transfer({ to: senderPkh, amount: 5 });
        await fundSender.confirmation();

        ticketSendContract = await Tezos.contract.at(knownTicketContract);
        ticketToken = { ticketer: ticketSendContract.address, content_type: { prim: 'string' }, content: { string: 'Ticket' } };

        // Send 3 tickets from the originated contract to sender
        const sendTickets = await ticketSendContract.methodsObject.default([senderPkh, '3']).send()
        await sendTickets.confirmation();

      } catch (error) {
        console.log(error);
      }
    });

    it('should transfer 1 ticket from an implicit account to another implicit account using a Wallet', async () => {
      // Check balances before transferring tickets
      const balanceBefore = await client.getTicketBalance(recipientPkh, ticketToken);
      expect(balanceBefore).toEqual('0');

      const senderBalanceBefore = await client.getTicketBalance(senderPkh, ticketToken);
      expect(senderBalanceBefore).toEqual('3');

      // Transfer 1 ticket from sender to recipient
      const transferTicketOp = await sender.wallet.transferTicket({
        ticketContents: { string: "Ticket" },
        ticketTy: { prim: "string" },
        ticketTicketer: ticketSendContract.address,
        ticketAmount: 1,
        destination: recipientPkh,
        entrypoint: 'default',
      }).send();

      await transferTicketOp.confirmation();

      expect(await transferTicketOp.status()).toEqual('applied');

      // Check balances after transferring tickets
      const balanceAfter = await client.getTicketBalance(recipientPkh, ticketToken);
      expect(balanceAfter).toEqual('1');

      const senderBalanceAfter = await client.getTicketBalance(senderPkh, ticketToken);
      expect(senderBalanceAfter).toEqual('2');
    });
  });
});