import { Schema, Semantic } from '@taquito/michelson-encoder';
import { BigMapAbstraction } from './big-map';
import { StorageProvider } from './interface';
import BigNumber from 'bignumber.js';
import { MichelsonV1Expression } from '@taquito/rpc';
import { SaplingStateAbstraction } from './sapling-state-abstraction';
import { BlockIdentifier } from '../read-provider/interface';

/**
 * Override the default michelson encoder semantic to provide richer abstraction over storage properties
 * @param p StorageProvider (contract API)
 */
// Override the default michelson encoder semantic to provide richer abstraction over storage properties
export const smartContractAbstractionSemantic: (
  p: StorageProvider,
  block?: BlockIdentifier
) => Semantic = (provider: StorageProvider, block?: BlockIdentifier) => ({
  // Provide a specific abstraction for BigMaps
  big_map: (val: MichelsonV1Expression, code: MichelsonV1Expression) => {
    if (!val || !('int' in val) || val.int === undefined) {
      // Return an empty object in case of missing big map ID
      return {};
    } else {
      const schema = new Schema(code);
      return new BigMapAbstraction(new BigNumber(val.int), schema, provider, block);
    }
  },
  sapling_state: (val: MichelsonV1Expression) => {
    if (!val || !('int' in val) || val.int === undefined) {
      // Return an empty object in case of missing sapling state ID
      return {};
    } else {
      return new SaplingStateAbstraction(new BigNumber(val.int), provider, block);
    }
  },
  /*
  // TODO: embed useful other abstractions
  'contract':  () => {},
  'address':  () => {}
  */
});
