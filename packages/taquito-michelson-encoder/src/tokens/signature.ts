import { ComparableToken, Token, TokenFactory, TokenValidationError } from './token';
import { validateSignature, ValidationResult } from '@taquito/utils';
import { BaseTokenSchema } from '../schema/types';

export class SignatureValidationError extends TokenValidationError {
  name = 'SignatureValidationError';
  constructor(public value: any, public token: SignatureToken, message: string) {
    super(value, token, message);
  }
}

export class SignatureToken extends ComparableToken {
  static prim: 'signature' = 'signature';

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

  private isValid(value: any): SignatureValidationError | null {
    if (validateSignature(value) !== ValidationResult.VALID) {
      return new SignatureValidationError(value, this, 'Signature is not valid');
    }

    return null;
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

  public ExtractSchema() {
    return SignatureToken.prim;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: SignatureToken.prim,
      schema: SignatureToken.prim,
    };
  }

  ToKey(val: any) {
    return this.Execute(val);
  }

  ToBigMapKey(val: string) {
    return {
      key: { string: val },
      type: { prim: SignatureToken.prim },
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (SignatureToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
