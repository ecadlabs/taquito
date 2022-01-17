import { ComparableToken, Token, TokenFactory } from './token';
import { BaseTokenSchema } from '../schema/types';
import { UnitValue } from '../taquito-michelson-encoder';

export class UnitToken extends ComparableToken {
  static prim: 'unit' = 'unit';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Encode(args: any[]): any {
    args.pop();
    return { prim: 'Unit' };
  }

  public EncodeObject(_val: any): any {
    return { prim: 'Unit' };
  }

  public Execute(_val: { prim: string }) {
    return UnitValue;
  }

  public ExtractSchema() {
    return UnitToken.prim;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: UnitToken.prim,
      schema: UnitToken.prim,
    };
  }

  compare(_val1: any, _val2: any) {
    return 0;
  }

  ToKey(_val: any) {
    return UnitValue;
  }

  ToBigMapKey(_val: any) {
    return {
      key: { prim: 'Unit' },
      type: { prim: UnitToken.prim },
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (UnitToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
