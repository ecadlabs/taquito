import { Semantic, Token, TokenFactory, TokenValidationError } from './token';

export class GlobalConstantValidationError extends TokenValidationError {
  name: string = 'GlobalConstantValidationError';
  constructor(public value: any, public token: GlobalConstantToken, message: string) {
    super(value, token, message);
  }
}

export class GlobalConstantToken extends Token {
  static prim = 'constant';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: { string: string }, semantic?: Semantic) {
    if (semantic && semantic[GlobalConstantToken.prim]) {
      return semantic[GlobalConstantToken.prim](val as any, this.val);
    }
    return val.string;
  }

  public Encode(args: any[], semantic?: Semantic): any {
    if (semantic && semantic[GlobalConstantToken.prim]) {
      return semantic[GlobalConstantToken.prim](args, this.val);
    } else {
      throw new GlobalConstantValidationError(
        args,
        this,
        `The expression associated with the global constant hash ${this.val.args[0]['string']} needs to be provided to the Michelson-Encoder.`
      );
    }
  }

  public EncodeObject(val: any, semantic?: Semantic): any {
    if (semantic && semantic[GlobalConstantToken.prim]) {
      return semantic[GlobalConstantToken.prim](val, this.val);
    } else {
      throw new GlobalConstantValidationError(
        val,
        this,
        `The expression associated with the global constant hash ${this.val.args[0]['string']} needs to be provided to the Michelson-Encoder.`
      );
    }
  }

  public ExtractSchema() {
    return GlobalConstantToken.prim;
  }
}
