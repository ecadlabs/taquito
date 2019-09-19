import { tokens } from './tokens';
import { Token } from './token';

export function createToken(val: any, idx: number): Token {
  const t = tokens.find(x => x.prim === val.prim);
  if (!t) {
    throw Error(JSON.stringify(val));
  }
  return new t(val, idx, createToken);
}
