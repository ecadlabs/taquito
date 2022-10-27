import {
  Token,
  TokenFactory,
  ComparableToken,
  TokenValidationError,
  SemanticEncoding,
} from './token';
import { validateChain, ValidationResult } from '@taquito/utils';
import { BaseTokenSchema } from '../schema/types';

export class ChainIDValidationError extends TokenValidationError {
  name = 'ChainIDValidationError';
  constructor(public value: any, public token: ChainIDToken, message: string) {
    super(value, token, message);
  }
}

export class ChainIDToken extends ComparableToken {
  static prim: 'chain_id' = 'chain_id' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  private isValid(value: any): ChainIDValidationError | null {
    if (validateChain(value) !== ValidationResult.VALID) {
      return new ChainIDValidationError(value, this, 'ChainID is not valid');
    }

    return null;
  }

  public Execute(val: any): string {
    return val[Object.keys(val)[0]];
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  public ExtractSchema() {
    return ChainIDToken.prim;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: ChainIDToken.prim,
      schema: ChainIDToken.prim,
    };
  }

  public Encode(args: any[]): any {
    const val = args.pop();

    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return { string: val };
  }

  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    if (semantic && semantic[ChainIDToken.prim]) {
      return semantic[ChainIDToken.prim](val);
    }

    return { string: val };
  }

  public ToKey({ string }: any) {
    return string;
  }

  public ToBigMapKey(val: string) {
    return {
      key: { string: val },
      type: { prim: ChainIDToken.prim },
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (ChainIDToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
