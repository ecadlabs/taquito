import { InvalidHexStringError } from '@taquito/core';
import { OperationDecodingError } from './errors';

export class Uint8ArrayConsumer {
  static fromHexString(hex: string) {
    const lowHex = hex.toLowerCase();
    if (/^(([a-f]|\d){2})*$/.test(lowHex)) {
      const arr = new Uint8Array(
        (lowHex.match(/([a-z]|\d){2}/g) || []).map((byte) => parseInt(byte, 16))
      );
      return new Uint8ArrayConsumer(arr);
    } else {
      throw new InvalidHexStringError(lowHex);
    }
  }

  constructor(private readonly arr: Uint8Array, private offset: number = 0) {
    if (!Number.isInteger(offset) || offset < 0 || offset > arr.length) {
      throw new OperationDecodingError(
        `Invalid offset ${offset} for buffer of length ${arr.length}`
      );
    }
  }

  public consume(count: number): Uint8Array {
    if (!Number.isInteger(count) || count < 0) {
      throw new OperationDecodingError(`Invalid byte count to consume: ${count}`);
    }
    if (this.offset + count > this.arr.length) {
      throw new OperationDecodingError(
        `Cannot consume ${count} bytes from offset ${this.offset} (available: ${this.length()})`
      );
    }
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

  public slice(start: number, end?: number) {
    return new Uint8ArrayConsumer(this.arr.subarray(this.offset).slice(start, end));
  }
}
