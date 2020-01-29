export class Uint8ArrayConsumer {
  static fromHexString(hex: string) {
    const lowHex = hex.toLowerCase();
    if (/^(([a-f]|\d){2})*$/.test(lowHex)) {
      const arr = new Uint8Array(
        (lowHex.match(/([a-z]|\d){2}/g) || []).map(byte => parseInt(byte, 16))
      );
      return new Uint8ArrayConsumer(arr);
    } else {
      throw new Error('Invalid hex string');
    }
  }

  constructor(private readonly arr: Uint8Array, private offset: number = 0) {}

  public consume(count: number): Uint8Array {
    const subArr = this.arr.subarray(this.offset, this.offset + count);
    this.offset += count;
    return subArr;
  }

  public get(idx: number) {
    return this.arr[this.offset + idx];
  }

  public length() {
    return this.arr.length - this.offset;
  }
}
