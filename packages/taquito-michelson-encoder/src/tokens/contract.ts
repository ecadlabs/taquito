import { TokenSchema } from './../schema/types';
import { encodeAddress, validateAddress, ValidationResult } from '@taquito/utils';
import { ContractTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing a Contract
 */
export class ContractValidationError extends TokenValidationError {
  name = 'ContractValidationError';
  constructor(
    public value: any,
    public token: ContractToken,
    message: string
  ) {
    super(value, token, message);
  }
}

export class ContractToken extends Token {
  static prim: 'contract' = 'contract' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  /**
   * @throws {@link ContractValidationError}
   */
  private validate(value: unknown) {
    if (typeof value !== 'string') {
      throw new ContractValidationError(value, this, 'Type error');
    }
    // tz1,tz2 and tz3 seems to be valid contract values (for Unit contract)
    if (validateAddress(value) !== ValidationResult.VALID) {
      throw new ContractValidationError(
        value,
        this,
        `Value ${JSON.stringify(value)} is not a valid contract address.`
      );
    }

    return null;
  }

  /**
   * @throws {@link ContractValidationError}
   */
  public Execute(val: { bytes: string; string: string }) {
    if (val.string) {
      return val.string;
    }
    if (!val.bytes) {
      throw new ContractValidationError(
        val,
        this,
        `Value ${JSON.stringify(
          val
        )} is not a valid contract address. must contain bytes or string.`
      );
    }

    return encodeAddress(val.bytes);
  }

  /**
   * @throws {@link ContractValidationError}
   */
  public Encode(args: any[]): any {
    const val = args.pop();
    this.validate(val);
    return { string: val };
  }

  /**
   * @throws {@link ContractValidationError}
   */
  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    this.validate(val);
    if (semantic && semantic[ContractToken.prim]) {
      return semantic[ContractToken.prim](val);
    }
    return { string: val };
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  public ExtractSchema() {
    return ContractToken.prim;
  }

  generateSchema(): ContractTokenSchema {
    const valueSchema = this.createToken(this.val.args[0], 0);
    return {
      __michelsonType: ContractToken.prim,
      schema: {
        parameter: this.val.args[0] ? valueSchema.generateSchema() : ({} as TokenSchema),
      },
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (ContractToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
