import { Token, TokenFactory, ComparableToken } from './token';
import { encodePubKey } from '@tezos-ts/utils';

export class BigMapToken extends Token {
  static prim = 'big_map';
  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  get ValueSchema() {
    return this.createToken(this.val.args![1], 0);
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

    return {
      prim: 'big_map',
      args: Object.keys(val).map(key => {
        return [this.KeySchema.Encode([key]), this.ValueSchema.Encode([val[key]])];
      }),
    };
  }

  public Execute(val: any[]) {
    return val.reduce((prev, current) => {
      return {
        ...prev,
        [encodePubKey(current.key.bytes)]: this.ValueSchema.Execute(current.value),
      };
    }, {});
  }
}
