import { Token, TokenFactory, Semantic } from './token';

export class ListToken extends Token {
  static prim = 'list';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Encode(args: any[]): any {
    const val = args.pop();
    const schema = this.createToken(this.val.args[0], 0);
    return {
      prim: 'list',
      args: val.reduce((prev: any, current: any) => {
        return [...prev, schema.Encode(current)];
      }, []),
    };
  }

  public Execute(val: any, semantics?: Semantic) {
    const schema = this.createToken(this.val.args[0], 0);
    return val.reduce((prev: any, current: any) => {
      return [...prev, schema.Execute(current, semantics)];
    }, []);
  }

  public EncodeObject(args: any): any {
    const schema = this.createToken(this.val.args[0], 0);
    return args.reduce((prev: any, current: any) => {
      return [...prev, schema.EncodeObject(current)];
    }, []);
  }

  public ExtractSchema() {
    return ListToken.prim;
  }
}
