import { Token, TokenFactory, Semantic, TokenValidationError } from './token';

export class ListValidationError extends TokenValidationError {
  name = 'ListValidationError';
  constructor(public value: any, public token: ListToken, message: string) {
    super(value, token, message);
  }
}

export class ListToken extends Token {
  static prim = 'list';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  get valueSchema() {
    return this.createToken(this.val.args[0], this.idx);
  }

  private isValid(value: any): ListValidationError | null {
    if (Array.isArray(value)) {
      return null;
    }

    return new ListValidationError(value, this, 'Value must be an array');
  }

  public Encode(args: any[]): any {
    const val = args.pop();

    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    const schema = this.createToken(this.val.args[0], 0);
    return val.reduce((prev: any, current: any) => {
      return [...prev, schema.EncodeObject(current)];
    }, []);
  }

  public Execute(val: any, semantics?: Semantic) {
    const schema = this.createToken(this.val.args[0], 0);

    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return val.reduce((prev: any, current: any) => {
      return [...prev, schema.Execute(current, semantics)];
    }, []);
  }

  public EncodeObject(args: any): any {
    const schema = this.createToken(this.val.args[0], 0);

    const err = this.isValid(args);
    if (err) {
      throw err;
    }

    return args.reduce((prev: any, current: any) => {
      return [...prev, schema.EncodeObject(current)];
    }, []);
  }

  public ExtractSchema() {
    return {
      [ListToken.prim]: this.valueSchema.ExtractSchema(),
    };
  }

  generateSchema() {
    return {
      __michelsonType: ListToken.prim,
      schema: this.valueSchema.generateSchema(),
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (ListToken.prim === tokenToFind) {
      tokens.push(this);
    }
    this.createToken(this.val.args[0], this.idx).findAndReturnTokens(tokenToFind, tokens);
    return tokens;
  }
}
