import { Context, ContractAbstraction } from '../../src/taquito';
import { Parser } from '@taquito/michel-codec';
import { MichelCodecPacker } from '../../src/packer/michel-codec-packer';
import { readFileSync } from 'node:fs';
import {
  fa21Address,
  fa21Code,
  fa21Entrypoints,
  fa21InitialStorage,
  fa21Owner,
  fa21Recipient,
} from '../../../../test-fixtures/fa21/fixture';

describe('FA2.1 reference through public contract methods', () => {
  function contract() {
    const context = new Context('https://rpc.invalid');
    const storage = new Parser().parseData(fa21InitialStorage());
    if (!storage) throw new Error('Invalid fixture storage');
    return new ContractAbstraction(
      fa21Address,
      { code: fa21Code(), storage },
      context.contract,
      context.contract,
      fa21Entrypoints,
      context.rpc,
      context.readProvider
    );
  }

  it('encodes the retained FA2 transfer entrypoint', () => {
    const parameters = contract()
      .methodsObject.transfer([
        { from_: fa21Owner, txs: [{ to_: fa21Recipient, token_id: 0, amount: 7 }] },
      ])
      .toTransferParams();
    expect(parameters).toMatchObject({ to: fa21Address, amount: 0, mutez: false });
    expect(parameters.parameter).toEqual({
      entrypoint: 'transfer',
      value: [
        {
          prim: 'Pair',
          args: [
            { string: fa21Owner },
            [
              {
                prim: 'Pair',
                args: [
                  { string: fa21Recipient },
                  { prim: 'Pair', args: [{ int: '0' }, { int: '7' }] },
                ],
              },
            ],
          ],
        },
      ],
    });
  });
  it.each([
    { name: 'approveIncrease', action: { increase: 5 }, variant: 'Left', amount: '5' },
    { name: 'approveDecrease', action: { decrease: 10 }, variant: 'Right', amount: '10' },
  ])('encodes and packs $name against independent Octez bytes', async (entry) => {
    const parameters = contract()
      .methodsObject.approve([
        { owner: fa21Owner, spender: fa21Recipient, token_id: 0, action: entry.action },
      ])
      .toTransferParams();
    expect(parameters.parameter).toEqual({
      entrypoint: 'approve',
      value: [
        {
          prim: 'Pair',
          args: [
            { string: fa21Owner },
            {
              prim: 'Pair',
              args: [
                { string: fa21Recipient },
                {
                  prim: 'Pair',
                  args: [{ int: '0' }, { prim: entry.variant, args: [{ int: entry.amount }] }],
                },
              ],
            },
          ],
        },
      ],
    });
    if (!parameters.parameter) throw new Error('Expected an approve parameter');
    const fixtures: Record<string, { packed: string }> = JSON.parse(
      readFileSync(new URL('../../../../test-fixtures/fa21/packed.json', import.meta.url), 'utf8')
    );
    expect(
      await new MichelCodecPacker().packData({
        data: parameters.parameter.value,
        type: fa21Entrypoints.entrypoints.approve,
      })
    ).toEqual({ packed: fixtures[entry.name].packed });
  });

  it('encodes the ticket destination and nested export quantities', () => {
    const parameters = contract()
      .methodsObject.export_ticket([
        {
          destination: `${fa21Address}%import_ticket`,
          txs: [
            {
              to_: fa21Recipient,
              tickets_to_export: [{ from_: fa21Owner, token_id: 0, amount: 3 }],
            },
          ],
        },
      ])
      .toTransferParams();
    expect(parameters.parameter).toEqual({
      entrypoint: 'export_ticket',
      value: [
        {
          prim: 'Pair',
          args: [
            { prim: 'Some', args: [{ string: `${fa21Address}%import_ticket` }] },
            [
              {
                prim: 'Pair',
                args: [
                  { string: fa21Recipient },
                  [
                    {
                      prim: 'Pair',
                      args: [
                        { string: fa21Owner },
                        { prim: 'Pair', args: [{ int: '0' }, { int: '3' }] },
                      ],
                    },
                  ],
                ],
              },
            ],
          ],
        },
      ],
    });
  });

  it('retains the FA2 operator variants and exposes all reference views', () => {
    const target = contract();
    expect(
      target.methodsObject
        .update_operators([
          { add_operator: { owner: fa21Owner, operator: fa21Recipient, token_id: 0 } },
          { remove_operator: { owner: fa21Owner, operator: fa21Recipient, token_id: 0 } },
        ])
        .toTransferParams().parameter
    ).toEqual({
      entrypoint: 'update_operators',
      value: [
        {
          prim: 'Left',
          args: [
            {
              prim: 'Pair',
              args: [
                { string: fa21Owner },
                { prim: 'Pair', args: [{ string: fa21Recipient }, { int: '0' }] },
              ],
            },
          ],
        },
        {
          prim: 'Right',
          args: [
            {
              prim: 'Pair',
              args: [
                { string: fa21Owner },
                { prim: 'Pair', args: [{ string: fa21Recipient }, { int: '0' }] },
              ],
            },
          ],
        },
      ],
    });
    expect(Object.keys(target.contractViews).sort()).toEqual([
      'get_allowance',
      'get_balance',
      'get_token_metadata',
      'get_total_supply',
      'is_operator',
      'is_token',
    ]);
  });
});
