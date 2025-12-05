import { MichelsonV1Expression, MichelsonV1ExpressionExtended, ScriptResponse } from '@taquito/rpc';
import { createToken } from '../tokens/createToken';
import { Semantic, Token } from '../tokens/token';
import { InvalidScriptError, ParameterEncodingError } from './errors';

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
   * @throws {@link InvalidScriptError}
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
        allViewSchema.push(new ViewSchema(view.args));
      });
    }
    return allViewSchema;
  }

  /**
   * @throws {@link InvalidScriptError}
   */
  constructor(viewArgs: MichelsonV1Expression[] | undefined) {
    if (!viewArgs) {
      throw new InvalidScriptError(viewArgs, 'the args are not defined');
    }
    if (viewArgs.length !== 4) {
      throw new InvalidScriptError(viewArgs, `there should be exactly 4 arguments`);
    }
    if (!('string' in viewArgs[0]) || !viewArgs[0]['string']) {
      throw new InvalidScriptError(
        viewArgs,
        `The first argument should be a string, representing the view name. It should be in the form: { string: 'viewName' }`
      );
    }

    this.viewName = viewArgs[0]['string'];
    this.viewArgsType = viewArgs[1] as MichelsonV1ExpressionExtended;
    this.viewReturnType = viewArgs[2] as MichelsonV1ExpressionExtended;
    this.instructions = viewArgs[3] as MichelsonV1ExpressionExtended[];

    this.rootArgsType = createToken(this.viewArgsType, 0);
    this.rootReturnType = createToken(this.viewReturnType, 0);
  }

  /**
   *
   * @description Transform the view parameter into Michelson
   *
   * @param args parameter of the view in js format
   * @returns parameter of the view in Michelson
   * @throws {@link ParameterEncodingError}
   */
  encodeViewArgs(args: any) {
    try {
      return this.rootArgsType.EncodeObject(args);
    } catch (ex) {
      throw new ParameterEncodingError(this.viewName, undefined, args, ex);
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
    return this.rootArgsType.generateSchema();
  }

  /**
   *
   * @description Return the format of the view result
   */
  extractResultSchema() {
    return this.rootReturnType.generateSchema();
  }
}
