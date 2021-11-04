import { Schema, Semantic, EncodingSemantic } from '@taquito/michelson-encoder';
import { BigMapAbstraction } from './big-map';
import BigNumber from 'bignumber.js';
import { MichelsonV1Expression } from '@taquito/rpc';
import { SaplingStateAbstraction } from './sapling-state-abstraction';
import { ContractProvider } from './interface';

// Override the default michelson encoder semantic to provide richer abstraction over storage properties
export const smartContractAbstractionSemantic: (p: ContractProvider) => Semantic = (
  provider: ContractProvider
) => ({
  // Provide a specific abstraction for BigMaps
  big_map: (val: MichelsonV1Expression, code: MichelsonV1Expression) => {
    if (!val || !('int' in val) || val.int === undefined) {
      // Return an empty object in case of missing big map ID
      return {};
    } else {
      const schema = new Schema(code);
      return new BigMapAbstraction(new BigNumber(val.int), schema, provider);
    }
  },
  sapling_state: (val: MichelsonV1Expression) => {
    if (!val || !('int' in val) || val.int === undefined) {
      // Return an empty object in case of missing sapling state ID
      return {};
    } else {
      return new SaplingStateAbstraction(new BigNumber(val.int), provider);
    }
  }
  /*
  // TODO: embed useful other abstractions
  'contract':  () => {},
  'address':  () => {}
  */
});

export const encodingSemantic: (encodingRules: any) => EncodingSemantic = (
  encodingRules: any
) => ({
  // The Encode method of the Schema class allows to transform the storage parameter into Michelson data.
  // The encodingSemantic function will override the default logic of the EncodeObject method of the GlobalConstant token in the Michelson-Encoder.
  // By default GlobalConstant.EncodeObject throws an exception because the global constant hides part of the Michelson type; a global constant can replace any Michelson expression. 
  // The Michelson-Encoder does not "know" what a global constant hash stand for, so the appropriate tokens represented by thee underlying Michelson type can not be created by the Michelson-Encoder.
  // By providing the global constant hash and their associated Michelson value to the Michelson-Encoder using the encodingSemantic function,
  // the storage parameter can now be encoded against the corresponding Michelson values.
  constant: (args: any, constantHash: MichelsonV1Expression) => {
    const hash = (constantHash as GlobalConstantMichelsonType).args[0]['string'];
    if (hash in encodingRules) {
      const value: MichelsonV1Expression = encodingRules[hash];
      const schema = new Schema(value);
      return schema.Encode(args);
    }
  }
});

type GlobalConstantMichelsonType = { prim: 'constant', args: [{ string: string }] };