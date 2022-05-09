import { MichelsonV1Expression, MichelsonV1ExpressionExtended } from '@taquito/rpc';
import { b58decode } from '@taquito/utils';
import { Schema } from '../src/schema/storage';
import { SemanticEncoding } from '../src/tokens/token';

// example of semantic encoding
export const optimizedEncoding: SemanticEncoding = {
  // encode address to bytes
  address: (val: string) => {
    return { bytes: b58decode(val) };
  },
  // encode contract to bytes
  contract: (val: string) => {
    return { bytes: b58decode(val) };
  },
  key_hash: (val: string) => {
    return { bytes: b58decode(val).slice(2) };
  },
  // encode timestamp to number of seconds since epoch
  timestamp: (val: string) => {
    const date = new Date(val);
    return { int: String(date.getTime() / 1000) };
  },
  ticket: (
    val: { ticketer: string; value: string; amount: string },
    type?: MichelsonV1Expression
  ) => {
    const ticketerType = { prim: 'contract' };
    const schemaTicketer = new Schema(ticketerType);
    const amountType = { prim: 'int' };
    const schemaAmount = new Schema(amountType);
    const valueType = type as MichelsonV1ExpressionExtended;
    if (!type || !valueType.args) {
      throw new Error('Missing ticket type.');
    }
    const valueSchema = new Schema(valueType.args[0]);
    return {
      prim: 'Pair',
      args: [
        schemaTicketer.Encode(val.ticketer, optimizedEncoding),
        {
          prim: 'Pair',
          args: [
            valueSchema.Encode(val.value, optimizedEncoding),
            schemaAmount.Encode(val.amount, optimizedEncoding),
          ],
        },
      ],
    };
  },
};
