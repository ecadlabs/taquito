import { Schema, Semantic, EncodingSemantic } from '@taquito/michelson-encoder';
import { BigMapAbstraction } from './big-map';
import BigNumber from 'bignumber.js';
import { MichelsonV1Expression } from '@taquito/rpc';
import { SaplingStateAbstraction } from './sapling-state-abstraction';
import { Context } from '../context';

type GlobalConstantMichelsonType = { prim: 'constant', args: [{ string: string }] };

// Override the default michelson encoder semantic to provide richer abstraction over storage properties
export const smartContractAbstractionSemantic: (c: Context) => Semantic = (
  context: Context
) => ({
  // Provide a specific abstraction for BigMaps
  big_map: (val: MichelsonV1Expression, code: MichelsonV1Expression) => {
    if (!val || !('int' in val) || val.int === undefined) {
      // Return an empty object in case of missing big map ID
      return {};
    } else {
      const schema = new Schema(code);
      return new BigMapAbstraction(new BigNumber(val.int), schema, context.contract);
    }
  },
  sapling_state: (val: MichelsonV1Expression) => {
    if (!val || !('int' in val) || val.int === undefined) {
      // Return an empty object in case of missing sapling state ID
      return {};
    } else {
      return new SaplingStateAbstraction(new BigNumber(val.int), context.contract);
    }
  },
  // Replace the constant hash by the corresponding Michelson value
  constant: (args: any, constantHash: MichelsonV1Expression) => {
    const hash = (constantHash as GlobalConstantMichelsonType).args[0]['string'];
    const value = context.globalConstantsProvider.getGlobalConstantByHash(hash);
    const schema = new Schema(value);
    return schema.Execute(args);
  }
  /*
  // TODO: embed useful other abstractions
  'contract':  () => {},
  'address':  () => {}
  */
});

export const encodingSemantic: (p: Context) => EncodingSemantic = (
  context: Context
) => ({
  // Replace the constant hash by the corresponding Michelson value
  constant: (args: any, constantHash: MichelsonV1Expression) => {
    const hash = (constantHash as GlobalConstantMichelsonType).args[0]['string'];
    const value = context.globalConstantsProvider.getGlobalConstantByHash(hash);
    const schema = new Schema(value);
    return schema.Encode(args);
  }
});