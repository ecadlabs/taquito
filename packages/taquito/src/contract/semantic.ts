import { Schema, Semantic } from '@taquito/michelson-encoder';
import { BigMapAbstraction } from './big-map';
import { ContractProvider } from './interface';
import BigNumber from 'bignumber.js';
import { MichelsonV1Expression } from '@taquito/rpc';
import { SaplingStateAbstraction } from './sapling-state-abstraction';

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
