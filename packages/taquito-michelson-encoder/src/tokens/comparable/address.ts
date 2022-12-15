import {
  Token,
  TokenFactory,
  ComparableToken,
  TokenValidationError,
  SemanticEncoding,
} from '../token';
import { b58decode, encodePubKey, validateAddress, ValidationResult } from '@taquito/utils';
import { BaseTokenSchema } from '../../schema/types';

export class AddressValidationError extends TokenValidationError {
  name = 'AddressValidationError';
  constructor(public value: any, public token: AddressToken, message: string) {
    super(value, token, message);
  }
}

export class AddressExecuteError extends TokenValidationError {
  name = 'AddressExecuteError';
  constructor(public value: BytesAndString, public token: AddressToken, message: string) {
    super(value, token, message)
  }
}

export interface BytesAndString { bytes: string; string: string };

export class AddressToken extends ComparableToken {
  static prim: 'address' = 'address' as const;

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

  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    if (semantic && semantic[AddressToken.prim]) {
      return semantic[AddressToken.prim](val);
    }

    return { string: val };
  }

  public Execute(val: BytesAndString): string {
    if (val.string) {
      return val.string;
    }
    if (!val.bytes) {
      throw new AddressExecuteError(
        val,
        this,
        `cannot be missing both string and bytes: ${val}`
      );
    }

    return encodePubKey(val.bytes);
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
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
    if (!bytes) {
      throw new AddressValidationError(
        { bytes, string },
        this,
        `cannot be missing both string and bytes ${{ string, bytes }}`
      );
    }

    return encodePubKey(bytes);
  }
  compare(address1: string, address2: string) {
    const isImplicit = (address: string) => {
      return address.startsWith('tz');
    };
    const implicit1 = isImplicit(address1);
    const implicit2 = isImplicit(address2);

    if (implicit1 && !implicit2) {
      return -1;
    } else if (implicit2 && !implicit1) {
      return 1;
    }
    return super.compare(address1, address2);
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (AddressToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
