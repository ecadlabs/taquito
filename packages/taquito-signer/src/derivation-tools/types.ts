export const Hard = 0x80000000;

export interface ExtendedKey {
  readonly chainCode: Uint8Array;
  derive(index: number): ExtendedKey;
  derivePath(path: Iterable<number>): ExtendedKey;
}

export interface ExtendedPrivateKey extends ExtendedKey {
  derive(index: number): ExtendedPrivateKey;
  derivePath(path: number[]): ExtendedPrivateKey;
}

