import { Decoder } from '../decoder';
import { Uint8ArrayConsumer } from '../uint8array-consumer';
import { kindMappingProto12, kindMappingReverseProto12 } from './constants';

export const EndorsementSchemaProto12 = {
  slot: 'int16',
  level: 'int32',
  round: 'int32',
  block_payload_hash: 'blockPayloadHash',
};

export const operationEncoderProto12 =
  (encoders: { [key: string]: (val: object) => string }) => (operation: { kind: string }) => {
    if (!(operation.kind in encoders) || !(operation.kind in kindMappingReverseProto12)) {
      throw new Error(`Unsupported operation kind: ${operation.kind}`);
    }

    return kindMappingReverseProto12[operation.kind] + encoders[operation.kind](operation);
  };

export const operationDecoderProto12 =
  (decoders: { [key: string]: Decoder }) => (value: Uint8ArrayConsumer) => {
    const op = value.consume(1);

    const operationName = kindMappingProto12[op[0]];
    const decodedObj = decoders[operationName](value);

    if (typeof decodedObj !== 'object') {
      throw new Error('Decoded invalid operation');
    }

    if (operationName) {
      return {
        kind: operationName,
        ...decodedObj,
      };
    } else {
      throw new Error(`Unsupported operation ${op[0]}`);
    }
  };
