import { Token, TokenFactory, TokenValidationError } from './token';
import { encodeKey, validatePublicKey } from '@taquito/utils';

export class KeyValidationError extends TokenValidationError {
  name: string = 'KeyValidationError';
  constructor(public value: any, public token: KeyToken, message: string) {
    super(value, token, message);
  }
}

export class KeyToken extends Token {
  static prim = 'key';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: { bytes: string; string: string }): string {
    if (val.string) {
      return val.string;
    }

    return encodeKey(val.bytes);
  }

  private isValid(value: any): KeyValidationError | null {
    if (!validatePublicKey(value)) {
      return new KeyValidationError(value, this, 'Key is not valid');
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
    return KeyToken.prim;
  }
}
