import { BaseTokenSchema } from '../../schema/types';
import { b58decode, encodePubKey, validateAddress, ValidationResult } from '@taquito/utils';
import { ComparableToken, SemanticEncoding, Token, TokenFactory, TokenValidationError } from "../token";

export class TxRollupL2AddresValidationError extends TokenValidationError {
  name = 'TxRollupL2AddresssValidationError';
  constructor(public value: unknown, public token: TxRollupL2Address, message: string) {
    super(value, token, message)
  }
}

export class TxRollupL2Address extends ComparableToken {
  static prim: 'tx_rollup_l2_address' = 'tx_rollup_l2_address';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac)
  }

  public ToBigMapKey(val: any) {
    const decoded = b58decode(val)
    return {
      key: { bytes: decoded },
      type: { prim: 'bytes' }
    }
  }

  private isValid(value: any): TxRollupL2AddresValidationError | null {
    if (validateAddress(value) !== ValidationResult.VALID) {
      throw new TxRollupL2AddresValidationError(value, this, `tx_rollup_l2_address is not valid: ${value}`)
    }
    return null
  }

  public Encode(args: string[]): any {
    const val = args.pop();
    if (!val) {
      throw new TxRollupL2AddresValidationError(val, this, `arg missing to encode: this -> "${val}"`)
    }
    const err = this.isValid(val)
    if (err) {
      throw err;
    }
    return { string: val }
  }

  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    if (semantic && semantic[TxRollupL2Address.prim]) {
      return semantic[TxRollupL2Address.prim](val)
    }
    return { string: val }
  }

  public Execute(val: {bytes: string; string: string}): string {
    if (val.string) {
      return val.string
    }
    if (!val.bytes) {
      throw new TxRollupL2AddresValidationError(val, this, `value cannot be missing string and byte value. must have one ${JSON.stringify(val)}`)
    }
    return encodePubKey(val.bytes)
  }
  public ExtractSchema() {
    return TxRollupL2Address.prim;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: TxRollupL2Address.prim,
      schema: TxRollupL2Address.prim
    }
  }

  public ToKey({bytes, string}: any) {
    if (string) {
      return string
    }
    if (!bytes) {
      throw new TxRollupL2AddresValidationError(bytes, this, `value cannot be missing string and byte value. must have one: bytes = ${bytes}`)
    }
    return encodePubKey(bytes)
  }

  compare(address1: string, address2: string) {
    const isImplicit = (address: string) => {
      // TODO CHECK THIS tru2 or txr1 or somethign else :O
      return address.startsWith('tr4')
    }
    const implicit1 = isImplicit(address1)
    const implicit2 = isImplicit(address2)

    if (implicit1 && !implicit2) {
      return -1;
    } else if (implicit2 && !implicit1) {
      return 1;
    }
    return super.compare(address1, address2)
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]): Token[] {
    if(TxRollupL2Address.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens
  }
}
