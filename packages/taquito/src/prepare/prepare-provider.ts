import { Context } from "../context";
import { Expr, Parser, Prim } from "@taquito/michel-codec";
import { InvalidCodeParameter, InvalidInitParameter } from "../contract/errors";
import { Schema } from "@taquito/michelson-encoder";
import { OriginateParams } from "../operations/types";
import { MichelsonV1Expression } from "@taquito/rpc";
import { GlobalConstantHashAndValue } from "@taquito/michel-codec";

export class Prepare {
    constructor(private context: Context){};

    async formatStorageProperty(params: OriginateParams) {
        if (params.storage !== undefined && params.init !== undefined) {
          throw new Error(
            "Storage and Init cannot be set a the same time. Please either use storage or init but not both.",
          );
        }
        if (!Array.isArray(params.code)) {
          throw new InvalidCodeParameter('Wrong code parameter type, expected an array', params.code);
        }
        if (params.storage !== undefined) {
          const storageType = (params.code as Expr[]).find((p): p is Prim => ('prim' in p) && p.prim === 'storage');
          if (storageType?.args === undefined) {
            throw new InvalidCodeParameter('The storage section is missing from the script', params.code);
          }
          const schema = new Schema(storageType.args[0] as MichelsonV1Expression);
          // find all global constant hashes in the storage script
          const constantTokens = schema.findToken('constant');
          // use the globalConstantProvider to fetch the value associated to each global constant hash
          let globalconstantsHashAndValue: GlobalConstantHashAndValue = {}
          for (const token of constantTokens){
              const hash = token.tokenVal.args![0]['string'];
              const michelineValue = await this.context.globalConstantsProvider.getGlobalConstantByHash(hash);
              Object.assign(globalconstantsHashAndValue, {
                [hash]: michelineValue
            });
          }
          // use the parser to replace all global constants in the script with their corresponding values
          const p = new Parser({ expandGlobalConstant: globalconstantsHashAndValue });
          const storageTypeNoGlobalConst = p.parseJSON(storageType.args[0]);
          const schemaNoGlobalConst = new Schema(storageTypeNoGlobalConst)
          const storage = schemaNoGlobalConst.Encode(params.storage);
          return {
            ...params,
            storage
          };
        } else if (params.init !== undefined && typeof params.init === 'object') {
          return {
            ...params,
            storage: params.init as Expr
          };
        } else {
          throw new InvalidInitParameter('Wrong init parameter type, expected JSON Michelson', params.init);
        }
      };
}