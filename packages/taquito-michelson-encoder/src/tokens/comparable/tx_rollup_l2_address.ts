import { BaseTokenSchema } from '../../schema/types';
import {
  b58decodeL2Address,
  encodeL2Address,
  validateAddress,
  ValidationResult,
} from '@taquito/utils';
import {
  ComparableToken,
  SemanticEncoding,
  Token,
  TokenFactory,
  TokenValidationError,
} from '../token';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing a Tx Rollup L2 Address
 */
export class TxRollupL2AddressValidationError extends TokenValidationError {
  name = 'TxRollupL2AddressValidationError';
  constructor(public value: unknown, public token: TxRollupL2AddressToken, message: string) {
    super(value, token, message);
  }
}

export class TxRollupL2AddressToken extends ComparableToken {
  static prim: 'tx_rollup_l2_address' = 'tx_rollup_l2_address' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public ToBigMapKey(val: any) {
    const decoded = b58decodeL2Address(val);
    return {
      key: { bytes: decoded },
      type: { prim: 'bytes' },
    };
  }

  /**
   * @throws {@link TxRollupL2AddressValidationError}
   */
  private validate(value: any) {
    if (validateAddress(value) !== ValidationResult.VALID) {
      throw new TxRollupL2AddressValidationError(
        value,
        this,
        `tx_rollup_l2_address is not valid: ${JSON.stringify(value)}`
      );
    }
  }

  /**
   * @throws {@link TxRollupL2AddressValidationError}
   */
  public Encode(args: string[]): any {
    const val = args.pop();
    if (!val) {
      throw new TxRollupL2AddressValidationError(
        val,
        this,
        `arg missing to encode: this -> "${JSON.stringify(val)}"`
      );
    }
    this.validate(val);

    return { string: val };
  }

  /**
   * @throws {@link TxRollupL2AddressValidationError}
   */
  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    this.validate(val);

    if (semantic && semantic[TxRollupL2AddressToken.prim]) {
      return semantic[TxRollupL2AddressToken.prim](val);
    }
    return { string: val };
  }

  /**
   * @throws {@link TxRollupL2AddressValidationError}
   */
  public Execute(val: { bytes?: string; string?: string }): string {
    if (val.string) {
      return val.string;
    }
    if (!val.bytes) {
      throw new TxRollupL2AddressValidationError(
        val,
        this,
        `value cannot be missing string and byte value. must have one ${JSON.stringify(val)}`
      );
    }
    return encodeL2Address(val.bytes);
  }
  public ExtractSchema() {
    return TxRollupL2AddressToken.prim;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: TxRollupL2AddressToken.prim,
      schema: TxRollupL2AddressToken.prim,
    };
  }

  /**
   * @throws {@link TxRollupL2AddressValidationError}
   */
  public ToKey({ bytes, string }: { bytes?: string; string?: string }) {
    if (string) {
      return string;
    }
    if (!bytes) {
      throw new TxRollupL2AddressValidationError(
        bytes,
        this,
        `value cannot be missing string and byte value. must have one: bytes = ${JSON.stringify(
          bytes
        )}`
      );
    }
    return encodeL2Address(bytes);
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]): Token[] {
    if (TxRollupL2AddressToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
