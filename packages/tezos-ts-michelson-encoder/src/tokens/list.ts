import { Token, TokenFactory } from './token';

export class ListToken extends Token {
  static prim = 'list';

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
      prim: 'list',
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
    return ListToken.prim;
  }
}
