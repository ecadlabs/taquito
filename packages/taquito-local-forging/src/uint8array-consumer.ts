export class Uint8ArrayConsumer {
  constructor(private readonly arr: Uint8Array, private offset: number = 0) { }

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
