import { Schema, Semantic } from '@taquito/michelson-encoder';
import { BigMapAbstraction } from './big-map';
import { ContractProvider } from './interface';
import BigNumber from 'bignumber.js';
import { MichelsonV1Expression } from '@taquito/rpc';

// Override the default michelson encoder semantic to provide richer abstraction over storage properties
export const smartContractAbstractionSemantic = <TContract extends { methods: unknown, storage: unknown }>(
  provider: ContractProvider<TContract>,
): Semantic => ({
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
  /*
  // TODO: embed useful other abstractions
  'contract':  () => {},
  'address':  () => {}
  */
});
