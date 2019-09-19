export type TokenFactory = (val: any, idx: number) => Token;

export interface ComparableToken extends Token {
  ToBigMapKey(
    val: string
  ): {
    key: { [key: string]: string };
    type: { prim: string };
  };
}

export abstract class Token {
  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {}

  annot() {
    return (Array.isArray(this.val.annots) ? this.val.annots[0] : String(this.idx)).replace(
      /(%|\:)(_Liq_entry_)?/,
      ''
    );
  }

  public createToken = this.fac;

  public abstract ExtractSchema(): any;

  public abstract Execute(val: any): any;

  public abstract Encode(_args: any[]): any;
}
