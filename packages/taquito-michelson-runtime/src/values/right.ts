export class Right {
  static from(value: { prim: "Right", args: any[] }) {
    return new Right(value.args[0]);
  }

  constructor(public value: any) { }
}
