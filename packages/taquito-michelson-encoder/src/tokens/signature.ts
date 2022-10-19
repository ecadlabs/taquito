import {
  ComparableToken,
  SemanticEncoding,
  Token,
  TokenFactory,
  TokenValidationError,
} from './token';
import { validateSignature, ValidationResult } from '@taquito/utils';
import { BaseTokenSchema } from '../schema/types';

export class SignatureValidationError extends TokenValidationError {
  name = 'SignatureValidationError';
  constructor(public value: any, public token: SignatureToken, message: string) {
    super(value, token, message);
  }
}

export class SignatureToken extends ComparableToken {
  static prim: 'signature' = 'signature' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: { [key: string]: string }): string {
    if (val.string) {
      return val.string;
    }
    // TODO decode the signature
    return val.bytes;
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

  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    if (semantic && semantic[SignatureToken.prim]) {
      return semantic[SignatureToken.prim](val);
    }

    return { string: val };
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
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
