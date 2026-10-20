import type { MichelsonV1Expression, MichelsonV1ExpressionExtended } from '@taquito/rpc';
import type { FieldNumberingStrategy, TokenSchema } from '@taquito/michelson-encoder';

interface Mapping {
  value: Record<string, unknown>;
  schema: TokenSchema;
}

interface CompatibilityCase {
  name: string;
  type: MichelsonV1ExpressionExtended;
  micheline: MichelsonV1Expression;
  encoded: MichelsonV1Expression;
  expected: Record<FieldNumberingStrategy, Mapping>;
  packed: string;
}

const stringSchema = { __michelsonType: 'string', schema: 'string' } as const;
const nestedType: MichelsonV1ExpressionExtended = {
  prim: 'pair',
  args: [
    { prim: 'string' },
    {
      prim: 'or',
      args: [
        { prim: 'pair', args: [{ prim: 'string' }, { prim: 'string' }] },
        { prim: 'pair', args: [{ prim: 'string' }, { prim: 'string' }] },
      ],
    },
  ],
};
const nestedLeft: MichelsonV1Expression = {
  prim: 'Pair',
  args: [
    { string: 'h' },
    { prim: 'Left', args: [{ prim: 'Pair', args: [{ string: 'a' }, { string: 'b' }] }] },
  ],
};
const nestedRight: MichelsonV1Expression = {
  prim: 'Pair',
  args: [
    { string: 'h' },
    { prim: 'Right', args: [{ prim: 'Pair', args: [{ string: 'a' }, { string: 'b' }] }] },
  ],
};
const mixedCombSchema: TokenSchema = {
  __michelsonType: 'pair',
  schema: { first: stringSchema, second: stringSchema, '2': stringSchema, '3': stringSchema },
};
const namedType: MichelsonV1ExpressionExtended = {
  prim: 'pair',
  args: [
    { prim: 'string', annots: ['%header'] },
    {
      prim: 'or',
      annots: ['%choice'],
      args: [
        {
          prim: 'pair',
          annots: ['%transfer'],
          args: [{ prim: 'string', annots: ['%label'] }, { prim: 'string' }],
        },
        { prim: 'string', annots: ['%cancel'] },
      ],
    },
  ],
};
const namedLegacySchema: TokenSchema = {
  __michelsonType: 'pair',
  schema: {
    header: stringSchema,
    choice: {
      __michelsonType: 'or',
      schema: {
        transfer: { __michelsonType: 'pair', schema: { label: stringSchema, '2': stringSchema } },
        cancel: stringSchema,
      },
    },
  },
};
const namedResetSchema: TokenSchema = {
  __michelsonType: 'pair',
  schema: {
    header: stringSchema,
    choice: {
      __michelsonType: 'or',
      schema: {
        transfer: { __michelsonType: 'pair', schema: { label: stringSchema, '1': stringSchema } },
        cancel: stringSchema,
      },
    },
  },
};
const namedRight: MichelsonV1Expression = {
  prim: 'Pair',
  args: [{ string: 'h' }, { prim: 'Right', args: [{ string: 'x' }] }],
};
const nestedLegacySchema: TokenSchema = {
  __michelsonType: 'pair',
  schema: {
    '0': stringSchema,
    '1': {
      __michelsonType: 'or',
      schema: {
        '1': { __michelsonType: 'pair', schema: { '1': stringSchema, '2': stringSchema } },
        '2': { __michelsonType: 'pair', schema: { '2': stringSchema, '3': stringSchema } },
      },
    },
  },
};
const nestedResetSchema: TokenSchema = {
  __michelsonType: 'pair',
  schema: {
    '0': stringSchema,
    '1': {
      __michelsonType: 'or',
      schema: {
        '0': { __michelsonType: 'pair', schema: { '0': stringSchema, '1': stringSchema } },
        '1': { __michelsonType: 'pair', schema: { '0': stringSchema, '1': stringSchema } },
      },
    },
  },
};

function mappings(legacy: Mapping, reset: Mapping): Record<FieldNumberingStrategy, Mapping> {
  return { Legacy: legacy, ResetFieldNumbersInNestedObjects: reset, Latest: reset };
}

// Mapping fixtures characterize main at 8c340feb277cd6db9518835f8b05909d90989589.
// PACK bytes were independently checked with Octez 25.3, Tallinn mockup.
// Latest currently matches the reset strategy; a future policy change needs explicit review.
export const pairOrCompatibilityCases: CompatibilityCase[] = [
  {
    name: 'pair inside Left inside pair',
    type: nestedType,
    micheline: nestedLeft,
    encoded: nestedLeft,
    expected: mappings(
      { value: { '0': 'h', '1': { '1': { '1': 'a', '2': 'b' } } }, schema: nestedLegacySchema },
      { value: { '0': 'h', '1': { '0': { '0': 'a', '1': 'b' } } }, schema: nestedResetSchema }
    ),
    packed: '05070701000000016805050707010000000161010000000162',
  },
  {
    name: 'pair inside Right inside pair',
    type: nestedType,
    micheline: nestedRight,
    encoded: nestedRight,
    expected: mappings(
      { value: { '0': 'h', '1': { '2': { '2': 'a', '3': 'b' } } }, schema: nestedLegacySchema },
      { value: { '0': 'h', '1': { '1': { '0': 'a', '1': 'b' } } }, schema: nestedResetSchema }
    ),
    packed: '05070701000000016805080707010000000161010000000162',
  },
  {
    name: 'named fields still count toward unnamed comb-pair positions',
    type: {
      prim: 'pair',
      args: [
        { prim: 'string', annots: ['%first'] },
        { prim: 'string', annots: ['%second'] },
        { prim: 'string' },
        { prim: 'string' },
      ],
    },
    micheline: {
      prim: 'Pair',
      args: [{ string: 'a' }, { string: 'b' }, { string: 'c' }, { string: 'd' }],
    },
    encoded: {
      prim: 'Pair',
      args: [
        { string: 'a' },
        {
          prim: 'Pair',
          args: [{ string: 'b' }, { prim: 'Pair', args: [{ string: 'c' }, { string: 'd' }] }],
        },
      ],
    },
    expected: mappings(
      { value: { first: 'a', second: 'b', '2': 'c', '3': 'd' }, schema: mixedCombSchema },
      { value: { first: 'a', second: 'b', '2': 'c', '3': 'd' }, schema: mixedCombSchema }
    ),
    packed: '05070701000000016107070100000001620707010000000163010000000164',
  },
  {
    name: 'named pair branch with a named and an unnamed child',
    type: namedType,
    micheline: nestedLeft,
    encoded: nestedLeft,
    expected: mappings(
      {
        value: { header: 'h', choice: { transfer: { label: 'a', '2': 'b' } } },
        schema: namedLegacySchema,
      },
      {
        value: { header: 'h', choice: { transfer: { label: 'a', '1': 'b' } } },
        schema: namedResetSchema,
      }
    ),
    packed: '05070701000000016805050707010000000161010000000162',
  },
  {
    name: 'named scalar branch opposite the mixed pair',
    type: namedType,
    micheline: namedRight,
    encoded: namedRight,
    expected: mappings(
      { value: { header: 'h', choice: { cancel: 'x' } }, schema: namedLegacySchema },
      { value: { header: 'h', choice: { cancel: 'x' } }, schema: namedResetSchema }
    ),
    packed: '0507070100000001680508010000000178',
  },
];
