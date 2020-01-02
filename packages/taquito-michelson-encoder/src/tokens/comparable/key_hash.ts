import { Token, TokenFactory, ComparableToken, TokenValidationError } from '../token';
import { encodeKeyHash, validateKeyHash, ValidationResult } from '@taquito/utils';

export class KeyHashValidationError extends TokenValidationError {
  name: string = 'KeyHashValidationError';
  constructor(public value: any, public token: KeyHashToken, message: string) {
    super(value, token, message);
  }
}

export class KeyHashToken extends Token implements ComparableToken {
  static prim = 'key_hash';

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

    return encodeKeyHash(val.bytes);
  }

  private isValid(value: any): KeyHashValidationError | null {
    if (validateKeyHash(value) !== ValidationResult.VALID) {
      return new KeyHashValidationError(value, this, `KeyHash is not valid: ${value}`);
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
    return KeyHashToken.prim;
  }

  // tslint:disable-next-line: variable-name
  public ToKey({ string, bytes }: any) {
    if (string) {
      return string;
    }

    return encodeKeyHash(bytes);
  }

  public ToBigMapKey(val: string) {
    return {
      key: { string: val },
      type: { prim: KeyHashToken.prim },
    };
  }
}
