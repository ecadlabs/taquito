import { MichelsonV1Expression } from '@taquito/rpc';
import { MichelsonMapKey } from '../michelson-map';

export abstract class TokenValidationError implements Error {
  name: string = 'ValidationError';
  public message: string;

  constructor(public value: any, public token: Token, baseMessage: string) {
    const annot = this.token.annot();
    const annotText = annot ? `[${annot}] ` : '';
    this.message = `${annotText}${baseMessage}`;
  }
}

export type TokenFactory = (val: any, idx: number) => Token;

export interface Semantic {
  [key: string]: (value: MichelsonV1Expression, schema: MichelsonV1Expression) => any;
}

export abstract class Token {
  constructor(
    protected val: { prim: string; args?: any[]; annots?: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) { }

  protected typeWithoutAnnotations() {
    const removeArgsRec = (val: Token['val']): { prim: string; args?: any[] } => {
      if (val.args) {
        return {
          prim: val.prim,
          args: val.args.map(x => removeArgsRec(x)),
        };
      } else {
        return {
          prim: val.prim,
        };
      }
    };

    return removeArgsRec(this.val);
  }

  annot() {
    return (Array.isArray(this.val.annots) && this.val.annots.length > 0
      ? this.val.annots[0]
      : String(this.idx)
    ).replace(/(%|\:)(_Liq_entry_)?/, '');
  }

  hasAnnotations() {
    return Array.isArray(this.val.annots) && this.val.annots.length;
  }

  public createToken = this.fac;

  public abstract ExtractSchema(): any;

  public abstract Execute(val: any, semantics?: Semantic): any;

  public abstract Encode(_args: any[]): any;

  public abstract EncodeObject(args: any): any;

  public ExtractSignature() {
    return [[this.ExtractSchema()]];
  }
}

export abstract class ComparableToken extends Token {
  abstract ToBigMapKey(
    val: string
  ): {
    key: { [key: string]: string };
    type: { prim: string };
  };

  abstract ToKey(val: string): any;

  compare(o1: string, o2: string): number {
    if (o1 === o2) {
      return 0;
    }

    return o1 < o2 ? -1 : 1;
  }
}
