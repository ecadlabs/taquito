import { BaseTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory } from './token';

export class OperationToken extends Token {
  static prim: 'operation' = 'operation' as const;

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
    const val = args.pop();
    return { string: val };
  }

  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    if (semantic && semantic[OperationToken.prim]) {
      return semantic[OperationToken.prim](val);
    }
    return { string: val };
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: OperationToken.prim,
      schema: OperationToken.prim,
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (OperationToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
