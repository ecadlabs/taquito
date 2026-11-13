import {
  Parser,
  assertMichelsonData,
  assertMichelsonType,
  type MichelsonData,
} from '@taquito/michel-codec';

// The data validator assumes literal values already have the correct JavaScript types.
// Parse JSON first so malformed strings, integers, bytes and option arities cannot bypass it.
export function parseData(value: object): MichelsonData {
  const expression = new Parser({ expandMacros: false }).parseJSON(value);
  if (assertMichelsonData(expression)) return expression;
  throw new Error('Expected Michelson data');
}

/** Validate contract values as addresses offline. The target contract type still needs simulation. */
export function offlineValidationType(
  type: import('@taquito/michel-codec').MichelsonType
): import('@taquito/michel-codec').MichelsonType {
  const map = (
    value: import('@taquito/michel-codec').Expr
  ): import('@taquito/michel-codec').Expr => {
    if (Array.isArray(value)) return value.map(map);
    if ('prim' in value) {
      // Lambda signatures describe code stack types, not contract-valued data literals.
      if (value.prim === 'lambda') return value;
      if (value.prim === 'contract') return { prim: 'address', annots: value.annots };
      return { ...value, args: value.args?.map(map) };
    }
    return value;
  };
  const result = map(type);
  if (assertMichelsonType(result)) return result;
  throw new Error('Expected a Michelson type');
}
