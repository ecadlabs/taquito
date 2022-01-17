import { Token, TokenFactory, ComparableToken, TokenValidationError } from '../token';
import { b58decode, encodePubKey, validateAddress, ValidationResult } from '@taquito/utils';
import { BaseTokenSchema } from '../../schema/types';

export class AddressValidationError extends TokenValidationError {
  name = 'AddressValidationError';
  constructor(public value: any, public token: AddressToken, message: string) {
    super(value, token, message);
  }
}

export class AddressToken extends ComparableToken {
  static prim: 'address' = 'address';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public ToBigMapKey(val: any) {
    const decoded = b58decode(val);
    return {
      key: { bytes: decoded },
      type: { prim: 'bytes' },
    };
  }

  private isValid(value: any): AddressValidationError | null {
    if (validateAddress(value) !== ValidationResult.VALID) {
      return new AddressValidationError(value, this, `Address is not valid: ${value}`);
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

  public Execute(val: { bytes: string; string: string }): string {
    if (val.string) {
      return val.string;
    }

    return encodePubKey(val.bytes);
  }

  public ExtractSchema() {
    return AddressToken.prim;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: AddressToken.prim,
      schema: AddressToken.prim,
    };
  }

  public ToKey({ bytes, string }: any) {
    if (string) {
      return string;
    }

    return encodePubKey(bytes);
  }

  compare(address1: string, address2: string) {
    const isImplicit = (address: string) => {
      return address.startsWith('tz');
    };

    if (isImplicit(address1) && isImplicit(address2)) {
      return super.compare(address1, address2);
    } else if (isImplicit(address1)) {
      return -1;
    } else if (isImplicit(address2)) {
      return 1;
    } else {
      return super.compare(address1, address2);
    }
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (AddressToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
