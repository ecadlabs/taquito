import { CONFIGS } from '../../config';
import {
  fa21Code,
  fa21InitialStorage,
  fa21Recipient,
  fa21Owner,
} from '../../../test-fixtures/fa21/fixture';
import { Parser } from '@taquito/michel-codec';
import { Schema } from '@taquito/michelson-encoder';
import BigNumber from 'bignumber.js';

CONFIGS().forEach(({ lib: tezos, rpc, setup }) => {
  describe(`FA2.1 pinned reference on ${rpc}`, () => {
    beforeEach(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 10_000_000 });
    });

    it('supports owner transfers, approvals, events and a real ticket round trip', async () => {
      const owner = await tezos.signer.publicKeyHash();
      const recipient = owner === fa21Recipient ? fa21Owner : fa21Recipient;
      const storage = new Parser().parseData(fa21InitialStorage(owner));
      if (!storage) throw new Error('Invalid FA2.1 initial storage');
      const origination = await tezos.contract.originate({ code: fa21Code(), init: storage });
      await origination.confirmation();
      const contract = await origination.contract();
      const transfer = await contract.methodsObject
        .transfer([{ from_: owner, txs: [{ to_: recipient, token_id: 0, amount: 7 }] }])
        .send();
      await transfer.confirmation();
      expect(
        await contract.contractViews
          .get_balance({ owner, token_id: 0 })
          .executeView({ viewCaller: contract.address })
      ).toEqual(new BigNumber(93));
      expect(
        await contract.contractViews
          .get_balance({ owner: recipient, token_id: 0 })
          .executeView({ viewCaller: contract.address })
      ).toEqual(new BigNumber(7));
      const events = transfer.operationResults
        .flatMap((operation) => operation.metadata.internal_operation_results ?? [])
        .filter((operation) => operation.kind === 'event' && operation.tag === 'transfer_event');
      expect(events).toHaveLength(1);
      const event = events[0];
      if (!event.type || !event.payload) throw new Error('Transfer event has no type or payload');
      expect(new Schema(event.type).Execute(event.payload)).toEqual({
        from_: owner,
        to_: recipient,
        token_id: new BigNumber(0),
        amount: new BigNumber(7),
      });

      const approval = await contract.methodsObject
        .approve([{ owner, spender: recipient, token_id: 0, action: { increase: 5 } }])
        .send();
      await approval.confirmation();
      expect(
        await contract.contractViews
          .get_allowance({ owner, spender: recipient, token_id: 0 })
          .executeView({ viewCaller: contract.address })
      ).toEqual(new BigNumber(5));
      const ticket = await contract.methodsObject
        .export_ticket([
          {
            destination: `${contract.address}%import_ticket`,
            txs: [
              { to_: recipient, tickets_to_export: [{ from_: owner, token_id: 0, amount: 3 }] },
            ],
          },
        ])
        .send();
      await ticket.confirmation();
      expect(
        await contract.contractViews
          .get_balance({ owner, token_id: 0 })
          .executeView({ viewCaller: contract.address })
      ).toEqual(new BigNumber(90));
      expect(
        await contract.contractViews
          .get_balance({ owner: recipient, token_id: 0 })
          .executeView({ viewCaller: contract.address })
      ).toEqual(new BigNumber(10));
      expect(
        await contract.contractViews
          .get_total_supply(0)
          .executeView({ viewCaller: contract.address })
      ).toEqual(new BigNumber(100));
    });
  });
});
