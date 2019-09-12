import { Token, TokenFactory } from './token';

export class OperationToken extends Token {
  static prim = 'operation';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any): { [key: string]: any } {
    return val.string;
  }

  public Encode(...args: any[]): any {
    return { string: args[0] };
  }

  public ExtractSchema() {
    return OperationToken.prim;
  }
}
