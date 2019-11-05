import { Token, TokenFactory, ComparableToken, Semantic } from './token';

export class BigMapToken extends Token {
  static prim = 'big_map';
  constructor(
    protected val: { prim: string; args: any[]; annots?: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  get ValueSchema() {
    return this.createToken(this.val.args[1], 0);
  }

  get KeySchema(): ComparableToken {
    return (this.createToken(this.val.args[0], 0) as unknown) as ComparableToken;
  }

  public ExtractSchema() {
    return {
      [this.KeySchema.ExtractSchema()]: this.ValueSchema.ExtractSchema(),
    };
  }

  public Encode(args: any[]): any {
    const val = args.pop();

    return Object.keys(val).map(key => {
      return {
        prim: 'Elt',
        args: [this.KeySchema.Encode([key]), this.ValueSchema.Encode([val[key]])],
      };
    });
  }

  public EncodeObject(args: any): any {
    const val = args;
    return Object.keys(val).map(key => {
      return {
        prim: 'Elt',
        args: [this.KeySchema.EncodeObject(key), this.ValueSchema.EncodeObject(val[key])],
      };
    });
  }

  public Execute(val: any[] | { int: string }, semantic?: Semantic) {
    if (semantic && semantic[BigMapToken.prim]) {
      return semantic[BigMapToken.prim](val as any, this.val);
    }

    if (Array.isArray(val)) {
      // Athens is returning an empty array for big map in storage
      // Internal: In taquito v5 it is still used to decode big map diff (as if they were a regular map)
      return val.reduce((prev, current) => {
        return {
          ...prev,
          [this.KeySchema.ToKey(current.args[0])]: this.ValueSchema.Execute(current.args[1]),
        };
      }, {});
    } else if ('int' in val) {
      // Babylon is returning an int with the big map id in contract storage
      return val.int;
    } else {
      // Unknown case
      throw new Error(
        `Big map is expecting either an array (Athens) or an object with an int property (Babylon). Got ${JSON.stringify(
          val
        )}`
      );
    }
  }
}
