import { Token, TokenFactory } from './token';

export class MapToken extends Token {
  static prim = 'map';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  get ValueSchema() {
    return this.createToken(this.val.args![1], 0);
  }

  get KeySchema(): Token & { ToKey: (x: any) => string } {
    return this.createToken(this.val.args[0], 0) as any;
  }

  public Execute(val: any[]): { [key: string]: any } {
    return val.reduce((prev, current) => {
      return {
        ...prev,
        [this.KeySchema.ToKey(current.args[0])]: this.ValueSchema.Execute(current.args[1]),
      };
    }, {});
  }

  public Encode(...args: any[]): any {
    const obj = args[0][0];

    return {
      prim: 'map',
      args: Object.keys(obj).map(key => {
        return [this.KeySchema.Encode([key]), this.ValueSchema.Encode([obj[key]])];
      }),
    };
  }

  public ExtractSchema() {
    return {
      [this.KeySchema.ExtractSchema()]: this.ValueSchema.ExtractSchema(),
    };
  }
}
