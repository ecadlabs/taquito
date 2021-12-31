import { Semantic, Token, TokenFactory, TokenValidationError } from './token';

export class GlobalConstantEncodingError extends TokenValidationError {
  name: string = 'GlobalConstantEncodingError';
  constructor(public value: any, public token: GlobalConstantToken, message: string) {
    super(value, token, message);
  }
}

export class GlobalConstantDecodingError extends TokenValidationError {
  name: string = 'GlobalConstantDecodingError';
  constructor(public value: any, public token: GlobalConstantToken, message: string) {
    super(value, token, message);
  }
}

export class GlobalConstantToken extends Token {
  static prim = 'constant';

  constructor(
    protected val: { prim: string; args: any[]; annots?: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any, semantic?: Semantic) {
    if (semantic && semantic[GlobalConstantToken.prim]) {
      return semantic[GlobalConstantToken.prim](val as any, this.val);
    } else {
      throw new GlobalConstantDecodingError(val, this, `Unable to decode a value represented by a global constants. Please provide an expanded script to the Michelson-Encoder or semantics for the decoding. The following global constant hash was encountered: ${this.val.args[0]['string']}.`
      );
    }
  }

  public Encode(args: any[]): any {
    throw new GlobalConstantEncodingError(args, this, `Unable to encode a script containing global constants. Please provide an expanded script to the Michelson-Encoder. The following global constant hash was encountered: ${this.val.args[0]['string']}.`);
  }

  public EncodeObject(val: any): any {
    throw new GlobalConstantEncodingError(val, this, `Unable to encode a script containing global constants. Please provide an expanded script to the Michelson-Encoder. The following global constant hash was encountered: ${this.val.args[0]['string']}.`);
  }

  public ExtractSchema() {
    return GlobalConstantToken.prim;
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (GlobalConstantToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  };

}
