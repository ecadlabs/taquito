import { ParameterValidationError } from '@taquito/core';
import {
  Parser,
  assertMichelsonData,
  type Expr,
  type MichelsonData,
} from '@taquito/michel-codec';

// The pinned kernel's binary Micheline decoder accepts printable ASCII and LF in strings.
export function assertKernelStrings(expression: Expr): void {
  if (Array.isArray(expression)) {
    expression.forEach(assertKernelStrings);
  } else if ('prim' in expression) {
    expression.args?.forEach(assertKernelStrings);
  } else if ('string' in expression && /[^ -~\n]/u.test(expression.string)) {
    throw new ParameterValidationError('Michelson strings must contain printable ASCII or line feeds');
  }
}

// The data validator assumes literal values already have the correct JavaScript types.
// Parse JSON first so malformed strings, integers, bytes and option arities cannot bypass it.
export function parseData(value: object): MichelsonData {
  const expression = new Parser({ expandMacros: false }).parseJSON(value);
  if (assertMichelsonData(expression)) return expression;
  throw new Error('Expected Michelson data');
}
