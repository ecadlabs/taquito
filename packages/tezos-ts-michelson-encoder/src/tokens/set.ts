import { Token, TokenFactory } from './token';

export class SetToken extends Token {
  static prim = 'set';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Encode(...args: any[]): any {
    const schema = this.createToken(this.val.args[0], 0);
    return {
      prim: 'set',
      args: args.reduce((prev: any, current: any) => {
        return [...prev, schema.Encode(current)];
      }, []),
    };
  }

  public Execute(val: any) {
    const schema = this.createToken(this.val.args[0], 0);
    return val.reduce((prev: any, current: any) => {
      return [...prev, schema.Execute(current)];
    }, []);
  }

  public ExtractSchema() {
    return SetToken.prim;
  }
}
