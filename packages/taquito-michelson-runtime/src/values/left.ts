export class Left {
  static from(value: { prim: "Left", args: any[] }) {
    return new Left(value.args[0]);
  }

  constructor(public value: any) { }
}
