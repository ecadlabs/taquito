import { Fa21Mockup } from './mockup';
import { fa21Owner, fa21Recipient } from '../../test-fixtures/fa21/fixture';
import { Schema } from '@taquito/michelson-encoder';
import BigNumber from 'bignumber.js';

describe('FA2.1 public parameters applied by Octez mockup', () => {
  const mockup = new Fa21Mockup();
  beforeAll(async () => {
    await mockup.start();
  });
  afterAll(async () => {
    await mockup.stop();
  });

  it('transfers as owner and preserves total supply', async () => {
    const contract = await mockup.originate();
    await mockup.transfer(
      'bootstrap1',
      contract.methodsObject
        .transfer([{ from_: fa21Owner, txs: [{ to_: fa21Recipient, token_id: 0, amount: 7 }] }])
        .toTransferParams()
    );
    expect(await mockup.view(contract.address, 'get_balance', `Pair "${fa21Owner}" 0`)).toEqual({
      int: '93',
    });
    expect(await mockup.view(contract.address, 'get_balance', `Pair "${fa21Recipient}" 0`)).toEqual(
      { int: '7' }
    );
    expect(await mockup.view(contract.address, 'get_total_supply', '0')).toEqual({ int: '100' });
  });
  it('consumes spender allowance and rejects an overspend without changing state', async () => {
    const contract = await mockup.originate();
    await mockup.transfer(
      'bootstrap1',
      contract.methodsObject
        .approve([
          { owner: fa21Owner, spender: fa21Recipient, token_id: 0, action: { increase: 5 } },
        ])
        .toTransferParams()
    );
    const params = contract.methodsObject
      .transfer([{ from_: fa21Owner, txs: [{ to_: fa21Recipient, token_id: 0, amount: 3 }] }])
      .toTransferParams();
    await mockup.transfer('bootstrap2', params);
    const input = `Pair "${fa21Owner}" "${fa21Recipient}" 0`;
    expect(await mockup.view(contract.address, 'get_allowance', input)).toEqual({ int: '2' });
    await expect(mockup.transfer('bootstrap2', params)).rejects.toThrow(
      'FA2.1_INSUFFICIENT_ALLOWANCE'
    );
    expect(await mockup.view(contract.address, 'get_allowance', input)).toEqual({ int: '2' });
    expect(await mockup.view(contract.address, 'get_balance', `Pair "${fa21Owner}" 0`)).toEqual({
      int: '97',
    });
    expect(await mockup.view(contract.address, 'get_balance', `Pair "${fa21Recipient}" 0`)).toEqual(
      { int: '3' }
    );
  });

  it('retains operator permission independently of allowance and supports revocation', async () => {
    const contract = await mockup.originate();
    const operator = { owner: fa21Owner, operator: fa21Recipient, token_id: 0 };
    await mockup.transfer(
      'bootstrap1',
      contract.methodsObject
        .approve([
          { owner: fa21Owner, spender: fa21Recipient, token_id: 0, action: { increase: 5 } },
        ])
        .toTransferParams()
    );
    await mockup.transfer(
      'bootstrap1',
      contract.methodsObject.update_operators([{ add_operator: operator }]).toTransferParams()
    );
    const params = contract.methodsObject
      .transfer([{ from_: fa21Owner, txs: [{ to_: fa21Recipient, token_id: 0, amount: 7 }] }])
      .toTransferParams();
    await mockup.transfer('bootstrap2', params);
    expect(
      await mockup.view(
        contract.address,
        'get_allowance',
        `Pair "${fa21Owner}" "${fa21Recipient}" 0`
      )
    ).toEqual({ int: '5' });
    await mockup.transfer(
      'bootstrap1',
      contract.methodsObject.update_operators([{ remove_operator: operator }]).toTransferParams()
    );
    expect(
      await mockup.view(contract.address, 'is_operator', `Pair "${fa21Owner}" "${fa21Recipient}" 0`)
    ).toEqual({ prim: 'False' });
    await expect(mockup.transfer('bootstrap2', params)).rejects.toThrow(
      'FA2.1_INSUFFICIENT_ALLOWANCE'
    );
    expect(await mockup.view(contract.address, 'get_balance', `Pair "${fa21Owner}" 0`)).toEqual({
      int: '93',
    });
  });

  it('clamps an allowance decrease to zero', async () => {
    const contract = await mockup.originate();
    for (const action of [{ increase: 5 }, { decrease: 10 }]) {
      await mockup.transfer(
        'bootstrap1',
        contract.methodsObject
          .approve([{ owner: fa21Owner, spender: fa21Recipient, token_id: 0, action }])
          .toTransferParams()
      );
    }
    expect(
      await mockup.view(
        contract.address,
        'get_allowance',
        `Pair "${fa21Owner}" "${fa21Recipient}" 0`
      )
    ).toEqual({ int: '0' });
  });

  it('executes a real ticket export and internal import without changing supply', async () => {
    const contract = await mockup.originate();
    await mockup.transfer(
      'bootstrap1',
      contract.methodsObject
        .export_ticket([
          {
            destination: `${contract.address}%import_ticket`,
            txs: [
              {
                to_: fa21Recipient,
                tickets_to_export: [{ from_: fa21Owner, token_id: 0, amount: 3 }],
              },
            ],
          },
        ])
        .toTransferParams()
    );
    // The recipient can gain this balance only if the internal import actually applied.
    expect(await mockup.view(contract.address, 'get_balance', `Pair "${fa21Owner}" 0`)).toEqual({
      int: '97',
    });
    expect(await mockup.view(contract.address, 'get_balance', `Pair "${fa21Recipient}" 0`)).toEqual(
      { int: '3' }
    );
    expect(await mockup.view(contract.address, 'get_total_supply', '0')).toEqual({ int: '100' });
  });

  it('returns the reference defaults for an unknown token', async () => {
    const contract = await mockup.originate();
    expect(await mockup.view(contract.address, 'is_token', '999')).toEqual({ prim: 'False' });
    expect(await mockup.view(contract.address, 'get_balance', `Pair "${fa21Owner}" 999`)).toEqual({
      int: '0',
    });
    expect(await mockup.view(contract.address, 'get_total_supply', '999')).toEqual({ int: '0' });
  });
  it('decodes actual transfer and balance events from Octez execution', async () => {
    const contract = await mockup.originate();
    const result = await mockup.simulate(
      contract.methodsObject
        .transfer([{ from_: fa21Owner, txs: [{ to_: fa21Recipient, token_id: 0, amount: 7 }] }])
        .toTransferParams()
    );
    const events = result.operations.filter((operation) => operation.kind === 'event');
    const decoded = events.map((event) => {
      if (!event.type || !event.payload) throw new Error('Event has no type or payload');
      return { tag: event.tag, value: new Schema(event.type).Execute(event.payload) };
    });
    expect(decoded).toEqual([
      {
        tag: 'transfer_event',
        value: {
          from_: fa21Owner,
          to_: fa21Recipient,
          token_id: new BigNumber(0),
          amount: new BigNumber(7),
        },
      },
      {
        tag: 'balance_update',
        value: {
          owner: fa21Owner,
          token_id: new BigNumber(0),
          new_balance: new BigNumber(93),
          diff: new BigNumber(-7),
        },
      },
      {
        tag: 'balance_update',
        value: {
          owner: fa21Recipient,
          token_id: new BigNumber(0),
          new_balance: new BigNumber(7),
          diff: new BigNumber(7),
        },
      },
    ]);
  });
});
