/**
 *
 * @param leaves nodes in the tree that we would like to make pairs from
 * @returns a paired/chunked array: [a, b, c, d] => [[a, b], [c, d]]
 */
export function pairNodes<T>(leaves: T[]): (T | undefined)[][] {
  const pairs: (T | undefined)[][] = new Array(Math.ceil(leaves.length / 2));

  for (let i = 0; i < leaves.length / 2; i++) {
    pairs[i] = leaves.slice(i * 2, i * 2 + 2);
  }

  return pairs;
}

/**
 * @description helper function to assist in Lazy initializing an object
 */
export class Lazy<T> {
  private isInitialized = false;

  private value?: T = undefined;

  constructor(private readonly init: () => Promise<T>) {}

  // initializes the lazily initiated object
  public async get(): Promise<T> {
    if (!this.isInitialized) {
      this.value = await this.init();
      this.isInitialized = true;
    }

    return this.value as T;
  }
}

/**
 *
 * @param hex hexadecimal string we would like to swap
 * @returns a hexadecimal string with swapped endians
 */
export const changeEndianness = (hex: string): string => {
  if (hex.length % 2 != 0) {
    hex = '0' + hex;
  }
  const bytes = hex.match(/.{2}/g) || [];

  return bytes.reverse().join('');
};
