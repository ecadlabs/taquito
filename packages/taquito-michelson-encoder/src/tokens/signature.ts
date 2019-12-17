import { Token, TokenFactory, TokenValidationError } from './token';
import { validateSignature } from '@taquito/utils';

export class SignatureValidationError extends TokenValidationError {
  name: string = 'SignatureValidationError';
  constructor(public value: any, public token: SignatureToken, message: string) {
    super(value, token, message);
  }
}

export class SignatureToken extends Token {
  static prim = 'signature';

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
    if (!validateSignature(value)) {
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
}
