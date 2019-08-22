import { Token, TokenFactory } from './token';

export class ContractToken extends Token {
  static prim = 'contract';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute() {
    return '';
  }

  public ExtractSchema() {
    return ContractToken.prim;
  }
}
