import { tokens } from './tokens';
import { Token } from './token';
import { PairToken } from './pair';

/**
 *  @category Error
 *  @description Error that indicates a script having an invalid type or it being unsupported by the Michelson Encoder. Note some protocol changes might affect this, we encourage users to open an issue so we can look into implementing support for said types.
 */
export class InvalidTokenError extends Error {
  name = 'Invalid token error';
  constructor(public message: string, public data: any) {
    super(message);
  }
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
