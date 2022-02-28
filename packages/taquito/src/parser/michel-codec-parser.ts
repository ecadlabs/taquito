import { Context } from '../context';
import { ParserProvider } from './interface';
import { Expr, GlobalConstantHashAndValue, Parser, Prim, ProtocolID } from '@taquito/michel-codec';
import { OriginateParams } from '../operations/types';
import { InvalidInitParameter, InvalidCodeParameter } from '../contract/errors';
import { Schema } from '@taquito/michelson-encoder';
import { MichelsonV1Expression } from '@taquito/rpc';
import { Protocols } from '../constants';

export class MichelCodecParser implements ParserProvider {
  constructor(private context: Context) {}

  private async getNextProto(): Promise<ProtocolID> {
    if (!this.context.proto) {
      const { next_protocol } = await this.context.rpc.getBlockMetadata();
      this.context.proto = next_protocol as Protocols;
    }
    return this.context.proto as ProtocolID;
  }

  async parseScript(src: string): Promise<Expr[] | null> {
    const parser = new Parser({ protocol: await this.getNextProto() });
    return parser.parseScript(src);
  }

  async parseMichelineExpression(src: string): Promise<Expr | null> {
    const parser = new Parser({ protocol: await this.getNextProto() });
    return parser.parseMichelineExpression(src);
  }

  async parseJSON(src: object): Promise<Expr> {
    const parser = new Parser({ protocol: await this.getNextProto() });
    return parser.parseJSON(src);
  }

  async prepareCodeOrigination(params: OriginateParams): Promise<OriginateParams> {
    const parsedParams = params;
    parsedParams.code = await this.formatCodeParam(params.code);
    if (params.init) {
      parsedParams.init = await this.formatInitParam(params.init);
    } else if (params.storage) {
      const storageType = (parsedParams.code as Expr[]).find(
        (p): p is Prim => 'prim' in p && p.prim === 'storage'
      );
      if (!storageType?.args) {
        throw new InvalidCodeParameter(
          'The storage section is missing from the script',
          params.code
        );
      }
      const schema = new Schema(storageType.args[0] as MichelsonV1Expression);
      const globalconstantsHashAndValue = await this.findGlobalConstantsHashAndValue(schema);

      if (Object.keys(globalconstantsHashAndValue).length !== 0) {
        // If there are global constants in the storage part of the contract code,
        // they need to be locally expanded in order to encode the storage arguments
        const p = new Parser({ expandGlobalConstant: globalconstantsHashAndValue });
        const storageTypeNoGlobalConst = p.parseJSON(storageType.args[0]);
        const schemaNoGlobalConst = new Schema(storageTypeNoGlobalConst);
        parsedParams.init = schemaNoGlobalConst.Encode(params.storage);
      } else {
        parsedParams.init = schema.Encode(params.storage);
      }
      delete parsedParams.storage;
    }
    return parsedParams;
  }

  private async formatCodeParam(code: string | object[]) {
    let parsedCode: Expr[];
    if (typeof code === 'string') {
      const c = await this.parseScript(code);
      if (c === null) {
        throw new InvalidCodeParameter('Invalid code parameter', code);
      }
      parsedCode = c;
    } else {
      const c = await this.parseJSON(code);
      const order = ['parameter', 'storage', 'code'];
      // Ensure correct ordering for RPC
      parsedCode = (c as Prim[]).sort((a, b) => order.indexOf(a.prim) - order.indexOf(b.prim));
    }
    return parsedCode;
  }

  private async formatInitParam(init: string | object) {
    let parsedInit: Expr;
    if (typeof init === 'string') {
      const c = await this.parseMichelineExpression(init);
      if (c === null) {
        throw new InvalidInitParameter('Invalid init parameter', init);
      }
      parsedInit = c;
    } else {
      parsedInit = await this.parseJSON(init);
    }
    return parsedInit;
  }

  private async findGlobalConstantsHashAndValue(schema: Schema) {
    const globalConstantTokens = schema.findToken('constant');
    const globalConstantsHashAndValue: GlobalConstantHashAndValue = {};

    if (globalConstantTokens.length !== 0) {
      for (const token of globalConstantTokens) {
        const tokenArgs = token.tokenVal.args;
        if (tokenArgs) {
          const hash: string = tokenArgs[0]['string'];
          const michelineValue = await this.context.globalConstantsProvider.getGlobalConstantByHash(
            hash
          );
          Object.assign(globalConstantsHashAndValue, {
            [hash]: michelineValue,
          });
        }
      }
    }
    return globalConstantsHashAndValue;
  }
}
