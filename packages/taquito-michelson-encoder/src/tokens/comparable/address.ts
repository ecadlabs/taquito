import {
  Token,
  TokenFactory,
  ComparableToken,
  TokenValidationError,
  SemanticEncoding,
} from '../token';
import { b58DecodeAddress, encodeAddress, validateAddress, ValidationResult } from '@taquito/utils';
import { BaseTokenSchema } from '../../schema/types';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing an Address
 */
export class AddressValidationError extends TokenValidationError {
  name = 'AddressValidationError';
  constructor(
    public value: any,
    public token: AddressToken,
    message: string
  ) {
    super(value, token, message);
  }
}

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
    const decoded = b58DecodeAddress(val);
    return {
      key: { bytes: decoded },
      type: { prim: 'bytes' },
    };
  }

  /**
   * @throws {@link AddressValidationError}
   */
  private validate(value: any) {
    if (validateAddress(value) !== ValidationResult.VALID) {
      throw new AddressValidationError(
        value,
        this,
        `Address is not valid: ${JSON.stringify(value)}`
      );
    }
  }

  /**
   * @throws {@link AddressValidationError}
   */
  public Encode(args: any[]): any {
    const val = args.pop();

    this.validate(val);

    return { string: val };
  }

  /**
   * @throws {@link AddressValidationError}
   */
  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    this.validate(val);

    if (semantic && semantic[AddressToken.prim]) {
      return semantic[AddressToken.prim](val);
    }

    return { string: val };
  }

  /**
   * @throws {@link AddressValidationError}
   */
  public Execute(val: { bytes: string; string: string }): string {
    if (val.string) {
      return val.string;
    }
    if (!val.bytes) {
      throw new AddressValidationError(
        val,
        this,
        `cannot be missing both string and bytes: ${JSON.stringify(val)}`
      );
    }

    return encodeAddress(val.bytes);
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

  /**
   * @throws {@link AddressValidationError}
   */
  public ToKey({ bytes, string }: any) {
    if (string) {
      return string;
    }
    if (!bytes) {
      throw new AddressValidationError(
        { bytes, string },
        this,
        `cannot be missing both string and bytes ${JSON.stringify({ string, bytes })}`
      );
    }

    return encodeAddress(bytes);
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
