export class Pair {
  static from(value: { prim: "Pair", args: any[] }) {
    return new Pair(value.args[0], value.args[1]);
  }

  constructor(public left: any, public right: any) { }
}
