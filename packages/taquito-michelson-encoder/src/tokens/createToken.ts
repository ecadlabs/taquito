import { tokens } from './tokens';
import { Token } from './token';
import { PairToken } from './pair';
import { TaquitoError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates a script having an invalid type or it being unsupported by the Michelson Encoder. Note some protocol changes might affect this, we encourage users to open an issue so we can look into implementing support for said types.
 */
export class InvalidTokenError extends TaquitoError {
  name = 'Invalid token error';
  constructor(
    public message: string,
    public data: any
  ) {
    super(message);
  }
}

/**
 *
 * @description Create a token from a value
 * @throws {@link InvalidTokenError} If the value passed is not supported by the Michelson Encoder
 */
export function createToken(
  val: any,
  idx: number,
  parentTokenType?: 'Or' | 'Pair' | 'Other' | undefined
): Token {
  if (Array.isArray(val)) {
    return new PairToken(val, idx, createToken, parentTokenType);
  }

  const t = tokens.find((x) => x.prim === val.prim);
  if (!t) {
    throw new InvalidTokenError(
      `Malformed data: ${JSON.stringify(val)}. Expected a value with a valid prim property`,
      val
    );
  }
  return new t(val, idx, createToken, parentTokenType);
}
