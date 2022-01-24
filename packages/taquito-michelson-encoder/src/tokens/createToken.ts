import { tokens } from './tokens';
import { Token } from './token';
import { PairToken } from './pair';

export class InvalidTokenError implements Error {
  name = 'Invalid token error';
  constructor(public message: string, public data: any) {}
}

export function createToken(val: any, idx: number): Token {
  if (Array.isArray(val)) {
    return new PairToken(val, idx, createToken);
  }

  const t = tokens.find((x) => x.prim === val.prim);
  if (!t) {
    throw new InvalidTokenError('Malformed data expected a value with a valid prim property', val);
  }
  return new t(val, idx, createToken);
}
