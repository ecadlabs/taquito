import {
  Token,
  TokenFactory,
  ComparableToken,
  TokenValidationError,
  SemanticEncoding,
} from './token';
import {
  b58DecodeAndCheckPrefix,
  b58Encode,
  compareArrays,
  PrefixV2,
  validateChain,
  ValidationResult,
} from '@taquito/utils';
import { BaseTokenSchema } from '../schema/types';

/**
 *  @category Error
 *  Error that indicates a failure happening when parsing encoding/executing a ChainID
 */
export class ChainIDValidationError extends TokenValidationError {
  name = 'ChainIDValidationError';
  constructor(public value: any, public token: ChainIDToken, message: string) {
    super(value, token, message);
  }
}

export class ChainIDToken extends ComparableToken {
  static prim: 'chain_id' = 'chain_id' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  /**
   * @throws {@link ChainIDValidationError}
   */
  private validate(value: any) {
    if (validateChain(value) !== ValidationResult.VALID) {
      throw new ChainIDValidationError(
        value,
        this,
        `Value ${JSON.stringify(value)} is not a valid ChainID`
      );
    }
  }

  public Execute(val: any): string {
    if (val && typeof val === 'object' && typeof val.bytes === 'string') {
      return b58Encode(val.bytes, PrefixV2.ChainID);
    }
    return val[Object.keys(val)[0]];
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: ChainIDToken.prim,
      schema: ChainIDToken.prim,
    };
  }

  /**
   * @throws {@link ChainIDValidationError}
   */
  public Encode(args: any[]): any {
    const val = args.pop();

    this.validate(val);

    return { string: val };
  }

  /**
   * @throws {@link ChainIDValidationError}
   */
  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    this.validate(val);

    if (semantic && semantic[ChainIDToken.prim]) {
      return semantic[ChainIDToken.prim](val);
    }

    return { string: val };
  }

  public ToKey({ bytes, string }: any) {
    if (bytes) {
      return b58Encode(bytes, PrefixV2.ChainID);
    }
    return string;
  }

  public ToBigMapKey(val: string) {
    return {
      key: { string: val },
      type: { prim: ChainIDToken.prim },
    };
  }

  compare(chainId1: string, chainId2: string): number {
    const [bytes1] = b58DecodeAndCheckPrefix(chainId1);
    const [bytes2] = b58DecodeAndCheckPrefix(chainId2);
    return compareArrays(bytes1, bytes2);
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (ChainIDToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
