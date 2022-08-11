import { MichelsonV1Expression, MichelsonV1ExpressionExtended, ScriptResponse } from '@taquito/rpc';
import { createToken } from '../tokens/createToken';
import { Semantic, Token } from '../tokens/token';
import { InvalidScriptError, ViewEncodingError } from './error';

export class ViewSchema {
  readonly viewName: string;
  readonly viewArgsType: MichelsonV1ExpressionExtended;
  readonly viewReturnType: MichelsonV1ExpressionExtended;
  readonly instructions: MichelsonV1ExpressionExtended[];
  private rootArgsType: Token;
  private rootReturnType: Token;

  /**
   *
   * @description Create an instance of ViewSchema for each view in a script
   *
   * @param val contract script obtained from the RPC
   * @returns array of ViewSchema or empty array if there is no view in the contract
   */
  static fromRPCResponse(val: { script: ScriptResponse }) {
    const allViewSchema: ViewSchema[] = [];

    const views =
      val &&
      val.script &&
      Array.isArray(val.script.code) &&
      (val.script.code.filter((x: any) => x.prim === 'view') as MichelsonV1ExpressionExtended[]);

    if (views) {
      views.forEach((view) => {
        if (!view.args || view.args.length !== 4) {
          throw new InvalidScriptError(
            `Invalid on-chain view found in the script: ${JSON.stringify(view)}`
          );
        }
        allViewSchema.push(new ViewSchema(view.args));
      });
    }
    return allViewSchema;
  }

  constructor(val: MichelsonV1Expression[]) {
    if (val.length !== 4 || !('string' in val[0])) {
      throw new InvalidScriptError(`Invalid on-chain view: ${JSON.stringify(val)}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.viewName = val[0]['string']!;
    this.viewArgsType = val[1] as MichelsonV1ExpressionExtended;
    this.viewReturnType = val[2] as MichelsonV1ExpressionExtended;
    this.instructions = val[3] as MichelsonV1ExpressionExtended[];

    this.rootArgsType = createToken(this.viewArgsType, 0);
    this.rootReturnType = createToken(this.viewReturnType, 0);
  }

  /**
   *
   * @description Transform the view parameter into Michelson
   *
   * @param args parameter of the view in js format
   * @returns parameter of the view in Michelson
   */
  encodeViewArgs(args: any) {
    try {
      return this.rootArgsType.EncodeObject(args);
    } catch (ex) {
      throw new ViewEncodingError(this.viewName, ex);
    }
  }

  /**
   *
   * @description Transform the view result from Michelson to readable data
   *
   * @param val result of the view in JSON Michelson
   * @param semantics optional semantics to override the default decoding behavior
   * @returns result of the view in a readable format
   */
  decodeViewResult(val: any, semantics?: Semantic) {
    return this.rootReturnType.Execute(val, semantics);
  }

  /**
   *
   * @description Return the signature of the view parameter
   */
  extractArgsSchema() {
    return this.rootArgsType.ExtractSchema();
  }

  /**
   *
   * @description Return the format of the view result
   */
  extractResultSchema() {
    return this.rootReturnType.ExtractSchema();
  }
}
