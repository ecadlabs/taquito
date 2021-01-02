export type Key = "string"; // TODO: can it also be bytes?

export class Address {
  static from(value: { [key in Key]?: string }) {
    return new Address(value.string);
  }

  private constructor(private value?: string) {
    if (typeof value === "undefined") {
      throw new Error();
    }
  }

  public toString() {
    return { string: this.value! }
  }

  public toMichelson() {
    return this.toString();
  }
}
