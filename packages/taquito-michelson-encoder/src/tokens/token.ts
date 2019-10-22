import { MichelsonV1Expression } from '@taquito/rpc';

export type TokenFactory = (val: any, idx: number) => Token;

export interface Semantic {
  [key: string]: (value: MichelsonV1Expression, schema: MichelsonV1Expression) => any;
}

export interface ComparableToken extends Token {
  ToBigMapKey(
    val: string
  ): {
    key: { [key: string]: string };
    type: { prim: string };
  };

  ToKey(val: string): string;
}

export abstract class Token {
  constructor(
    protected val: { prim: string; args: any[]; annots?: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {}

  annot() {
    return (Array.isArray(this.val.annots) ? this.val.annots[0] : String(this.idx)).replace(
      /(%|\:)(_Liq_entry_)?/,
      ''
    );
  }

  hasAnnotations() {
    return Array.isArray(this.val.annots) && this.val.annots.length;
  }

  public createToken = this.fac;

  public abstract ExtractSchema(): any;

  public abstract Execute(val: any, semantics?: Semantic): any;

  public abstract Encode(_args: any[]): any;

  public abstract EncodeObject(args: any): any;
}
