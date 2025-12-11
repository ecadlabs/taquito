import { SaplingStateTokenSchema } from '../schema/types';
import { Semantic, SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing a Sapling State
 */
export class SaplingStateValidationError extends TokenValidationError {
  name = 'SaplingStateValidationError';
  constructor(
    public value: any,
    public token: SaplingStateToken,
    message: string
  ) {
    super(value, token, message);
  }
}

export class SaplingStateToken extends Token {
  static prim: 'sapling_state' = 'sapling_state' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  private isValid(val: any) {
    return typeof val === 'object' && Object.keys(val).length === 0;
  }

  /**
   * @throws {@link SaplingStateValidationError}
   */
  Execute(val: { int: string }, semantic?: Semantic) {
    if (semantic && semantic[SaplingStateToken.prim]) {
      return semantic[SaplingStateToken.prim](val, this.val);
    }
    if ('int' in val) {
      return val.int;
    } else {
      throw new SaplingStateValidationError(
        val,
        this,
        `Sapling state is expecting an object with an int property. Got ${JSON.stringify(val)}`
      );
    }
  }

  /**
   * @throws {@link SaplingStateValidationError}
   */
  Encode(args: any[]): any {
    const val = args.pop();
    if (this.isValid(val)) {
      return [];
    } else {
      throw new SaplingStateValidationError(
        val,
        this,
        `Invalid sapling_state. Received: ${JSON.stringify(val)} while expecting: {}`
      );
    }
  }

  /**
   * @throws {@link SaplingStateValidationError}
   */
  EncodeObject(val: any, semantic?: SemanticEncoding): any {
    if (semantic && semantic[SaplingStateToken.prim]) {
      return semantic[SaplingStateToken.prim](val);
    }
    if (this.isValid(val)) {
      return [];
    } else {
      throw new SaplingStateValidationError(
        val,
        this,
        `Invalid sapling_state. Received: ${JSON.stringify(val)} while expecting: {}`
      );
    }
  }

  generateSchema(): SaplingStateTokenSchema {
    return {
      __michelsonType: SaplingStateToken.prim,
      schema: {
        memoSize: this.val.args[0]['int'],
      },
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (SaplingStateToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
