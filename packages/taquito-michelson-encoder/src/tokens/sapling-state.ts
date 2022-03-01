import { SaplingStateTokenSchema } from '../schema/types';
import { Semantic, Token, TokenFactory, TokenValidationError } from './token';

export class SaplingStateValidationError extends TokenValidationError {
  name = 'SaplingStateValidationError';
  constructor(public value: any, public token: SaplingStateToken, message: string) {
    super(value, token, message);
  }
}

export class SaplingStateToken extends Token {
  static prim: 'sapling_state' = 'sapling_state';

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

  Execute(val: { int: string }, semantic?: Semantic) {
    if (semantic && semantic[SaplingStateToken.prim]) {
      return semantic[SaplingStateToken.prim](val, this.val);
    }
    if ('int' in val) {
      return val.int;
    } else {
      // Unknown case
      throw new Error(
        `Sapling state is expecting an object with an int property. Got ${JSON.stringify(val)}`
      );
    }
  }

  Encode(args: any[]): any {
    const val = args.pop();
    if (this.isValid(val)) {
      return [];
    } else {
      throw new SaplingStateValidationError(
        val,
        this,
        `Invalid sapling_state. Received: ${val} while expecting: {}`
      );
    }
  }

  EncodeObject(val: any): any {
    if (this.isValid(val)) {
      return [];
    } else {
      throw new SaplingStateValidationError(
        val,
        this,
        `Invalid sapling_state. Received: ${val} while expecting: {}`
      );
    }
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  ExtractSchema() {
    return {
      [SaplingStateToken.prim]: {
        'memo-size': Number(this.val.args[0]['int']),
      },
    };
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
