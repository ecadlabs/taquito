import { Token, TokenFactory, ComparableToken, TokenValidationError } from './token';
import { validateChain, ValidationResult } from '@taquito/utils';

export class ChainIDValidationError extends TokenValidationError {
  name = 'ChainIDValidationError';
  constructor(public value: any, public token: ChainIDToken, message: string) {
    super(value, token, message);
  }
}

export class ChainIDToken extends ComparableToken {
  static prim = 'chain_id';

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

  public ExtractSchema() {
    return ChainIDToken.prim;
  }

  public Encode(args: any[]): any {
    const val = args.pop();

    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return { string: val };
  }

  public EncodeObject(val: any): any {
    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return { string: val };
  }

  // tslint:disable-next-line: variable-name
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
