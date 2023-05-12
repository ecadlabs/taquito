import { InvalidHexStringError } from '@taquito/core';

export function parseHex(s: string): Uint8Array {
  const res: number[] = [];
  for (let i = 0; i < s.length; i += 2) {
    const ss = s.slice(i, i + 2);
    const x = parseInt(ss, 16);
    if (Number.isNaN(x)) {
      throw new InvalidHexStringError(ss);
    }
    res.push(x);
  }
  return new Uint8Array(res);
}
