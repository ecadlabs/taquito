import BigNumber from 'bignumber.js';
import { script } from '../data/contract_with_views';
import { rpcContractResponse } from '../data/sample20';
import { InvalidScriptError, ParameterEncodingError } from '../src/schema/errors';
import { ViewSchema } from '../src/schema/view-schema';

describe('ViewSchema test', () => {
  const viewIsTwenty = [
    { string: 'is_twenty' },
    { prim: 'pair', args: [{ prim: 'nat' }, { prim: 'address' }] },
    { prim: 'nat' },
    [
      { prim: 'CAR' },
      { prim: 'DUP' },
      { prim: 'CAR' },
      { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '20' }] },
      { prim: 'COMPARE' },
      { prim: 'EQ' },
      {
        prim: 'IF',
        args: [
          [{ prim: 'CAR' }],
          [
            { prim: 'DUP' },
            { prim: 'CDR' },
            { prim: 'SWAP' },
            { prim: 'VIEW', args: [{ string: 'succ' }, { prim: 'nat' }] },
            [{ prim: 'IF_NONE', args: [[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]], []] }],
          ],
        ],
      },
    ],
  ];
  const viewSchema = new ViewSchema(viewIsTwenty);
  it('Should extract args schema properly', () => {
    const argsSchema = viewSchema.extractArgsSchema();
    expect(argsSchema).toEqual({
      __michelsonType: 'pair',
      schema: {
        0: { __michelsonType: 'nat', schema: 'nat' },
        1: { __michelsonType: 'address', schema: 'address' },
      },
    });
  });

  it('Should extract result schema properly', () => {
    const argsSchema = viewSchema.extractResultSchema();
    expect(argsSchema).toEqual({ __michelsonType: 'nat', schema: 'nat' });
  });

  it('Should encode view args properly', () => {
    const result = viewSchema.encodeViewArgs({
      0: '12',
      1: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
    });
    expect(result).toEqual({
      prim: 'Pair',
      args: [{ int: '12' }, { string: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb' }],
    });
  });

  it('Should throw if view parameter is invalid', () => {
    expect(() =>
      viewSchema.encodeViewArgs({
        0: '12',
        1: 'notAnAddress',
      })
    ).toThrowError(ParameterEncodingError);
  });

  it('Should decode view result properly', () => {
    const result = viewSchema.decodeViewResult({ int: '23' });
    expect(result).toEqual(new BigNumber(23));
  });

  it('Should parse view elements properly', () => {
    expect(viewSchema.viewName).toEqual('is_twenty');
    expect(viewSchema.viewArgsType).toEqual(viewIsTwenty[1]);
    expect(viewSchema.viewReturnType).toEqual(viewIsTwenty[2]);
    expect(viewSchema.instructions).toEqual(viewIsTwenty[3]);
  });

  it('Should throw if view does not have the right length of elements', () => {
    expect(
      () => new ViewSchema([{ string: 'add' }, { prim: 'nat' }, { prim: 'nat' }])
    ).toThrowError(InvalidScriptError);
  });
});

describe('ViewSchema.fromRPCResponse test', () => {
  it('Should create a ViewSchema instance for each view in the contract code', () => {
    const viewSchemas = ViewSchema.fromRPCResponse({ script });
    expect(viewSchemas.length).toEqual(7);
    expect(viewSchemas[0].viewName).toEqual('add');
    expect(viewSchemas[1].viewName).toEqual('fib');
    expect(viewSchemas[2].viewName).toEqual('id');
    expect(viewSchemas[3].viewName).toEqual('is_twenty');
    expect(viewSchemas[4].viewName).toEqual('step_constants');
    expect(viewSchemas[5].viewName).toEqual('succ');
    expect(viewSchemas[6].viewName).toEqual('test_failwith');
  });

  it('Should return an empty array if there is no view in the contract code', () => {
    const viewSchemas = ViewSchema.fromRPCResponse({ script: rpcContractResponse.script });
    expect(viewSchemas.length).toEqual(0);
  });

  it('Should throw InvalidScriptError if view does not have the right length of elements', () => {
    expect(() =>
      ViewSchema.fromRPCResponse({
        script: {
          code: [
            {
              prim: 'view',
              args: [{ string: 'add' }, { prim: 'nat' }, { prim: 'nat' }],
            },
          ],
          storage: {},
        },
      })
    ).toThrowError(InvalidScriptError);
  });
});
