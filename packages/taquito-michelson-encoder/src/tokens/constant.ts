import { ConstantTokenSchema } from '../schema/types';
import { Semantic, SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding a Global Constant
 */
export class GlobalConstantEncodingError extends TokenValidationError {
  name = 'GlobalConstantEncodingError';
  constructor(public value: any, public token: GlobalConstantToken, message: string) {
    super(value, token, message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing executing a Global Constant
 */
export class GlobalConstantDecodingError extends TokenValidationError {
  name = 'GlobalConstantDecodingError';
  constructor(public value: any, public token: GlobalConstantToken, message: string) {
    super(value, token, message);
  }
}

export class GlobalConstantToken extends Token {
  static prim: 'constant' = 'constant' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots?: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  /**
   * @throws {@link GlobalConstantDecodingError}
   */
  public Execute(val: any, semantic?: Semantic) {
    if (semantic && semantic[GlobalConstantToken.prim]) {
      return semantic[GlobalConstantToken.prim](val as any, this.val);
    } else {
      throw new GlobalConstantDecodingError(
        val,
        this,
        `Unable to decode a value represented by a global constants. Please provide an expanded script to the Michelson-Encoder or semantics for the decoding. The following global constant hash was encountered: ${this.val.args[0]['string']}.`
      );
    }
  }

  /**
   * @throws {@link GlobalConstantEncodingError}
   */
  public Encode(args: any[]): any {
    throw new GlobalConstantEncodingError(
      args,
      this,
      `Unable to encode a script containing global constants. Please provide an expanded script to the Michelson-Encoder. The following global constant hash was encountered: ${this.val.args[0]['string']}.`
    );
  }

  /**
   * @throws {@link GlobalConstantEncodingError}
   */
  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    if (semantic && semantic[GlobalConstantToken.prim]) {
      return semantic[GlobalConstantToken.prim](val);
    }
    throw new GlobalConstantEncodingError(
      val,
      this,
      `Unable to encode a script containing global constants. Please provide an expanded script to the Michelson-Encoder. The following global constant hash was encountered: ${this.val.args[0]['string']}.`
    );
  }

  generateSchema(): ConstantTokenSchema {
    return {
      __michelsonType: GlobalConstantToken.prim,
      schema: {
        hash: this.val.args[0]['string'],
      },
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (GlobalConstantToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
