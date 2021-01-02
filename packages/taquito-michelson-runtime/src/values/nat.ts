export type Key = "string" | "int";

export class Nat {
  static from(value: { [key in Key]?: string }) {
    return new Nat(value.int ?? value.string);
  }

  private constructor(private value?: string) {
    if (typeof value === "undefined") {
      throw new Error();
    }
  }

  public toString() {
    return { string: this.value! }
  }

  public toInt() {
    return { int: this.value! }
  }
}
